import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Activity, 
  Play, 
  Square, 
  Pause, 
  Map, 
  Target, 
  TrendingUp, 
  Clock,
  Zap,
  Footprints
} from 'lucide-react';
import { FitnessTrackingService, FitnessSession } from '../../services/fitnessTrackingService';
import { UserFitnessProfile } from '../../services/stepCounterService';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface FitnessTrackerProps {
  userProfile?: UserFitnessProfile;
}

export const FitnessTracker: React.FC<FitnessTrackerProps> = ({ userProfile }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [fitnessService] = useState(() => FitnessTrackingService.getInstance());
  const [isTracking, setIsTracking] = useState(false);
  const [currentSession, setCurrentSession] = useState<FitnessSession | null>(null);
  const [currentStats, setCurrentStats] = useState<{
    steps: number;
    distance: number;
    calories: number;
    duration: number;
    pace: number;
  } | null>(null);
  const [dailyStats, setDailyStats] = useState<any>(null);
  const [activityType, setActivityType] = useState<'walking' | 'running' | 'cycling' | 'hiking'>('walking');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize fitness tracking service
  useEffect(() => {
    const initializeService = async () => {
      if (!userProfile || isInitialized) return;

      try {
        await fitnessService.initialize(userProfile);
        setIsInitialized(true);
        
        // Set up session update callback
        fitnessService.onSessionUpdate = (session) => {
          setCurrentSession(session);
        };

        // Load today's stats
        const stats = await fitnessService.getDailyStats();
        setDailyStats(stats);

        console.log('Fitness tracking service initialized');
      } catch (error) {
        console.error('Failed to initialize fitness tracking service:', error);
        toast({
          title: 'Initialization Error',
          description: 'Failed to initialize fitness tracking. Please check permissions.',
          variant: 'destructive'
        });
      }
    };

    initializeService();
  }, [userProfile, fitnessService, isInitialized, toast]);

  // Update current stats periodically
  useEffect(() => {
    if (!isTracking) return;

    const updateStats = () => {
      const stats = fitnessService.getCurrentStats();
      if (stats) {
        setCurrentStats(stats);
      }
    };

    // Update immediately
    updateStats();

    // Update every second while tracking
    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, [isTracking, fitnessService]);

  // Start tracking
  const handleStartTracking = useCallback(async () => {
    if (!isInitialized) {
      toast({
        title: 'Not Ready',
        description: 'Please wait for fitness tracking to initialize.',
        variant: 'destructive'
      });
      return;
    }

    try {
      await fitnessService.startTracking(activityType);
      setIsTracking(true);
      toast({
        title: 'Tracking Started',
        description: `Started tracking ${activityType} activity.`,
      });
    } catch (error) {
      console.error('Failed to start tracking:', error);
      toast({
        title: 'Start Error',
        description: 'Failed to start fitness tracking. Please check permissions.',
        variant: 'destructive'
      });
    }
  }, [fitnessService, activityType, isInitialized, toast]);

  // Stop tracking
  const handleStopTracking = useCallback(async () => {
    try {
      const completedSession = await fitnessService.stopTracking();
      setIsTracking(false);
      
      if (completedSession) {
        toast({
          title: 'Session Complete',
          description: `Completed ${completedSession.activityType} session with ${completedSession.totalSteps} steps.`,
        });
        
        // Reload daily stats
        const stats = await fitnessService.getDailyStats();
        setDailyStats(stats);
      }
    } catch (error) {
      console.error('Failed to stop tracking:', error);
      toast({
        title: 'Stop Error',
        description: 'Failed to stop fitness tracking.',
        variant: 'destructive'
      });
    }
  }, [fitnessService, toast]);

  // Pause tracking
  const handlePauseTracking = useCallback(async () => {
    try {
      await fitnessService.pauseTracking();
      toast({
        title: 'Tracking Paused',
        description: 'Fitness tracking has been paused.',
      });
    } catch (error) {
      console.error('Failed to pause tracking:', error);
    }
  }, [fitnessService, toast]);

  // Resume tracking
  const handleResumeTracking = useCallback(async () => {
    try {
      await fitnessService.resumeTracking();
      toast({
        title: 'Tracking Resumed',
        description: 'Fitness tracking has been resumed.',
      });
    } catch (error) {
      console.error('Failed to resume tracking:', error);
    }
  }, [fitnessService, toast]);

  // Format duration
  const formatDuration = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    }
    return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
  };

  // Format distance
  const formatDistance = (meters: number): string => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`;
    }
    return `${Math.round(meters)} m`;
  };

  // Format pace
  const formatPace = (mps: number): string => {
    if (mps === 0) return '0:00 /km';
    
    const pacePerKm = 1000 / mps; // seconds per km
    const minutes = Math.floor(pacePerKm / 60);
    const seconds = Math.floor(pacePerKm % 60);
    
    return `${minutes}:${String(seconds).padStart(2, '0')} /km`;
  };

  // Calculate step goal progress
  const stepGoal = 10000; // Default 10K steps
  const stepProgress = dailyStats ? (dailyStats.totalSteps / stepGoal) * 100 : 0;

  if (!isInitialized) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center space-x-2">
          <Activity className="h-5 w-5 animate-spin" />
          <span>Initializing fitness tracking...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Tracking Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Fitness Tracker</h2>
          </div>
          <Badge variant={isTracking ? 'default' : 'secondary'}>
            {isTracking ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        {/* Activity Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Activity Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['walking', 'running', 'cycling', 'hiking'] as const).map((type) => (
              <Button
                key={type}
                variant={activityType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActivityType(type)}
                disabled={isTracking}
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Current Session Stats */}
        {isTracking && currentStats && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-medium text-blue-900 mb-3">Current Session</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatDuration(currentStats.duration)}
                </div>
                <div className="text-sm text-blue-700">Duration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {currentStats.steps.toLocaleString()}
                </div>
                <div className="text-sm text-green-700">Steps</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatDistance(currentStats.distance)}
                </div>
                <div className="text-sm text-purple-700">Distance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {formatPace(currentStats.pace)}
                </div>
                <div className="text-sm text-orange-700">Pace</div>
              </div>
            </div>
          </div>
        )}

        {/* Daily Progress */}
        {dailyStats && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Daily Steps Progress</span>
              <span className="text-sm text-gray-500">
                {dailyStats.totalSteps.toLocaleString()} / {stepGoal.toLocaleString()}
              </span>
            </div>
            <Progress value={Math.min(stepProgress, 100)} className="h-2" />
            <div className="mt-2 text-xs text-gray-500">
              {stepProgress >= 100 ? 'Goal achieved! 🎉' : `${Math.round(100 - stepProgress)}% remaining`}
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex space-x-3">
          {!isTracking ? (
            <Button
              onClick={handleStartTracking}
              className="flex-1"
              size="lg"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Tracking
            </Button>
          ) : (
            <>
              <Button
                onClick={handlePauseTracking}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button
                onClick={handleStopTracking}
                variant="destructive"
                className="flex-1"
                size="lg"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
            </>
          )}
        </div>

        {/* Resume button if paused */}
        {isTracking && (
          <div className="mt-3">
            <Button
              onClick={handleResumeTracking}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Play className="h-4 w-4 mr-2" />
              Resume Tracking
            </Button>
          </div>
        )}
      </Card>

      {/* Daily Summary */}
      {dailyStats && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Today's Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {dailyStats.totalSteps.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Steps</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatDistance(dailyStats.totalDistance)}
              </div>
              <div className="text-sm text-gray-600">Distance</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(dailyStats.totalCalories)}
              </div>
              <div className="text-sm text-gray-600">Calories</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {formatPace(dailyStats.averagePace)}
              </div>
              <div className="text-sm text-gray-600">Avg Pace</div>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Zap className="h-5 w-5 mr-2" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-12">
            <Map className="h-4 w-4 mr-2" />
            View Routes
          </Button>
          <Button variant="outline" className="h-12">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button variant="outline" className="h-12">
            <Footprints className="h-4 w-4 mr-2" />
            Goals
          </Button>
          <Button variant="outline" className="h-12">
            <Clock className="h-4 w-4 mr-2" />
            History
          </Button>
        </div>
      </Card>
    </div>
  );
};
