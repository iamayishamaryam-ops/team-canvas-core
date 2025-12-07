import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Attendance {
  id: string;
  user_id: string;
  date: string;
  clock_in: string | null;
  clock_out: string | null;
  status: string;
  overtime_hours: number;
  notes: string | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
    department: string | null;
    avatar_url: string | null;
  };
}

export function useAttendance(date?: string) {
  return useQuery({
    queryKey: ["attendance", date],
    queryFn: async () => {
      let query = supabase
        .from("attendance")
        .select(`
          *,
          profiles:user_id (full_name, department, avatar_url)
        `)
        .order("date", { ascending: false });

      if (date) {
        query = query.eq("date", date);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Attendance[];
    },
  });
}

export function useMyAttendance() {
  return useQuery({
    queryKey: ["my-attendance"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(30);

      if (error) throw error;
      return data as Attendance[];
    },
  });
}

export function useTodayAttendance() {
  return useQuery({
    queryKey: ["today-attendance"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle();

      if (error) throw error;
      return data as Attendance | null;
    },
  });
}

export function useClockIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const now = new Date();
      const today = now.toISOString().split("T")[0];
      const clockInTime = now.toISOString();

      // Check if late (after 9 AM)
      const hour = now.getHours();
      const status = hour >= 9 ? "late" : "present";

      const { data, error } = await supabase
        .from("attendance")
        .upsert({
          user_id: user.id,
          date: today,
          clock_in: clockInTime,
          status,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["today-attendance"] });
      queryClient.invalidateQueries({ queryKey: ["my-attendance"] });
      toast({ title: "Clocked in successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to clock in", description: error.message, variant: "destructive" });
    },
  });
}

export function useClockOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const today = new Date().toISOString().split("T")[0];
      const clockOutTime = new Date().toISOString();

      const { data, error } = await supabase
        .from("attendance")
        .update({ clock_out: clockOutTime })
        .eq("user_id", user.id)
        .eq("date", today)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["today-attendance"] });
      queryClient.invalidateQueries({ queryKey: ["my-attendance"] });
      toast({ title: "Clocked out successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to clock out", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Attendance> & { id: string }) => {
      const { data, error } = await supabase
        .from("attendance")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      toast({ title: "Attendance updated" });
    },
    onError: (error) => {
      toast({ title: "Failed to update attendance", description: error.message, variant: "destructive" });
    },
  });
}
