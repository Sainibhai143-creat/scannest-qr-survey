-- Create contact_submissions table for storing contact form submissions
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert contact submissions (public form)
CREATE POLICY "Anyone can submit contact forms" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (true);

-- Create policy for admins to view all submissions (for future admin panel)
CREATE POLICY "Admins can view all contact submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (false); -- Will be updated when admin roles are implemented

-- Add index for better performance
CREATE INDEX idx_contact_submissions_submitted_at ON public.contact_submissions(submitted_at DESC);