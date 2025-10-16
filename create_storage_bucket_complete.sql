-- Complete storage bucket setup for payment screenshots
-- This script ensures the bucket exists with proper policies

-- 1. Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. Create or update the payment-screenshots bucket
DO $$
BEGIN
  -- Insert bucket if it doesn't exist
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'payment-screenshots',
    'payment-screenshots', 
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Update bucket settings if it exists
  UPDATE storage.buckets 
  SET 
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  WHERE id = 'payment-screenshots';
END $$;

-- 3. Drop all existing policies for payment-screenshots to start clean
DO $$
DECLARE
  policy_name TEXT;
BEGIN
  FOR policy_name IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname LIKE '%payment%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', policy_name);
  END LOOP;
END $$;

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

-- 6. Test the setup
SELECT 
  'Bucket created/updated' as status,
  id, 
  name, 
  public, 
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id = 'payment-screenshots';

SELECT 
  'Policies created' as status,
  policyname,
  cmd,
  permissive
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%payment%'
ORDER BY policyname;

