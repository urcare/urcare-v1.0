
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Smile,
  Star,
  Heart,
  Sun,
  Rainbow,
  Cake,
  Gift,
  Gamepad2,
  Music,
  Palette
} from 'lucide-react';

export const ChildFriendlyInterface = () => {
  const [selectedTheme, setSelectedTheme] = useState('rainbow');
  const [moodSelection, setMoodSelection] = useState('');
  const [completedActivities, setCompletedActivities] = useState([]);

  const themes = [
    { id: 'rainbow', name: 'Rainbow Adventure', icon: Rainbow, colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'] },
    { id: 'space', name: 'Space Explorer', icon: Star, colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'] },
    { id: 'ocean', name: 'Ocean Friends', icon: Heart, colors: ['#00c9ff', '#92fe9d', '#00d2ff', '#3a7bd5', '#74b9ff'] },
    { id: 'garden', name: 'Magic Garden', icon: Sun, colors: ['#a8edea', '#fed6e3', '#fad0c4', '#ffd1ff', '#c2e9fb'] }
  ];

  const moodOptions = [
    { emoji: '😊', mood: 'happy', color: 'bg-yellow-300' },
    { emoji: '😢', mood: 'sad', color: 'bg-blue-300' },
    { emoji: '😴', mood: 'sleepy', color: 'bg-purple-300' },
    { emoji: '😠', mood: 'angry', color: 'bg-red-300' },
    { emoji: '😰', mood: 'scared', color: 'bg-gray-300' },
    { emoji: '🤒', mood: 'sick', color: 'bg-green-300' }
  ];

  const interactiveActivities = [
    {
      id: 'breathing',
      title: 'Magic Breathing Balloon',
      description: 'Watch the balloon grow and shrink with your breathing',
      icon: '🎈',
      completed: false
    },
    {
      id: 'coloring',
      title: 'Color Your Health Hero',
      description: 'Color your favorite superhero who keeps you healthy',
      icon: '🎨',
      completed: false
    },
    {
      id: 'story',
      title: 'Brave Little Patient Story',
      description: 'Listen to a story about a brave child at the doctor',
      icon: '📚',
      completed: false
    },
    {
      id: 'game',
      title: 'Medicine Memory Game',
      description: 'Match the vitamins to help your body grow strong',
      icon: '🎮',
      completed: false
    }
  ];

  const ageAppropriateContent = {
    '0-2': {
      title: 'Little Explorer',
      activities: ['Peek-a-boo games', 'Soft music', 'Colorful animations'],
      instructions: 'Simple pictures and sounds'
    },
    '3-5': {
      title: 'Brave Adventurer',
      activities: ['Interactive stories', 'Simple coloring', 'Counting games'],
      instructions: 'Fun pictures with easy words'
    },
    '6-12': {
      title: 'Health Hero',
      activities: ['Educational games', 'Body exploration', 'Healthy habits tracking'],
      instructions: 'Cool activities with explanations'
    },
    '13+': {
      title: 'Wellness Champion',
      activities: ['Health challenges', 'Goal tracking', 'Educational content'],
      instructions: 'Engaging content with detailed information'
    }
  };

  const selectedThemeData = themes.find(t => t.id === selectedTheme);

  const handleMoodSelection = (mood) => {
    setMoodSelection(mood);
    // This would trigger appropriate content based on mood
  };

  const completeActivity = (activityId) => {
    if (!completedActivities.includes(activityId)) {
      setCompletedActivities([...completedActivities, activityId]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section with Child-Friendly Design */}
      <Card className="bg-gradient-to-br from-pink-100 to-purple-100 border-none">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="text-6xl">👋</div>
            <h2 className="text-2xl font-bold text-purple-800">Hi there, Little Champion!</h2>
            <p className="text-purple-600">Welcome to your special health adventure!</p>
            <div className="flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Choose Your Adventure Theme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {themes.map((theme) => {
              const IconComponent = theme.icon;
              return (
                <Card 
                  key={theme.id}
                  className={`cursor-pointer transition-all hover:scale-105 ${selectedTheme === theme.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedTheme(theme.id)}
                >
                  <CardContent className="p-4 text-center">
                    <IconComponent className="h-8 w-8 mx-auto mb-2" />
                    <div className="font-medium text-sm">{theme.name}</div>
                    <div className="flex justify-center gap-1 mt-2">
                      {theme.colors.map((color, index) => (
                        <div 
                          key={index}
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        ></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Mood Check-in */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smile className="h-5 w-5" />
            How are you feeling today?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {moodOptions.map((option) => (
              <Button
                key={option.mood}
                variant={moodSelection === option.mood ? "default" : "outline"}
                className={`h-20 flex flex-col items-center gap-2 ${option.color} hover:scale-110 transition-transform`}
                onClick={() => handleMoodSelection(option.mood)}
              >
                <span className="text-2xl">{option.emoji}</span>
                <span className="text-xs capitalize">{option.mood}</span>
              </Button>
            ))}
          </div>
          {moodSelection && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-center">
                Thank you for sharing! That helps us take better care of you. 💙
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interactive Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5" />
            Fun Activities While You Wait
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interactiveActivities.map((activity) => (
              <Card 
                key={activity.id} 
                className={`cursor-pointer transition-all hover:scale-105 ${completedActivities.includes(activity.id) ? 'bg-green-50 border-green-300' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{activity.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-medium">{activity.title}</h3>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                    {completedActivities.includes(activity.id) ? (
                      <Badge className="bg-green-100 text-green-800">
                        ✅ Done!
                      </Badge>
                    ) : (
                      <Button 
                        size="sm"
                        onClick={() => completeActivity(activity.id)}
                      >
                        Play
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Age-Appropriate Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cake className="h-5 w-5" />
            Special Content Just for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(ageAppropriateContent).map(([ageGroup, content]) => (
              <Card key={ageGroup} className="bg-gradient-to-br from-yellow-50 to-orange-50">
                <CardContent className="p-4">
                  <div className="text-center">
                    <h3 className="font-bold text-orange-800">{content.title}</h3>
                    <p className="text-sm text-orange-600 mb-3">Ages {ageGroup}</p>
                    <div className="space-y-2">
                      {content.activities.map((activity, index) => (
                        <div key={index} className="text-xs bg-white p-2 rounded">
                          {activity}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reward System */}
      <Card className="bg-gradient-to-br from-purple-100 to-pink-100 border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Your Bravery Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="flex justify-center gap-2">
              {completedActivities.map((_, index) => (
                <Star key={index} className="h-8 w-8 fill-yellow-400 text-yellow-400" />
              ))}
              {[...Array(Math.max(0, 5 - completedActivities.length))].map((_, index) => (
                <Star key={`empty-${index}`} className="h-8 w-8 text-gray-300" />
              ))}
            </div>
            <p className="text-purple-800">
              You've earned {completedActivities.length} brave stars! 
              {completedActivities.length >= 3 && " 🎉 You're a super star!"}
            </p>
            {completedActivities.length >= 5 && (
              <Badge className="bg-purple-100 text-purple-800 text-lg p-2">
                🏆 Health Hero Champion!
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
