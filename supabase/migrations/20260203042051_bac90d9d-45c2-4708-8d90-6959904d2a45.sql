-- Drop the overly permissive contact form policies and create more secure ones
DROP POLICY IF EXISTS "Anonymous users can submit contact form" ON public.contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can submit contact form" ON public.contact_submissions;

-- Create a more secure policy that still allows public contact form submissions
-- but with some basic validation
CREATE POLICY "Public can submit contact form with validation" ON public.contact_submissions
  FOR INSERT TO public
  WITH CHECK (
    -- Ensure required fields are not empty
    name IS NOT NULL AND 
    email IS NOT NULL AND 
    message IS NOT NULL AND
    length(name) > 0 AND 
    length(email) > 0 AND 
    length(message) > 0
  );