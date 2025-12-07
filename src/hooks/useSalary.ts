import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface SalaryComponent {
  id: string;
  user_id: string;
  basic_salary: number;
  housing_allowance: number;
  transportation_allowance: number;
  food_allowance: number;
  phone_allowance: number;
  other_allowances: number;
  created_at: string;
  profiles?: {
    full_name: string | null;
    department: string | null;
    avatar_url: string | null;
    email: string;
  };
}

export interface Payslip {
  id: string;
  user_id: string;
  month: number;
  year: number;
  basic_salary: number;
  housing_allowance: number;
  transportation_allowance: number;
  food_allowance: number;
  phone_allowance: number;
  other_allowances: number;
  overtime_amount: number;
  overtime_hours: number;
  late_deduction: number;
  absence_deduction: number;
  loan_deduction: number;
  other_deductions: number;
  gross_salary: number;
  total_deductions: number;
  net_salary: number;
  status: string;
  paid_at: string | null;
  notes: string | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
    department: string | null;
    avatar_url: string | null;
    email: string;
  };
}

export function useSalaryComponents() {
  return useQuery({
    queryKey: ["salary-components"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("salary_components")
        .select(`
          *,
          profiles:user_id (full_name, department, avatar_url, email)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as SalaryComponent[];
    },
  });
}

export function useMySalary() {
  return useQuery({
    queryKey: ["my-salary"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("salary_components")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as SalaryComponent | null;
    },
  });
}

export function usePayslips(month?: number, year?: number) {
  return useQuery({
    queryKey: ["payslips", month, year],
    queryFn: async () => {
      let query = supabase
        .from("payslips")
        .select(`
          *,
          profiles:user_id (full_name, department, avatar_url, email)
        `)
        .order("year", { ascending: false })
        .order("month", { ascending: false });

      if (month) query = query.eq("month", month);
      if (year) query = query.eq("year", year);

      const { data, error } = await query;
      if (error) throw error;
      return data as Payslip[];
    },
  });
}

export function useMyPayslips() {
  return useQuery({
    queryKey: ["my-payslips"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("payslips")
        .select("*")
        .eq("user_id", user.id)
        .order("year", { ascending: false })
        .order("month", { ascending: false });

      if (error) throw error;
      return data as Payslip[];
    },
  });
}

export function useUpsertSalaryComponent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (salary: Omit<SalaryComponent, "id" | "created_at" | "profiles">) => {
      const { data, error } = await supabase
        .from("salary_components")
        .upsert(salary, { onConflict: "user_id" })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salary-components"] });
      queryClient.invalidateQueries({ queryKey: ["my-salary"] });
      toast({ title: "Salary updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to update salary", description: error.message, variant: "destructive" });
    },
  });
}

export function useGeneratePayslip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payslip: Omit<Payslip, "id" | "created_at" | "profiles">) => {
      const { data, error } = await supabase
        .from("payslips")
        .upsert(payslip, { onConflict: "user_id,month,year" })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payslips"] });
      queryClient.invalidateQueries({ queryKey: ["my-payslips"] });
      toast({ title: "Payslip generated successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to generate payslip", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdatePayslipStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const updates: Record<string, unknown> = { status };
      if (status === "paid") {
        updates.paid_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from("payslips")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payslips"] });
      toast({ title: "Payslip status updated" });
    },
    onError: (error) => {
      toast({ title: "Failed to update status", description: error.message, variant: "destructive" });
    },
  });
}
