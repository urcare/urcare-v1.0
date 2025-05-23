
export type MoodType = 'very_happy' | 'happy' | 'neutral' | 'sad' | 'very_sad' | 'anxious' | 'stressed' | 'excited' | 'calm' | 'angry';

export interface MoodEntry {
  id: string;
  mood: MoodType;
  emoji: string;
  intensity: number; // 1-10 scale
  timestamp: Date;
  notes?: string;
  triggers?: string[];
  activities?: string[];
  location?: string;
}

export interface EmotionalPattern {
  id: string;
  type: 'weekly_low' | 'stress_spike' | 'anxiety_pattern' | 'improvement_trend' | 'energy_dip';
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  severity: 'mild' | 'moderate' | 'severe';
  triggers: string[];
  suggestions: string[];
  detectedAt: Date;
}

export interface MicroHabit {
  id: string;
  title: string;
  description: string;
  category: 'mindfulness' | 'movement' | 'social' | 'creativity' | 'self_care';
  duration: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  moodBoost: number; // expected improvement 1-10
  isCompleted: boolean;
  completedAt?: Date;
  streak: number;
}

export interface BuddyProfile {
  id: string;
  name: string;
  avatar: string;
  moodCompatibility: number; // percentage
  interests: string[];
  timezone: string;
  isOnline: boolean;
  lastActive: Date;
  supportStyle: 'encouraging' | 'listening' | 'problem_solving' | 'distraction';
}

export interface CrisisAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  triggeredAt: Date;
  isActive: boolean;
  recommendedActions: string[];
}

export interface AIInsight {
  id: string;
  type: 'pattern' | 'suggestion' | 'warning' | 'celebration';
  title: string;
  description: string;
  confidence: number; // 0-100
  actionable: boolean;
  generatedAt: Date;
}
