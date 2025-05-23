
export type UserRole = 'Patient' | 'Doctor' | 'Nurse' | 'Admin' | 'Pharmacy' | 'Lab' | 'Reception';
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

export interface UserProfile {
  id: string;
  full_name: string | null;
  role: UserRole;
  email: string;
  status: UserStatus;
  auth_id?: string;
  phone?: string | null;
}
