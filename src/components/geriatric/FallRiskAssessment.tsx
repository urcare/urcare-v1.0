
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  AlertTriangle,
  Home,
  Pill,
  Activity,
  Shield,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const FallRiskAssessment = () => {
  const [assessmentData, setAssessmentData] = useState({
    riskFactors: {
      previousFalls: false,
      muscleWeakness: false,
      balanceProblems: false,
      medicationSideEffects: false,
      visionProblems: false,
      cognitiveImpairment: false,
      environmentalHazards: false,
      footwearIssues: false
    },
    environmentalAssessment: {
      poorLighting: false,
      looseRugs: false,
      clutterInWalkways: false,
      noHandrails: false,
      slipperyFloors: false,
      highThresholds: false,
      unstableFurniture: false,
      inaccessibleBathroom: false
    },
    medicationReview: {
      antidepressants: false,
      antipsychotics: false,
      sedatives: false,
      antihypertensives: false,
      diuretics: false,
      polypharmacy: false
    }
  });

  const [riskScore, setRiskScore] = useState(0);
  const [preventionPlan, setPreventionPlan] = useState([]);

  const riskFactors = [
    { key: 'previousFalls', label: 'Previous Falls (last 12 months)', weight: 3 },
    { key: 'muscleWeakness', label: 'Muscle Weakness', weight: 2 },
    { key: 'balanceProblems', label: 'Balance/Gait Problems', weight: 3 },
    { key: 'medicationSideEffects', label: 'Medication Side Effects', weight: 2 },
    { key: 'visionProblems', label: 'Vision Problems', weight: 2 },
    { key: 'cognitiveImpairment', label: 'Cognitive Impairment', weight: 2 },
    { key: 'environmentalHazards', label: 'Environmental Hazards', weight: 1 },
    { key: 'footwearIssues', label: 'Inappropriate Footwear', weight: 1 }
  ];

  const environmentalFactors = [
    { key: 'poorLighting', label: 'Poor Lighting', intervention: 'Install adequate lighting' },
    { key: 'looseRugs', label: 'Loose Rugs/Carpets', intervention: 'Secure or remove rugs' },
    { key: 'clutterInWalkways', label: 'Clutter in Walkways', intervention: 'Clear pathways' },
    { key: 'noHandrails', label: 'Missing Handrails', intervention: 'Install handrails' },
    { key: 'slipperyFloors', label: 'Slippery Floors', intervention: 'Add non-slip surfaces' },
    { key: 'highThresholds', label: 'High Thresholds', intervention: 'Install ramps' },
    { key: 'unstableFurniture', label: 'Unstable Furniture', intervention: 'Secure furniture' },
    { key: 'inaccessibleBathroom', label: 'Unsafe Bathroom', intervention: 'Install grab bars, shower seat' }
  ];

  const medicationFactors = [
    { key: 'antidepressants', label: 'Antidepressants' },
    { key: 'antipsychotics', label: 'Antipsychotics' },
    { key: 'sedatives', label: 'Sedatives/Hypnotics' },
    { key: 'antihypertensives', label: 'Antihypertensives' },
    { key: 'diuretics', label: 'Diuretics' },
    { key: 'polypharmacy', label: 'Polypharmacy (>4 medications)' }
  ];

  const updateRiskFactor = (category, factor, checked) => {
    setAssessmentData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [factor]: checked
      }
    }));
  };

  const calculateRiskScore = () => {
    let score = 0;
    
    // Risk factors scoring
    riskFactors.forEach(factor => {
      if (assessmentData.riskFactors[factor.key]) {
        score += factor.weight;
      }
    });

    // Environmental factors
    Object.values(assessmentData.environmentalAssessment).forEach(value => {
      if (value) score += 1;
    });

    // Medication factors
    Object.values(assessmentData.medicationReview).forEach(value => {
      if (value) score += 1;
    });

    setRiskScore(score);
    generatePreventionPlan(score);
  };

  const generatePreventionPlan = (score) => {
    const plan = [];
    
    if (score >= 5) {
      plan.push({
        priority: 'high',
        intervention: 'Immediate referral to fall prevention clinic',
        timeline: 'Within 1 week'
      });
    }

    if (assessmentData.riskFactors.muscleWeakness || assessmentData.riskFactors.balanceProblems) {
      plan.push({
        priority: 'high',
        intervention: 'Physical therapy evaluation and exercise program',
        timeline: 'Within 2 weeks'
      });
    }

    if (assessmentData.riskFactors.medicationSideEffects || Object.values(assessmentData.medicationReview).some(v => v)) {
      plan.push({
        priority: 'high',
        intervention: 'Comprehensive medication review',
        timeline: 'Within 1 week'
      });
    }

    if (assessmentData.riskFactors.visionProblems) {
      plan.push({
        priority: 'medium',
        intervention: 'Ophthalmology referral',
        timeline: 'Within 1 month'
      });
    }

    // Environmental interventions
    environmentalFactors.forEach(factor => {
      if (assessmentData.environmentalAssessment[factor.key]) {
        plan.push({
          priority: 'medium',
          intervention: factor.intervention,
          timeline: 'Within 2 weeks'
        });
      }
    });

    setPreventionPlan(plan);
  };

  const getRiskLevel = (score) => {
    if (score >= 8) return { level: 'Very High', color: 'bg-red-100 text-red-800' };
    if (score >= 5) return { level: 'High', color: 'bg-orange-100 text-orange-800' };
    if (score >= 3) return { level: 'Moderate', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'Low', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="space-y-6">
      {/* Risk Score Display */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Fall Risk Assessment Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-orange-600">{riskScore}</div>
              <div className="text-sm text-gray-600">Total Risk Score</div>
            </div>
            <Badge className={getRiskLevel(riskScore).color}>
              {getRiskLevel(riskScore).level} Risk
            </Badge>
          </div>
          <Button onClick={calculateRiskScore} className="mt-4">
            Calculate Risk Score
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Factors Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Risk Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {riskFactors.map((factor) => (
                <div key={factor.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={factor.key}
                    checked={assessmentData.riskFactors[factor.key]}
                    onCheckedChange={(checked) => updateRiskFactor('riskFactors', factor.key, checked)}
                  />
                  <label
                    htmlFor={factor.key}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {factor.label}
                  </label>
                  <Badge variant="outline" className="text-xs">
                    {factor.weight}pts
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Environmental Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Environmental Hazards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {environmentalFactors.map((factor) => (
                <div key={factor.key} className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={factor.key}
                      checked={assessmentData.environmentalAssessment[factor.key]}
                      onCheckedChange={(checked) => updateRiskFactor('environmentalAssessment', factor.key, checked)}
                    />
                    <label
                      htmlFor={factor.key}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {factor.label}
                    </label>
                  </div>
                  {assessmentData.environmentalAssessment[factor.key] && (
                    <div className="ml-6 text-xs text-blue-600">
                      Intervention: {factor.intervention}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Medication Review */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Medication Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {medicationFactors.map((factor) => (
                <div key={factor.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={factor.key}
                    checked={assessmentData.medicationReview[factor.key]}
                    onCheckedChange={(checked) => updateRiskFactor('medicationReview', factor.key, checked)}
                  />
                  <label
                    htmlFor={factor.key}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {factor.label}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prevention Plan */}
      {preventionPlan.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Fall Prevention Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {preventionPlan.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {item.priority === 'high' ? (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-yellow-500" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{item.intervention}</div>
                    <div className="text-sm text-gray-600">Timeline: {item.timeline}</div>
                  </div>
                  <Badge 
                    className={item.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}
                  >
                    {item.priority} priority
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
