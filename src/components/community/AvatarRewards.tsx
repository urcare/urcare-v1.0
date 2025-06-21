
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Shirt, Palette, Crown, Sparkles, Lock, Star } from 'lucide-react';
import { toast } from 'sonner';

interface AvatarItem {
  id: string;
  name: string;
  category: string;
  type: 'accessory' | 'clothing' | 'background' | 'effect';
  cost: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isUnlocked: boolean;
  isEquipped: boolean;
  preview: string;
  unlockCondition?: string;
}

export const AvatarRewards = () => {
  const [userPoints, setUserPoints] = useState(450);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [avatarItems, setAvatarItems] = useState<AvatarItem[]>([
    {
      id: '1',
      name: 'Wellness Crown',
      category: 'Accessories',
      type: 'accessory',
      cost: 100,
      rarity: 'rare',
      isUnlocked: true,
      isEquipped: true,
      preview: '👑'
    },
    {
      id: '2',
      name: 'Meditation Robe',
      category: 'Clothing',
      type: 'clothing',
      cost: 75,
      rarity: 'common',
      isUnlocked: true,
      isEquipped: false,
      preview: '🥋'
    },
    {
      id: '3',
      name: 'Rainbow Aura',
      category: 'Effects',
      type: 'effect',
      cost: 200,
      rarity: 'epic',
      isUnlocked: false,
      isEquipped: false,
      preview: '🌈',
      unlockCondition: 'Complete 30-day streak'
    },
    {
      id: '4',
      name: 'Zen Garden Background',
      category: 'Backgrounds',
      type: 'background',
      cost: 150,
      rarity: 'rare',
      isUnlocked: false,
      isEquipped: false,
      preview: '🎋'
    },
    {
      id: '5',
      name: 'Fitness Gear',
      category: 'Clothing',
      type: 'clothing',
      cost: 120,
      rarity: 'rare',
      isUnlocked: false,
      isEquipped: false,
      preview: '💪',
      unlockCondition: 'Complete 50 fitness actions'
    },
    {
      id: '6',
      name: 'Golden Halo',
      category: 'Accessories',
      type: 'accessory',
      cost: 300,
      rarity: 'legendary',
      isUnlocked: false,
      isEquipped: false,
      preview: '😇',
      unlockCondition: 'Reach Health Champion status'
    }
  ]);

  const categories = ['all', 'accessories', 'clothing', 'backgrounds', 'effects'];

  const handlePurchase = (itemId: string) => {
    const item = avatarItems.find(i => i.id === itemId);
    if (!item || userPoints < item.cost) {
      toast.error('Not enough points to purchase this item');
      return;
    }

    setUserPoints(prev => prev - item.cost);
    setAvatarItems(prev => prev.map(i => 
      i.id === itemId ? { ...i, isUnlocked: true } : i
    ));
    toast.success(`${item.name} purchased! 🎉`);
  };

  const handleEquip = (itemId: string) => {
    const item = avatarItems.find(i => i.id === itemId);
    if (!item || !item.isUnlocked) return;

    setAvatarItems(prev => prev.map(i => {
      if (i.type === item.type) {
        return { ...i, isEquipped: i.id === itemId };
      }
      return i;
    }));
    toast.success(`${item.name} equipped!`);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredItems = avatarItems.filter(item => 
    selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory
  );

  const equippedItems = avatarItems.filter(item => item.isEquipped);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Avatar Customization
          </CardTitle>
          <CardDescription>
            Customize your avatar with rewards earned through your health journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-4 border-yellow-200">
                <AvatarFallback className="text-2xl">
                  {equippedItems.find(i => i.type === 'accessory')?.preview || '😊'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">Your Avatar</h3>
                <p className="text-sm text-gray-600">
                  {equippedItems.length} items equipped
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-bold text-yellow-600">{userPoints} points</span>
              </div>
              <p className="text-xs text-gray-500">Available to spend</p>
            </div>
          </div>

          {/* Current Equipment */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {['accessory', 'clothing', 'background', 'effect'].map((type) => {
              const equippedItem = equippedItems.find(i => i.type === type);
              return (
                <div key={type} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-1">
                    {equippedItem ? equippedItem.preview : '❓'}
                  </div>
                  <p className="text-xs text-gray-600 capitalize">{type}</p>
                  {equippedItem && (
                    <p className="text-xs font-medium">{equippedItem.name}</p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Category Filters */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? 'All Items' : category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className={`transition-all duration-200 hover:shadow-md ${
            item.isEquipped ? 'ring-2 ring-blue-500' : ''
          }`}>
            <CardContent className="p-4">
              <div className="text-center space-y-3">
                <div className="text-4xl">{item.preview}</div>
                
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <Badge className={`${getRarityColor(item.rarity)} text-xs mt-1`}>
                    {item.rarity.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{item.cost} points</span>
                </div>

                {item.unlockCondition && !item.isUnlocked && (
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    <Lock className="h-3 w-3 inline mr-1" />
                    {item.unlockCondition}
                  </div>
                )}

                <div className="space-y-2">
                  {item.isUnlocked ? (
                    item.isEquipped ? (
                      <Badge className="w-full bg-green-100 text-green-800">
                        ✓ Equipped
                      </Badge>
                    ) : (
                      <Button 
                        onClick={() => handleEquip(item.id)}
                        size="sm"
                        className="w-full"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Equip
                      </Button>
                    )
                  ) : item.unlockCondition ? (
                    <Button size="sm" disabled className="w-full">
                      <Lock className="h-4 w-4 mr-2" />
                      Locked
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handlePurchase(item.id)}
                      size="sm"
                      disabled={userPoints < item.cost}
                      className="w-full"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      {userPoints < item.cost ? 'Not Enough Points' : 'Purchase'}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress towards next rewards */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Next reward at 500 points</span>
                <span>{userPoints}/500</span>
              </div>
              <Progress value={(userPoints / 500) * 100} className="h-2" />
            </div>
            <p className="text-sm text-gray-600">
              🎁 Unlock the "Diamond Badge" and "Cosmic Background" when you reach 500 points!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
