-- Enable required extensions
create extension if not exists pgcrypto;

-- Helper function to update updated_at
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Enums for consistent values
do $$ begin
  if not exists (select 1 from pg_type where typname = 'ownership_type') then
    create type public.ownership_type as enum ('owner','resident');
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_type where typname = 'fuel_type') then
    create type public.fuel_type as enum ('petrol','diesel','electric','cng');
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_type where typname = 'income_source') then
    create type public.income_source as enum ('business','privateJob','governmentJob');
  end if;
end $$;

-- Surveys table (main record)
create table if not exists public.surveys (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Login information captured in the form (temporary until real auth)
  login_name text not null,
  login_email text not null,
  login_id text not null,
  login_password text not null,

  -- Contact information
  full_name text not null,
  phone_number text not null,
  address text not null,

  -- House & family
  house_number text not null,
  ownership ownership_type not null,
  family_male int not null default 0,
  family_female int not null default 0,
  family_total int not null default 0,

  -- Income & occupation
  income_source income_source not null,
  gov_department text,
  gov_designation text,
  gov_employee_id text,

  -- Health
  has_disability boolean not null default false,
  disability_details text,
  has_health_insurance boolean not null default false,
  health_insurance_provider text
);

-- Indices & constraints
create index if not exists idx_surveys_created_by on public.surveys(created_by);
create index if not exists idx_surveys_created_at on public.surveys(created_at);
create unique index if not exists uq_surveys_login_per_user on public.surveys(created_by, login_id);

-- Trigger for updated_at
create or replace trigger trg_surveys_updated
before update on public.surveys
for each row execute function public.update_updated_at_column();

-- Appliances table (1:1 per survey)
create table if not exists public.appliances (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid not null references public.surveys(id) on delete cascade,
  fans int not null default 0,
  lights int not null default 0,
  ac int not null default 0,
  refrigerator int not null default 0,
  washing_machine int not null default 0,
  geyser int not null default 0,
  microwave int not null default 0,
  others text[] not null default '{}'
);
create unique index if not exists uq_appliances_survey on public.appliances(survey_id);

-- Vehicles table (1:N per survey)
create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid not null references public.surveys(id) on delete cascade,
  type text not null,
  registration_number text not null,
  fuel_type fuel_type not null,
  model_year int not null
);
create index if not exists idx_vehicles_survey on public.vehicles(survey_id);
create unique index if not exists uq_vehicle_reg_per_survey on public.vehicles(survey_id, registration_number);

-- Optional: QR tokens table (reserved for future secure QR access)
create table if not exists public.qr_tokens (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid not null references public.surveys(id) on delete cascade,
  token text not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  used_at timestamptz
);
create index if not exists idx_qr_tokens_survey on public.qr_tokens(survey_id);

-- Enable Row Level Security
alter table public.surveys enable row level security;
alter table public.appliances enable row level security;
alter table public.vehicles enable row level security;
alter table public.qr_tokens enable row level security;

-- RLS policies for surveys (owner-based)
create policy if not exists "Users can view their own surveys"
  on public.surveys for select
  using (auth.uid() = created_by);

create policy if not exists "Users can insert their own surveys"
  on public.surveys for insert
  with check (auth.uid() = created_by);

create policy if not exists "Users can update their own surveys"
  on public.surveys for update
  using (auth.uid() = created_by);

create policy if not exists "Users can delete their own surveys"
  on public.surveys for delete
  using (auth.uid() = created_by);

-- RLS for appliances (owner via parent survey)
create policy if not exists "Owners can view appliances via parent survey"
  on public.appliances for select
  using (exists (
    select 1 from public.surveys s
    where s.id = appliances.survey_id and s.created_by = auth.uid()
  ));

create policy if not exists "Owners can insert appliances via parent survey"
  on public.appliances for insert
  with check (exists (
    select 1 from public.surveys s
    where s.id = appliances.survey_id and s.created_by = auth.uid()
  ));

create policy if not exists "Owners can update appliances via parent survey"
  on public.appliances for update
  using (exists (
    select 1 from public.surveys s
    where s.id = appliances.survey_id and s.created_by = auth.uid()
  ));

create policy if not exists "Owners can delete appliances via parent survey"
  on public.appliances for delete
  using (exists (
    select 1 from public.surveys s
    where s.id = appliances.survey_id and s.created_by = auth.uid()
  ));

-- RLS for vehicles (owner via parent survey)
create policy if not exists "Owners can view vehicles via parent survey"
  on public.vehicles for select
  using (exists (
    select 1 from public.surveys s
    where s.id = vehicles.survey_id and s.created_by = auth.uid()
  ));

create policy if not exists "Owners can insert vehicles via parent survey"
  on public.vehicles for insert
  with check (exists (
    select 1 from public.surveys s
    where s.id = vehicles.survey_id and s.created_by = auth.uid()
  ));

create policy if not exists "Owners can update vehicles via parent survey"
  on public.vehicles for update
  using (exists (
    select 1 from public.surveys s
    where s.id = vehicles.survey_id and s.created_by = auth.uid()
  ));

create policy if not exists "Owners can delete vehicles via parent survey"
  on public.vehicles for delete
  using (exists (
    select 1 from public.surveys s
    where s.id = vehicles.survey_id and s.created_by = auth.uid()
  ));

-- RLS for qr_tokens (owner via parent survey). For public QR access, we will later add a secure RPC/edge function.
create policy if not exists "Owners can view QR tokens via parent survey"
  on public.qr_tokens for select
  using (exists (
    select 1 from public.surveys s
    where s.id = qr_tokens.survey_id and s.created_by = auth.uid()
  ));

create policy if not exists "Owners can insert QR tokens via parent survey"
  on public.qr_tokens for insert
  with check (exists (
    select 1 from public.surveys s
    where s.id = qr_tokens.survey_id and s.created_by = auth.uid()
  ));

create policy if not exists "Owners can update QR tokens via parent survey"
  on public.qr_tokens for update
  using (exists (
    select 1 from public.surveys s
    where s.id = qr_tokens.survey_id and s.created_by = auth.uid()
  ));

create policy if not exists "Owners can delete QR tokens via parent survey"
  on public.qr_tokens for delete
  using (exists (
    select 1 from public.surveys s
    where s.id = qr_tokens.survey_id and s.created_by = auth.uid()
  ));