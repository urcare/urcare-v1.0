
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  CheckCircle, 
  Circle, 
  Flag, 
  Heart, 
  Brain, 
  Activity, 
  Apple, 
  Stethoscope,
  TrendingUp,
  Target
} from 'lucide-react';
import { HealthMilestone, HealthTimelineEvent } from '@/types/healthTwin';

interface HealthProgressTimelineProps {
  milestones: HealthMilestone[];
  timelineEvents: HealthTimelineEvent[];
  onUpdateMilestone: (milestoneId: string, updates: Partial<HealthMilestone>) => void;
}

export function HealthProgressTimeline({ 
  milestones, 
  timelineEvents, 
  onUpdateMilestone 
}: HealthProgressTimelineProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('all');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fitness': return <Activity className="h-4 w-4" />;
      case 'nutrition': return <Apple className="h-4 w-4" />;
      case 'medical': return <Stethoscope className="h-4 w-4" />;
      case 'mental': return <Brain className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fitness': return 'text-blue-600 bg-blue-100';
      case 'nutrition': return 'text-green-600 bg-green-100';
      case 'medical': return 'text-red-600 bg-red-100';
      case 'mental': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'milestone': return <Flag className="h-4 w-4" />;
      case 'vitals': return <Heart className="h-4 w-4" />;
      case 'symptom': return <Activity className="h-4 w-4" />;
      case 'medication': return <Stethoscope className="h-4 w-4" />;
      case 'appointment': return <Calendar className="h-4 w-4" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  const filterTimelineEvents = (timeframe: string) => {
    const now = new Date();
    let cutoffDate = new Date();

    switch (timeframe) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return timelineEvents;
    }

    return timelineEvents.filter(event => event.date >= cutoffDate);
  };

  const filteredEvents = filterTimelineEvents(selectedTimeframe);
  const sortedEvents = [...filteredEvents].sort((a, b) => b.date.getTime() - a.date.getTime());

  const completedMilestones = milestones.filter(m => m.isCompleted).length;
  const totalMilestones = milestones.length;
  const overallProgress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  const upcomingMilestones = milestones
    .filter(m => !m.isCompleted && m.targetDate > new Date())
    .sort((a, b) => a.targetDate.getTime() - b.targetDate.getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Milestones Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-6 w-6" />
            Health Milestones
          </CardTitle>
          <CardDescription>
            Track your progress towards health and wellness goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Progress Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{completedMilestones}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{totalMilestones - completedMilestones}</div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-600">{Math.round(overallProgress)}%</div>
                  <div className="text-sm text-gray-600">Overall Progress</div>
                  <Progress value={overallProgress} className="mt-2" />
                </div>
              </Card>
            </div>

            {/* Upcoming Milestones */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Upcoming Milestones</h3>
              {upcomingMilestones.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No upcoming milestones. Set some health goals to get started!
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingMilestones.map(milestone => (
                    <Card key={milestone.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getCategoryIcon(milestone.category)}
                          <div>
                            <div className="font-medium">{milestone.title}</div>
                            <div className="text-sm text-gray-600">{milestone.description}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              Target: {milestone.targetDate.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <Badge className={getCategoryColor(milestone.category)}>
                            {milestone.category}
                          </Badge>
                          <div className="mt-2">
                            <Progress value={milestone.progress} className="w-24" />
                            <div className="text-xs text-gray-600 mt-1">
                              {milestone.progress}% complete
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* All Milestones */}
            <div>
              <h3 className="text-lg font-semibold mb-4">All Milestones</h3>
              <div className="space-y-3">
                {milestones.map(milestone => (
                  <Card key={milestone.id} className={`p-4 ${milestone.isCompleted ? 'bg-green-50' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {milestone.isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${milestone.isCompleted ? 'line-through text-gray-600' : ''}`}>
                              {milestone.title}
                            </span>
                            <Badge className={getCategoryColor(milestone.category)}>
                              {getCategoryIcon(milestone.category)}
                              <span className="ml-1">{milestone.category}</span>
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-gray-600 mt-1">
                            {milestone.description}
                          </div>
                          
                          <div className="text-xs text-gray-500 mt-1">
                            {milestone.isCompleted && milestone.completedDate ? (
                              `Completed: ${milestone.completedDate.toLocaleDateString()}`
                            ) : (
                              `Target: ${milestone.targetDate.toLocaleDateString()}`
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {!milestone.isCompleted && (
                          <div>
                            <Progress value={milestone.progress} className="w-24 mb-1" />
                            <div className="text-xs text-gray-600">
                              {milestone.progress}%
                            </div>
                          </div>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => onUpdateMilestone(milestone.id, { 
                            isCompleted: !milestone.isCompleted,
                            completedDate: !milestone.isCompleted ? new Date() : undefined
                          })}
                        >
                          {milestone.isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Health Timeline
          </CardTitle>
          <CardDescription>
            Complete history of your health journey and key events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Timeframe Filter */}
            <Tabs value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="all">All Time</TabsTrigger>
                <TabsTrigger value="year">Past Year</TabsTrigger>
                <TabsTrigger value="quarter">3 Months</TabsTrigger>
                <TabsTrigger value="month">1 Month</TabsTrigger>
                <TabsTrigger value="week">1 Week</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTimeframe} className="mt-6">
                {sortedEvents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No events found for the selected timeframe
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedEvents.map((event, index) => (
                      <div key={event.id} className="flex gap-4">
                        {/* Timeline Line */}
                        <div className="flex flex-col items-center">
                          <div className={`p-2 rounded-full border-2 ${getSeverityColor(event.severity)} z-10`}>
                            {getEventIcon(event.type)}
                          </div>
                          {index < sortedEvents.length - 1 && (
                            <div className="w-0.5 h-12 bg-gray-200 mt-2" />
                          )}
                        </div>
                        
                        {/* Event Content */}
                        <div className="flex-1 pb-8">
                          <Card className={`p-4 ${getSeverityColor(event.severity)}`}>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-medium">{event.title}</h4>
                                  <Badge variant="outline">
                                    {event.type}
                                  </Badge>
                                  {event.severity && (
                                    <Badge variant={event.severity === 'high' ? 'destructive' : 'secondary'}>
                                      {event.severity}
                                    </Badge>
                                  )}
                                </div>
                                
                                <p className="text-gray-600 text-sm mb-2">
                                  {event.description}
                                </p>
                                
                                <div className="text-xs text-gray-500">
                                  {event.date.toLocaleDateString()} at {event.date.toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                          </Card>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
