
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
  Activity
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
    label: 'Home Dashboard',
    icon: Home,
    description: 'AI insights & quick actions'
  },
  {
    id: 'health-records',
    label: 'Health Records',
    icon: FileText,
    description: 'Documents & timeline'
  },
  {
    id: 'appointments',
    label: 'Appointments',
    icon: Calendar,
    description: 'Booking & teleconsults'
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
    description: 'AI coaching & tracking'
  },
  {
    id: 'emergency',
    label: 'Emergency',
    icon: Shield,
    description: 'Safety & crisis tools'
  },
  {
    id: 'community',
    label: 'Community',
    icon: Users,
    description: 'Support & social health'
  },
  {
    id: 'family',
    label: 'Family Care',
    icon: UserPlus,
    description: 'Guardian & family mode'
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: Settings,
    description: 'Settings & preferences'
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
      "fixed inset-y-0 left-0 z-50 w-280 bg-background-secondary border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      {/* Sidebar Header */}
      <div className="flex items-center gap-3 p-6 border-b border-border">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
          <Stethoscope className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">UrCare</h1>
          <p className="text-sm text-muted-foreground">Patient Portal</p>
        </div>
      </div>

      {/* AI Health Score */}
      <div className="p-4 m-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-foreground">Health Score</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-background rounded-full h-2">
            <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full w-4/5"></div>
          </div>
          <span className="text-lg font-bold text-primary">85</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Good overall health</p>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
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
                "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:bg-background hover:text-foreground"
              )}
            >
              <IconComponent className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{item.label}</div>
                <div className="text-xs opacity-75 truncate">{item.description}</div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="p-4 mt-auto border-t border-border">
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-2 bg-background rounded-lg">
            <Activity className="w-4 h-4 mx-auto text-success mb-1" />
            <div className="text-xs font-medium text-foreground">12,543</div>
            <div className="text-xs text-muted-foreground">Steps</div>
          </div>
          <div className="p-2 bg-background rounded-lg">
            <Calendar className="w-4 h-4 mx-auto text-primary mb-1" />
            <div className="text-xs font-medium text-foreground">2</div>
            <div className="text-xs text-muted-foreground">Upcoming</div>
          </div>
        </div>
      </div>
    </div>
  );
};
