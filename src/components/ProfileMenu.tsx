
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { User, LogOut, Settings, UserCog, BadgeAlert } from 'lucide-react';
import { Badge } from './ui/badge';

export function ProfileMenu() {
  const { user, profile, signOut } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  const handleLogout = async () => {
    await signOut();
    setShowLogoutConfirm(false);
  };

  if (!user) {
    return (
      <Button variant="ghost" className="flex items-center gap-3 p-2" asChild>
        <a href="/auth">Sign In</a>
      </Button>
    );
  }

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email?.substring(0, 2).toUpperCase() || 'U';
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Doctor':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Nurse':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Patient':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Pharmacy':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Lab':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'Reception':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-3 p-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="bg-primary text-white">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium">
                {profile?.full_name || user.email}
              </p>
              <div className="flex items-center gap-2">
                {profile?.role && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${getRoleBadgeColor(profile.role)}`}>
                    {profile.role}
                  </span>
                )}
                {profile?.status && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${getStatusBadgeColor(profile.status)}`}>
                    {profile.status}
                  </span>
                )}
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{profile?.full_name || user.email}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {profile?.role && (
                  <Badge variant="outline" className={getRoleBadgeColor(profile.role)}>
                    {profile.role}
                  </Badge>
                )}
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>My Profile</span>
          </DropdownMenuItem>
          {profile?.role === 'Admin' && (
            <DropdownMenuItem>
              <UserCog className="mr-2 h-4 w-4" />
              <span>Admin Dashboard</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-red-600"
            onClick={() => {
              setOpen(false);
              setShowLogoutConfirm(true);
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Out Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out of your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogoutConfirm(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleLogout}
            >
              Log out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
