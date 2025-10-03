
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ChevronsUpDown, User, Stethoscope, Shield } from 'lucide-react';

export function ProfileSwitcher() {
  const profiles = [
    {
      id: 'doctor',
      name: 'Dr. Sarah Wilson',
      role: 'Cardiologist',
      status: 'Active',
      icon: Stethoscope,
    },
    {
      id: 'admin',
      name: 'Admin Dashboard',
      role: 'System Administrator',
      status: 'Available',
      icon: Shield,
    },
    {
      id: 'patient',
      name: 'Patient View',
      role: 'Test Patient',
      status: 'Demo',
      icon: User,
    },
  ];

  const [activeProfile, setActiveProfile] = React.useState(profiles[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 px-3 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
        >
          <div className="flex items-center gap-2">
            <activeProfile.icon className="h-4 w-4" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{activeProfile.name}</span>
              <span className="text-xs text-muted-foreground">{activeProfile.role}</span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-64 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700"
        align="start"
      >
        {profiles.map((profile) => (
          <React.Fragment key={profile.id}>
            <DropdownMenuItem
              onClick={() => setActiveProfile(profile)}
              className={`flex items-center gap-3 p-3 cursor-pointer dark:text-white dark:hover:bg-slate-700 ${
                activeProfile.id === profile.id ? 'bg-accent' : ''
              }`}
            >
              <profile.icon className="h-4 w-4" />
              <div className="flex flex-col">
                <span className="font-medium">{profile.name}</span>
                <span className="text-sm text-muted-foreground dark:text-slate-400">{profile.role}</span>
              </div>
              <Badge 
                variant={profile.status === 'Active' ? 'default' : 'secondary'}
                className="ml-auto"
              >
                {profile.status}
              </Badge>
            </DropdownMenuItem>
            {profile.id !== profiles[profiles.length - 1].id && (
              <DropdownMenuSeparator className="dark:bg-slate-700" />
            )}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
