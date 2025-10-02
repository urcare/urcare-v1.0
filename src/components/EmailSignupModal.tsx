import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface EmailSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EmailSignupModal: React.FC<EmailSignupModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningUp(true);
    
    try {
      // Check for urcare/urcare123 credentials
      if (username === 'urcare' && password === 'urcare123') {
        toast.success('UrCare account login successful! Auto-activating subscription...');
        
        // Simulate auto-subscription activation
        setTimeout(() => {
          toast.success('Subscription activated! Welcome to UrCare Premium!');
          onSuccess();
          navigate('/onboarding'); // Redirect to onboarding
        }, 2000);
        
        return;
      }
      
      // For other credentials, show coming soon message
      toast.info('Email signup feature coming soon! Use urcare/urcare123 for demo access.');
      setIsSigningUp(false);
      
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An unexpected error occurred during signup.');
      setIsSigningUp(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Sign Up with Email</DialogTitle>
          <DialogDescription className="text-center">
            Create your UrCare account to get started.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSignup} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="urcare"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500">Demo: Use "urcare" for testing</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="urcare123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500">Demo: Use "urcare123" for testing</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800 text-center">
              <strong>Demo Credentials:</strong><br />
              Username: urcare<br />
              Password: urcare123<br />
              <span className="text-xs">Auto-subscription will be activated!</span>
            </p>
          </div>
          
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={isSigningUp}>
              {isSigningUp ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


