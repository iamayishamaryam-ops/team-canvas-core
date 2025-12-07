import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface LeaveRequest {
  id: string;
  user_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days_count: number;
  reason: string | null;
  status: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  team_overlap_warning: boolean;
  created_at: string;
  profiles?: {
    full_name: string | null;
    department: string | null;
    avatar_url: string | null;
  };
}

export interface LeaveBalance {
  id: string;
  user_id: string;
  leave_type: string;
  total_days: number;
  used_days: number;
  year: number;
}

export interface TeamOverlapResult {
  overlap_count: number;
  overlapping_employees: string[];
}

export function useLeaveRequests(status?: string) {
  return useQuery({
    queryKey: ["leave-requests", status],
    queryFn: async () => {
      let query = supabase
        .from("leave_requests")
        .select(`
          *,
          profiles!leave_requests_user_id_fkey (full_name, department, avatar_url)
        `)
        .order("created_at", { ascending: false });

      if (status && status !== "all") {
        query = query.eq("status", status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as LeaveRequest[];
    },
  });
}

export function useMyLeaveRequests() {
  return useQuery({
    queryKey: ["my-leave-requests"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("leave_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as LeaveRequest[];
    },
  });
}

export function useLeaveBalances() {
  return useQuery({
    queryKey: ["leave-balances"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const currentYear = new Date().getFullYear();
      const { data, error } = await supabase
        .from("leave_balances")
        .select("*")
        .eq("user_id", user.id)
        .eq("year", currentYear);

      if (error) throw error;
      return data as LeaveBalance[];
    },
  });
}

export function useCheckTeamOverlap() {
  return useMutation({
    mutationFn: async ({ userId, startDate, endDate }: { userId: string; startDate: string; endDate: string }) => {
      const { data, error } = await supabase
        .rpc("check_team_leave_overlap", {
          p_user_id: userId,
          p_start_date: startDate,
          p_end_date: endDate,
        });

      if (error) throw error;
      return data?.[0] as TeamOverlapResult | null;
    },
  });
}

export function useCreateLeaveRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: {
      leave_type: string;
      start_date: string;
      end_date: string;
      days_count: number;
      reason?: string;
      team_overlap_warning?: boolean;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("leave_requests")
        .insert({
          user_id: user.id,
          ...request,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-requests"] });
      queryClient.invalidateQueries({ queryKey: ["my-leave-requests"] });
      toast({ title: "Leave request submitted" });
    },
    onError: (error) => {
      toast({ title: "Failed to submit leave request", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateLeaveRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, reviewed_by }: { id: string; status: string; reviewed_by?: string }) => {
      const { data, error } = await supabase
        .from("leave_requests")
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
      queryClient.invalidateQueries({ queryKey: ["leave-requests"] });
      queryClient.invalidateQueries({ queryKey: ["my-leave-requests"] });
      toast({ title: `Leave request ${variables.status}` });
    },
    onError: (error) => {
      toast({ title: "Failed to update leave request", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteLeaveRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("leave_requests")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-requests"] });
      queryClient.invalidateQueries({ queryKey: ["my-leave-requests"] });
      toast({ title: "Leave request deleted" });
    },
    onError: (error) => {
      toast({ title: "Failed to delete leave request", description: error.message, variant: "destructive" });
    },
  });
}
