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
import { Search, Plus, Filter, MoreHorizontal, Mail, Phone, Eye, Edit, Trash2 } from "lucide-react";

const employees = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@beautymap.com",
    phone: "+1 234 567 8901",
    department: "Marketing",
    role: "Marketing Manager",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    joinDate: "Jan 15, 2022",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@beautymap.com",
    phone: "+1 234 567 8902",
    department: "Engineering",
    role: "Senior Developer",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    joinDate: "Mar 22, 2021",
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily.davis@beautymap.com",
    phone: "+1 234 567 8903",
    department: "HR",
    role: "HR Specialist",
    status: "On Leave",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    joinDate: "Jul 8, 2023",
  },
  {
    id: 4,
    name: "James Wilson",
    email: "james.wilson@beautymap.com",
    phone: "+1 234 567 8904",
    department: "Finance",
    role: "Financial Analyst",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    joinDate: "Nov 30, 2022",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    email: "lisa.anderson@beautymap.com",
    phone: "+1 234 567 8905",
    department: "Sales",
    role: "Sales Executive",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    joinDate: "Feb 14, 2024",
  },
  {
    id: 6,
    name: "David Kim",
    email: "david.kim@beautymap.com",
    phone: "+1 234 567 8906",
    department: "Engineering",
    role: "DevOps Engineer",
    status: "Inactive",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    joinDate: "Sep 5, 2020",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-success/10 text-success border-success/20 hover:bg-success/20";
    case "On Leave":
      return "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20";
    case "Inactive":
      return "bg-muted text-muted-foreground border-border hover:bg-muted";
    default:
      return "";
  }
};

const Employees = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Employees</h1>
            <p className="text-muted-foreground mt-1">Manage your team members</p>
          </div>
          <Button className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
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

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden animate-fade-in" style={{ animationDelay: "200ms" }}>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Employee</TableHead>
                <TableHead className="text-muted-foreground">Department</TableHead>
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
                        <AvatarImage src={employee.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {employee.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{employee.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {employee.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">{employee.department}</TableCell>
                  <TableCell className="text-muted-foreground">{employee.role}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusBadge(employee.status)}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{employee.joinDate}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border-border">
                        <DropdownMenuItem className="text-foreground hover:bg-secondary cursor-pointer">
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground hover:bg-secondary cursor-pointer">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive hover:bg-destructive/10 cursor-pointer">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between text-sm animate-fade-in" style={{ animationDelay: "400ms" }}>
          <p className="text-muted-foreground">
            Showing {filteredEmployees.length} of {employees.length} employees
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
    </DashboardLayout>
  );
};

export default Employees;
