import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle, 
  Circle, 
  Utensils, 
  Dumbbell, 
  Pill, 
  Droplets, 
  Bed,
  Bell,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

interface HealthEvent {
  id: string;
  type: 'workout' | 'meal' | 'medication' | 'hydration' | 'sleep';
  title: string;
  time: string;
  description: string;
  completed: boolean;
  category: string;
  icon: React.ReactNode;
  color: string;
}

const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [events, setEvents] = useState<HealthEvent[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);

  // Sample daily schedule - in a real app, this would come from the user's health plan
  const defaultEvents: HealthEvent[] = [
    {
      id: '1',
      type: 'workout',
      title: 'Morning Cardio',
      time: '07:00',
      description: '30 minutes of cardio exercise',
      completed: false,
      category: 'Fitness',
      icon: <Dumbbell className="w-5 h-5" />,
      color: 'bg-blue-500'
    },
    {
      id: '2',
      type: 'meal',
      title: 'Breakfast',
      time: '08:00',
      description: 'Protein-rich breakfast with fruits',
      completed: false,
      category: 'Nutrition',
      icon: <Utensils className="w-5 h-5" />,
      color: 'bg-green-500'
    },
    {
      id: '3',
      type: 'hydration',
      title: 'Drink Water',
      time: '09:00',
      description: 'Drink 8oz of water',
      completed: false,
      category: 'Hydration',
      icon: <Droplets className="w-5 h-5" />,
      color: 'bg-cyan-500'
    },
    {
      id: '4',
      type: 'workout',
      title: 'Strength Training',
      time: '12:00',
      description: 'Upper body strength workout',
      completed: false,
      category: 'Fitness',
      icon: <Dumbbell className="w-5 h-5" />,
      color: 'bg-blue-500'
    },
    {
      id: '5',
      type: 'meal',
      title: 'Lunch',
      time: '13:00',
      description: 'Balanced lunch with vegetables',
      completed: false,
      category: 'Nutrition',
      icon: <Utensils className="w-5 h-5" />,
      color: 'bg-green-500'
    },
    {
      id: '6',
      type: 'medication',
      title: 'Take Vitamins',
      time: '14:00',
      description: 'Daily vitamin supplements',
      completed: false,
      category: 'Health',
      icon: <Pill className="w-5 h-5" />,
      color: 'bg-purple-500'
    },
    {
      id: '7',
      type: 'meal',
      title: 'Dinner',
      time: '19:00',
      description: 'Light dinner with protein',
      completed: false,
      category: 'Nutrition',
      icon: <Utensils className="w-5 h-5" />,
      color: 'bg-green-500'
    },
    {
      id: '8',
      type: 'sleep',
      title: 'Bedtime Routine',
      time: '22:00',
      description: 'Prepare for 8 hours of sleep',
      completed: false,
      category: 'Sleep',
      icon: <Bed className="w-5 h-5" />,
      color: 'bg-indigo-500'
    }
  ];

  useEffect(() => {
    // Load events from localStorage or use defaults
    const savedEvents = localStorage.getItem('dashboardEvents');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      setEvents(defaultEvents);
    }

    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Save events to localStorage whenever they change
    localStorage.setItem('dashboardEvents', JSON.stringify(events));
  }, [events]);

  const toggleEventCompletion = (eventId: string) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId
          ? { ...event, completed: !event.completed }
          : event
      )
    );

    const event = events.find(e => e.id === eventId);
    if (event) {
      if (!event.completed) {
        toast.success(`Great job! ${event.title} completed! 🎉`);
      } else {
        toast.info(`${event.title} marked as incomplete`);
      }
    }
  };

  const getCurrentEvent = () => {
    const now = currentTime;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

    return events.find(event => {
      const [eventHour, eventMinute] = event.time.split(':').map(Number);
      const eventTime = eventHour * 60 + eventMinute;
      const currentTime = currentHour * 60 + currentMinute;
      
      // Event is current if it's within 30 minutes of the scheduled time
      return Math.abs(eventTime - currentTime) <= 30 && !event.completed;
    });
  };

  const getUpcomingEvents = () => {
    const now = currentTime;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeMinutes = currentHour * 60 + currentMinute;

    return events
      .filter(event => {
        const [eventHour, eventMinute] = event.time.split(':').map(Number);
        const eventTimeMinutes = eventHour * 60 + eventMinute;
        return eventTimeMinutes > currentTimeMinutes && !event.completed;
      })
      .sort((a, b) => {
        const [aHour, aMinute] = a.time.split(':').map(Number);
        const [bHour, bMinute] = b.time.split(':').map(Number);
        return (aHour * 60 + aMinute) - (bHour * 60 + bMinute);
      })
      .slice(0, 3);
  };

  const getCompletedEvents = () => {
    return events.filter(event => event.completed);
  };

  const getProgressPercentage = () => {
    const completed = getCompletedEvents().length;
    return Math.round((completed / events.length) * 100);
  };

  const currentEvent = getCurrentEvent();
  const upcomingEvents = getUpcomingEvents();
  const completedEvents = getCompletedEvents();
  const progressPercentage = getProgressPercentage();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Daily Dashboard</h1>
            <p className="text-gray-600">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
              {upcomingEvents.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {upcomingEvents.length}
                </Badge>
              )}
            </Button>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: false 
                })}
              </div>
              <div className="text-sm text-gray-500">Current Time</div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Daily Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {completedEvents.length} of {events.length} tasks completed
                  </span>
                  <Badge variant="secondary">{progressPercentage}%</Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Event Alert */}
        {currentEvent && (
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Clock className="w-5 h-5" />
                Now: {currentEvent.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 mb-3">{currentEvent.description}</p>
              <Button 
                onClick={() => toggleEventCompletion(currentEvent.id)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Mark as Complete
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Daily Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 ${
                    event.completed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${event.color} text-white`}>
                    {event.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold ${
                        event.completed ? 'text-green-700 line-through' : 'text-gray-900'
                      }`}>
                        {event.title}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {event.category}
                      </Badge>
                    </div>
                    <p className={`text-sm ${
                      event.completed ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {event.description}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {event.time}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleEventCompletion(event.id)}
                      className={`p-2 h-auto ${
                        event.completed 
                          ? 'text-green-600 hover:text-green-700' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {event.completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Upcoming Next
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-lg ${event.color} text-white`}>
                      {event.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600">{event.description}</p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {event.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notifications Panel */}
        {showNotifications && (
          <Card className="fixed top-20 right-4 w-80 z-50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <div key={event.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`p-1 rounded ${event.color} text-white`}>
                          {event.icon}
                        </div>
                        <span className="font-medium text-blue-900">{event.title}</span>
                      </div>
                      <p className="text-sm text-blue-700">{event.description}</p>
                      <p className="text-xs text-blue-600 mt-1">Scheduled for {event.time}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No upcoming notifications</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
