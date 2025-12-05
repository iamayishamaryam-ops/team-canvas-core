import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEmployee, useUpdateEmployee, Employee } from "@/hooks/useEmployees";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];
import {
  useEmployeeDocuments,
  useUploadDocument,
  useDeleteDocument,
  useDownloadDocument,
} from "@/hooks/useEmployeeDocuments";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Upload, Download, Trash2, FileText, Mail, Phone, Building, Briefcase, Calendar, User } from "lucide-react";
import { format } from "date-fns";

interface EmployeeProfileDialogProps {
  employeeId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "view" | "edit";
}

const EmployeeProfileDialog = ({
  employeeId,
  open,
  onOpenChange,
  mode: initialMode,
}: EmployeeProfileDialogProps) => {
  const [mode, setMode] = useState(initialMode);
  const { data: employee, isLoading } = useEmployee(employeeId);
  const { data: documents, isLoading: documentsLoading } = useEmployeeDocuments(employeeId);
  const updateEmployee = useUpdateEmployee();
  const uploadDocument = useUploadDocument();
  const deleteDocument = useDeleteDocument();
  const downloadDocument = useDownloadDocument();
  const { isAdminLevel, role: currentUserRole } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Employee>>({});

  // Sync form data when employee changes
  useState(() => {
    if (employee) {
      setFormData(employee);
    }
  });

  const handleSave = async () => {
    if (!employeeId || !employee) return;

    const { id, role, ...profileData } = formData;
    
    await updateEmployee.mutateAsync({
      id: employeeId,
      data: {
        full_name: formData.full_name,
        phone: formData.phone,
        department: formData.department,
        position: formData.position,
        status: formData.status,
      },
      newRole: isAdminLevel && formData.role !== employee.role ? (formData.role as AppRole) : undefined,
    });

    setMode("view");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !employeeId) return;

    await uploadDocument.mutateAsync({ employeeId, file });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success border-success/20";
      case "on_leave":
        return "bg-warning/10 text-warning border-warning/20";
      case "inactive":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-success/10 text-success border-success/20";
    }
  };

  const canEditRole = currentUserRole === "ceo" || currentUserRole === "admin_hr";

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!employee) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Employee Not Found</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">Could not find employee details.</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-border">
              <AvatarImage src={employee.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {employee.full_name?.split(" ").map((n) => n[0]).join("") || "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <span>{employee.full_name || "Unknown"}</span>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={getStatusBadge(employee.status)}>
                  {employee.status || "active"}
                </Badge>
                <Badge variant="secondary">{employee.role}</Badge>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6 mt-4">
            {mode === "view" ? (
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">{employee.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{employee.phone || "Not set"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Department</p>
                      <p className="text-sm font-medium">{employee.department || "Not set"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Position</p>
                      <p className="text-sm font-medium">{employee.position || "Not set"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Role</p>
                      <p className="text-sm font-medium capitalize">{employee.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Joined</p>
                      <p className="text-sm font-medium">
                        {employee.created_at
                          ? format(new Date(employee.created_at), "MMM dd, yyyy")
                          : "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
                
                {isAdminLevel && (
                  <Button onClick={() => setMode("edit")} className="w-full">
                    Edit Profile
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={formData.department || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={formData.position || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, position: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status || "active"}
                      onValueChange={(value) =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="on_leave">On Leave</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {canEditRole && (
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={formData.role || "employee"}
                        onValueChange={(value) =>
                          setFormData({ ...formData, role: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employee">Employee</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="bdm">BDM</SelectItem>
                          <SelectItem value="admin_hr">Admin/HR</SelectItem>
                          {currentUserRole === "ceo" && (
                            <SelectItem value="ceo">CEO</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    disabled={updateEmployee.isPending}
                    className="flex-1"
                  >
                    {updateEmployee.isPending && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setMode("view")}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="documents" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Employee Documents</h3>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="document-upload"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadDocument.isPending}
                  >
                    {uploadDocument.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Upload Document
                  </Button>
                </div>
              </div>

              {documentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : documents && documents.length > 0 ? (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.name}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{doc.name.split("_").slice(1).join("_")}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.createdAt
                              ? format(new Date(doc.createdAt), "MMM dd, yyyy")
                              : "Unknown date"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            downloadDocument.mutate({
                              employeeId: employeeId!,
                              fileName: doc.name,
                            })
                          }
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {isAdminLevel && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() =>
                              deleteDocument.mutate({
                                employeeId: employeeId!,
                                fileName: doc.name,
                              })
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No documents uploaded</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeProfileDialog;
