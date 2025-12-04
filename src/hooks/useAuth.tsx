import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export type AppRole = "ceo" | "admin_hr" | "bdm" | "manager" | "employee";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  department: string | null;
  position: string | null;
  phone: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: AppRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, role?: "manager" | "employee") => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  // Permission flags based on role hierarchy
  isAdminLevel: boolean;           // CEO, Admin/HR, BDM
  canManageSalary: boolean;        // CEO, Admin/HR only
  canManageEmployees: boolean;     // CEO, Admin/HR, BDM
  canApproveLeave: boolean;        // CEO, Admin/HR, Manager
  canViewAllDocuments: boolean;    // CEO, Admin/HR
  canViewAllSalary: boolean;       // CEO, Admin/HR
  canManageExpenses: boolean;      // CEO, Admin/HR, BDM
  canManageAttendance: boolean;    // CEO, Admin/HR, BDM
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer Supabase calls with setTimeout to prevent deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setRole(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData as Profile);
      }

      // Fetch role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();

      if (roleData) {
        setRole(roleData.role as AppRole);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, fullName: string, role: "manager" | "employee" = "employee") => {
    const redirectUrl = `${window.location.origin}/dashboard`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setRole(null);
  };

  // Role-based permissions
  // CEO: Full access to all modules
  // Admin/HR: Full access except system settings, can manage salary/documents/employees
  // BDM: Full access (same as Admin/HR)
  // Manager: Access employees under them, approve/reject leave, no salary/documents of others
  // Employee: View only their profile, apply leave, view own salary, upload own documents
  const isAdminLevel = role === "ceo" || role === "admin_hr" || role === "bdm";
  const canManageSalary = role === "ceo" || role === "admin_hr" || role === "bdm";
  const canManageEmployees = role === "ceo" || role === "admin_hr" || role === "bdm";
  const canApproveLeave = role === "ceo" || role === "admin_hr" || role === "bdm" || role === "manager";
  const canViewAllDocuments = role === "ceo" || role === "admin_hr" || role === "bdm";
  const canViewAllSalary = role === "ceo" || role === "admin_hr" || role === "bdm";
  const canManageExpenses = role === "ceo" || role === "admin_hr" || role === "bdm";
  const canManageAttendance = role === "ceo" || role === "admin_hr" || role === "bdm";

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role,
        loading,
        signIn,
        signUp,
        signOut,
        isAdminLevel,
        canManageSalary,
        canManageEmployees,
        canApproveLeave,
        canViewAllDocuments,
        canViewAllSalary,
        canManageExpenses,
        canManageAttendance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Role display names
export const roleDisplayNames: Record<AppRole, string> = {
  ceo: "CEO",
  admin_hr: "Admin / HR",
  bdm: "BDM",
  manager: "Manager",
  employee: "Employee",
};
