
import { 
  Smartphone,
  Bell,
  Fingerprint,
  CreditCard,
  Eye,
  Watch,
  Workflow,
  RefreshCw
} from 'lucide-react';
import { MenuItem } from '../menuItems';

export const mobileMenuItems: MenuItem[] = [
  {
    title: "Advanced Mobile Features",
    url: "/advanced-mobile-features",
    icon: Smartphone,
    description: "Push notifications, biometric auth, mobile payments, AR education"
  },
  {
    title: "Cross-Platform Compatibility",
    url: "/cross-platform-compatibility",
    icon: RefreshCw,
    description: "Browser testing, mobile apps, tablets, kiosk mode, smart TV, smartwatch"
  }
];
