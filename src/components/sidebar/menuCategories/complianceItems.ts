
import { 
  Shield,
  FileText,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { MenuItem } from '../menuItems';

export const complianceMenuItems: MenuItem[] = [
  {
    title: "Compliance Management",
    url: "/compliance-management",
    icon: Shield,
    description: "HIPAA, GDPR, SOX, FDA, Joint Commission, and local regulation compliance"
  }
];
