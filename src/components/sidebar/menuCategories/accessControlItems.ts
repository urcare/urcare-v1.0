
import { 
  Shield,
  Lock,
  Key,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { MenuItem } from '../menuItems';

export const accessControlMenuItems: MenuItem[] = [
  {
    title: "Advanced Access Control",
    url: "/advanced-access-control",
    icon: Shield,
    description: "ABAC, dynamic permissions, session management, privileged access, reviews, emergency access"
  }
];
