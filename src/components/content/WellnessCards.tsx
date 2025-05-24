
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookMarked, Heart, Activity, Apple, Moon, Dumbbell } from 'lucide-react';

interface WellnessCard {
  id: string;
  title: string;
  description: string;
  category: 'nutrition' | 'exercise' | 'sleep' | 'mental-health' | 'prevention';
  actionText: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeCommitment: string;
  benefits: string[];
  icon: React.ReactNode;
}

interface Props {
  onBookmark: (contentId: string) => void;
  bookmarkedItems: string[];
}

const wellnessCards: WellnessCard[] = [
  {
    id: 'wellness-1',
    title: '10-Minute Morning Meditation',
    description: 'Start your day with mindfulness to reduce stress and improve focus.',
    category: 'mental-health',
    actionText: 'Start Meditation',
    difficulty: 'easy',
    timeCommitment: '10 minutes',
    benefits: ['Reduces stress', 'Improves focus', 'Better mood'],
    icon: <Heart className="h-5 w-5" />
  },
  {
    id: 'wellness-2',
    title: 'Diabetes-Friendly Meal Prep',
    description: 'Weekly meal planning to maintain stable blood sugar levels.',
    category: 'nutrition',
    actionText: 'View Recipes',
    difficulty: 'medium',
    timeCommitment: '2 hours weekly',
    benefits: ['Better glucose control', 'Saves time', 'Balanced nutrition'],
    icon: <Apple className="h-5 w-5" />
  },
  {
    id: 'wellness-3',
    title: 'Heart-Healthy Walking Plan',
    description: 'Gentle cardio routine designed for cardiovascular health.',
    category: 'exercise',
    actionText: 'Start Walking',
    difficulty: 'easy',
    timeCommitment: '30 minutes daily',
    benefits: ['Improves circulation', 'Strengthens heart', 'Boosts energy'],
    icon: <Activity className="h-5 w-5" />
  },
  {
    id: 'wellness-4',
    title: 'Sleep Optimization Guide',
    description: 'Improve sleep quality for better health outcomes.',
    category: 'sleep',
    actionText: 'Learn More',
    difficulty: 'easy',
    timeCommitment: 'Ongoing',
    benefits: ['Better recovery', 'Improved immune function', 'Mental clarity'],
    icon: <Moon className="h-5 w-5" />
  },
  {
    id: 'wellness-5',
    title: 'Strength Training for Seniors',
    description: 'Safe resistance exercises to maintain muscle mass and bone density.',
    category: 'exercise',
    actionText: 'View Exercises',
    difficulty: 'medium',
    timeCommitment: '20 minutes, 3x/week',
    benefits: ['Maintains strength', 'Improves balance', 'Bone health'],
    icon: <Dumbbell className="h-5 w-5" />
  }
];

export const WellnessCards = ({ onBookmark, bookmarkedItems }: Props) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nutrition': return 'bg-green-100 text-green-800';
      case 'exercise': return 'bg-blue-100 text-blue-800';
      case 'sleep': return 'bg-purple-100 text-purple-800';
      case 'mental-health': return 'bg-pink-100 text-pink-800';
      case 'prevention': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Wellness Cards</CardTitle>
          <CardDescription>
            Actionable wellness activities personalized for your health conditions
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wellnessCards.map((card) => (
          <Card key={card.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {card.icon}
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onBookmark(card.id)}
                  className={bookmarkedItems.includes(card.id) ? 'text-blue-600' : ''}
                >
                  <BookMarked className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getCategoryColor(card.category)}>
                  {card.category.replace('-', ' ')}
                </Badge>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${getDifficultyColor(card.difficulty)}`} />
                  <span className="text-xs text-gray-600 capitalize">{card.difficulty}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-gray-700">{card.description}</p>
              
              <div className="text-sm text-gray-600">
                <p><strong>Time:</strong> {card.timeCommitment}</p>
              </div>

              <div className="space-y-2">
                <p className="font-medium text-sm">Benefits:</p>
                <div className="flex flex-wrap gap-1">
                  {card.benefits.map((benefit, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button className="w-full" size="sm">
                {card.actionText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
