import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Clock,
  Calendar,
  DollarSign,
  FileText,
  Receipt,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, AppRole } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: AppRole[]; // If not specified, accessible by all
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Employees", href: "/employees", icon: Users, roles: ["ceo", "admin_hr", "bdm"] },
  { name: "Attendance", href: "/attendance", icon: Clock },
  { name: "Leave", href: "/leave", icon: Calendar },
  { name: "Salary", href: "/salary", icon: DollarSign, roles: ["ceo", "admin_hr", "bdm"] },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Expenses", href: "/expenses", icon: Receipt, roles: ["ceo", "admin_hr", "bdm"] },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { profile, role, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  // Filter navigation based on user role
  const filteredNavigation = navigation.filter((item) => {
    if (!item.roles) return true; // Accessible by all
    if (!role) return false;
    return item.roles.includes(role);
  });

  // Get initials from profile name
  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return profile?.email?.slice(0, 2).toUpperCase() || "U";
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <img 
              src={logo} 
              alt="Beauty Maps" 
              className={cn("transition-all brightness-0 invert", collapsed ? "h-10 w-10 object-contain" : "h-12 w-auto")} 
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "h-8 w-8 text-muted-foreground hover:text-foreground",
              collapsed && "absolute -right-4 top-6 rounded-full border border-border bg-background"
            )}
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {filteredNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  collapsed && "justify-center px-2",
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                )
              }
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0")} />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="border-t border-sidebar-border p-3">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              "w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10",
              collapsed && "justify-center px-2"
            )}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
