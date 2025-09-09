import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Activity,
  Brain,
  ChevronDown,
  ChevronUp,
  Clock,
  Heart,
  Moon,
  Sun,
  Target,
  TrendingUp,
  Utensils,
  Zap,
} from "lucide-react";
import React, { useState } from "react";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rpe: string;
  rest_s: number;
  tempo: string;
  cues: string[];
  alt: string[];
}

interface Movement {
  type: "home" | "gym";
  duration_min: number;
  exercises: Exercise[];
  warmup: string[];
  cooldown: string[];
}

interface MealItem {
  food: string;
  qty_g: number;
  hand_portion?: string;
}

interface Meal {
  name: string;
  time: string;
  items: MealItem[];
  macros: {
    p: number;
    c: number;
    f: number;
    fiber?: number;
  };
  order: string[];
  tips: string[];
  swaps?: string[];
}

interface Nutrition {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  meals: Meal[];
  snacks: string[];
  hacks: string[];
}

interface HealthScore {
  total: number;
  delta: number;
  subscores: {
    metabolic: number;
    fitness: number;
    sleep: number;
    nutrition: number;
    recovery?: number;
    stress?: number;
  };
}

interface DailyPlan {
  date: string;
  timezone: string;
  focus: string;
  movement: Movement;
  steps: {
    target: number;
    post_meal_walk_min: number;
  };
  nutrition: Nutrition;
  blood_sugar_support?: {
    tactics: string[];
  };
  sleep: {
    bedtime: string;
    wake_time: string;
    duration_hours: number;
    wind_down_routine: string[];
    environment_tips: string[];
  };
  stress: {
    practice: string;
    duration_min: number;
    reflection_prompt: string;
  };
  recovery: {
    nature_time_min: number;
    mobility_routine: string[];
    environment_optimization: string[];
  };
  education: string;
  health_score: HealthScore;
}

interface AIHealthCoachPlan {
  day1: DailyPlan;
  day2: DailyPlan;
  overall_goals: string[];
  progress_tips: string[];
  safety_notes?: string[];
  cultural_adaptations?: string[];
}

interface ExpandableSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  icon,
  children,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Card className="mb-4">
      <CardHeader
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </div>
      </CardHeader>
      {isExpanded && <CardContent>{children}</CardContent>}
    </Card>
  );
};

const ExerciseCard: React.FC<{ exercise: Exercise }> = ({ exercise }) => (
  <div className="bg-gray-50 p-4 rounded-lg mb-3">
    <h4 className="font-semibold text-lg mb-2">{exercise.name}</h4>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
      <div>
        <span className="font-medium">Sets:</span> {exercise.sets}
      </div>
      <div>
        <span className="font-medium">Reps:</span> {exercise.reps}
      </div>
      <div>
        <span className="font-medium">RPE:</span> {exercise.rpe}
      </div>
      <div>
        <span className="font-medium">Rest:</span> {exercise.rest_s}s
      </div>
    </div>
    <div className="mt-2">
      <span className="font-medium">Tempo:</span> {exercise.tempo}
    </div>
    {exercise.cues.length > 0 && (
      <div className="mt-2">
        <span className="font-medium">Cues:</span>
        <ul className="list-disc list-inside ml-2">
          {exercise.cues.map((cue, index) => (
            <li key={index} className="text-sm">
              {cue}
            </li>
          ))}
        </ul>
      </div>
    )}
    {exercise.alt.length > 0 && (
      <div className="mt-2">
        <span className="font-medium">Alternatives:</span>
        <ul className="list-disc list-inside ml-2">
          {exercise.alt.map((alt, index) => (
            <li key={index} className="text-sm">
              {alt}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

const MealCard: React.FC<{ meal: Meal }> = ({ meal }) => (
  <div className="bg-gray-50 p-4 rounded-lg mb-3">
    <div className="flex justify-between items-start mb-3">
      <h4 className="font-semibold text-lg">{meal.name}</h4>
      <Badge variant="outline">{meal.time}</Badge>
    </div>

    <div className="mb-3">
      <h5 className="font-medium mb-2">Food Items:</h5>
      <ul className="space-y-1">
        {meal.items.map((item, index) => (
          <li key={index} className="text-sm">
            <span className="font-medium">{item.food}</span> - {item.qty_g}g
            {item.hand_portion && (
              <span className="text-gray-600"> ({item.hand_portion})</span>
            )}
          </li>
        ))}
      </ul>
    </div>

    <div className="mb-3">
      <h5 className="font-medium mb-2">Macros:</h5>
      <div className="flex gap-4 text-sm">
        <span>Protein: {meal.macros.p}g</span>
        <span>Carbs: {meal.macros.c}g</span>
        <span>Fat: {meal.macros.f}g</span>
        {meal.macros.fiber && <span>Fiber: {meal.macros.fiber}g</span>}
      </div>
    </div>

    <div className="mb-3">
      <h5 className="font-medium mb-2">Eating Order:</h5>
      <div className="flex gap-2">
        {meal.order.map((step, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {step}
          </Badge>
        ))}
      </div>
    </div>

    {meal.tips.length > 0 && (
      <div className="mb-3">
        <h5 className="font-medium mb-2">Tips:</h5>
        <ul className="list-disc list-inside text-sm space-y-1">
          {meal.tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>
    )}

    {meal.swaps && meal.swaps.length > 0 && (
      <div>
        <h5 className="font-medium mb-2">Swaps:</h5>
        <ul className="list-disc list-inside text-sm space-y-1">
          {meal.swaps.map((swap, index) => (
            <li key={index}>{swap}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

const HealthScoreDisplay: React.FC<{ healthScore: HealthScore }> = ({
  healthScore,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getDeltaColor = (delta: number) => {
    if (delta > 0) return "text-green-600";
    if (delta < 0) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-3xl font-bold mb-2">
          <span className={getScoreColor(healthScore.total)}>
            {healthScore.total}
          </span>
          <span
            className={cn("ml-2 text-sm", getDeltaColor(healthScore.delta))}
          >
            ({healthScore.delta > 0 ? "+" : ""}
            {healthScore.delta})
          </span>
        </div>
        <p className="text-sm text-gray-600">Overall Health Score</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(healthScore.subscores).map(([key, value]) => (
          <div key={key} className="text-center">
            <div className={cn("text-lg font-semibold", getScoreColor(value))}>
              {value}
            </div>
            <div className="text-xs text-gray-600 capitalize">
              {key.replace("_", " ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DailyPlanDisplay: React.FC<{ plan: DailyPlan; dayNumber: number }> = ({
  plan,
  dayNumber,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          Day {dayNumber} - {plan.date}
        </h2>
        <p className="text-lg text-gray-600">{plan.focus}</p>
      </div>

      <ExpandableSection
        title="Movement & Training"
        icon={<Activity className="h-5 w-5 text-blue-600" />}
        defaultExpanded={true}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <Badge
              variant={plan.movement.type === "home" ? "default" : "secondary"}
            >
              {plan.movement.type === "home" ? "Home Workout" : "Gym Workout"}
            </Badge>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{plan.movement.duration_min} minutes</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Warm-up:</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {plan.movement.warmup.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Exercises:</h4>
            {plan.movement.exercises.map((exercise, index) => (
              <ExerciseCard key={index} exercise={exercise} />
            ))}
          </div>

          <div>
            <h4 className="font-semibold mb-2">Cool-down:</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {plan.movement.cooldown.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </ExpandableSection>

      <ExpandableSection
        title="Steps & Movement"
        icon={<Target className="h-5 w-5 text-green-600" />}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-green-600">
              {plan.steps.target.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">target steps</div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{plan.steps.post_meal_walk_min} min post-meal walks</span>
          </div>
        </div>
      </ExpandableSection>

      <ExpandableSection
        title="Nutrition"
        icon={<Utensils className="h-5 w-5 text-orange-600" />}
        defaultExpanded={true}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-orange-600">
                {plan.nutrition.calories}
              </div>
              <div className="text-xs text-gray-600">Calories</div>
            </div>
            <div>
              <div className="text-xl font-bold text-blue-600">
                {plan.nutrition.protein_g}g
              </div>
              <div className="text-xs text-gray-600">Protein</div>
            </div>
            <div>
              <div className="text-xl font-bold text-green-600">
                {plan.nutrition.carbs_g}g
              </div>
              <div className="text-xs text-gray-600">Carbs</div>
            </div>
            <div>
              <div className="text-xl font-bold text-purple-600">
                {plan.nutrition.fat_g}g
              </div>
              <div className="text-xs text-gray-600">Fat</div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Meals:</h4>
            {plan.nutrition.meals.map((meal, index) => (
              <MealCard key={index} meal={meal} />
            ))}
          </div>

          <div>
            <h4 className="font-semibold mb-2">Snacks:</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {plan.nutrition.snacks.map((snack, index) => (
                <li key={index}>{snack}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Nutrition Hacks:</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {plan.nutrition.hacks.map((hack, index) => (
                <li key={index}>{hack}</li>
              ))}
            </ul>
          </div>
        </div>
      </ExpandableSection>

      {plan.blood_sugar_support && (
        <ExpandableSection
          title="Blood Sugar Support"
          icon={<Heart className="h-5 w-5 text-red-600" />}
        >
          <ul className="list-disc list-inside text-sm space-y-1">
            {plan.blood_sugar_support.tactics.map((tactic, index) => (
              <li key={index}>{tactic}</li>
            ))}
          </ul>
        </ExpandableSection>
      )}

      <ExpandableSection
        title="Sleep & Circadian"
        icon={<Moon className="h-5 w-5 text-indigo-600" />}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Bedtime</div>
              <div className="font-semibold">{plan.sleep.bedtime}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Wake Time</div>
              <div className="font-semibold">{plan.sleep.wake_time}</div>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600">Duration</div>
            <div className="font-semibold">
              {plan.sleep.duration_hours} hours
            </div>
          </div>

          <div>
            <h5 className="font-medium mb-2">Wind-down Routine:</h5>
            <ul className="list-disc list-inside text-sm space-y-1">
              {plan.sleep.wind_down_routine.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-medium mb-2">Environment Tips:</h5>
            <ul className="list-disc list-inside text-sm space-y-1">
              {plan.sleep.environment_tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </ExpandableSection>

      <ExpandableSection
        title="Stress & Mindset"
        icon={<Brain className="h-5 w-5 text-purple-600" />}
      >
        <div className="space-y-3">
          <div>
            <h5 className="font-medium mb-2">Practice:</h5>
            <p className="text-sm">{plan.stress.practice}</p>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="h-4 w-4" />
              <span className="text-sm text-gray-600">
                {plan.stress.duration_min} minutes
              </span>
            </div>
          </div>

          <div>
            <h5 className="font-medium mb-2">Reflection Prompt:</h5>
            <p className="text-sm italic">"{plan.stress.reflection_prompt}"</p>
          </div>
        </div>
      </ExpandableSection>

      <ExpandableSection
        title="Recovery & Environment"
        icon={<Sun className="h-5 w-5 text-yellow-600" />}
      >
        <div className="space-y-3">
          <div>
            <div className="text-sm text-gray-600">Nature Time</div>
            <div className="font-semibold">
              {plan.recovery.nature_time_min} minutes
            </div>
          </div>

          <div>
            <h5 className="font-medium mb-2">Mobility Routine:</h5>
            <ul className="list-disc list-inside text-sm space-y-1">
              {plan.recovery.mobility_routine.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-medium mb-2">Environment Optimization:</h5>
            <ul className="list-disc list-inside text-sm space-y-1">
              {plan.recovery.environment_optimization.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </ExpandableSection>

      <ExpandableSection
        title="Education"
        icon={<Zap className="h-5 w-5 text-yellow-500" />}
      >
        <p className="text-sm">{plan.education}</p>
      </ExpandableSection>

      <ExpandableSection
        title="Health Score"
        icon={<TrendingUp className="h-5 w-5 text-green-600" />}
        defaultExpanded={true}
      >
        <HealthScoreDisplay healthScore={plan.health_score} />
      </ExpandableSection>
    </div>
  );
};

interface AIHealthCoachPlanProps {
  plan: AIHealthCoachPlan;
}

const AIHealthCoachPlan: React.FC<AIHealthCoachPlanProps> = ({ plan }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">AI Health Coach Plan</h1>
        <p className="text-gray-600">
          Your personalized, evidence-based health plan
        </p>
      </div>

      <DailyPlanDisplay plan={plan.day1} dayNumber={1} />
      <DailyPlanDisplay plan={plan.day2} dayNumber={2} />

      <Card>
        <CardHeader>
          <CardTitle>Overall Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            {plan.overall_goals.map((goal, index) => (
              <li key={index}>{goal}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progress Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            {plan.progress_tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {plan.safety_notes && plan.safety_notes.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Safety Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-red-700">
              {plan.safety_notes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {plan.cultural_adaptations && plan.cultural_adaptations.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">
              Cultural Adaptations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-blue-700">
              {plan.cultural_adaptations.map((adaptation, index) => (
                <li key={index}>{adaptation}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIHealthCoachPlan;
