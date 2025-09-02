import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Calendar, 
  Clock, 
  Target, 
  Activity, 
  Heart, 
  Pill, 
  Zap,
  ArrowRight,
  Info
} from 'lucide-react';
import AIDailyHealthPlan from '@/components/health/AIDailyHealthPlan';
import { UserHealthProfile } from '@/services/aiHealthAssistantService';

const AIHealthAssistantDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userProfile, setUserProfile] = useState<UserHealthProfile>({
    age: 28,
    gender: 'male',
    bodyType: 'endomorph',
    foodPreferences: ['vegetarian'],
    allergies: ['peanuts'],
    healthConditions: ['mild hypertension', 'overweight'],
    medications: [
      {
        name: 'Blood pressure medication',
        timing: 'morning after breakfast',
        instructions: 'Take one tablet after breakfast',
        interactions: []
      }
    ],
    workSchedule: {
      start: '09:00',
      end: '18:00',
      type: 'desk'
    },
    sleepPattern: {
      bedtime: '00:00',
      wakeTime: '07:30',
      quality: 'fair'
    },
    stressLevel: 'high',
    fitnessGoals: ['weight loss', 'fitness'],
    currentFitnessLevel: 'beginner',
    height: 175,
    weight: 85,
    activityLevel: 'sedentary'
  });

  const [generatedPlan, setGeneratedPlan] = useState<any>(null);

  const updateProfile = (field: keyof UserHealthProfile, value: any) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateArrayField = (field: keyof UserHealthProfile, value: string, action: 'add' | 'remove') => {
    setUserProfile(prev => ({
      ...prev,
      [field]: action === 'add' 
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter(item => item !== value)
    }));
  };

  const handlePlanGenerated = (plan: any) => {
    setGeneratedPlan(plan);
    setCurrentStep(3);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Personal Health Profile
        </h2>
        <p className="text-gray-600">
          Let's gather information about your health to create a personalized daily plan
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={userProfile.age}
                  onChange={(e) => updateProfile('age', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={userProfile.gender} onValueChange={(value: any) => updateProfile('gender', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={userProfile.height}
                  onChange={(e) => updateProfile('height', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={userProfile.weight}
                  onChange={(e) => updateProfile('weight', parseInt(e.target.value))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="bodyType">Body Type</Label>
              <Select value={userProfile.bodyType} onValueChange={(value: any) => updateProfile('bodyType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ectomorph">Ectomorph (Naturally thin)</SelectItem>
                  <SelectItem value="mesomorph">Mesomorph (Athletic build)</SelectItem>
                  <SelectItem value="endomorph">Endomorph (Naturally heavier)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Health Goals & Fitness */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Health Goals & Fitness
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Fitness Goals</Label>
              <div className="space-y-2 mt-2">
                {['weight loss', 'muscle gain', 'fitness', 'flexibility', 'endurance'].map((goal) => (
                  <div key={goal} className="flex items-center space-x-2">
                    <Checkbox
                      id={goal}
                      checked={userProfile.fitnessGoals.includes(goal)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateArrayField('fitnessGoals', goal, 'add');
                        } else {
                          updateArrayField('fitnessGoals', goal, 'remove');
                        }
                      }}
                    />
                    <Label htmlFor={goal} className="text-sm capitalize">{goal}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="fitnessLevel">Current Fitness Level</Label>
              <Select value={userProfile.currentFitnessLevel} onValueChange={(value: any) => updateProfile('currentFitnessLevel', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="activityLevel">Activity Level</Label>
              <Select value={userProfile.activityLevel} onValueChange={(value: any) => updateProfile('activityLevel', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (Little to no exercise)</SelectItem>
                  <SelectItem value="lightly-active">Lightly Active (Light exercise 1-3 days/week)</SelectItem>
                  <SelectItem value="moderately-active">Moderately Active (Moderate exercise 3-5 days/week)</SelectItem>
                  <SelectItem value="very-active">Very Active (Hard exercise 6-7 days/week)</SelectItem>
                  <SelectItem value="extremely-active">Extremely Active (Very hard exercise, physical job)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Diet & Allergies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Diet & Allergies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Food Preferences</Label>
              <div className="space-y-2 mt-2">
                {['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'low-carb', 'keto'].map((pref) => (
                  <div key={pref} className="flex items-center space-x-2">
                    <Checkbox
                      id={pref}
                      checked={userProfile.foodPreferences.includes(pref)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateArrayField('foodPreferences', pref, 'add');
                        } else {
                          updateArrayField('foodPreferences', pref, 'remove');
                        }
                      }}
                    />
                    <Label htmlFor={pref} className="text-sm capitalize">{pref}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="allergies">Allergies (comma-separated)</Label>
              <Input
                id="allergies"
                value={userProfile.allergies.join(', ')}
                onChange={(e) => updateProfile('allergies', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder="peanuts, dairy, shellfish"
              />
            </div>
          </CardContent>
        </Card>

        {/* Health Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Health Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="healthConditions">Health Conditions (comma-separated)</Label>
              <Input
                id="healthConditions"
                value={userProfile.healthConditions.join(', ')}
                onChange={(e) => updateProfile('healthConditions', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder="hypertension, diabetes, asthma"
              />
            </div>
            <div>
              <Label htmlFor="stressLevel">Stress Level</Label>
              <Select value={userProfile.stressLevel} onValueChange={(value: any) => updateProfile('stressLevel', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="very-high">Very High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button onClick={() => setCurrentStep(2)} size="lg">
          Continue to Schedule
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <Calendar className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Daily Schedule & Lifestyle
        </h2>
        <p className="text-gray-600">
          Tell us about your daily routine and schedule preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Work Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Work Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="workStart">Work Start Time</Label>
                <Input
                  id="workStart"
                  type="time"
                  value={userProfile.workSchedule.start}
                  onChange={(e) => updateProfile('workSchedule', { ...userProfile.workSchedule, start: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="workEnd">Work End Time</Label>
                <Input
                  id="workEnd"
                  type="time"
                  value={userProfile.workSchedule.end}
                  onChange={(e) => updateProfile('workSchedule', { ...userProfile.workSchedule, end: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="workType">Work Type</Label>
              <Select value={userProfile.workSchedule.type} onValueChange={(value: any) => updateProfile('workSchedule', { ...userProfile.workSchedule, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desk">Desk Job (Sedentary)</SelectItem>
                  <SelectItem value="active">Active Job (Physical)</SelectItem>
                  <SelectItem value="mixed">Mixed (Some movement)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Sleep Pattern */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Sleep Pattern
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="wakeTime">Wake Up Time</Label>
                <Input
                  id="wakeTime"
                  type="time"
                  value={userProfile.sleepPattern.wakeTime}
                  onChange={(e) => updateProfile('sleepPattern', { ...userProfile.sleepPattern, wakeTime: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="bedtime">Bedtime</Label>
                <Input
                  id="bedtime"
                  type="time"
                  value={userProfile.sleepPattern.bedtime}
                  onChange={(e) => updateProfile('sleepPattern', { ...userProfile.sleepPattern, bedtime: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="sleepQuality">Sleep Quality</Label>
              <Select value={userProfile.sleepPattern.quality} onValueChange={(value: any) => updateProfile('sleepPattern', { ...userProfile.sleepPattern, quality: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="poor">Poor</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Medications */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5" />
              Medications & Supplements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="medName">Medication Name</Label>
                <Input
                  id="medName"
                  value={userProfile.medications[0]?.name || ''}
                  onChange={(e) => updateProfile('medications', [{ ...userProfile.medications[0], name: e.target.value }])}
                  placeholder="e.g., Blood pressure medication"
                />
              </div>
              <div>
                <Label htmlFor="medTiming">Timing</Label>
                <Input
                  id="medTiming"
                  value={userProfile.medications[0]?.timing || ''}
                  onChange={(e) => updateProfile('medications', [{ ...userProfile.medications[0], timing: e.target.value }])}
                  placeholder="e.g., morning after breakfast"
                />
              </div>
              <div>
                <Label htmlFor="medInstructions">Instructions</Label>
                <Input
                  id="medInstructions"
                  value={userProfile.medications[0]?.instructions || ''}
                  onChange={(e) => updateProfile('medications', [{ ...userProfile.medications[0], instructions: e.target.value }])}
                  placeholder="e.g., Take one tablet"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(1)}>
          Back to Profile
        </Button>
        <Button onClick={() => setCurrentStep(3)} size="lg">
          Generate Health Plan
          <Zap className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
          <Zap className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your AI-Generated Health Plan
        </h2>
        <p className="text-gray-600">
          Based on your profile, here's your personalized daily health schedule
        </p>
      </div>

      <AIDailyHealthPlan 
        userProfile={userProfile}
        onPlanGenerated={handlePlanGenerated}
      />

      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={() => setCurrentStep(1)}>
          Edit Profile
        </Button>
        <Button variant="outline" onClick={() => setCurrentStep(2)}>
          Edit Schedule
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Health Assistant Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience how our AI generates personalized daily health plans based on your unique profile, 
            integrating nutrition, exercise, detoxification, medication optimization, and lifestyle factors.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        {/* Info Section */}
        <div className="mt-16">
          <Separator className="my-8" />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                About the AI Health Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">How It Works</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Analyzes your health profile and preferences</li>
                    <li>• Considers your daily schedule and constraints</li>
                    <li>• Generates personalized recommendations</li>
                    <li>• Integrates all health dimensions seamlessly</li>
                    <li>• Provides actionable, time-specific guidance</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• AI-powered plan generation with fallback logic</li>
                    <li>• Comprehensive daily schedule (24 hours)</li>
                    <li>• Nutrition calculations and meal timing</li>
                    <li>• Exercise recommendations and progression</li>
                    <li>• Medication optimization and safety</li>
                    <li>• Stress management and lifestyle tips</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIHealthAssistantDemo;
