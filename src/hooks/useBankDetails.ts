import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface BankDetails {
  id: string;
  user_id: string;
  bank_name: string | null;
  account_holder_name: string | null;
  account_number: string | null;
  iban: string | null;
  swift_code: string | null;
  branch_name: string | null;
  created_at: string;
  updated_at: string;
}

export function useMyBankDetails() {
  return useQuery({
    queryKey: ["my-bank-details"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("bank_details")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as BankDetails | null;
    },
  });
}

export function useBankDetails(userId?: string) {
  return useQuery({
    queryKey: ["bank-details", userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from("bank_details")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      return data as BankDetails | null;
    },
    enabled: !!userId,
  });
}

export function useUpsertBankDetails() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bankDetails: Omit<BankDetails, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("bank_details")
        .upsert(bankDetails, { onConflict: "user_id" })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bank-details"] });
      queryClient.invalidateQueries({ queryKey: ["bank-details"] });
      toast({ title: "Bank details saved successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to save bank details", description: error.message, variant: "destructive" });
    },
  });
}
