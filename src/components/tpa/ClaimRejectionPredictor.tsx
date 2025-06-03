
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  FileText,
  TrendingUp,
  Target,
  Lightbulb
} from 'lucide-react';

interface RiskFactor {
  factor: string;
  impact: 'high' | 'medium' | 'low';
  description: string;
  recommendation: string;
}

interface ClaimAnalysis {
  riskScore: number;
  likelihood: 'high' | 'medium' | 'low';
  riskFactors: RiskFactor[];
  missingDocuments: string[];
  recommendations: string[];
}

export const ClaimRejectionPredictor = () => {
  const [analysisData] = useState<ClaimAnalysis>({
    riskScore: 75,
    likelihood: 'medium',
    riskFactors: [
      {
        factor: 'Cost Variance',
        impact: 'high',
        description: 'Actual cost 25% higher than estimated',
        recommendation: 'Provide detailed breakdown of additional costs'
      },
      {
        factor: 'Documentation Gap',
        impact: 'medium',
        description: 'Missing pre-authorization approval letter',
        recommendation: 'Upload pre-auth approval document'
      },
      {
        factor: 'Treatment Timeline',
        impact: 'low',
        description: 'Treatment started before policy inception',
        recommendation: 'Verify policy effective date and treatment timeline'
      }
    ],
    missingDocuments: [
      'Pre-authorization approval letter',
      'Detailed medical reports',
      'Pharmacy bills with batch numbers'
    ],
    recommendations: [
      'Submit complete medical documentation',
      'Provide itemized billing breakdown',
      'Include doctor consultation notes',
      'Verify all procedure codes with TPA guidelines'
    ]
  });

  const commonRejectionReasons = [
    { reason: 'Incomplete Documentation', percentage: 35, color: '#ef4444' },
    { reason: 'Pre-existing Condition', percentage: 22, color: '#f59e0b' },
    { reason: 'Policy Exclusions', percentage: 18, color: '#8b5cf6' },
    { reason: 'Cost Variance', percentage: 15, color: '#06b6d4' },
    { reason: 'Treatment Timeline Issues', percentage: 10, color: '#10b981' }
  ];

  const historicalPatterns = [
    { tpa: 'Star Health', rejectionRate: 12, commonIssue: 'Documentation' },
    { tpa: 'ICICI Lombard', rejectionRate: 8, commonIssue: 'Cost Variance' },
    { tpa: 'HDFC Ergo', rejectionRate: 15, commonIssue: 'Policy Terms' },
    { tpa: 'Bajaj Allianz', rejectionRate: 10, commonIssue: 'Pre-existing' }
  ];

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-green-600';
  };

  const getRiskBgColor = (score: number) => {
    if (score >= 70) return 'bg-red-100';
    if (score >= 40) return 'bg-amber-100';
    return 'bg-green-100';
  };

  const getImpactBadge = (impact: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-amber-100 text-amber-800',
      low: 'bg-green-100 text-green-800'
    };
    return <Badge className={colors[impact as keyof typeof colors]}>{impact.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Claim Rejection Predictor</h2>
          <p className="text-gray-600">Predictive analysis to prevent claim rejections</p>
        </div>
      </div>

      {/* Risk Score Card */}
      <Card className={`${getRiskBgColor(analysisData.riskScore)} border-2`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <Brain className={`w-8 h-8 ${getRiskColor(analysisData.riskScore)}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Rejection Risk Score</h3>
                <p className={`text-4xl font-bold ${getRiskColor(analysisData.riskScore)}`}>
                  {analysisData.riskScore}/100
                </p>
                <p className="text-gray-600">
                  {analysisData.likelihood.charAt(0).toUpperCase() + analysisData.likelihood.slice(1)} Risk
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-2">Risk Level</p>
              <Progress value={analysisData.riskScore} className="w-32 h-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Risk Factors Identified
            </CardTitle>
            <CardDescription>Issues that may lead to claim rejection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisData.riskFactors.map((factor, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{factor.factor}</h4>
                    {getImpactBadge(factor.impact)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{factor.description}</p>
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
                    <p className="text-sm text-blue-700">{factor.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-600" />
              Missing Documents
            </CardTitle>
            <CardDescription>Required documents not yet uploaded</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysisData.missingDocuments.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm">{doc}</span>
                  </div>
                  <Button size="sm" variant="outline">
                    Upload
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Document Completeness Score</span>
              </div>
              <Progress value={65} className="mt-2 h-2" />
              <p className="text-xs text-gray-600 mt-1">65% complete - Upload remaining documents to improve score</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            AI Recommendations
          </CardTitle>
          <CardDescription>Actions to improve claim approval chances</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysisData.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-sm">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Historical Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Common Rejection Reasons</CardTitle>
            <CardDescription>Analysis of historical rejection patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {commonRejectionReasons.map((reason, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{reason.reason}</span>
                    <span className="text-sm text-gray-600">{reason.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${reason.percentage}%`, 
                        backgroundColor: reason.color 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>TPA Performance Analysis</CardTitle>
            <CardDescription>Rejection rates by insurance provider</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {historicalPatterns.map((pattern, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{pattern.tpa}</h4>
                    <p className="text-sm text-gray-600">Common issue: {pattern.commonIssue}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{pattern.rejectionRate}%</p>
                    <p className="text-xs text-gray-500">Rejection Rate</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button variant="outline">
          <TrendingUp className="w-4 h-4 mr-2" />
          View Detailed Analysis
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <CheckCircle className="w-4 h-4 mr-2" />
          Implement Recommendations
        </Button>
      </div>
    </div>
  );
};
