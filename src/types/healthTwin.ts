
export interface HealthAvatar {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  height: number; // in cm
  weight: number; // in kg
  skinTone: string;
  hairColor: string;
  hairStyle: string;
  bodyType: 'slim' | 'average' | 'athletic' | 'heavy';
  customizations: {
    accessories: string[];
    clothing: string;
    features: Record<string, string>;
  };
}

export interface Symptom {
  id: string;
  name: string;
  severity: 1 | 2 | 3 | 4 | 5;
  bodyPart: string;
  duration: string;
  description: string;
  location: {
    x: number;
    y: number;
  };
}

export interface RiskFactor {
  id: string;
  name: string;
  category: 'lifestyle' | 'genetic' | 'environmental' | 'medical';
  level: 'low' | 'moderate' | 'high' | 'critical';
  score: number;
  description: string;
  recommendations: string[];
}

export interface HealthScore {
  overall: number;
  cardiovascular: number;
  mental: number;
  nutrition: number;
  fitness: number;
  sleep: number;
  lastUpdated: Date;
  trend: 'improving' | 'stable' | 'declining';
}

export interface VitalSigns {
  heartRate: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  temperature: number;
  oxygenSaturation: number;
  respiratoryRate: number;
  timestamp: Date;
}

export interface EmergencyTrigger {
  id: string;
  type: 'vitals' | 'symptoms' | 'condition';
  condition: string;
  threshold: number;
  isActive: boolean;
  emergencyContacts: string[];
  actionPlan: string;
}

export interface HealthMilestone {
  id: string;
  title: string;
  description: string;
  category: 'fitness' | 'nutrition' | 'medical' | 'mental';
  targetDate: Date;
  completedDate?: Date;
  progress: number;
  isCompleted: boolean;
}

export interface HealthTimelineEvent {
  id: string;
  date: Date;
  type: 'milestone' | 'vitals' | 'symptom' | 'medication' | 'appointment';
  title: string;
  description: string;
  severity?: 'low' | 'medium' | 'high';
  category: string;
}
