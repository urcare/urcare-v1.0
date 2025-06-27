-- First, let's create the user_profiles table (this should work)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  address TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  health_id TEXT, -- ABHA ID
  guardian_id UUID REFERENCES public.user_profiles(id),
  role TEXT NOT NULL DEFAULT 'patient' CHECK (role IN ('patient', 'doctor', 'nurse', 'admin', 'pharmacy', 'lab', 'reception')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'suspended')),
  preferences JSONB DEFAULT '{}',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to existing appointments table
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS reason TEXT,
ADD COLUMN IF NOT EXISTS prescription_id UUID;

-- Update appointments table to reference user_profiles instead of users
-- First check if the foreign key constraints exist and drop them
DO $$
BEGIN
    -- Try to drop existing foreign key constraints if they exist
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'appointments_patient_id_fkey') THEN
        ALTER TABLE public.appointments DROP CONSTRAINT appointments_patient_id_fkey;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'appointments_doctor_id_fkey') THEN
        ALTER TABLE public.appointments DROP CONSTRAINT appointments_doctor_id_fkey;
    END IF;
END $$;

-- Add new foreign key constraints to user_profiles
ALTER TABLE public.appointments 
ADD CONSTRAINT appointments_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.user_profiles(id),
ADD CONSTRAINT appointments_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.user_profiles(id);

-- Medical records table
CREATE TABLE IF NOT EXISTS public.medical_records_new (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.user_profiles(id),
  doctor_id UUID REFERENCES public.user_profiles(id),
  appointment_id UUID REFERENCES public.appointments(id),
  type TEXT NOT NULL CHECK (type IN ('prescription', 'lab_report', 'imaging', 'discharge_summary', 'consultation_notes', 'vaccination', 'other')),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_type TEXT,
  tags TEXT[],
  is_critical BOOLEAN DEFAULT FALSE,
  visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'family', 'doctors', 'emergency')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drop old medical_records if it exists and rename new one
DROP TABLE IF EXISTS public.medical_records;
ALTER TABLE public.medical_records_new RENAME TO medical_records;

-- Medications table
CREATE TABLE IF NOT EXISTS public.medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.user_profiles(id),
  doctor_id UUID REFERENCES public.user_profiles(id),
  appointment_id UUID REFERENCES public.appointments(id),
  medication_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  duration TEXT,
  instructions TEXT,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  refills_remaining INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id),
  type TEXT NOT NULL CHECK (type IN ('appointment_reminder', 'medication_reminder', 'test_result', 'emergency_alert', 'system_update', 'family_alert')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  scheduled_for TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health metrics table
CREATE TABLE IF NOT EXISTS public.health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id),
  metric_type TEXT NOT NULL CHECK (metric_type IN ('weight', 'blood_pressure', 'blood_sugar', 'heart_rate', 'temperature', 'oxygen_saturation', 'bmi', 'steps', 'sleep_hours', 'mood')),
  value DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  notes TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Family connections table
CREATE TABLE IF NOT EXISTS public.family_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id),
  family_member_id UUID NOT NULL REFERENCES public.user_profiles(id),
  relationship TEXT NOT NULL CHECK (relationship IN ('parent', 'child', 'spouse', 'sibling', 'guardian', 'dependent')),
  is_primary_caregiver BOOLEAN DEFAULT FALSE,
  permissions JSONB DEFAULT '{"view_records": false, "book_appointments": false, "emergency_access": true}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, family_member_id)
);

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_connections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);
  
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for medical_records
CREATE POLICY "Users can view own medical records" ON public.medical_records
  FOR SELECT USING (
    auth.uid() = patient_id OR 
    auth.uid() = doctor_id OR
    EXISTS (
      SELECT 1 FROM public.family_connections fc 
      WHERE fc.family_member_id = auth.uid() 
      AND fc.user_id = patient_id 
      AND (fc.permissions->>'view_records')::boolean = true
    )
  );
  
CREATE POLICY "Patients can create own records" ON public.medical_records
  FOR INSERT WITH CHECK (auth.uid() = patient_id);
  
CREATE POLICY "Doctors can create patient records" ON public.medical_records
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'doctor')
  );

-- RLS Policies for medications
CREATE POLICY "Users can view own medications" ON public.medications
  FOR SELECT USING (auth.uid() = patient_id OR auth.uid() = doctor_id);
  
CREATE POLICY "Patients can create own medications" ON public.medications
  FOR INSERT WITH CHECK (auth.uid() = patient_id);
  
CREATE POLICY "Doctors can prescribe medications" ON public.medications
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'doctor')
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for health_metrics
CREATE POLICY "Users can manage own health metrics" ON public.health_metrics
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for family_connections
CREATE POLICY "Users can view own family connections" ON public.family_connections
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = family_member_id);
  
CREATE POLICY "Users can manage own family connections" ON public.family_connections
  FOR ALL USING (auth.uid() = user_id);

-- Update the user creation function to work with user_profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_appointments_patient_date ON public.appointments(patient_id, date_time);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date ON public.appointments(doctor_id, date_time);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient ON public.medical_records(patient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_medications_patient_active ON public.medications(patient_id, is_active, end_date);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_health_metrics_user_type ON public.health_metrics(user_id, metric_type, recorded_at DESC);
