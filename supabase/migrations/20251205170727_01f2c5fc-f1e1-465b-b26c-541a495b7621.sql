-- Create storage bucket for employee documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('employee-documents', 'employee-documents', false);

-- Allow authenticated users to upload their own documents
CREATE POLICY "Users can upload own documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'employee-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can view their own documents
CREATE POLICY "Users can view own documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'employee-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Admin level can view all documents
CREATE POLICY "Admin can view all documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'employee-documents' 
  AND is_admin_level(auth.uid())
);

-- Admin level can upload documents for any user
CREATE POLICY "Admin can upload documents for any user"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'employee-documents' 
  AND is_admin_level(auth.uid())
);

-- Users can delete their own documents
CREATE POLICY "Users can delete own documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'employee-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Admin can delete any documents
CREATE POLICY "Admin can delete any documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'employee-documents' 
  AND is_admin_level(auth.uid())
);

-- Add status column to profiles if not exists
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';

-- Add DELETE policy for admin-level users on profiles
CREATE POLICY "Admin level can delete profiles"
ON public.profiles
FOR DELETE
TO authenticated
USING (is_admin_level(auth.uid()));