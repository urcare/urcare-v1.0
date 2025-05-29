
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, Gift, Copy, Share2, Mail, MessageSquare, Users, Star, Trophy } from 'lucide-react';
import { toast } from 'sonner';

interface Referral {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  status: 'pending' | 'joined' | 'active';
  rewardEarned: number;
  avatar?: string;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  icon: string;
  isUnlocked: boolean;
}

export const ReferralProgram = () => {
  const [referralCode] = useState('WELLNESS-SARAH-2024');
  const [referralLink] = useState(`https://app.healthcommunity.com/join?ref=${referralCode}`);
  const [inviteEmail, setInviteEmail] = useState('');
  const [totalReferrals] = useState(8);
  const [totalRewards] = useState(425);

  const [referrals] = useState<Referral[]>([
    {
      id: '1',
      name: 'Emily Johnson',
      email: 'emily@example.com',
      joinedAt: '2024-01-15',
      status: 'active',
      rewardEarned: 75,
      avatar: '/placeholder.svg'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael@example.com',
      joinedAt: '2024-01-18',
      status: 'joined',
      rewardEarned: 50,
      avatar: '/placeholder.svg'
    },
    {
      id: '3',
      name: 'Lisa Park',
      email: 'lisa@example.com',
      joinedAt: '2024-01-20',
      status: 'pending',
      rewardEarned: 0
    }
  ]);

  const [rewards] = useState<Reward[]>([
    {
      id: '1',
      title: 'First Referral',
      description: 'Invite your first friend to join',
      pointsRequired: 50,
      icon: '🎯',
      isUnlocked: true
    },
    {
      id: '2',
      title: 'Community Builder',
      description: 'Successfully refer 5 active members',
      pointsRequired: 250,
      icon: '🏗️',
      isUnlocked: false
    },
    {
      id: '3',
      title: 'Wellness Ambassador',
      description: 'Refer 10 members who stay active for 30+ days',
      pointsRequired: 500,
      icon: '🌟',
      isUnlocked: false
    }
  ]);

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied to clipboard!');
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success('Referral code copied to clipboard!');
  };

  const sendEmailInvite = () => {
    if (!inviteEmail) {
      toast.error('Please enter an email address');
      return;
    }
    toast.success(`Invitation sent to ${inviteEmail}!`);
    setInviteEmail('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'joined': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const shareToSocial = (platform: string) => {
    const message = "Join me on this amazing health community platform where we support each other's wellness journey!";
    const url = referralLink;
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Program Overview */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-purple-600" />
            Friend Referral Program
          </CardTitle>
          <CardDescription>
            Invite friends to join our wellness community and earn rewards together
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{totalReferrals}</div>
              <p className="text-sm text-gray-600">Friends Referred</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{totalRewards}</div>
              <p className="text-sm text-gray-600">Points Earned</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{referrals.filter(r => r.status === 'active').length}</div>
              <p className="text-sm text-gray-600">Active Members</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Referrals Work</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl mb-2">1️⃣</div>
              <h3 className="font-medium mb-2">Invite Friends</h3>
              <p className="text-sm text-gray-600">Share your unique referral link or code with friends</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl mb-2">2️⃣</div>
              <h3 className="font-medium mb-2">They Join</h3>
              <p className="text-sm text-gray-600">Friends sign up using your referral link</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl mb-2">3️⃣</div>
              <h3 className="font-medium mb-2">Earn Rewards</h3>
              <p className="text-sm text-gray-600">Get points and unlock exclusive benefits</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Share Your Referral</CardTitle>
          <CardDescription>
            Use these tools to invite friends to join the community
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Referral Link */}
          <div className="space-y-2">
            <Label>Your Referral Link</Label>
            <div className="flex gap-2">
              <Input value={referralLink} readOnly className="flex-1" />
              <Button onClick={copyReferralLink} variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>

          {/* Referral Code */}
          <div className="space-y-2">
            <Label>Your Referral Code</Label>
            <div className="flex gap-2">
              <Input value={referralCode} readOnly className="flex-1" />
              <Button onClick={copyReferralCode} variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>

          {/* Email Invite */}
          <div className="space-y-2">
            <Label>Send Direct Invitation</Label>
            <div className="flex gap-2">
              <Input
                placeholder="friend@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1"
              />
              <Button onClick={sendEmailInvite}>
                <Mail className="h-4 w-4 mr-2" />
                Send Invite
              </Button>
            </div>
          </div>

          {/* Social Sharing */}
          <div className="space-y-2">
            <Label>Share on Social Media</Label>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => shareToSocial('facebook')}
                className="flex-1"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Facebook
              </Button>
              <Button 
                variant="outline" 
                onClick={() => shareToSocial('twitter')}
                className="flex-1"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button 
                variant="outline" 
                onClick={() => shareToSocial('linkedin')}
                className="flex-1"
              >
                <Share2 className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral History */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referrals</CardTitle>
          <CardDescription>
            Track the friends you've invited and rewards earned
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {referrals.map((referral) => (
              <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={referral.avatar} />
                    <AvatarFallback>{referral.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{referral.name}</p>
                    <p className="text-sm text-gray-600">{referral.email}</p>
                    <p className="text-xs text-gray-500">Joined {referral.joinedAt}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(referral.status)}>
                    {referral.status}
                  </Badge>
                  {referral.rewardEarned > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      +{referral.rewardEarned} points
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Referral Rewards */}
      <Card>
        <CardHeader>
          <CardTitle>Referral Rewards</CardTitle>
          <CardDescription>
            Unlock special badges and bonuses as you refer more friends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rewards.map((reward) => (
              <Card key={reward.id} className={reward.isUnlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50'}>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{reward.icon}</div>
                  <h4 className="font-medium mb-1">{reward.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">{reward.pointsRequired} points</span>
                  </div>
                  {reward.isUnlocked && (
                    <Badge className="mt-2">Unlocked!</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
