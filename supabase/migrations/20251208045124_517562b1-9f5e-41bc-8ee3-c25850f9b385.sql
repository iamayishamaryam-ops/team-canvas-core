-- Create bank_details table for employee salary payments
CREATE TABLE public.bank_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  bank_name TEXT,
  account_holder_name TEXT,
  account_number TEXT,
  iban TEXT,
  swift_code TEXT,
  branch_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bank_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Bank details policies - users can view/update own, admin can view/update all
CREATE POLICY "Users can view own bank details" ON public.bank_details
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own bank details" ON public.bank_details
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own bank details" ON public.bank_details
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admin can view all bank details" ON public.bank_details
  FOR SELECT USING (is_admin_level(auth.uid()));

CREATE POLICY "Admin can update all bank details" ON public.bank_details
  FOR UPDATE USING (is_admin_level(auth.uid()));

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own notifications" ON public.notifications
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Admin can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (is_admin_level(auth.uid()));

CREATE POLICY "Users can insert own notifications" ON public.notifications
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Add triggers for updated_at
CREATE TRIGGER update_bank_details_updated_at
  BEFORE UPDATE ON public.bank_details
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();