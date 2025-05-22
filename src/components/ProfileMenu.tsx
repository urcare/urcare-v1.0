
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { User, LogOut, Settings } from 'lucide-react';

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
              <p className="text-xs text-muted-foreground">
                {profile?.role || 'User'}
              </p>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
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
