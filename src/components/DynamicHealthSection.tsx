import React, { useState } from 'react';
import { 
  ChevronDown, 
  Heart, 
  Settings, 
  Calendar, 
  Activity, 
  CheckCircle,
  ArrowLeft,
  Clock
} from 'lucide-react';

interface HealthTip {
  id: string;
  title: string;
  time: string;
  category: string;
  description: string;
  icon: string;
}

interface PlanActivity {
  id: string;
  label: string;
  time: string;
}

interface HealthPlan {
  id: string;
  title: string;
  description: string;
  activities?: PlanActivity[];
  dailySchedule?: {
    morning?: {
      time: string;
      activity: string;
      details: string;
    };
    breakfast?: {
      time: string;
      meal: string;
      calories: number;
      macros: string;
    };
    workout?: {
      time: string;
      type: string;
      exercises?: Array<{
        name: string;
        sets: number;
        reps: number;
        rest: string;
      }>;
    };
    lunch?: {
      time: string;
      meal: string;
      calories: number;
      macros: string;
    };
    dinner?: {
      time: string;
      meal: string;
      calories: number;
      macros: string;
    };
    evening?: {
      time: string;
      activity: string;
      details: string;
    };
    bedtime?: {
      time: string;
      activity: string;
      details: string;
    };
  };
}

interface DynamicHealthSectionProps {
  isDarkMode: boolean;
  showTips: boolean;
  setShowTips: (show: boolean) => void;
  setShowYourHealthPopup: (show: boolean) => void;
  plans: HealthPlan[];
  selectedPlan: HealthPlan | null;
  onSelectPlan: (plan: HealthPlan) => void;
  onBackToPlans: () => void;
  todaysActivities: any[];
  expandedItems: Set<string>;
  toggleExpanded: (itemId: string) => void;
}

const DynamicHealthSection: React.FC<DynamicHealthSectionProps> = ({
  isDarkMode,
  showTips,
  setShowTips,
  setShowYourHealthPopup,
  plans,
  selectedPlan,
  onSelectPlan,
  onBackToPlans,
  todaysActivities,
  expandedItems,
  toggleExpanded
}) => {
  const [viewMode, setViewMode] = useState<'tips' | 'plans' | 'selectedPlan'>('tips');

  // Default health tips data
  const healthTips: HealthTip[] = [
    {
      id: 'hydration-tip',
      title: 'Stay Hydrated',
      time: 'All Day',
      category: 'Hydration',
      description: 'Drink at least 8 glasses of water throughout the day. Start your morning with a glass of water to kickstart your metabolism.',
      icon: '💧'
    },
    {
      id: 'sleep-tip',
      title: 'Quality Sleep',
      time: '22:00 - 06:00',
      category: 'Sleep',
      description: 'Aim for 7-9 hours of quality sleep. Keep your bedroom cool, dark, and quiet for optimal rest.',
      icon: '😴'
    },
    {
      id: 'exercise-tip',
      title: 'Daily Movement',
      time: '30 min',
      category: 'Exercise',
      description: 'Incorporate at least 30 minutes of physical activity daily. Even a brisk walk can make a significant difference.',
      icon: '🏃‍♂️'
    }
  ];

  // Update view mode when plans are available
  React.useEffect(() => {
    if (plans.length > 0 && viewMode === 'tips') {
      setViewMode('plans');
    }
  }, [plans, viewMode]);

  // Update view mode when plan is selected
  React.useEffect(() => {
    if (selectedPlan && viewMode === 'plans') {
      setViewMode('selectedPlan');
    }
  }, [selectedPlan, viewMode]);

  const handlePlanSelect = (plan: HealthPlan) => {
    onSelectPlan(plan);
    setViewMode('selectedPlan');
  };

  const handleBackToPlans = () => {
    onBackToPlans();
    setViewMode('plans');
  };

  const handleBackToTips = () => {
    setViewMode('tips');
    setShowTips(true);
  };

  const getIconForCategory = (category: string) => {
    switch (category) {
      case 'Exercise':
        return <Activity className={`w-4 h-4 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-200' : 'text-gray-800'
        }`} />;
      case 'Meals':
        return <img src="/icons/diet.png" alt="Diet" className="w-4 h-4" />;
      case 'Work':
        return <CheckCircle className={`w-4 h-4 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-200' : 'text-gray-800'
        }`} />;
      default:
        return <Calendar className={`w-4 h-4 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-200' : 'text-gray-800'
        }`} />;
    }
  };

  const renderHealthTips = () => (
    <>
      {healthTips.map((tip) => {
        const isExpanded = expandedItems.has(tip.id);
        
        return (
          <div key={tip.id} className="space-y-2">
            <div 
              onClick={() => toggleExpanded(tip.id)}
              className={`rounded-[2rem] px-4 py-3.5 flex items-center justify-between transition-colors duration-300 cursor-pointer hover:opacity-80 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 flex-shrink-0 ${
                  isDarkMode 
                    ? 'bg-gray-600 border-[#88ba82]' 
                    : 'bg-white border-yellow-400'
                }`}>
                  <span className="text-lg">{tip.icon}</span>
                </div>
                <div className="flex flex-col justify-center min-h-[2rem]">
                  <p className={`text-sm font-medium transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                    {tip.title}
                  </p>
                  <p className={`text-xs transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {tip.time}
                  </p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 transform transition-all duration-300 ${
                isExpanded ? 'rotate-180' : 'rotate-0'
              } ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </div>
            
            {/* Expanded Details */}
            {isExpanded && (
              <div className={`ml-4 p-3 rounded-xl transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-600' : 'bg-gray-50'
              }`}>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <strong>Description:</strong> {tip.description}
                </p>
                <p className={`text-xs mt-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <strong>Category:</strong> {tip.category}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </>
  );

  const renderPlans = () => (
    <>
      {plans.map((plan) => (
        <div key={plan.id} className="space-y-2">
          <div 
            onClick={() => handlePlanSelect(plan)}
            className={`rounded-[2rem] px-4 py-3.5 flex items-center justify-between transition-colors duration-300 cursor-pointer hover:opacity-80 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 flex-shrink-0 ${
                isDarkMode 
                  ? 'bg-gray-600 border-[#88ba82]' 
                  : 'bg-white border-yellow-400'
              }`}>
                <Heart className={`w-4 h-4 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-800'
                }`} />
              </div>
              <div className="flex flex-col justify-center min-h-[2rem]">
                <p className={`text-sm font-medium transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  {plan.title}
                </p>
                <p className={`text-xs transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {plan.description}
                </p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 transform transition-all duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`} />
          </div>
        </div>
      ))}
    </>
  );

  const renderSelectedPlanActivities = () => {
    // Handle both dailySchedule (from /api/health-plans) and activities (from /api/groq/generate-plan)
    if (!selectedPlan) {
      return <div className="text-center text-gray-500">No plan selected.</div>;
    }

    let scheduleItems = [];

    // Check if plan has dailySchedule (from /api/health-plans)
    if (selectedPlan.dailySchedule) {
      const { dailySchedule } = selectedPlan;
      
      // Convert AI daily schedule to display format
      scheduleItems = [
        dailySchedule.morning && {
          id: 'morning',
          time: dailySchedule.morning.time,
          title: 'Morning Routine',
          activity: dailySchedule.morning.activity,
          details: [dailySchedule.morning.details],
          icon: '🌅'
        },
        dailySchedule.breakfast && {
          id: 'breakfast',
          time: dailySchedule.breakfast.time,
          title: 'Breakfast',
          activity: dailySchedule.breakfast.meal,
          details: [
            `Calories: ${dailySchedule.breakfast.calories}`,
            `Macros: ${dailySchedule.breakfast.macros}`
          ],
          icon: '🍳'
        },
        dailySchedule.workout && {
          id: 'workout',
          time: dailySchedule.workout.time,
          title: 'Workout Session',
          activity: dailySchedule.workout.type,
          details: dailySchedule.workout.exercises?.map(ex => 
            `${ex.name}: ${ex.sets} sets x ${ex.reps} reps (${ex.rest} rest)`
          ) || [],
          icon: '💪'
        },
        dailySchedule.lunch && {
          id: 'lunch',
          time: dailySchedule.lunch.time,
          title: 'Lunch',
          activity: dailySchedule.lunch.meal,
          details: [
            `Calories: ${dailySchedule.lunch.calories}`,
            `Macros: ${dailySchedule.lunch.macros}`
          ],
          icon: '🥗'
        },
        dailySchedule.dinner && {
          id: 'dinner',
          time: dailySchedule.dinner.time,
          title: 'Dinner',
          activity: dailySchedule.dinner.meal,
          details: [
            `Calories: ${dailySchedule.dinner.calories}`,
            `Macros: ${dailySchedule.dinner.macros}`
          ],
          icon: '🍽️'
        },
        dailySchedule.evening && {
          id: 'evening',
          time: dailySchedule.evening.time,
          title: 'Evening Routine',
          activity: dailySchedule.evening.activity,
          details: [dailySchedule.evening.details],
          icon: '🌙'
        },
        dailySchedule.bedtime && {
          id: 'bedtime',
          time: dailySchedule.bedtime.time,
          title: 'Bedtime Routine',
          activity: dailySchedule.bedtime.activity,
          details: [dailySchedule.bedtime.details],
          icon: '😴'
        }
      ].filter(Boolean); // Remove null/undefined items
    }
    // Check if plan has activities array (from /api/groq/generate-plan)
    else if (selectedPlan.activities && Array.isArray(selectedPlan.activities)) {
      scheduleItems = selectedPlan.activities.map((activity, index) => ({
        id: activity.id || `activity_${index}`,
        time: activity.time || 'TBD',
        title: activity.label || 'Activity',
        activity: activity.description || activity.label || 'Activity',
        details: [activity.description || 'No details available'],
        icon: getActivityIcon(activity.label || 'Activity')
      }));
    }
    // Fallback if neither structure is found
    else {
      return <div className="text-center text-gray-500">No schedule available for this plan.</div>;
    }

    // Helper function to get appropriate icon based on activity label
    function getActivityIcon(label) {
      const lowerLabel = label.toLowerCase();
      if (lowerLabel.includes('breakfast') || lowerLabel.includes('meal') || lowerLabel.includes('food')) return '🍳';
      if (lowerLabel.includes('workout') || lowerLabel.includes('exercise') || lowerLabel.includes('gym')) return '💪';
      if (lowerLabel.includes('lunch')) return '🥗';
      if (lowerLabel.includes('dinner')) return '🍽️';
      if (lowerLabel.includes('morning') || lowerLabel.includes('wake')) return '🌅';
      if (lowerLabel.includes('evening') || lowerLabel.includes('wind')) return '🌙';
      if (lowerLabel.includes('bedtime') || lowerLabel.includes('sleep')) return '😴';
      if (lowerLabel.includes('work') || lowerLabel.includes('focus')) return '💻';
      if (lowerLabel.includes('break') || lowerLabel.includes('rest')) return '☕';
      return '📋';
    }

    return (
      <>
        {scheduleItems.map((scheduleItem, index) => {
          const itemId = `schedule-${scheduleItem.id}`;
          const isExpanded = expandedItems.has(itemId);
          
          return (
            <div key={itemId} className="space-y-2">
              <div 
                onClick={() => toggleExpanded(itemId)}
                className={`rounded-[2rem] px-4 py-3.5 flex items-center justify-between transition-colors duration-300 cursor-pointer hover:opacity-80 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 flex-shrink-0 ${
                    isDarkMode 
                      ? 'bg-gray-600 border-[#88ba82]' 
                      : 'bg-white border-yellow-400'
                  }`}>
                    <span className="text-lg">{scheduleItem.icon}</span>
                  </div>
                  <div className="flex flex-col justify-center min-h-[2rem]">
                    <p className={`text-sm font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      {scheduleItem.title}
                    </p>
                    <p className={`text-xs transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {scheduleItem.time}
                    </p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 transform transition-all duration-300 ${
                  isExpanded ? 'rotate-180' : 'rotate-0'
                } ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </div>
              
              {/* Expanded Details */}
              {isExpanded && (
                <div className={`ml-4 p-3 rounded-xl transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-600' : 'bg-gray-50'
                }`}>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <strong>Activity:</strong> {scheduleItem.activity}
                  </p>
                  <p className={`text-xs mt-2 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <strong>Time:</strong> {scheduleItem.time}
                  </p>
                  <div className={`mt-3 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <p className={`text-xs font-medium mb-2 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      Details:
                    </p>
                    <ul className="space-y-1">
                      {scheduleItem.details.map((detail, idx) => (
                        <li key={idx} className={`text-xs flex items-center gap-2 transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <span className="w-1 h-1 bg-current rounded-full"></span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </>
    );
  };

  const getTitle = () => {
    switch (viewMode) {
      case 'tips':
        return 'Health Tips';
      case 'plans':
        return 'Choose Your Plan';
      case 'selectedPlan':
        return 'Today\'s Schedule';
      default:
        return 'Health Tips';
    }
  };

  const getContent = () => {
    switch (viewMode) {
      case 'tips':
        return renderHealthTips();
      case 'plans':
        return renderPlans();
      case 'selectedPlan':
        return renderSelectedPlanActivities();
      default:
        return renderHealthTips();
    }
  };

  return (
    <div className={`py-6 flex-1 shadow-lg rounded-3xl transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className={`text-lg font-medium transition-colors duration-300 ${
          isDarkMode ? 'text-[#88ba82]' : 'text-yellow-500'
        }`}>
          {getTitle()}
        </h2>
        <div className="flex items-center gap-2">
          {/* Back button for selected plan view */}
          {viewMode === 'selectedPlan' && (
            <button
              onClick={handleBackToPlans}
              className="flex items-center justify-center w-6 h-6 transition-colors duration-300 hover:opacity-80"
              title="Back to Plans"
            >
              <ArrowLeft className={`w-4 h-4 transition-colors duration-300 ${
                isDarkMode ? 'text-[#88ba82]' : 'text-yellow-500'
              }`} />
            </button>
          )}
          
          {/* Back to tips button for plans view */}
          {viewMode === 'plans' && (
            <button
              onClick={handleBackToTips}
              className="flex items-center justify-center w-6 h-6 transition-colors duration-300 hover:opacity-80"
              title="Back to Health Tips"
            >
              <Heart className={`w-4 h-4 transition-colors duration-300 ${
                isDarkMode ? 'text-[#88ba82]' : 'text-yellow-500'
              }`} />
            </button>
          )}
          
          {/* Settings button */}
          <button
            onClick={() => setShowYourHealthPopup(true)}
            className="flex items-center justify-center w-6 h-6 transition-colors duration-300 hover:opacity-80"
          >
            <Settings className={`w-5 h-5 transition-colors duration-300 ${
              isDarkMode ? 'text-[#88ba82]' : 'text-yellow-500'
            }`} />
          </button>
        </div>
      </div>
      
      <div className="space-y-3 px-4">
        {getContent()}
      </div>
    </div>
  );
};

export default DynamicHealthSection;