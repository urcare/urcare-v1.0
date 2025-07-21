// Authentication types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  role?: UserRole;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export type UserRole = 'Patient' | 'Doctor' | 'Nurse' | 'Admin' | 'Pharmacy' | 'Lab' | 'Reception';

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: User;
}

// Emotional Health types
export interface EmotionalHealthData {
  userId: string;
  timestamp: string;
  mood: MoodLevel;
  stressLevel: StressLevel;
  anxietyLevel: AnxietyLevel;
  energyLevel: EnergyLevel;
  sleepQuality: SleepQuality;
  socialConnection: SocialConnectionLevel;
  notes?: string;
  triggers?: string[];
  copingStrategies?: string[];
}

export type MoodLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type StressLevel = 'Low' | 'Moderate' | 'High' | 'Severe';
export type AnxietyLevel = 'Minimal' | 'Mild' | 'Moderate' | 'Severe';
export type EnergyLevel = 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Very High';
export type SleepQuality = 'Poor' | 'Fair' | 'Good' | 'Very Good' | 'Excellent';
export type SocialConnectionLevel = 'Isolated' | 'Limited' | 'Moderate' | 'Good' | 'Strong';

export interface MoodEntry {
  id: string;
  mood: MoodLevel;
  notes?: string;
  timestamp: string;
  activities?: string[];
  location?: string;
}

export interface EmotionalPattern {
  timeframe: 'daily' | 'weekly' | 'monthly';
  averageMood: number;
  moodTrend: 'improving' | 'stable' | 'declining';
  commonTriggers: string[];
  effectiveStrategies: string[];
  riskFactors: string[];
}

export interface TherapySession {
  id: string;
  therapistId: string;
  patientId: string;
  scheduledAt: string;
  duration: number;
  notes?: string;
  goals?: string[];
  homework?: string[];
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
}

export interface MentalHealthAssessment {
  id: string;
  patientId: string;
  assessmentType: 'PHQ-9' | 'GAD-7' | 'DASS-21' | 'PSS' | 'Custom';
  score: number;
  severity: 'minimal' | 'mild' | 'moderate' | 'severe';
  completedAt: string;
  recommendations?: string[];
}

// Health Twin types
export interface HealthTwinData {
  userId: string;
  profileData: ProfileData;
  healthMetrics: HealthMetrics;
  riskFactors: RiskFactor[];
  predictions: HealthPrediction[];
  recommendations: HealthRecommendation[];
  goals: HealthGoal[];
  lastUpdated: string;
}

export interface ProfileData {
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // in cm
  weight: number; // in kg
  bloodType: BloodType;
  allergies: string[];
  medications: Medication[];
  medicalHistory: MedicalCondition[];
  familyHistory: FamilyMedicalHistory[];
  lifestyle: LifestyleFactors;
}

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  purpose: string;
}

export interface MedicalCondition {
  condition: string;
  diagnosedDate: string;
  severity: 'mild' | 'moderate' | 'severe';
  status: 'active' | 'resolved' | 'managed';
  treatment?: string;
}

export interface FamilyMedicalHistory {
  relation: 'parent' | 'sibling' | 'grandparent' | 'other';
  condition: string;
  ageOfOnset?: number;
}

export interface LifestyleFactors {
  smokingStatus: 'never' | 'former' | 'current';
  alcoholConsumption: 'none' | 'light' | 'moderate' | 'heavy';
  exerciseLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  dietType: 'standard' | 'vegetarian' | 'vegan' | 'keto' | 'mediterranean' | 'other';
  sleepHours: number;
  stressLevel: 'low' | 'moderate' | 'high';
}

export interface HealthMetrics {
  vitals: VitalSigns;
  labResults: LabResult[];
  biometrics: BiometricData;
  wearableData?: WearableData;
}

export interface VitalSigns {
  bloodPressure: {
    systolic: number;
    diastolic: number;
    timestamp: string;
  };
  heartRate: {
    value: number;
    timestamp: string;
  };
  temperature: {
    value: number;
    unit: 'celsius' | 'fahrenheit';
    timestamp: string;
  };
  respiratoryRate: {
    value: number;
    timestamp: string;
  };
  oxygenSaturation: {
    value: number;
    timestamp: string;
  };
}

export interface LabResult {
  testName: string;
  value: number;
  unit: string;
  referenceRange: {
    min: number;
    max: number;
  };
  status: 'normal' | 'low' | 'high' | 'critical';
  testDate: string;
  lab: string;
}

export interface BiometricData {
  bmi: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  boneDensity?: number;
  metabolicAge?: number;
  visceralFat?: number;
}

export interface WearableData {
  steps: number;
  activeMinutes: number;
  caloriesBurned: number;
  sleepData: {
    totalSleep: number;
    deepSleep: number;
    lightSleep: number;
    remSleep: number;
    sleepEfficiency: number;
  };
  heartRateVariability?: number;
  stressScore?: number;
  recoveryScore?: number;
}

export interface RiskFactor {
  type: 'genetic' | 'lifestyle' | 'environmental' | 'medical';
  factor: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'very_high';
  description: string;
  modifiable: boolean;
  recommendations?: string[];
}

export interface HealthPrediction {
  condition: string;
  riskScore: number; // 0-100
  confidence: number; // 0-100
  timeframe: '3_months' | '6_months' | '1_year' | '5_years' | '10_years';
  factors: string[];
  preventionStrategies: string[];
}

export interface HealthRecommendation {
  id: string;
  type: 'lifestyle' | 'medical' | 'preventive' | 'dietary' | 'exercise';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  actionItems: string[];
  expectedBenefit: string;
  timeToImpact: string;
  evidence: string;
  personalizedReason: string;
}

export interface HealthGoal {
  id: string;
  type: 'weight_loss' | 'fitness' | 'nutrition' | 'sleep' | 'stress' | 'medical' | 'custom';
  title: string;
  description: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  deadline: string;
  milestones: Milestone[];
  status: 'not_started' | 'in_progress' | 'achieved' | 'paused' | 'cancelled';
  progress: number; // 0-100
}

export interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  completed: boolean;
  completedDate?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Common utility types
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'date';
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: any) => boolean | string;
  };
}

export interface TableColumn<T = any> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
  width?: string | number;
}

// Health Twin specific types
export interface Symptom {
  id: string;
  name: string;
  severity: number; // 1-5
  bodyPart: string;
  duration: string;
  description?: string;
  location?: { x: number; y: number };
}

export interface HealthAvatar {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  height: number; // cm
  weight: number; // kg
  skinTone: string;
  hairColor: string;
  hairStyle: string;
  bodyType: string;
  customizations: {
    accessories: string[];
    clothing: string;
    features: Record<string, any>;
  };
}

export interface HealthScore {
  overall: number;
  cardiovascular: number;
  mental: number;
  fitness: number;
  sleep: number;
  nutrition: number;
  trend: 'improving' | 'stable' | 'declining';
  lastUpdated: string;
}

export interface EmergencyTrigger {
  id: string;
  type: 'vitals' | 'symptoms' | 'condition';
  condition: string;
  threshold: number;
  isActive: boolean;
  emergencyContacts: string[];
  actionPlan?: string;
}

export interface HealthMilestone {
  id: string;
  title: string;
  category: 'fitness' | 'nutrition' | 'medical' | 'mental';
  target: number;
  current: number;
  unit: string;
  deadline: string;
  completed: boolean;
  completedDate?: string;
}

export interface HealthTimelineEvent {
  id: string;
  type: 'milestone' | 'vitals' | 'symptom' | 'medication' | 'appointment';
  title: string;
  description?: string;
  date: string;
  severity?: 'low' | 'medium' | 'high';
  category?: string;
  data?: Record<string, any>;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
} 