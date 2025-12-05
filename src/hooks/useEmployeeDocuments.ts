import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface EmployeeDocument {
  name: string;
  url: string;
  createdAt: string;
  size: number;
}

export const useEmployeeDocuments = (employeeId: string | null) => {
  return useQuery({
    queryKey: ["employee-documents", employeeId],
    queryFn: async () => {
      if (!employeeId) return [];

      const { data, error } = await supabase.storage
        .from("employee-documents")
        .list(employeeId);

      if (error) throw error;

      const documents: EmployeeDocument[] = await Promise.all(
        (data || []).map(async (file) => {
          const { data: urlData } = supabase.storage
            .from("employee-documents")
            .getPublicUrl(`${employeeId}/${file.name}`);

          return {
            name: file.name,
            url: urlData.publicUrl,
            createdAt: file.created_at,
            size: file.metadata?.size || 0,
          };
        })
      );

      return documents;
    },
    enabled: !!employeeId,
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      employeeId,
      file,
    }: {
      employeeId: string;
      file: File;
    }) => {
      const filePath = `${employeeId}/${Date.now()}_${file.name}`;
      
      const { error } = await supabase.storage
        .from("employee-documents")
        .upload(filePath, file);

      if (error) throw error;
    },
    onSuccess: (_, { employeeId }) => {
      queryClient.invalidateQueries({ queryKey: ["employee-documents", employeeId] });
      toast.success("Document uploaded successfully");
    },
    onError: (error) => {
      toast.error("Failed to upload document: " + error.message);
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      employeeId,
      fileName,
    }: {
      employeeId: string;
      fileName: string;
    }) => {
      const { error } = await supabase.storage
        .from("employee-documents")
        .remove([`${employeeId}/${fileName}`]);

      if (error) throw error;
    },
    onSuccess: (_, { employeeId }) => {
      queryClient.invalidateQueries({ queryKey: ["employee-documents", employeeId] });
      toast.success("Document deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete document: " + error.message);
    },
  });
};

export const useDownloadDocument = () => {
  return useMutation({
    mutationFn: async ({
      employeeId,
      fileName,
    }: {
      employeeId: string;
      fileName: string;
    }) => {
      const { data, error } = await supabase.storage
        .from("employee-documents")
        .download(`${employeeId}/${fileName}`);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    onError: (error) => {
      toast.error("Failed to download document: " + error.message);
    },
  });
};
