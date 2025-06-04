
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Brain, 
  Clock, 
  CheckCircle,
  Edit,
  Download,
  Copy,
  Sparkles
} from 'lucide-react';

interface DocumentationTask {
  id: string;
  patientName: string;
  documentType: 'progress-note' | 'consultation' | 'discharge-summary' | 'assessment';
  priority: 'urgent' | 'high' | 'normal';
  status: 'pending' | 'ai-generated' | 'reviewed' | 'completed';
  aiSuggestions: string[];
  keyFindings: string[];
  generatedContent: string;
  timeEstimate: string;
  confidenceScore: number;
}

const mockTasks: DocumentationTask[] = [
  {
    id: 'DOC001',
    patientName: 'Sarah Chen',
    documentType: 'progress-note',
    priority: 'normal',
    status: 'ai-generated',
    aiSuggestions: [
      'Include blood pressure trends from last 3 visits',
      'Mention medication adherence improvement',
      'Note patient education provided'
    ],
    keyFindings: [
      'Blood pressure well controlled on current regimen',
      'Patient demonstrates good understanding of lifestyle modifications',
      'No adverse effects from recent medication adjustment'
    ],
    generatedContent: 'Patient returns for routine follow-up of hypertension. Current medications include lisinopril 10mg daily and hydrochlorothiazide 25mg daily. Blood pressure readings show improvement with systolic readings averaging 135 mmHg compared to 150 mmHg at last visit...',
    timeEstimate: '2 minutes',
    confidenceScore: 94
  },
  {
    id: 'DOC002',
    patientName: 'Michael Thompson',
    documentType: 'consultation',
    priority: 'high',
    status: 'pending',
    aiSuggestions: [
      'Review recent lab results and imaging',
      'Document differential diagnosis considerations',
      'Include specialist recommendations'
    ],
    keyFindings: [
      'New onset chest pain with atypical features',
      'ECG shows non-specific ST changes',
      'Troponin levels within normal limits'
    ],
    generatedContent: '',
    timeEstimate: '5 minutes',
    confidenceScore: 0
  }
];

export const AIDocumentationAssistant = () => {
  const [tasks] = useState<DocumentationTask[]>(mockTasks);
  const [selectedTask, setSelectedTask] = useState<DocumentationTask | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'normal': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'reviewed': return 'bg-blue-500 text-white';
      case 'ai-generated': return 'bg-purple-500 text-white';
      case 'pending': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'progress-note': return 'Progress Note';
      case 'consultation': return 'Consultation';
      case 'discharge-summary': return 'Discharge Summary';
      case 'assessment': return 'Assessment';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            AI Documentation Assistant
          </CardTitle>
          <CardDescription>
            Intelligent note summarization, template generation, and clinical narrative creation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2">
                  <Brain className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">47</p>
                    <p className="text-sm text-gray-600">AI Generated Today</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">89%</p>
                    <p className="text-sm text-gray-600">Accuracy Score</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Clock className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">73%</p>
                    <p className="text-sm text-gray-600">Time Saved</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <FileText className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">12</p>
                    <p className="text-sm text-gray-600">Pending Review</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Documentation Tasks</h3>
              {tasks.map((task) => (
                <Card 
                  key={task.id} 
                  className={`cursor-pointer transition-colors ${selectedTask?.id === task.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-purple-400`}
                  onClick={() => setSelectedTask(task)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{task.patientName}</h4>
                        <p className="text-sm text-gray-600">{getDocumentTypeLabel(task.documentType)}</p>
                        <p className="text-xs text-gray-500">Est. {task.timeEstimate}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <Brain className="h-3 w-3 text-purple-500" />
                          <span>{task.aiSuggestions.length} suggestions</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-blue-500" />
                          <span>{task.keyFindings.length} findings</span>
                        </div>
                        {task.confidenceScore > 0 && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>{task.confidenceScore}% confidence</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedTask ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedTask.patientName} - {getDocumentTypeLabel(selectedTask.documentType)}</CardTitle>
                    <CardDescription>AI-assisted documentation with smart suggestions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Task Details</h4>
                          <div className="space-y-1 text-sm">
                            <p>Type: <strong>{getDocumentTypeLabel(selectedTask.documentType)}</strong></p>
                            <p>Priority: <span className="capitalize">{selectedTask.priority}</span></p>
                            <p>Time Estimate: {selectedTask.timeEstimate}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">AI Confidence</h4>
                          {selectedTask.confidenceScore > 0 ? (
                            <p className="text-2xl font-bold text-green-600">{selectedTask.confidenceScore}%</p>
                          ) : (
                            <p className="text-sm text-gray-500">Pending generation</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">AI Suggestions</h4>
                        <ul className="space-y-1">
                          {selectedTask.aiSuggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <Brain className="h-3 w-3 text-purple-500" />
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Key Findings</h4>
                        <ul className="space-y-1">
                          {selectedTask.keyFindings.map((finding, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <Sparkles className="h-3 w-3 text-blue-500" />
                              {finding}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {selectedTask.generatedContent && (
                        <div>
                          <h4 className="font-medium mb-2">Generated Content</h4>
                          <div className="bg-gray-50 p-3 rounded text-sm">
                            {selectedTask.generatedContent}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        {selectedTask.status === 'pending' ? (
                          <Button>
                            <Brain className="h-4 w-4 mr-1" />
                            Generate with AI
                          </Button>
                        ) : (
                          <>
                            <Button>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit Document
                            </Button>
                            <Button variant="outline">
                              <Copy className="h-4 w-4 mr-1" />
                              Copy Content
                            </Button>
                            <Button variant="outline">
                              <Download className="h-4 w-4 mr-1" />
                              Export
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a documentation task to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
