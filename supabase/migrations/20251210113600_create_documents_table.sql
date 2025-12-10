-- Create documents table
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Passport', 'Visa', 'ID', 'Contract', 'Other')),
  file_path TEXT NOT NULL,
  expiry_date DATE,
  file_size INTEGER, -- Optional: store file size in bytes
  content_type TEXT, -- Optional: store mime type
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own documents"
ON public.documents FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can upload own documents"
ON public.documents FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own documents"
ON public.documents FOR DELETE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admin level can view all documents"
ON public.documents FOR SELECT
TO authenticated
USING (public.is_admin_level(auth.uid()));

CREATE POLICY "Admin level can delete any documents"
ON public.documents FOR DELETE
TO authenticated
USING (public.is_admin_level(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
