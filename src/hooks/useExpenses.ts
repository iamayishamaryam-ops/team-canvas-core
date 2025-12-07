import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Expense {
  id: string;
  user_id: string;
  category: string;
  amount: number;
  description: string;
  receipt_url: string | null;
  expense_date: string;
  status: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
    department: string | null;
    avatar_url: string | null;
  };
}

export function useExpenses(status?: string) {
  return useQuery({
    queryKey: ["expenses", status],
    queryFn: async () => {
      let query = supabase
        .from("expenses")
        .select(`
          *,
          profiles!expenses_user_id_fkey (full_name, department, avatar_url)
        `)
        .order("created_at", { ascending: false });

      if (status && status !== "all") {
        query = query.eq("status", status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Expense[];
    },
  });
}

export function useMyExpenses() {
  return useQuery({
    queryKey: ["my-expenses"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Expense[];
    },
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expense: {
      category: string;
      amount: number;
      description: string;
      receipt_url?: string;
      expense_date: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("expenses")
        .insert({
          user_id: user.id,
          ...expense,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["my-expenses"] });
      toast({ title: "Expense submitted" });
    },
    onError: (error) => {
      toast({ title: "Failed to submit expense", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateExpenseStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, reviewed_by }: { id: string; status: string; reviewed_by?: string }) => {
      const { data, error } = await supabase
        .from("expenses")
        .update({
          status,
          reviewed_by,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["my-expenses"] });
      toast({ title: `Expense ${variables.status}` });
    },
    onError: (error) => {
      toast({ title: "Failed to update expense", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["my-expenses"] });
      toast({ title: "Expense deleted" });
    },
    onError: (error) => {
      toast({ title: "Failed to delete expense", description: error.message, variant: "destructive" });
    },
  });
}
