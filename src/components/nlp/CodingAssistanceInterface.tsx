
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code,
  Search,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  FileText,
  Brain,
  Copy,
  Star
} from 'lucide-react';

export const CodingAssistanceInterface = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [documentText, setDocumentText] = useState('');
  const [suggestedCodes, setSuggestedCodes] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const icdSuggestions = [
    {
      code: 'I10',
      description: 'Essential (primary) hypertension',
      confidence: 95.2,
      category: 'ICD-10-CM',
      reimbursement: '$142',
      documentation: 'Well documented',
      risk: 'low'
    },
    {
      code: 'E11.9',
      description: 'Type 2 diabetes mellitus without complications',
      confidence: 92.8,
      category: 'ICD-10-CM',
      reimbursement: '$168',
      documentation: 'Needs clarification',
      risk: 'medium'
    },
    {
      code: 'Z51.11',
      description: 'Encounter for antineoplastic chemotherapy',
      confidence: 88.5,
      category: 'ICD-10-CM',
      reimbursement: '$1,245',
      documentation: 'Complete',
      risk: 'low'
    }
  ];

  const cptSuggestions = [
    {
      code: '99213',
      description: 'Office visit, established patient, 20-29 minutes',
      confidence: 94.1,
      category: 'CPT',
      reimbursement: '$112',
      documentation: 'Meets requirements',
      risk: 'low'
    },
    {
      code: '93000',
      description: 'Electrocardiogram, routine ECG with interpretation',
      confidence: 96.7,
      category: 'CPT',
      reimbursement: '$45',
      documentation: 'Complete',
      risk: 'low'
    },
    {
      code: '80053',
      description: 'Comprehensive metabolic panel',
      confidence: 91.3,
      category: 'CPT',
      reimbursement: '$28',
      documentation: 'Adequate',
      risk: 'low'
    }
  ];

  const recentCoding = [
    {
      id: 1,
      patient: 'John Smith',
      date: '2024-06-09',
      codes: ['I10', '99213', 'Z51.11'],
      accuracy: 96.5,
      reimbursement: '$1,497',
      status: 'approved'
    },
    {
      id: 2,
      patient: 'Sarah Johnson',
      date: '2024-06-08',
      codes: ['E11.9', '99214'],
      accuracy: 94.2,
      reimbursement: '$298',
      status: 'under review'
    }
  ];

  const analyzeDocument = async () => {
    if (!documentText.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setSuggestedCodes([...icdSuggestions, ...cptSuggestions]);
    setIsAnalyzing(false);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 95) return 'text-green-600';
    if (confidence >= 90) return 'text-blue-600';
    if (confidence >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Document Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Coding Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Paste clinical documentation for automatic code suggestions..."
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              className="min-h-32"
            />
            <Button 
              onClick={analyzeDocument} 
              disabled={!documentText.trim() || isAnalyzing}
              className="flex items-center gap-2"
            >
              {isAnalyzing ? (
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              ) : (
                <Code className="h-4 w-4" />
              )}
              {isAnalyzing ? 'Analyzing...' : 'Analyze Document'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Code Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Code Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Search ICD-10, CPT codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Suggested Codes */}
      {suggestedCodes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              AI Code Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="icd" className="w-full">
              <TabsList>
                <TabsTrigger value="icd">ICD-10 Codes</TabsTrigger>
                <TabsTrigger value="cpt">CPT Codes</TabsTrigger>
                <TabsTrigger value="all">All Suggestions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="icd" className="space-y-4">
                {icdSuggestions.map((code, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono">{code.code}</Badge>
                        <span className={`text-sm font-medium ${getConfidenceColor(code.confidence)}`}>
                          {code.confidence}% confidence
                        </span>
                        <Badge className={getRiskColor(code.risk)}>{code.risk} risk</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-medium">{code.reimbursement}</span>
                        <Button variant="outline" size="icon">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-gray-700 mb-2">{code.description}</div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Documentation: {code.documentation}</span>
                      <span>Category: {code.category}</span>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="cpt" className="space-y-4">
                {cptSuggestions.map((code, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono">{code.code}</Badge>
                        <span className={`text-sm font-medium ${getConfidenceColor(code.confidence)}`}>
                          {code.confidence}% confidence
                        </span>
                        <Badge className={getRiskColor(code.risk)}>{code.risk} risk</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-medium">{code.reimbursement}</span>
                        <Button variant="outline" size="icon">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-gray-700 mb-2">{code.description}</div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Documentation: {code.documentation}</span>
                      <span>Category: {code.category}</span>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="all" className="space-y-4">
                {suggestedCodes.map((code, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono">{code.code}</Badge>
                        <span className={`text-sm font-medium ${getConfidenceColor(code.confidence)}`}>
                          {code.confidence}% confidence
                        </span>
                        <Badge className={getRiskColor(code.risk)}>{code.risk} risk</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-medium">{code.reimbursement}</span>
                        <Button variant="outline" size="icon">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-gray-700 mb-2">{code.description}</div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Documentation: {code.documentation}</span>
                      <span>Category: {code.category}</span>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Recent Coding History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Coding Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCoding.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="font-medium">{record.patient}</div>
                    <div className="text-sm text-gray-600">{record.date}</div>
                  </div>
                  <div className="flex gap-2">
                    {record.codes.map((code, index) => (
                      <Badge key={index} variant="outline" className="font-mono text-xs">
                        {code}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium text-green-600">{record.reimbursement}</div>
                    <div className="text-sm text-gray-600">{record.accuracy}% accuracy</div>
                  </div>
                  <Badge variant={record.status === 'approved' ? 'default' : 'secondary'}>
                    {record.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Coding Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">94.8%</div>
            <div className="text-sm text-gray-600">Coding Accuracy</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">$12,450</div>
            <div className="text-sm text-gray-600">Monthly Revenue</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">2.3s</div>
            <div className="text-sm text-gray-600">Avg Processing Time</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">247</div>
            <div className="text-sm text-gray-600">Documents Processed</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
