import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  getTodaysActivities, 
  markActivityCompleted, 
  checkAndGenerateNextDay,
  getDailyProgress 
} from '@/services/healthSystemService';
import { 
  CheckCircle2, 
  Clock, 
  Play, 
  Pause, 
  SkipForward,
  Calendar,
  TrendingUp,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

interface DailyActivity {
  id: string;
  activity_type: string;
  activity_title: string;
  activity_description: string;
  scheduled_time: string;
  duration_minutes: number;
  status: 'pending' | 'completed' | 'skipped' | 'in_progress';
  completed_at?: string;
  user_notes?: string;
}

interface DailyProgress {
  total_activities: number;
  completed_activities: number;
  completion_percentage: number;
}

export const DailyActivitiesView: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [progress, setProgress] = useState<DailyProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [completingActivity, setCompletingActivity] = useState<string | null>(null);

  // Load today's activities
  const loadTodaysActivities = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get today's activities
      const activitiesResult = await getTodaysActivities(user.id);
      if (activitiesResult.success) {
        setActivities(activitiesResult.data);
      }

      // Get daily progress
      const today = new Date().toISOString().split('T')[0];
      const progressResult = await getDailyProgress(user.id, today);
      if (progressResult.success && progressResult.data) {
        setProgress(progressResult.data);
      }

      // Check if next day generation is needed
      await checkAndGenerateNextDay(user.id);

    } catch (error) {
      console.error('Failed to load activities:', error);
      toast.error('Failed to load today\'s activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodaysActivities();
  }, [user]);

  // Mark activity as completed
  const handleCompleteActivity = async (activityId: string) => {
    if (!user) return;

    try {
      setCompletingActivity(activityId);
      
      const result = await markActivityCompleted(user.id, activityId);
      
      if (result.success) {
        toast.success('Activity completed! 🎉');
        
        // Update local state
        setActivities(prev => 
          prev.map(activity => 
            activity.id === activityId 
              ? { ...activity, status: 'completed', completed_at: new Date().toISOString() }
              : activity
          )
        );

        // Reload progress
        await loadTodaysActivities();
      } else {
        toast.error('Failed to mark activity as completed');
      }
    } catch (error) {
      console.error('Failed to complete activity:', error);
      toast.error('Failed to complete activity');
    } finally {
      setCompletingActivity(null);
    }
  };

  // Mark activity as skipped
  const handleSkipActivity = async (activityId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('daily_health_activities')
        .update({ status: 'skipped' })
        .eq('id', activityId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.info('Activity skipped');
      
      // Update local state
      setActivities(prev => 
        prev.map(activity => 
          activity.id === activityId 
            ? { ...activity, status: 'skipped' }
            : activity
        )
      );

      // Reload progress
      await loadTodaysActivities();
    } catch (error) {
      console.error('Failed to skip activity:', error);
      toast.error('Failed to skip activity');
    }
  };

  // Get activity icon based on type
  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'workout':
        return <Activity className="w-5 h-5 text-blue-500" />;
      case 'meal':
        return <span className="text-2xl">🍽️</span>;
      case 'sleep':
        return <span className="text-2xl">😴</span>;
      case 'meditation':
        return <span className="text-2xl">🧘</span>;
      case 'hydration':
        return <span className="text-2xl">💧</span>;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'skipped':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      {progress && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Today's Progress</h2>
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{progress.completed_activities}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{progress.total_activities}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{Math.round(progress.completion_percentage)}%</div>
              <div className="text-sm text-gray-600">Progress</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.completion_percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Activities List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Today's Activities</h3>
        
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No activities scheduled for today</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className={`bg-white rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md ${
                activity.status === 'completed' ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.activity_type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">{activity.activity_title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{activity.activity_description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{activity.scheduled_time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>⏱️</span>
                        <span>{activity.duration_minutes} min</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-2 ml-4">
                  {activity.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleCompleteActivity(activity.id)}
                        disabled={completingActivity === activity.id}
                        className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 disabled:opacity-50 transition-colors"
                      >
                        {completingActivity === activity.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        <span>Complete</span>
                      </button>
                      
                      <button
                        onClick={() => handleSkipActivity(activity.id)}
                        className="flex items-center space-x-1 px-3 py-1 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600 transition-colors"
                      >
                        <SkipForward className="w-4 h-4" />
                        <span>Skip</span>
                      </button>
                    </>
                  )}
                  
                  {activity.status === 'completed' && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                  )}
                  
                  {activity.status === 'skipped' && (
                    <div className="flex items-center space-x-1 text-yellow-600">
                      <SkipForward className="w-5 h-5" />
                      <span className="text-sm font-medium">Skipped</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
