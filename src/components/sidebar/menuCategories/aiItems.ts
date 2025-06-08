
import { Brain, Activity, Lightbulb, ClipboardList, TrendingUp, Workflow, Bot, Target, Heart, BookOpen } from "lucide-react"
import { MenuItem } from "../menuItems"

export const aiMenuItems: MenuItem[] = [
  {
    title: "Predictive Clinical AI",
    url: "/predictive-ai",
    icon: Brain,
    description: "Advanced patient risk assessment and early warning systems"
  },
  {
    title: "Mental Health AI",
    url: "/mental-health-ai",
    icon: Activity,
    description: "Psychological wellness monitoring and intervention systems"
  },
  {
    title: "Clinical Decision Support",
    url: "/clinical-decision-support",
    icon: Lightbulb,
    description: "AI-powered treatment guidance and decision support"
  },
  {
    title: "Treatment Protocol AI",
    url: "/treatment-protocol-ai",
    icon: ClipboardList,
    description: "Comprehensive care management with intelligent protocol guidance"
  },
  {
    title: "Clinical Optimization AI",
    url: "/clinical-optimization",
    icon: TrendingUp,
    description: "Resource and outcome enhancement with intelligent optimization"
  },
  {
    title: "Workflow Automation AI",
    url: "/workflow-automation-ai",
    icon: Workflow,
    description: "Intelligent process management and workflow orchestration"
  },
  {
    title: "Advanced Workflow AI",
    url: "/advanced-workflow-ai",
    icon: Bot,
    description: "Premium process automation with intelligent optimization"
  },
  {
    title: "Process Optimization AI",
    url: "/process-optimization-ai",
    icon: Target,
    description: "Operational excellence enhancement and performance optimization"
  },
  {
    title: "Emotional & Retention AI",
    url: "/emotional-retention-ai",
    icon: Heart,
    description: "Patient engagement intelligence with mood analysis and retention optimization"
  },
  {
    title: "Content & Engagement AI",
    url: "/content-engagement-ai",
    icon: BookOpen,
    description: "Personalized patient experience with intelligent content optimization"
  },
];
