
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Stethoscope, 
  Pill, 
  AlertTriangle, 
  TrendingUp,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react';
import { PrescriptionSuggestionInterface } from './PrescriptionSuggestionInterface';

interface ClinicalAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  patientName: string;
  timestamp: string;
}

interface DiagnosticSuggestion {
  id: string;
  patientName: string;
  symptoms: string[];
  suggestedDiagnosis: string;
  confidence: number;
  recommendedTests: string[];
}

export const ClinicalDecisionSupportDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const clinicalAlerts: ClinicalAlert[] = [
    {
      id: 'CA001',
      type: 'critical',
      title: 'Drug Interaction Alert',
      message: 'Potential interaction between Warfarin and Aspirin',
      patientName: 'John Smith',
      timestamp: '2 minutes ago'
    },
    {
      id: 'CA002',
      type: 'warning',
      title: 'Allergy Alert',
      message: 'Patient has documented penicillin allergy',
      patientName: 'Mary Johnson',
      timestamp: '5 minutes ago'
    },
    {
      id: 'CA003',
      type: 'info',
      title: 'Preventive Care Due',
      message: 'Annual mammography screening due',
      patientName: 'Sarah Davis',
      timestamp: '15 minutes ago'
    }
  ];

  const diagnosticSuggestions: DiagnosticSuggestion[] = [
    {
      id: 'DS001',
      patientName: 'Robert Wilson',
      symptoms: ['Chest pain', 'Shortness of breath', 'Fatigue'],
      suggestedDiagnosis: 'Acute Coronary Syndrome',
      confidence: 85,
      recommendedTests: ['ECG', 'Troponin levels', 'Chest X-ray']
    },
    {
      id: 'DS002',
      patientName: 'Lisa Anderson',
      symptoms: ['Fever', 'Cough', 'Sore throat'],
      suggestedDiagnosis: 'Upper Respiratory Infection',
      confidence: 78,
      recommendedTests: ['Rapid strep test', 'CBC', 'Throat culture']
    }
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-500 text-white';
      case 'warning': return 'bg-yellow-500 text-white';
      case 'info': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            Clinical Decision Support System
          </CardTitle>
          <CardDescription>
            AI-powered clinical insights and decision support tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <AlertTriangle className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <h3 className="font-bold text-red-800">Active Alerts</h3>
              <p className="text-2xl font-bold text-red-600">12</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Stethoscope className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-bold text-green-800">AI Diagnoses</h3>
              <p className="text-2xl font-bold text-green-600">34</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Pill className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-bold text-purple-800">Drug Checks</h3>
              <p className="text-2xl font-bold text-purple-600">156</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">Accuracy</h3>
              <p className="text-2xl font-bold text-blue-600">94.2%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="alerts">Clinical Alerts</TabsTrigger>
          <TabsTrigger value="diagnosis">AI Diagnosis</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Clinical Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {clinicalAlerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                      alert.type === 'critical' ? 'text-red-600' :
                      alert.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{alert.title}</span>
                        <Badge className={getAlertColor(alert.type)} variant="secondary">
                          {alert.type.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {alert.patientName} • {alert.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Diagnostic Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {diagnosticSuggestions.slice(0, 2).map((suggestion) => (
                  <div key={suggestion.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold">{suggestion.patientName}</span>
                      <Badge variant="outline">{suggestion.confidence}% confidence</Badge>
                    </div>
                    <p className="text-sm font-medium text-blue-600 mb-1">
                      {suggestion.suggestedDiagnosis}
                    </p>
                    <p className="text-xs text-gray-600 mb-2">
                      Symptoms: {suggestion.symptoms.join(', ')}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {suggestion.recommendedTests.map((test, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {test}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Alerts Dashboard</CardTitle>
              <CardDescription>Real-time alerts and warnings for patient safety</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clinicalAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <AlertTriangle className={`h-6 w-6 mt-1 ${
                      alert.type === 'critical' ? 'text-red-600' :
                      alert.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{alert.title}</h3>
                        <Badge className={getAlertColor(alert.type)}>
                          {alert.type.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-gray-500">{alert.timestamp}</span>
                      </div>
                      <p className="text-gray-700 mb-1">{alert.message}</p>
                      <p className="text-sm font-medium">Patient: {alert.patientName}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Acknowledge
                      </Button>
                      <Button size="sm">
                        <Users className="h-4 w-4 mr-1" />
                        View Patient
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagnosis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Diagnostic Support</CardTitle>
              <CardDescription>Machine learning assisted diagnosis suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {diagnosticSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{suggestion.patientName}</h3>
                        <p className="text-blue-600 font-medium">{suggestion.suggestedDiagnosis}</p>
                      </div>
                      <div className="text-center">
                        <Badge variant="outline" className="mb-1">
                          {suggestion.confidence}% Confidence
                        </Badge>
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${suggestion.confidence}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Reported Symptoms:</h4>
                        <ul className="space-y-1">
                          {suggestion.symptoms.map((symptom, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                              {symptom}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Recommended Tests:</h4>
                        <div className="space-y-1">
                          {suggestion.recommendedTests.map((test, index) => (
                            <Badge key={index} variant="secondary" className="mr-1 mb-1">
                              {test}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button size="sm">
                        <Stethoscope className="h-4 w-4 mr-1" />
                        Accept Diagnosis
                      </Button>
                      <Button size="sm" variant="outline">
                        <Clock className="h-4 w-4 mr-1" />
                        Request More Tests
                      </Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescriptions" className="space-y-4">
          <PrescriptionSuggestionInterface />
        </TabsContent>
      </Tabs>
    </div>
  );
};
