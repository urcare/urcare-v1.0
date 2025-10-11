-- Create storage bucket for user health reports
-- This migration sets up the storage bucket and RLS policies for health report uploads

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'health-reports',
  'health-reports',
  false, -- Private bucket
  10485760, -- 10MB file size limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
) ON CONFLICT (id) DO NOTHING;

-- Create RLS policy for health reports bucket
-- Users can only upload files to their own folder
CREATE POLICY "Users can upload their own health reports" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'health-reports' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can view their own health reports
CREATE POLICY "Users can view their own health reports" ON storage.objects
FOR SELECT USING (
  bucket_id = 'health-reports' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can update their own health reports
CREATE POLICY "Users can update their own health reports" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'health-reports' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own health reports
CREATE POLICY "Users can delete their own health reports" ON storage.objects
FOR DELETE USING (
  bucket_id = 'health-reports' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.objects TO service_role;
