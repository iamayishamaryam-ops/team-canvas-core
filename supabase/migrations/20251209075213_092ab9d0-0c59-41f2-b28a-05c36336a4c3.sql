-- Create storage buckets for leave and expense attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('leave-attachments', 'leave-attachments', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('expense-receipts', 'expense-receipts', false);

-- RLS policies for leave attachments
CREATE POLICY "Users can upload leave attachments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'leave-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own leave attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'leave-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admin can view all leave attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'leave-attachments' AND public.is_admin_level(auth.uid()));

CREATE POLICY "Users can delete own leave attachments"
ON storage.objects FOR DELETE
USING (bucket_id = 'leave-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

-- RLS policies for expense receipts
CREATE POLICY "Users can upload expense receipts"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'expense-receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own expense receipts"
ON storage.objects FOR SELECT
USING (bucket_id = 'expense-receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admin can view all expense receipts"
ON storage.objects FOR SELECT
USING (bucket_id = 'expense-receipts' AND public.is_admin_level(auth.uid()));

CREATE POLICY "Users can delete own expense receipts"
ON storage.objects FOR DELETE
USING (bucket_id = 'expense-receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add attachments column to leave_requests for storing file paths
ALTER TABLE public.leave_requests ADD COLUMN IF NOT EXISTS attachments TEXT[] DEFAULT '{}';

-- Add receipts column to expenses for storing file paths (renamed from receipt_url to support multiple)
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS receipts TEXT[] DEFAULT '{}';