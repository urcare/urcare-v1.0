
import { 
  Smartphone,
  Bell,
  Fingerprint,
  CreditCard,
  Eye,
  Watch,
  Workflow
} from 'lucide-react';
import { MenuItem } from '../menuItems';

export const mobileMenuItems: MenuItem[] = [
  {
    title: "Advanced Mobile Features",
    url: "/advanced-mobile-features",
    icon: Smartphone,
    description: "Push notifications, biometric auth, mobile payments, AR education"
  }
];
