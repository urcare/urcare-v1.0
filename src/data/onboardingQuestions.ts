import { QuestionData } from '../components/onboarding/QuestionStep';

export const onboardingQuestions: QuestionData[] = [
  // Sleep improvement question (from image 1)
  {
    id: 'sleep_improvement',
    type: 'multiple-choice',
    question: 'What would you like to improve about your sleep?',
    options: [
      {
        id: 'consistent_schedule',
        label: 'Build a consistent sleep schedule',
      },
      {
        id: 'sleep_quality',
        label: 'Improve sleep quality',
      },
      {
        id: 'fall_asleep_faster',
        label: 'Fall asleep faster',
      },
      {
        id: 'all_above',
        label: 'All the above',
      },
    ],
  },

  // Health priorities (from image 2)
  {
    id: 'health_priorities',
    type: 'cards',
    question: 'What is the most important aspect of health for you?',
    options: [
      {
        id: 'better_sleep',
        label: 'Better sleep',
        description: 'Feeling rested every night and maintaining good sleep habits.',
        icon: '🌙',
      },
      {
        id: 'improved_wellbeing',
        label: 'Improved wellbeing',
        description: 'Eating better, stressing less, and forming habits that help you thrive.',
        icon: '😊',
      },
      {
        id: 'lasting_fitness',
        label: 'Lasting fitness',
        description: 'Building strength and endurance to be at your best.',
        icon: '💪',
      },
    ],
  },

  // Weight goal (from image 7)
  {
    id: 'weight_goal',
    type: 'single-choice',
    question: 'What is your goal?',
    description: 'This helps us generate a plan for your calorie intake.',
    options: [
      {
        id: 'lose_weight',
        label: 'Lose weight',
      },
      {
        id: 'maintain',
        label: 'Maintain',
      },
      {
        id: 'gain_weight',
        label: 'Gain weight',
      },
    ],
  },

  // Goal speed (from image 3)
  {
    id: 'goal_speed',
    type: 'slider',
    question: 'How fast do you want to reach your goal?',
    description: 'Gain weight speed per week',
    min: 0.1,
    max: 1.5,
    step: 0.1,
    unit: 'kg',
    options: [
      {
        id: 'slow',
        label: '0.1 kg',
        icon: '🐌',
      },
      {
        id: 'medium',
        label: '0.8 kg',
        icon: '🐰',
      },
      {
        id: 'fast',
        label: '1.5 kg',
        icon: '🐆',
      },
    ],
  },

  // Current weight (from image 4)
  {
    id: 'current_weight',
    type: 'number',
    question: 'What is your current weight?',
    placeholder: '70',
    unit: 'kg',
    min: 30,
    max: 200,
  },

  // Target weight (from image 4)
  {
    id: 'target_weight',
    type: 'number',
    question: 'What is your desired weight?',
    placeholder: '65',
    unit: 'kg',
    min: 30,
    max: 200,
  },

  // Height
  {
    id: 'height',
    type: 'number',
    question: 'What is your height?',
    placeholder: '170',
    unit: 'cm',
    min: 100,
    max: 250,
  },

  // Age
  {
    id: 'age',
    type: 'number',
    question: 'What is your age?',
    placeholder: '25',
    unit: 'years',
    min: 13,
    max: 120,
  },

  // Gender
  {
    id: 'gender',
    type: 'single-choice',
    question: 'What is your gender?',
    options: [
      {
        id: 'male',
        label: 'Male',
      },
      {
        id: 'female',
        label: 'Female',
      },
      {
        id: 'other',
        label: 'Other',
      },
    ],
  },

  // Barriers (from image 8)
  {
    id: 'barriers',
    type: 'multiple-choice',
    question: "What's stopping you from reaching your goals?",
    options: [
      {
        id: 'lack_consistency',
        label: 'Lack of consistency',
        icon: '📊',
      },
      {
        id: 'unhealthy_eating',
        label: 'Unhealthy eating habits',
        icon: '🍔',
      },
      {
        id: 'lack_support',
        label: 'Lack of support',
        icon: '🤝',
      },
      {
        id: 'busy_schedule',
        label: 'Busy schedule',
        icon: '📅',
      },
      {
        id: 'lack_inspiration',
        label: 'Lack of meal inspiration',
        icon: '🍎',
      },
    ],
  },

  // Chronic conditions
  {
    id: 'chronic_conditions',
    type: 'multiple-choice',
    question: 'Do you have any chronic conditions?',
    options: [
      {
        id: 'diabetes',
        label: 'Diabetes',
      },
      {
        id: 'hypertension',
        label: 'Hypertension',
      },
      {
        id: 'asthma',
        label: 'Asthma',
      },
      {
        id: 'pcos',
        label: 'PCOS',
      },
      {
        id: 'kidney_issues',
        label: 'Kidney issues',
      },
      {
        id: 'none',
        label: 'None',
      },
    ],
  },

  // Diet type
  {
    id: 'diet_type',
    type: 'single-choice',
    question: 'What is your diet type?',
    options: [
      {
        id: 'vegetarian',
        label: 'Vegetarian',
      },
      {
        id: 'non_vegetarian',
        label: 'Non-Vegetarian',
      },
      {
        id: 'vegan',
        label: 'Vegan',
      },
      {
        id: 'eggetarian',
        label: 'Eggetarian',
      },
    ],
  },

  // Allergies
  {
    id: 'allergies',
    type: 'text',
    question: 'Do you have any allergies?',
    placeholder: 'e.g., Nuts, Dairy, Penicillin...',
  },

  // Smartwatch usage
  {
    id: 'smartwatch_usage',
    type: 'yes-no',
    question: 'Do you use a smartwatch or fitness band?',
  },

  // Family tracking
  {
    id: 'family_tracking',
    type: 'yes-no',
    question: 'Do you want to track family members\' health too?',
  },
];

export const getQuestionById = (id: string): QuestionData | undefined => {
  return onboardingQuestions.find(q => q.id === id);
}; 