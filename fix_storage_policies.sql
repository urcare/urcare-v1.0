-- Fix storage bucket policies for payment screenshots
-- This script creates the bucket and sets up proper RLS policies

-- 1. Create the payment-screenshots bucket if it doesn't exist
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

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can upload their own payment screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own payment screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own payment screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own payment screenshots" ON storage.objects;

-- 3. Create comprehensive RLS policies for payment screenshots
CREATE POLICY "Users can upload their own payment screenshots" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'payment-screenshots' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own payment screenshots" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'payment-screenshots' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own payment screenshots" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'payment-screenshots' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own payment screenshots" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'payment-screenshots' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- 4. Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;

-- 5. Create a simple policy for public access to view screenshots (for admin review)
CREATE POLICY "Public can view payment screenshots" ON storage.objects
  FOR SELECT USING (bucket_id = 'payment-screenshots');

-- 6. Verify the bucket exists
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id = 'payment-screenshots';

-- 7. Verify policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%payment%';

