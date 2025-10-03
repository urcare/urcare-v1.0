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
    // Complete daily schedule from 7 AM to 11 PM
    const dailySchedule = [
      {
        id: 'morning-wakeup',
        time: '07:00',
        title: 'Morning Wake-up Routine',
        activity: 'Yoga',
        details: ['Downward Dog', 'Warrior II', 'Child\'s Pose'],
        icon: '🧘‍♀️'
      },
      {
        id: 'breakfast',
        time: '07:30',
        title: 'Healthy Breakfast',
        activity: 'Breakfast',
        details: ['Oatmeal with Berries', 'Avocado Toast', 'Greek Yogurt Bowl'],
        icon: '🍳'
      },
      {
        id: 'focused-work',
        time: '08:00',
        title: 'Focused Work Session',
        activity: 'Work',
        details: ['Emails & Planning', 'Deep Work: Coding', 'Project Review'],
        icon: '💻'
      },
      {
        id: 'deep-work',
        time: '09:00',
        title: 'Deep Work Block',
        activity: 'Work',
        details: ['Deep Work: Coding', 'Problem Solving', 'Algorithm Practice'],
        icon: '🔬'
      },
      {
        id: 'short-break',
        time: '10:30',
        title: 'Short Break',
        activity: 'Leisure/Break',
        details: ['Walk Outside', 'Stretch', 'Hydrate'],
        icon: '🚶‍♂️'
      },
      {
        id: 'creative-work',
        time: '11:00',
        title: 'Creative Work',
        activity: 'Work',
        details: ['Brainstorming', 'Design', 'Writing'],
        icon: '🎨'
      },
      {
        id: 'lunch',
        time: '12:30',
        title: 'Lunch Break',
        activity: 'Lunch',
        details: ['Grilled Chicken Salad', 'Quinoa Bowl', 'Veggie Wrap'],
        icon: '🥗'
      },
      {
        id: 'afternoon-work',
        time: '13:30',
        title: 'Afternoon Work',
        activity: 'Work',
        details: ['Meetings', 'Collaboration', 'Review'],
        icon: '👥'
      },
      {
        id: 'energy-boost',
        time: '15:00',
        title: 'Energy Boost',
        activity: 'Leisure/Break',
        details: ['10-min Meditation', 'Green Tea', 'Light Snack'],
        icon: '⚡'
      },
      {
        id: 'physical-activity',
        time: '16:00',
        title: 'Physical Activity',
        activity: 'Workout',
        details: ['30-min Walk', 'Yoga Flow', 'Gym Session'],
        icon: '🏃‍♂️'
      },
      {
        id: 'wind-down',
        time: '17:30',
        title: 'Wind-down Routine',
        activity: 'Leisure/Break',
        details: ['Journaling', 'Gratitude List', 'Breathing Exercises'],
        icon: '📝'
      },
      {
        id: 'dinner',
        time: '18:30',
        title: 'Dinner',
        activity: 'Dinner',
        details: ['Salmon & Veggies', 'Lentil Curry', 'Stir-fry Tofu'],
        icon: '🍽️'
      },
      {
        id: 'leisure',
        time: '20:00',
        title: 'Leisure / Hobbies',
        activity: 'Hobby',
        details: ['Reading', 'Music', 'Art', 'Podcast'],
        icon: '📚'
      },
      {
        id: 'evening-relaxation',
        time: '21:30',
        title: 'Evening Relaxation',
        activity: 'Leisure/Break',
        details: ['Warm Bath', 'Herbal Tea', 'No Screens'],
        icon: '🛁'
      },
      {
        id: 'sleep-prep',
        time: '22:30',
        title: 'Sleep Prep',
        activity: 'Leisure/Break',
        details: ['Dim Lights', 'Stretch', 'Affirmations'],
        icon: '🌙'
      },
      {
        id: 'lights-out',
        time: '23:00',
        title: 'Lights Out',
        activity: 'Sleep',
        details: ['Sleep', 'Rest', 'Recovery'],
        icon: '😴'
      }
    ];

    return (
      <>
        {dailySchedule.map((scheduleItem, index) => {
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


