
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Plus, Settings, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Profile {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  isActive: boolean;
}

export function ProfileSwitcher() {
  const { profile } = useAuth();
  const [activeProfile, setActiveProfile] = useState<Profile>({
    id: '1',
    name: profile?.full_name || 'Current User',
    role: profile?.role || 'Patient',
    isActive: true
  });

  // Mock additional profiles - in real app, fetch from backend
  const [profiles] = useState<Profile[]>([
    {
      id: '1',
      name: profile?.full_name || 'Current User',
      role: profile?.role || 'Patient',
      isActive: true
    },
    {
      id: '2',
      name: 'Child Profile',
      role: 'Patient',
      isActive: false
    },
    {
      id: '3',
      name: 'Elderly Parent',
      role: 'Patient',
      isActive: false
    }
  ]);

  const handleProfileSwitch = (profileId: string) => {
    const newProfile = profiles.find(p => p.id === profileId);
    if (newProfile) {
      setActiveProfile(newProfile);
      // In real app, update context and backend
      console.log('Switching to profile:', newProfile.name);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={activeProfile.avatar} />
            <AvatarFallback>
              {activeProfile.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-medium">{activeProfile.name}</span>
            <span className="text-xs text-muted-foreground">{activeProfile.role}</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel>Switch Profile</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {profiles.map((profile) => (
          <DropdownMenuItem
            key={profile.id}
            onClick={() => handleProfileSwitch(profile.id)}
            className={`flex items-center gap-3 p-3 ${
              profile.isActive ? 'bg-accent' : ''
            }`}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback>
                {profile.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{profile.name}</span>
              <span className="text-xs text-muted-foreground">{profile.role}</span>
            </div>
            {profile.isActive && (
              <div className="ml-auto h-2 w-2 bg-green-500 rounded-full" />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Manage Profiles
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
