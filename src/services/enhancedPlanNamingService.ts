// Enhanced Plan Naming Service
// This service provides intelligent naming for health plans

export class EnhancedPlanNamingService {
  // Generate a plan name based on the plan details
  static generatePlanName(planDetails: {
    primaryGoal: string;
    difficulty: string;
    duration: number;
    targetConditions?: string[];
  }): string {
    const { primaryGoal, difficulty, duration, targetConditions } = planDetails;
    
    // Base name from primary goal
    let baseName = primaryGoal.toLowerCase();
    
    // Add difficulty modifier
    const difficultyModifiers = {
      'beginner': 'Gentle',
      'intermediate': 'Balanced',
      'advanced': 'Intensive',
      'expert': 'Elite'
    };
    
    const modifier = difficultyModifiers[difficulty.toLowerCase() as keyof typeof difficultyModifiers] || 'Custom';
    
    // Add duration context
    const durationText = duration <= 4 ? 'Quick' : duration <= 12 ? 'Standard' : 'Extended';
    
    // Generate final name
    const planName = `${modifier} ${durationText} ${baseName.charAt(0).toUpperCase() + baseName.slice(1)} Plan`;
    
    return planName;
  }

  // Generate a plan description
  static generatePlanDescription(planDetails: {
    primaryGoal: string;
    difficulty: string;
    duration: number;
    targetConditions?: string[];
  }): string {
    const { primaryGoal, difficulty, duration, targetConditions } = planDetails;
    
    let description = `A ${difficulty.toLowerCase()} ${duration}-week program designed to help you achieve ${primaryGoal.toLowerCase()}.`;
    
    if (targetConditions && targetConditions.length > 0) {
      description += ` This plan specifically targets ${targetConditions.join(', ').toLowerCase()}.`;
    }
    
    description += ` The program includes personalized recommendations for diet, exercise, sleep, and stress management.`;
    
    return description;
  }

  // Get plan category based on primary goal
  static getPlanCategory(primaryGoal: string): string {
    const goal = primaryGoal.toLowerCase();
    
    if (goal.includes('weight') || goal.includes('fat')) {
      return 'Weight Management';
    } else if (goal.includes('muscle') || goal.includes('strength')) {
      return 'Fitness & Strength';
    } else if (goal.includes('energy') || goal.includes('vitality')) {
      return 'Energy & Vitality';
    } else if (goal.includes('sleep') || goal.includes('rest')) {
      return 'Sleep & Recovery';
    } else if (goal.includes('stress') || goal.includes('anxiety')) {
      return 'Mental Wellness';
    } else if (goal.includes('heart') || goal.includes('cardiovascular')) {
      return 'Heart Health';
    } else if (goal.includes('diabetes') || goal.includes('blood sugar')) {
      return 'Blood Sugar Management';
    } else {
      return 'General Wellness';
    }
  }

  // Generate plan tags
  static generatePlanTags(planDetails: {
    primaryGoal: string;
    difficulty: string;
    duration: number;
    targetConditions?: string[];
  }): string[] {
    const tags = [];
    const { primaryGoal, difficulty, duration, targetConditions } = planDetails;
    
    // Add difficulty tag
    tags.push(difficulty.toLowerCase());
    
    // Add duration tag
    if (duration <= 4) {
      tags.push('quick');
    } else if (duration <= 12) {
      tags.push('standard');
    } else {
      tags.push('extended');
    }
    
    // Add goal-based tags
    const goal = primaryGoal.toLowerCase();
    if (goal.includes('weight')) {
      tags.push('weight-management');
    }
    if (goal.includes('muscle')) {
      tags.push('muscle-building');
    }
    if (goal.includes('energy')) {
      tags.push('energy-boost');
    }
    if (goal.includes('sleep')) {
      tags.push('sleep-optimization');
    }
    
    // Add condition-specific tags
    if (targetConditions) {
      targetConditions.forEach(condition => {
        const conditionTag = condition.toLowerCase().replace(/\s+/g, '-');
        tags.push(conditionTag);
      });
    }
    
    return [...new Set(tags)]; // Remove duplicates
  }
}
