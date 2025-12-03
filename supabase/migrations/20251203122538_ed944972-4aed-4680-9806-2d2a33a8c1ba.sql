-- Update the handle_new_user function to accept role from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  selected_role app_role;
BEGIN
  -- Get role from metadata, default to 'employee' if not provided or invalid
  selected_role := COALESCE(
    NULLIF(NEW.raw_user_meta_data ->> 'role', '')::app_role,
    'employee'::app_role
  );
  
  -- Only allow manager or employee roles during self-signup
  -- CEO, admin_hr, and bdm must be assigned manually
  IF selected_role NOT IN ('manager', 'employee') THEN
    selected_role := 'employee';
  END IF;

  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, selected_role);
  
  RETURN NEW;
END;
$$;