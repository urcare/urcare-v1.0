-- Complete storage bucket setup for payment screenshots
-- Run this in your Supabase SQL editor

-- 1. Create the payment-screenshots bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment-screenshots',
  'payment-screenshots', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- 2. Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "payment_screenshots_upload" ON storage.objects;
DROP POLICY IF EXISTS "payment_screenshots_select" ON storage.objects;
DROP POLICY IF EXISTS "payment_screenshots_update" ON storage.objects;
DROP POLICY IF EXISTS "payment_screenshots_delete" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own payment screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own payment screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own payment screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own payment screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Public can view payment screenshots" ON storage.objects;

-- 4. Create comprehensive RLS policies
CREATE POLICY "payment_screenshots_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'payment-screenshots' 
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "payment_screenshots_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'payment-screenshots' 
    AND (
      auth.uid() IS NOT NULL 
      AND (storage.foldername(name))[1] = auth.uid()::text
      OR 
      auth.uid() IS NOT NULL -- Allow authenticated users to view for admin purposes
    )
  );

CREATE POLICY "payment_screenshots_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'payment-screenshots' 
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "payment_screenshots_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'payment-screenshots' 
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 5. Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;

-- 6. Verify the setup
SELECT 
  'Bucket Status' as info,
  id, 
  name, 
  public, 
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id = 'payment-screenshots';

SELECT 
  'Policies Status' as info,
  policyname,
  cmd,
  permissive
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%payment%'
ORDER BY policyname;
