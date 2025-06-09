
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClinicalDocumentationInterface } from './ClinicalDocumentationInterface';
import { VoiceToTextInterface } from './VoiceToTextInterface';
import { CodingAssistanceInterface } from './CodingAssistanceInterface';
import { MedicalLiteratureSearchInterface } from './MedicalLiteratureSearchInterface';
import { PatientQueryInterface } from './PatientQueryInterface';
import { MultilingualSupportInterface } from './MultilingualSupportInterface';
import { 
  FileText,
  Mic,
  Code,
  Search,
  MessageCircle,
  Languages,
  Brain,
  TrendingUp,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const NaturalLanguageProcessingDashboard = () => {
  const [activeTab, setActiveTab] = useState('documentation');
  const [nlpMetrics, setNlpMetrics] = useState({
    processedDocuments: 1247,
    accuracyScore: 94.8,
    processingSpeed: 2.3,
    languagesSupported: 12,
    activeTranscriptions: 8,
    codingAccuracy: 97.2
  });

  const nlpTabs = [
    {
      id: 'documentation',
      title: 'Documentation',
      icon: FileText,
      component: ClinicalDocumentationInterface,
      description: 'AI-powered clinical documentation with summarization and structuring'
    },
    {
      id: 'voice',
      title: 'Voice-to-Text',
      icon: Mic,
      component: VoiceToTextInterface,
      description: 'Medical speech recognition with real-time transcription'
    },
    {
      id: 'coding',
      title: 'Coding',
      icon: Code,
      component: CodingAssistanceInterface,
      description: 'Automated medical coding with ICD-10/CPT suggestions'
    },
    {
      id: 'literature',
      title: 'Literature',
      icon: Search,
      component: MedicalLiteratureSearchInterface,
      description: 'AI-powered medical literature search and summarization'
    },
    {
      id: 'queries',
      title: 'Patient Queries',
      icon: MessageCircle,
      component: PatientQueryInterface,
      description: 'Natural language patient communication interface'
    },
    {
      id: 'multilingual',
      title: 'Translation',
      icon: Languages,
      component: MultilingualSupportInterface,
      description: 'Multilingual support with medical terminology accuracy'
    }
  ];

  useEffect(() => {
    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setNlpMetrics(prev => ({
        ...prev,
        processedDocuments: prev.processedDocuments + Math.floor(Math.random() * 3),
        accuracyScore: Math.min(100, prev.accuracyScore + (Math.random() - 0.5) * 0.1),
        processingSpeed: Math.max(1, prev.processingSpeed + (Math.random() - 0.5) * 0.1),
        activeTranscriptions: Math.max(0, prev.activeTranscriptions + Math.floor(Math.random() * 3) - 1)
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Brain className="h-6 w-6 text-purple-600" />
        <h1 className="text-2xl font-bold">Natural Language Processing</h1>
      </div>

      {/* NLP Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{nlpMetrics.processedDocuments}</div>
            <div className="text-sm text-gray-600">Documents Processed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{nlpMetrics.accuracyScore.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Accuracy Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{nlpMetrics.processingSpeed.toFixed(1)}s</div>
            <div className="text-sm text-gray-600">Avg Processing Time</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-cyan-600">{nlpMetrics.languagesSupported}</div>
            <div className="text-sm text-gray-600">Languages Supported</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{nlpMetrics.activeTranscriptions}</div>
            <div className="text-sm text-gray-600">Active Transcriptions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{nlpMetrics.codingAccuracy.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Coding Accuracy</div>
          </CardContent>
        </Card>
      </div>

      {/* System Status Alert */}
      {nlpMetrics.accuracyScore < 90 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              NLP Performance Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-orange-700">
                <TrendingUp className="h-4 w-4" />
                <span>Accuracy score below threshold - Model retraining recommended</span>
              </div>
              <div className="flex items-center gap-2 text-orange-700">
                <CheckCircle className="h-4 w-4" />
                <span>Backup models available for critical processes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* NLP Feature Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          {nlpTabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {nlpTabs.map((tab) => {
          const ComponentToRender = tab.component;
          return (
            <TabsContent key={tab.id} value={tab.id} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <tab.icon className="h-5 w-5" />
                    {tab.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{tab.description}</p>
                </CardHeader>
                <CardContent>
                  <ComponentToRender />
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};
