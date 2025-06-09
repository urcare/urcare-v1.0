
import { 
  Database,
  Shield,
  BarChart3,
  GitBranch,
  Lock,
  Eye
} from 'lucide-react';
import { MenuItem } from '../menuItems';

export const dataGovernanceItems: MenuItem[] = [
  {
    title: "Data Governance",
    url: "/data-governance",
    icon: Database,
    description: "Data classification, retention, quality, lineage, master data management, and privacy by design"
  }
];
