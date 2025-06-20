
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Home, 
  FileText, 
  Calendar, 
  Pill, 
  Heart, 
  Shield, 
  Users, 
  UserPlus, 
  Settings,
  Stethoscope,
  Brain,
  Activity,
  Video
} from 'lucide-react';

interface PatientSidebarProps {
  activeSection: string;
  onSectionChange: (section: any) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  {
    id: 'home',
    label: 'Dashboard',
    icon: Home,
    description: 'Overview & insights'
  },
  {
    id: 'appointments',
    label: 'Appointments',
    icon: Calendar,
    description: 'Schedule & manage'
  },
  {
    id: 'teleconsult',
    label: 'Teleconsult',
    icon: Video,
    description: 'Video consultations'
  },
  {
    id: 'health-records',
    label: 'Health Records',
    icon: FileText,
    description: 'Medical documents'
  },
  {
    id: 'medications',
    label: 'Medications',
    icon: Pill,
    description: 'Prescriptions & reminders'
  },
  {
    id: 'wellness',
    label: 'Wellness Hub',
    icon: Heart,
    description: 'Health tracking'
  },
  {
    id: 'emergency',
    label: 'Emergency',
    icon: Shield,
    description: 'Crisis support'
  },
  {
    id: 'community',
    label: 'Community',
    icon: Users,
    description: 'Support groups'
  },
  {
    id: 'family',
    label: 'Family Care',
    icon: UserPlus,
    description: 'Family management'
  },
  {
    id: 'profile',
    label: 'Profile & Settings',
    icon: Settings,
    description: 'Account settings'
  }
];

export const PatientSidebar: React.FC<PatientSidebarProps> = ({
  activeSection,
  onSectionChange,
  isOpen,
  onClose
}) => {
  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      {/* Sidebar Header */}
      <div className="flex items-center gap-3 p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
          <Stethoscope className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">UrCare</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Patient Portal</p>
        </div>
      </div>

      {/* AI Health Score */}
      <div className="p-4 m-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-100 dark:border-blue-800">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Health Score</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full w-4/5"></div>
          </div>
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">85</span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Good overall health</p>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                onSectionChange(item.id);
                onClose();
              }}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 group",
                isActive 
                  ? "bg-blue-500 text-white shadow-md" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <IconComponent className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{item.label}</div>
                <div className={cn(
                  "text-xs opacity-75 truncate",
                  isActive ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                )}>{item.description}</div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Activity className="w-4 h-4 mx-auto text-green-500 mb-1" />
            <div className="text-xs font-medium text-gray-900 dark:text-white">12,543</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Steps</div>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Calendar className="w-4 h-4 mx-auto text-blue-500 mb-1" />
            <div className="text-xs font-medium text-gray-900 dark:text-white">2</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Upcoming</div>
          </div>
        </div>
      </div>
    </div>
  );
};
