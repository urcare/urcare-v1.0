import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  UserPlus, 
  Eye, 
  Edit, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  RefreshCw,
  Users,
  Mail,
  Calendar,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';

interface User {
  id: string;
  full_name: string;
  created_at: string;
  subscription_status: 'active' | 'inactive' | 'premium';
  last_login: string;
  profile_data?: any;
  city?: string;
  plan_name?: string;
}

interface UserManagementProps {
  onRefresh?: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onRefresh }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  // Initialize Supabase client
  const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL || "https://lvnkpserdydhnqbigfbz.supabase.co",
    process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzY5NjYsImV4cCI6MjA2ODkxMjk2Nn0.Y2NfbA7K9efpFHB6FFmCtgti3udX5wbOoQVkDndtkBc"
  );

  // Load users from Supabase
  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading users:', error);
        toast.error('Failed to load users');
        return;
      }

      // Transform data to match our User interface with mock data for missing fields
      const transformedUsers: User[] = data?.map((profile: any) => ({
        id: profile.id,
        full_name: profile.full_name || 'Unknown User',
        created_at: profile.created_at,
        subscription_status: 'active', // Mock status
        last_login: 'Recently', // Mock last login
        profile_data: profile,
        city: 'Unknown', // Mock city
        plan_name: 'Basic' // Mock plan
      })) || [];

      setUsers(transformedUsers);
      setFilteredUsers(transformedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  // Search users
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = users.filter(user => 
      user.full_name.toLowerCase().includes(term.toLowerCase()) ||
      user.city?.toLowerCase().includes(term.toLowerCase()) ||
      user.plan_name?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  // Toggle subscription status
  const toggleSubscription = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      // Mock operation - subscription_status column doesn't exist in database
      // Just update local state for demo purposes

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, subscription_status: newStatus as 'active' | 'inactive' | 'premium' }
          : user
      ));
      setFilteredUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, subscription_status: newStatus as 'active' | 'inactive' | 'premium' }
          : user
      ));

      toast.success(`Subscription ${newStatus === 'active' ? 'activated' : 'deactivated'} (demo mode)`);
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast.error('Failed to update subscription');
    }
  };

  // Delete user
  const deleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
        return;
      }

      // Update local state
      setUsers(prev => prev.filter(user => user.id !== userId));
      setFilteredUsers(prev => prev.filter(user => user.id !== userId));

      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  // Create new user
  const createUser = async (fullName: string, city?: string) => {
    setIsCreating(true);
    try {
      // Create user profile directly (without auth for demo)
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          full_name: fullName,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        toast.error('Failed to create user');
        return;
      }

      toast.success('User created successfully');
      setShowCreateModal(false);
      loadUsers(); // Refresh the list
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    } finally {
      setIsCreating(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Refresh handler
  const handleRefresh = () => {
    loadUsers();
    if (onRefresh) onRefresh();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'premium':
        return 'bg-blue-100 text-blue-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-6 h-6" />
            User Management
          </h2>
          <p className="text-gray-600">Manage user accounts and subscriptions</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <UserPlus className="w-4 h-4" />
            Create User
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-gray-600">
          {filteredUsers.length} users
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">No users found</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{user.full_name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{user.city || 'No city'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(user.subscription_status)}>
                      {user.subscription_status}
                    </Badge>
                    
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserDetails(true);
                        }}
                        className="p-2"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleSubscription(user.id, user.subscription_status)}
                        className={`p-2 ${
                          user.subscription_status === 'active' 
                            ? 'text-green-600 hover:bg-green-50' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {user.subscription_status === 'active' ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteUser(user.id)}
                        className="p-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={createUser}
          isLoading={isCreating}
        />
      )}

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <UserDetailsModal
          isOpen={showUserDetails}
          onClose={() => setShowUserDetails(false)}
          user={selectedUser}
          onUpdate={loadUsers}
        />
      )}
    </div>
  );
};

// Create User Modal Component
interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (fullName: string, city?: string) => void;
  isLoading: boolean;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onCreate, isLoading }) => {
  const [city, setCity] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName) {
      onCreate(fullName, city);
      setCity('');
      setFullName('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Create New User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <Input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="New York"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? 'Creating...' : 'Create User'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// User Details Modal Component
interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdate: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ isOpen, onClose, user, onUpdate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="text-gray-900">{user.full_name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <p className="text-gray-900">{user.city || 'No city'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <Badge className={user.subscription_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
              {user.subscription_status}
            </Badge>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Joined</label>
            <p className="text-gray-900">{new Date(user.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Login</label>
            <p className="text-gray-900">{user.last_login}</p>
          </div>
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
