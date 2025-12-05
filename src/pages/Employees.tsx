import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, Filter, MoreHorizontal, Mail, Eye, Edit, Trash2, Loader2 } from "lucide-react";
import { useEmployees } from "@/hooks/useEmployees";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import EmployeeProfileDialog from "@/components/employees/EmployeeProfileDialog";
import DeleteEmployeeDialog from "@/components/employees/DeleteEmployeeDialog";

const getStatusBadge = (status: string | null) => {
  switch (status) {
    case "active":
      return "bg-success/10 text-success border-success/20 hover:bg-success/20";
    case "on_leave":
      return "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20";
    case "inactive":
      return "bg-muted text-muted-foreground border-border hover:bg-muted";
    default:
      return "bg-success/10 text-success border-success/20 hover:bg-success/20";
  }
};

const formatStatus = (status: string | null) => {
  switch (status) {
    case "active":
      return "Active";
    case "on_leave":
      return "On Leave";
    case "inactive":
      return "Inactive";
    default:
      return "Active";
  }
};

const Employees = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [profileDialogMode, setProfileDialogMode] = useState<"view" | "edit">("view");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<{ id: string; name: string } | null>(null);

  const { data: employees, isLoading, error } = useEmployees();
  const { isAdminLevel, canManageEmployees } = useAuth();

  const filteredEmployees = employees?.filter(
    (emp) =>
      emp.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleViewProfile = (employeeId: string) => {
    setSelectedEmployee(employeeId);
    setProfileDialogMode("view");
    setProfileDialogOpen(true);
  };

  const handleEditProfile = (employeeId: string) => {
    setSelectedEmployee(employeeId);
    setProfileDialogMode("edit");
    setProfileDialogOpen(true);
  };

  const handleDeleteEmployee = (employeeId: string, employeeName: string) => {
    setEmployeeToDelete({ id: employeeId, name: employeeName });
    setDeleteDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Employees</h1>
            <p className="text-muted-foreground mt-1">Manage your team members</p>
          </div>
          {canManageEmployees && (
            <Button className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-border focus:border-primary"
            />
          </div>
          <Button variant="outline" className="border-border hover:bg-secondary">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12 text-destructive">
            <p>Failed to load employees. Please try again.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredEmployees.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No employees found.</p>
          </div>
        )}

        {/* Table */}
        {!isLoading && !error && filteredEmployees.length > 0 && (
          <div className="rounded-xl border border-border bg-card overflow-hidden animate-fade-in" style={{ animationDelay: "200ms" }}>
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Employee</TableHead>
                  <TableHead className="text-muted-foreground">Department</TableHead>
                  <TableHead className="text-muted-foreground">Position</TableHead>
                  <TableHead className="text-muted-foreground">Role</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Join Date</TableHead>
                  <TableHead className="text-muted-foreground w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee, index) => (
                  <TableRow
                    key={employee.id}
                    className="border-border hover:bg-secondary/50 transition-colors animate-fade-in"
                    style={{ animationDelay: `${(index + 3) * 50}ms` }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-border">
                          <AvatarImage src={employee.avatar_url || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {employee.full_name?.split(" ").map((n) => n[0]).join("") || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{employee.full_name || "Unknown"}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {employee.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">{employee.department || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">{employee.position || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {employee.role?.replace("_", " ") || "employee"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadge(employee.status)}>
                        {formatStatus(employee.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {employee.created_at
                        ? format(new Date(employee.created_at), "MMM dd, yyyy")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border">
                          <DropdownMenuItem
                            className="text-foreground hover:bg-secondary cursor-pointer"
                            onClick={() => handleViewProfile(employee.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          {isAdminLevel && (
                            <DropdownMenuItem
                              className="text-foreground hover:bg-secondary cursor-pointer"
                              onClick={() => handleEditProfile(employee.id)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          {isAdminLevel && (
                            <DropdownMenuItem
                              className="text-destructive hover:bg-destructive/10 cursor-pointer"
                              onClick={() => handleDeleteEmployee(employee.id, employee.full_name || "Unknown")}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between text-sm animate-fade-in" style={{ animationDelay: "400ms" }}>
          <p className="text-muted-foreground">
            Showing {filteredEmployees.length} of {employees?.length || 0} employees
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-border hover:bg-secondary">
              Previous
            </Button>
            <Button variant="outline" size="sm" className="border-border hover:bg-secondary">
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <EmployeeProfileDialog
        employeeId={selectedEmployee}
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        mode={profileDialogMode}
      />

      <DeleteEmployeeDialog
        employeeId={employeeToDelete?.id || null}
        employeeName={employeeToDelete?.name || ""}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </DashboardLayout>
  );
};

export default Employees;
