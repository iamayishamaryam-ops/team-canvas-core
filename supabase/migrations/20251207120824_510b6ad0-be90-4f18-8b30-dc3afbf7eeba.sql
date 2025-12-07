
-- Attendance table
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  clock_in TIMESTAMP WITH TIME ZONE,
  clock_out TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'half_day', 'on_leave')),
  overtime_hours NUMERIC(4,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Leave requests table
CREATE TABLE public.leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  leave_type TEXT NOT NULL CHECK (leave_type IN ('annual', 'sick', 'personal', 'maternity', 'paternity', 'unpaid')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_count INTEGER NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  team_overlap_warning BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Leave balances table
CREATE TABLE public.leave_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  leave_type TEXT NOT NULL CHECK (leave_type IN ('annual', 'sick', 'personal', 'maternity', 'paternity', 'unpaid')),
  total_days INTEGER NOT NULL DEFAULT 0,
  used_days INTEGER NOT NULL DEFAULT 0,
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, leave_type, year)
);

-- Salary components table
CREATE TABLE public.salary_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  basic_salary NUMERIC(12,2) NOT NULL DEFAULT 0,
  housing_allowance NUMERIC(12,2) DEFAULT 0,
  transportation_allowance NUMERIC(12,2) DEFAULT 0,
  food_allowance NUMERIC(12,2) DEFAULT 0,
  phone_allowance NUMERIC(12,2) DEFAULT 0,
  other_allowances NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Monthly payslips table
CREATE TABLE public.payslips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  basic_salary NUMERIC(12,2) NOT NULL DEFAULT 0,
  housing_allowance NUMERIC(12,2) DEFAULT 0,
  transportation_allowance NUMERIC(12,2) DEFAULT 0,
  food_allowance NUMERIC(12,2) DEFAULT 0,
  phone_allowance NUMERIC(12,2) DEFAULT 0,
  other_allowances NUMERIC(12,2) DEFAULT 0,
  overtime_amount NUMERIC(12,2) DEFAULT 0,
  overtime_hours NUMERIC(6,2) DEFAULT 0,
  late_deduction NUMERIC(12,2) DEFAULT 0,
  absence_deduction NUMERIC(12,2) DEFAULT 0,
  loan_deduction NUMERIC(12,2) DEFAULT 0,
  other_deductions NUMERIC(12,2) DEFAULT 0,
  gross_salary NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_deductions NUMERIC(12,2) NOT NULL DEFAULT 0,
  net_salary NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'paid')),
  paid_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, month, year)
);

-- Expenses table
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('travel', 'meals', 'supplies', 'equipment', 'training', 'other')),
  amount NUMERIC(12,2) NOT NULL,
  description TEXT NOT NULL,
  receipt_url TEXT,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'reimbursed')),
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payslips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Attendance policies
CREATE POLICY "Users can view own attendance" ON public.attendance FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admin can view all attendance" ON public.attendance FOR SELECT USING (is_admin_level(auth.uid()));
CREATE POLICY "Users can insert own attendance" ON public.attendance FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admin can insert any attendance" ON public.attendance FOR INSERT WITH CHECK (is_admin_level(auth.uid()));
CREATE POLICY "Users can update own attendance" ON public.attendance FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admin can update any attendance" ON public.attendance FOR UPDATE USING (is_admin_level(auth.uid()));
CREATE POLICY "Admin can delete attendance" ON public.attendance FOR DELETE USING (is_admin_level(auth.uid()));

-- Leave requests policies
CREATE POLICY "Users can view own leave requests" ON public.leave_requests FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admin can view all leave requests" ON public.leave_requests FOR SELECT USING (is_admin_level(auth.uid()));
CREATE POLICY "Users can insert own leave requests" ON public.leave_requests FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own pending leave" ON public.leave_requests FOR UPDATE USING (user_id = auth.uid() AND status = 'pending');
CREATE POLICY "Admin can update any leave request" ON public.leave_requests FOR UPDATE USING (is_admin_level(auth.uid()));
CREATE POLICY "Users can delete own pending leave" ON public.leave_requests FOR DELETE USING (user_id = auth.uid() AND status = 'pending');
CREATE POLICY "Admin can delete any leave request" ON public.leave_requests FOR DELETE USING (is_admin_level(auth.uid()));

-- Leave balances policies
CREATE POLICY "Users can view own leave balances" ON public.leave_balances FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admin can view all leave balances" ON public.leave_balances FOR SELECT USING (is_admin_level(auth.uid()));
CREATE POLICY "Admin can manage leave balances" ON public.leave_balances FOR ALL USING (is_admin_level(auth.uid()));

-- Salary components policies (admin only)
CREATE POLICY "Users can view own salary" ON public.salary_components FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admin can view all salaries" ON public.salary_components FOR SELECT USING (is_admin_level(auth.uid()));
CREATE POLICY "Admin can manage salaries" ON public.salary_components FOR ALL USING (is_admin_level(auth.uid()));

-- Payslips policies
CREATE POLICY "Users can view own payslips" ON public.payslips FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admin can view all payslips" ON public.payslips FOR SELECT USING (is_admin_level(auth.uid()));
CREATE POLICY "Admin can manage payslips" ON public.payslips FOR ALL USING (is_admin_level(auth.uid()));

-- Expenses policies
CREATE POLICY "Users can view own expenses" ON public.expenses FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admin can view all expenses" ON public.expenses FOR SELECT USING (is_admin_level(auth.uid()));
CREATE POLICY "Users can insert own expenses" ON public.expenses FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own pending expenses" ON public.expenses FOR UPDATE USING (user_id = auth.uid() AND status = 'pending');
CREATE POLICY "Admin can update any expense" ON public.expenses FOR UPDATE USING (is_admin_level(auth.uid()));
CREATE POLICY "Users can delete own pending expenses" ON public.expenses FOR DELETE USING (user_id = auth.uid() AND status = 'pending');
CREATE POLICY "Admin can delete any expense" ON public.expenses FOR DELETE USING (is_admin_level(auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON public.attendance FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_leave_requests_updated_at BEFORE UPDATE ON public.leave_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_leave_balances_updated_at BEFORE UPDATE ON public.leave_balances FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_salary_components_updated_at BEFORE UPDATE ON public.salary_components FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_payslips_updated_at BEFORE UPDATE ON public.payslips FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON public.expenses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Function to check team leave overlap
CREATE OR REPLACE FUNCTION public.check_team_leave_overlap(
  p_user_id UUID,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS TABLE(overlap_count INTEGER, overlapping_employees TEXT[])
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_department TEXT;
BEGIN
  -- Get user's department
  SELECT department INTO user_department FROM public.profiles WHERE id = p_user_id;
  
  -- Count overlapping approved leaves in same department
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT lr.user_id)::INTEGER as overlap_count,
    ARRAY_AGG(DISTINCT p.full_name) as overlapping_employees
  FROM public.leave_requests lr
  JOIN public.profiles p ON lr.user_id = p.id
  WHERE p.department = user_department
    AND lr.user_id != p_user_id
    AND lr.status = 'approved'
    AND (
      (lr.start_date <= p_end_date AND lr.end_date >= p_start_date)
    );
END;
$$;
