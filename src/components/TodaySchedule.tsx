import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Clock, Activity, Utensils, Moon, Sun } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  time: string;
  duration: string;
  type: 'exercise' | 'meal' | 'rest' | 'work' | 'mindfulness';
  details?: string;
  instructions?: string[];
  equipment?: string[];
  difficulty?: string;
  calories?: number;
}

interface Plan {
  id: string;
  title: string;
  description: string;
  activities: Activity[];
}

interface TodayScheduleProps {
  plan?: Plan | null;
}

const TodaySchedule: React.FC<TodayScheduleProps> = ({ plan }) => {
  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set());

  // Generate full day schedule (7 AM to 11 PM)
  const generateFullDaySchedule = (): Activity[] => {
    const baseSchedule: Activity[] = [
      {
        id: 'wake-up',
        title: 'Wake Up & Hydration',
        time: '07:00',
        duration: '15 min',
        type: 'rest',
        details: 'Start your day with a glass of water',
        instructions: ['Drink 1 glass of water', 'Stretch gently', 'Open curtains for natural light']
      },
      {
        id: 'morning-meditation',
        title: 'Morning Meditation',
        time: '07:15',
        duration: '15 min',
        type: 'mindfulness',
        details: 'Set intention for the day',
        instructions: ['Find a quiet space', 'Sit comfortably', 'Focus on breathing', 'Set daily intention']
      },
      {
        id: 'breakfast',
        title: 'Breakfast',
        time: '07:30',
        duration: '30 min',
        type: 'meal',
        details: 'Nutritious morning meal',
        instructions: ['Include protein', 'Add fruits or vegetables', 'Stay hydrated', 'Eat mindfully']
      },
      {
        id: 'morning-exercise',
        title: 'Morning Exercise',
        time: '08:00',
        duration: '45 min',
        type: 'exercise',
        details: 'Energizing workout to start the day',
        instructions: ['Warm up for 5 minutes', 'Main workout for 30 minutes', 'Cool down for 10 minutes'],
        equipment: ['Yoga mat', 'Water bottle'],
        difficulty: 'Beginner',
        calories: 250
      },
      {
        id: 'work-session-1',
        title: 'Work Session 1',
        time: '09:00',
        duration: '2 hours',
        type: 'work',
        details: 'Focused work time',
        instructions: ['Set clear goals', 'Eliminate distractions', 'Take breaks every 25 minutes']
      },
      {
        id: 'mid-morning-snack',
        title: 'Mid-Morning Snack',
        time: '10:00',
        duration: '15 min',
        type: 'meal',
        details: 'Healthy snack to maintain energy',
        instructions: ['Choose protein-rich snack', 'Include fruits or nuts', 'Stay hydrated']
      },
      {
        id: 'work-session-2',
        title: 'Work Session 2',
        time: '10:15',
        duration: '1.5 hours',
        type: 'work',
        details: 'Continued focused work',
        instructions: ['Review morning progress', 'Tackle important tasks', 'Stay organized']
      },
      {
        id: 'lunch',
        title: 'Lunch',
        time: '12:00',
        duration: '45 min',
        type: 'meal',
        details: 'Balanced midday meal',
        instructions: ['Include vegetables', 'Add lean protein', 'Choose whole grains', 'Take time to enjoy']
      },
      {
        id: 'afternoon-walk',
        title: 'Afternoon Walk',
        time: '12:45',
        duration: '20 min',
        type: 'exercise',
        details: 'Gentle movement after lunch',
        instructions: ['Walk at comfortable pace', 'Get fresh air', 'Practice mindfulness'],
        calories: 100
      },
      {
        id: 'work-session-3',
        title: 'Work Session 3',
        time: '13:15',
        duration: '2 hours',
        type: 'work',
        details: 'Afternoon productivity',
        instructions: ['Focus on remaining tasks', 'Take short breaks', 'Stay hydrated']
      },
      {
        id: 'afternoon-snack',
        title: 'Afternoon Snack',
        time: '15:00',
        duration: '15 min',
        type: 'meal',
        details: 'Energy-boosting snack',
        instructions: ['Choose healthy options', 'Avoid sugar crash', 'Stay hydrated']
      },
      {
        id: 'work-session-4',
        title: 'Work Session 4',
        time: '15:15',
        duration: '1.5 hours',
        type: 'work',
        details: 'Final work push',
        instructions: ['Complete important tasks', 'Prepare for tomorrow', 'Review daily progress']
      },
      {
        id: 'evening-exercise',
        title: 'Evening Exercise',
        time: '17:00',
        duration: '45 min',
        type: 'exercise',
        details: 'Wind down with gentle movement',
        instructions: ['Choose relaxing activity', 'Focus on flexibility', 'Listen to your body'],
        equipment: ['Yoga mat', 'Comfortable clothes'],
        difficulty: 'Beginner',
        calories: 200
      },
      {
        id: 'dinner',
        title: 'Dinner',
        time: '18:00',
        duration: '45 min',
        type: 'meal',
        details: 'Light, nutritious evening meal',
        instructions: ['Keep portions moderate', 'Include vegetables', 'Avoid heavy foods', 'Eat slowly']
      },
      {
        id: 'evening-relaxation',
        title: 'Evening Relaxation',
        time: '19:00',
        duration: '1 hour',
        type: 'rest',
        details: 'Unwind and recharge',
        instructions: ['Read a book', 'Listen to music', 'Spend time with family', 'Practice gratitude']
      },
      {
        id: 'evening-meditation',
        title: 'Evening Meditation',
        time: '20:00',
        duration: '20 min',
        type: 'mindfulness',
        details: 'Reflect on the day',
        instructions: ['Find quiet space', 'Review day\'s events', 'Practice gratitude', 'Set tomorrow\'s intention']
      },
      {
        id: 'preparation',
        title: 'Prepare for Tomorrow',
        time: '20:30',
        duration: '30 min',
        type: 'work',
        details: 'Set up for success',
        instructions: ['Plan tomorrow\'s tasks', 'Prepare clothes', 'Pack lunch', 'Set morning routine']
      },
      {
        id: 'wind-down',
        title: 'Wind Down',
        time: '21:00',
        duration: '1 hour',
        type: 'rest',
        details: 'Prepare for sleep',
        instructions: ['Avoid screens', 'Dim lights', 'Practice relaxation', 'Prepare bedroom']
      },
      {
        id: 'bedtime',
        title: 'Bedtime',
        time: '22:00',
        duration: '8 hours',
        type: 'rest',
        details: 'Restful sleep',
        instructions: ['Keep room cool and dark', 'Avoid caffeine', 'Practice deep breathing', 'Get 7-9 hours sleep']
      }
    ];

    // If a plan is selected, merge its activities into the base schedule
    if (plan && plan.activities) {
      const planActivities = plan.activities.map(activity => ({
        ...activity,
        type: activity.type as 'exercise' | 'meal' | 'rest' | 'work' | 'mindfulness' || 'exercise'
      }));

      // Replace activities at the same time slots
      const mergedSchedule = baseSchedule.map(baseActivity => {
        const planActivity = planActivities.find(pa => pa.time === baseActivity.time);
        return planActivity || baseActivity;
      });

      // Add any new activities from the plan that don't have time conflicts
      const newActivities = planActivities.filter(pa => 
        !baseSchedule.some(ba => ba.time === pa.time)
      );

      return [...mergedSchedule, ...newActivities].sort((a, b) => 
        a.time.localeCompare(b.time)
      );
    }

    return baseSchedule;
  };

  const schedule = generateFullDaySchedule();

  const toggleExpanded = (activityId: string) => {
    const newExpanded = new Set(expandedActivities);
    if (newExpanded.has(activityId)) {
      newExpanded.delete(activityId);
    } else {
      newExpanded.add(activityId);
    }
    setExpandedActivities(newExpanded);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'exercise':
        return <Activity className="w-4 h-4" />;
      case 'meal':
        return <Utensils className="w-4 h-4" />;
      case 'rest':
        return <Moon className="w-4 h-4" />;
      case 'work':
        return <Clock className="w-4 h-4" />;
      case 'mindfulness':
        return <Sun className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'exercise':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'meal':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'rest':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'work':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'mindfulness':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Today's Schedule</h2>
        <p className="text-gray-600">
          {plan ? `Following: ${plan.title}` : 'Your daily routine'}
        </p>
      </div>

      <div className="space-y-3">
        {schedule.map((activity) => {
          const isExpanded = expandedActivities.has(activity.id);
          return (
            <Card 
              key={activity.id}
              className={`transition-all duration-200 hover:shadow-md ${
                isExpanded ? 'shadow-lg' : 'shadow-sm'
              }`}
            >
              <CardContent className="p-4">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleExpanded(activity.id)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-800">{activity.title}</span>
                        <span className="text-sm text-gray-500">{activity.time}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {activity.duration}
                        </span>
                      </div>
                      {activity.details && (
                        <p className="text-sm text-gray-600">{activity.details}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {activity.calories && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                        {activity.calories} cal
                      </span>
                    )}
                    {activity.difficulty && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                        {activity.difficulty}
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {activity.instructions && activity.instructions.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-800 mb-2">Instructions:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                          {activity.instructions.map((instruction, index) => (
                            <li key={index}>{instruction}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {activity.equipment && activity.equipment.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-800 mb-2">Equipment:</h4>
                        <div className="flex flex-wrap gap-2">
                          {activity.equipment.map((item, index) => (
                            <span 
                              key={index}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TodaySchedule;


