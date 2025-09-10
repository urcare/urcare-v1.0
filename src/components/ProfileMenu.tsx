
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Settings, LogOut, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function ProfileMenu() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      // The signOut function will handle the redirect automatically
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="User" />
            <AvatarFallback className="bg-blue-600 text-white">DR</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700" 
        align="end" 
        forceMount
      >
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium text-sm dark:text-white">
              {profile?.full_name || user?.user_metadata?.full_name || 'User'}
            </p>
            <p className="w-[200px] truncate text-xs text-muted-foreground dark:text-slate-400">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator className="dark:bg-slate-700" />
        <DropdownMenuItem 
          className="dark:text-white dark:hover:bg-slate-700 cursor-pointer"
          onClick={() => navigate('/profile')}
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="dark:text-white dark:hover:bg-slate-700 cursor-pointer"
          onClick={() => navigate('/settings')}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="dark:text-white dark:hover:bg-slate-700 cursor-pointer"
          onClick={() => navigate('/admin')}
        >
          <Shield className="mr-2 h-4 w-4" />
          <span>Admin Panel</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="dark:bg-slate-700" />
        <DropdownMenuItem 
          className="dark:text-white dark:hover:bg-slate-700 cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
