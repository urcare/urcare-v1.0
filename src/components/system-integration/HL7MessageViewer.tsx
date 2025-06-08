
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  RefreshCw,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Clock,
  Code,
  Zap
} from 'lucide-react';

export const HL7MessageViewer = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);

  const hl7Messages = [
    {
      id: 'HL7001',
      type: 'ADT^A01',
      description: 'Patient Admission',
      source: 'Epic EMR',
      destination: 'HIMS',
      timestamp: '2024-01-15 14:32:15',
      status: 'processed',
      size: '2.1 KB',
      segments: 15
    },
    {
      id: 'HL7002',
      type: 'ORU^R01',
      description: 'Lab Results',
      source: 'Sunquest LIMS',
      destination: 'Epic EMR',
      timestamp: '2024-01-15 14:30:22',
      status: 'failed',
      size: '4.7 KB',
      segments: 23
    },
    {
      id: 'HL7003',
      type: 'ADT^A08',
      description: 'Patient Update',
      source: 'Registration',
      destination: 'Epic EMR',
      timestamp: '2024-01-15 14:28:45',
      status: 'processing',
      size: '1.8 KB',
      segments: 12
    }
  ];

  const fhirResources = [
    {
      id: 'FHIR001',
      type: 'Patient',
      action: 'CREATE',
      source: 'Cerner EHR',
      destination: 'Analytics DB',
      timestamp: '2024-01-15 14:31:45',
      status: 'processed',
      version: 'R4',
      size: '3.2 KB'
    },
    {
      id: 'FHIR002',
      type: 'Observation',
      action: 'UPDATE',
      source: 'LIMS',
      destination: 'Cerner EHR',
      timestamp: '2024-01-15 14:29:33',
      status: 'processed',
      version: 'R4',
      size: '2.8 KB'
    },
    {
      id: 'FHIR003',
      type: 'Encounter',
      action: 'CREATE',
      source: 'Registration',
      destination: 'Billing',
      timestamp: '2024-01-15 14:27:18',
      status: 'failed',
      version: 'R4',
      size: '5.1 KB'
    }
  ];

  const transformationRules = [
    {
      id: 'TR001',
      name: 'HL7 to FHIR Patient',
      source: 'HL7 PID Segment',
      destination: 'FHIR Patient Resource',
      status: 'active',
      lastUsed: '2 mins ago',
      successRate: '98.5%'
    },
    {
      id: 'TR002',
      name: 'Lab Result Mapping',
      source: 'HL7 OBX Segment',
      destination: 'FHIR Observation',
      status: 'active',
      lastUsed: '5 mins ago',
      successRate: '99.2%'
    },
    {
      id: 'TR003',
      name: 'Admission to Encounter',
      source: 'HL7 ADT Message',
      destination: 'FHIR Encounter',
      status: 'inactive',
      lastUsed: '1 hour ago',
      successRate: '97.8%'
    }
  ];

  const sampleHL7 = `MSH|^~\\&|EPIC|UCDMC|CERNER|UCDMC|202401151432||ADT^A01|12345|P|2.5
EVN|A01|202401151432|||^SMITH^JOHN
PID|1||123456789^^^UCDMC^MRN||DOE^JANE^M||19850615|F|||123 MAIN ST^^SACRAMENTO^CA^95814||^PRN^PH^^^916^5551234|^PRN^PH^^^916^5555678|EN|M|CHR|||123456789|||||||||||||||
NK1|1|DOE^JOHN^||123 MAIN ST^^SACRAMENTO^CA^95814|^PRN^PH^^^916^5551234|N
PV1|1|I|2N^2002^A|ER|||^JONES^ROBERT^M|||SUR|||3|||^JONES^ROBERT^M|AMB|1||||||||||||||||||||||||202401151430|202401151432`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">HL7/FHIR Message Center</h3>
          <p className="text-gray-600">View, parse, and manage healthcare message standards</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="hl7" className="space-y-6">
        <TabsList>
          <TabsTrigger value="hl7">HL7 Messages</TabsTrigger>
          <TabsTrigger value="fhir">FHIR Resources</TabsTrigger>
          <TabsTrigger value="transformation">Transformation</TabsTrigger>
          <TabsTrigger value="viewer">Message Viewer</TabsTrigger>
        </TabsList>

        <TabsContent value="hl7" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>HL7 Message Queue</CardTitle>
              <CardDescription>Recent HL7 messages and processing status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {hl7Messages.map((message, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        message.status === 'processed' ? 'bg-green-100' :
                        message.status === 'failed' ? 'bg-red-100' :
                        'bg-blue-100'
                      }`}>
                        {message.status === 'processed' ? <CheckCircle className="h-4 w-4 text-green-600" /> :
                         message.status === 'failed' ? <AlertTriangle className="h-4 w-4 text-red-600" /> :
                         <Clock className="h-4 w-4 text-blue-600" />}
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{message.id}</h5>
                        <p className="text-sm text-gray-600">{message.type} - {message.description}</p>
                        <p className="text-xs text-gray-500">{message.source} → {message.destination}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={`${
                          message.status === 'processed' ? 'border-green-500 text-green-700' :
                          message.status === 'failed' ? 'border-red-500 text-red-700' :
                          'border-blue-500 text-blue-700'
                        }`}>
                          {message.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">{message.timestamp}</p>
                      <p className="text-xs text-gray-500">{message.size} • {message.segments} segments</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fhir" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>FHIR Resource Exchange</CardTitle>
              <CardDescription>FHIR R4 resource transactions and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {fhirResources.map((resource, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        resource.status === 'processed' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {resource.status === 'processed' ? 
                          <CheckCircle className="h-4 w-4 text-green-600" /> : 
                          <AlertTriangle className="h-4 w-4 text-red-600" />}
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{resource.id}</h5>
                        <p className="text-sm text-gray-600">{resource.type} ({resource.action})</p>
                        <p className="text-xs text-gray-500">{resource.source} → {resource.destination}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{resource.version}</Badge>
                        <Badge variant="outline" className={`${
                          resource.status === 'processed' ? 'border-green-500 text-green-700' : 'border-red-500 text-red-700'
                        }`}>
                          {resource.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">{resource.timestamp}</p>
                      <p className="text-xs text-gray-500">{resource.size}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transformation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transformation Rules</CardTitle>
              <CardDescription>Configure message parsing and routing rules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transformationRules.map((rule, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          rule.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                        <h5 className="font-medium text-gray-900">{rule.name}</h5>
                      </div>
                      <Badge variant="outline" className={
                        rule.status === 'active' ? 'border-green-500 text-green-700' : 'border-gray-500 text-gray-700'
                      }>
                        {rule.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Source:</span>
                        <p className="font-medium">{rule.source}</p>
                      </div>
                      <div className="flex items-center justify-center">
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                      <div>
                        <span className="text-gray-600">Destination:</span>
                        <p className="font-medium">{rule.destination}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Last used: {rule.lastUsed}</span>
                      <span>Success rate: {rule.successRate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="viewer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Message Viewer</CardTitle>
              <CardDescription>Parse and view message content with syntax highlighting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Parse Message
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Validate
                  </Button>
                </div>
                <div className="border rounded-lg">
                  <div className="bg-gray-50 px-4 py-2 border-b">
                    <h6 className="font-medium text-gray-900">Sample HL7 ADT Message</h6>
                  </div>
                  <div className="p-4">
                    <pre className="text-xs font-mono text-gray-800 whitespace-pre-wrap overflow-x-auto">
                      {sampleHL7}
                    </pre>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 border rounded">
                    <span className="text-gray-600">Message Type:</span>
                    <p className="font-medium">ADT^A01 (Patient Admission)</p>
                  </div>
                  <div className="p-3 border rounded">
                    <span className="text-gray-600">Segments:</span>
                    <p className="font-medium">MSH, EVN, PID, NK1, PV1</p>
                  </div>
                  <div className="p-3 border rounded">
                    <span className="text-gray-600">Validation:</span>
                    <p className="font-medium text-green-600">Valid HL7 v2.5</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
