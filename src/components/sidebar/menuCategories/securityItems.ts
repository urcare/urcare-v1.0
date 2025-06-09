
import { 
  Shield,
  Lock,
  Key,
  Eye,
  AlertTriangle,
  Database
} from 'lucide-react';
import { MenuItem } from '../menuItems';

export const securityMenuItems: MenuItem[] = [
  {
    title: "Advanced Security Features",
    url: "/advanced-security-features",
    icon: Shield,
    description: "MFA, SSO, monitoring, encryption, intrusion detection, DLP"
  }
];
