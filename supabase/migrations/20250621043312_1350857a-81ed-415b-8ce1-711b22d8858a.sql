-- First, let's add department and specialization support to user_profiles for doctors
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS specialization TEXT,
ADD COLUMN IF NOT EXISTS license_number TEXT,
ADD COLUMN IF NOT EXISTS emergency_phone TEXT,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Create doctor_patients table for doctor-patient relationships
CREATE TABLE IF NOT EXISTS public.doctor_patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  relationship_type TEXT DEFAULT 'primary' CHECK (relationship_type IN ('primary', 'consultant', 'specialist', 'emergency')),
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(doctor_id, patient_id)
);

-- Create doctor availability table
CREATE TABLE IF NOT EXISTS public.doctor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  max_appointments INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(doctor_id, day_of_week, start_time, end_time)
);

-- Create appointment slots table for better slot management
CREATE TABLE IF NOT EXISTS public.appointment_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  slot_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  max_appointments INTEGER DEFAULT 1,
  current_appointments INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(doctor_id, slot_date, start_time)
);

-- Add departments reference table
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some default departments
INSERT INTO public.departments (name, description) VALUES
('Cardiology', 'Heart and cardiovascular system care'),
('Neurology', 'Brain and nervous system disorders'),
('Pediatrics', 'Children''s health and development'),
('Dermatology', 'Skin, hair, and nail conditions'),
('Orthopedics', 'Bones, joints, and musculoskeletal system'),
('General Medicine', 'Primary care and general health')
ON CONFLICT (name) DO NOTHING;

-- Update appointments table to better support booking
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS slot_id UUID REFERENCES public.appointment_slots(id),
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS booking_reference TEXT UNIQUE DEFAULT 'APT-' || upper(substring(gen_random_uuid()::text, 1, 8));

-- Enable RLS on new tables
ALTER TABLE public.doctor_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for doctor_patients
CREATE POLICY "Doctors can view their patients" ON public.doctor_patients
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'doctor' AND id = doctor_id)
  );

CREATE POLICY "Patients can view their doctors" ON public.doctor_patients
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'patient' AND id = patient_id)
  );

CREATE POLICY "Doctors can manage their patient relationships" ON public.doctor_patients
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'doctor' AND id = doctor_id)
  );

-- RLS Policies for doctor_availability
CREATE POLICY "Doctors can manage their availability" ON public.doctor_availability
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'doctor' AND id = doctor_id)
  );

CREATE POLICY "Patients can view doctor availability" ON public.doctor_availability
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'patient')
  );

-- RLS Policies for appointment_slots
CREATE POLICY "Anyone can view available slots" ON public.appointment_slots
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Doctors can manage their slots" ON public.appointment_slots
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'doctor' AND id = doctor_id)
  );

-- RLS Policies for departments
CREATE POLICY "Anyone can view departments" ON public.departments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage departments" ON public.departments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Function to automatically create appointment slots based on doctor availability
-- Fixed: renamed current_date variable to iter_date to avoid PostgreSQL reserved keyword
CREATE OR REPLACE FUNCTION public.generate_appointment_slots(
  doctor_uuid UUID,
  start_date DATE,
  end_date DATE,
  slot_duration_minutes INTEGER DEFAULT 30
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  iter_date DATE;
  availability_record RECORD;
  slot_start TIME;
  slot_end TIME;
  slots_created INTEGER := 0;
BEGIN
  iter_date := start_date;
  
  WHILE iter_date <= end_date LOOP
    -- Get availability for current day of week (0=Sunday)
    FOR availability_record IN 
      SELECT * FROM public.doctor_availability 
      WHERE doctor_id = doctor_uuid 
      AND day_of_week = EXTRACT(DOW FROM iter_date)
      AND is_available = true
    LOOP
      slot_start := availability_record.start_time;
      
      WHILE slot_start < availability_record.end_time LOOP
        slot_end := slot_start + (slot_duration_minutes || ' minutes')::INTERVAL;
        
        -- Don't create slot if it exceeds availability end time
        IF slot_end <= availability_record.end_time THEN
          INSERT INTO public.appointment_slots (
            doctor_id, slot_date, start_time, end_time, is_available
          ) VALUES (
            doctor_uuid, iter_date, slot_start, slot_end, true
          ) ON CONFLICT (doctor_id, slot_date, start_time) DO NOTHING;
          
          slots_created := slots_created + 1;
        END IF;
        
        slot_start := slot_end;
      END LOOP;
    END LOOP;
    
    iter_date := iter_date + 1;
  END LOOP;
  
  RETURN slots_created;
END;
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_doctor_patients_doctor ON public.doctor_patients(doctor_id, is_active);
CREATE INDEX IF NOT EXISTS idx_doctor_patients_patient ON public.doctor_patients(patient_id, is_active);
CREATE INDEX IF NOT EXISTS idx_doctor_availability_doctor_day ON public.doctor_availability(doctor_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_appointment_slots_doctor_date ON public.appointment_slots(doctor_id, slot_date, is_available);
CREATE INDEX IF NOT EXISTS idx_appointments_slot_id ON public.appointments(slot_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role_department ON public.user_profiles(role, department) WHERE role = 'doctor';

-- Update medical_records policies to include doctor access
DROP POLICY IF EXISTS "Users can view own medical records" ON public.medical_records;
CREATE POLICY "Users can view own medical records" ON public.medical_records
  FOR SELECT USING (
    auth.uid() = patient_id OR 
    auth.uid() = doctor_id OR
    EXISTS (
      SELECT 1 FROM public.doctor_patients dp 
      WHERE dp.doctor_id = auth.uid() 
      AND dp.patient_id = patient_id 
      AND dp.is_active = true
    ) OR
    EXISTS (
      SELECT 1 FROM public.family_connections fc 
      WHERE fc.family_member_id = auth.uid() 
      AND fc.user_id = patient_id 
      AND (fc.permissions->>'view_records')::boolean = true
    )
  );

-- Update medications policies to include doctor access
DROP POLICY IF EXISTS "Users can view own medications" ON public.medications;
CREATE POLICY "Users can view own medications" ON public.medications
  FOR SELECT USING (
    auth.uid() = patient_id OR 
    auth.uid() = doctor_id OR
    EXISTS (
      SELECT 1 FROM public.doctor_patients dp 
      WHERE dp.doctor_id = auth.uid() 
      AND dp.patient_id = patient_id 
      AND dp.is_active = true
    )
  );

-- Add admin access to all records
CREATE POLICY "Admins can view all records" ON public.medical_records
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage all records" ON public.medical_records
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can view all medications" ON public.medications
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage all medications" ON public.medications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
