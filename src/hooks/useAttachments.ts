import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useUploadLeaveAttachment = () => {
  return useMutation({
    mutationFn: async ({
      userId,
      leaveRequestId,
      file,
    }: {
      userId: string;
      leaveRequestId: string;
      file: File;
    }) => {
      const filePath = `${userId}/${leaveRequestId}/${Date.now()}_${file.name}`;
      
      const { error } = await supabase.storage
        .from("leave-attachments")
        .upload(filePath, file);

      if (error) throw error;
      return filePath;
    },
    onError: (error) => {
      toast.error("Failed to upload attachment: " + error.message);
    },
  });
};

export const useUploadExpenseReceipt = () => {
  return useMutation({
    mutationFn: async ({
      userId,
      file,
    }: {
      userId: string;
      file: File;
    }) => {
      const filePath = `${userId}/${Date.now()}_${file.name}`;
      
      const { error } = await supabase.storage
        .from("expense-receipts")
        .upload(filePath, file);

      if (error) throw error;
      return filePath;
    },
    onError: (error) => {
      toast.error("Failed to upload receipt: " + error.message);
    },
  });
};

export const getAttachmentUrl = (bucket: string, filePath: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
};

export const useDownloadAttachment = () => {
  return useMutation({
    mutationFn: async ({
      bucket,
      filePath,
      fileName,
    }: {
      bucket: string;
      filePath: string;
      fileName: string;
    }) => {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(filePath);

      if (error) throw error;

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
      toast.error("Failed to download: " + error.message);
    },
  });
};

export const useDeleteAttachment = () => {
  return useMutation({
    mutationFn: async ({
      bucket,
      filePath,
    }: {
      bucket: string;
      filePath: string;
    }) => {
      const { error } = await supabase.storage.from(bucket).remove([filePath]);
      if (error) throw error;
    },
    onError: (error) => {
      toast.error("Failed to delete: " + error.message);
    },
  });
};
