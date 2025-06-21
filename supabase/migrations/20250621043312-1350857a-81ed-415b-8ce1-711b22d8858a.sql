
-- First, let's add department and specialization support to user_profiles for doctors
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS specialization TEXT,
ADD COLUMN IF NOT EXISTS license_number TEXT;

-- Create doctor availability table
CREATE TABLE IF NOT EXISTS public.doctor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
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
ALTER TABLE public.doctor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for doctor_availability
CREATE POLICY "Anyone can view doctor availability" ON public.doctor_availability
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Doctors can manage their availability" ON public.doctor_availability
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'doctor' AND id = doctor_id)
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
CREATE INDEX IF NOT EXISTS idx_doctor_availability_doctor_day ON public.doctor_availability(doctor_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_appointment_slots_doctor_date ON public.appointment_slots(doctor_id, slot_date, is_available);
CREATE INDEX IF NOT EXISTS idx_appointments_slot_id ON public.appointments(slot_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role_department ON public.user_profiles(role, department) WHERE role = 'doctor';
