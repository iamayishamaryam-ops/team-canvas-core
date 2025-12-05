import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Employee {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  department: string | null;
  position: string | null;
  avatar_url: string | null;
  status: string | null;
  created_at: string | null;
  role: string | null;
}

export const useEmployees = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch roles for all users
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Map roles to profiles
      const roleMap = new Map(roles?.map((r) => [r.user_id, r.role]) || []);
      
      return (profiles || []).map((profile) => ({
        ...profile,
        role: roleMap.get(profile.id) || "employee",
      })) as Employee[];
    },
  });
};

export const useEmployee = (employeeId: string | null) => {
  return useQuery({
    queryKey: ["employee", employeeId],
    queryFn: async () => {
      if (!employeeId) return null;
      
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", employeeId)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) return null;

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", employeeId)
        .maybeSingle();

      return {
        ...profile,
        role: roleData?.role || "employee",
      } as Employee;
    },
    enabled: !!employeeId,
  });
};

import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
      newRole,
    }: {
      id: string;
      data: Partial<Omit<Employee, "id" | "role">>;
      newRole?: AppRole;
    }) => {
      const { error: profileError } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", id);

      if (profileError) throw profileError;

      if (newRole) {
        const { error: roleError } = await supabase
          .from("user_roles")
          .update({ role: newRole })
          .eq("user_id", id);

        if (roleError) throw roleError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee"] });
      toast.success("Employee updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update employee: " + error.message);
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Delete from auth.users will cascade to profiles and user_roles
      const { error } = await supabase.auth.admin.deleteUser(id);
      
      // If admin delete fails (no admin privileges), try deleting profile directly
      if (error) {
        const { error: profileError } = await supabase
          .from("profiles")
          .delete()
          .eq("id", id);
        
        if (profileError) throw profileError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete employee: " + error.message);
    },
  });
};
