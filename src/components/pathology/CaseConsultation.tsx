
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  MessageSquare, 
  Camera,
  Share2,
  Clock,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Video,
  Phone,
  Send,
  Eye,
  Star
} from 'lucide-react';

export const CaseConsultation = () => {
  const [selectedConsultation, setSelectedConsultation] = useState('CONS001');

  const consultations = [
    {
      id: 'CONS001',
      case: 'Melanoma vs Nevus',
      patient: 'John Doe',
      consultant: 'Dr. Expert',
      requestedBy: 'Dr. Smith',
      specialty: 'Dermatopathology',
      priority: 'Urgent',
      status: 'Pending Review',
      submitted: '2024-01-08 14:30',
      images: 5,
      question: 'Atypical melanocytic lesion with concerning features'
    },
    {
      id: 'CONS002',
      case: 'Lymphoma Subtyping',
      patient: 'Jane Smith',
      consultant: 'Dr. Specialist',
      requestedBy: 'Dr. Johnson',
      specialty: 'Hematopathology',
      priority: 'Routine',
      status: 'In Progress',
      submitted: '2024-01-08 13:45',
      images: 8,
      question: 'B-cell lymphoma classification assistance needed'
    },
    {
      id: 'CONS003',
      case: 'Pediatric Tumor',
      patient: 'Mike Wilson Jr.',
      consultant: 'Dr. Pediatric',
      requestedBy: 'Dr. Brown',
      specialty: 'Pediatric Pathology',
      priority: 'STAT',
      status: 'Completed',
      submitted: '2024-01-08 12:00',
      images: 12,
      question: 'Rare pediatric soft tissue tumor identification'
    }
  ];

  const consultants = [
    {
      name: 'Dr. Expert',
      specialty: 'Dermatopathology',
      rating: 4.9,
      cases: 245,
      avgResponse: '2.3 hours',
      available: true
    },
    {
      name: 'Dr. Specialist',
      specialty: 'Hematopathology',
      rating: 4.8,
      cases: 189,
      avgResponse: '3.1 hours',
      available: true
    },
    {
      name: 'Dr. Pediatric',
      specialty: 'Pediatric Pathology',
      rating: 4.9,
      cases: 156,
      avgResponse: '1.8 hours',
      available: false
    }
  ];

  const educationalCases = [
    {
      title: 'Melanoma Pitfalls',
      specialty: 'Dermatopathology',
      cases: 25,
      difficulty: 'Advanced',
      rating: 4.7
    },
    {
      title: 'Lymphoma Morphology',
      specialty: 'Hematopathology',
      cases: 18,
      difficulty: 'Intermediate',
      rating: 4.5
    },
    {
      title: 'Pediatric Tumors',
      specialty: 'Pediatric Pathology',
      cases: 12,
      difficulty: 'Expert',
      rating: 4.8
    }
  ];

  const messages = [
    {
      sender: 'Dr. Smith',
      time: '14:30',
      message: 'Requesting consultation on atypical melanocytic lesion. Patient is 45-year-old male with changing mole.',
      type: 'request'
    },
    {
      sender: 'Dr. Expert',
      time: '15:15',
      message: 'Thank you for the consultation. Looking at the images now. Can you provide more clinical history about the lesion duration?',
      type: 'response'
    },
    {
      sender: 'Dr. Smith',
      time: '15:45',
      message: 'Lesion has been present for 6 months with recent change in color and asymmetry. No family history of melanoma.',
      type: 'reply'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Case Consultation</h3>
          <p className="text-gray-600">Expert opinions, collaboration, and educational resources</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Educational Cases
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Video Consult
          </Button>
          <Button className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Request Consultation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Consultation List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Active Consultations</CardTitle>
              <CardDescription className="text-xs">Expert opinion requests</CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                {consultations.map((consultation) => (
                  <div
                    key={consultation.id}
                    className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                      selectedConsultation === consultation.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedConsultation(consultation.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className={`text-xs ${
                        consultation.priority === 'STAT' ? 'border-red-500 text-red-700' :
                        consultation.priority === 'Urgent' ? 'border-orange-500 text-orange-700' :
                        'border-blue-500 text-blue-700'
                      }`}>
                        {consultation.priority}
                      </Badge>
                      <span className="text-xs text-gray-500">{consultation.images} images</span>
                    </div>
                    <h5 className="font-medium text-sm text-gray-900">{consultation.case}</h5>
                    <p className="text-xs text-gray-600">{consultation.patient}</p>
                    <p className="text-xs text-gray-500">{consultation.consultant}</p>
                    <Badge variant="outline" className={`mt-1 text-xs ${
                      consultation.status === 'Completed' ? 'border-green-500 text-green-700' :
                      consultation.status === 'In Progress' ? 'border-blue-500 text-blue-700' :
                      'border-orange-500 text-orange-700'
                    }`}>
                      {consultation.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Available Consultants</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-3">
                {consultants.map((consultant, index) => (
                  <div key={index} className="border rounded p-2">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">{consultant.name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs">{consultant.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">{consultant.specialty}</p>
                    <p className="text-xs text-gray-500">{consultant.cases} cases • {consultant.avgResponse}</p>
                    <Badge variant="outline" className={`mt-1 text-xs ${
                      consultant.available ? 'border-green-500 text-green-700' : 'border-gray-500 text-gray-700'
                    }`}>
                      {consultant.available ? 'Available' : 'Busy'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Consultation Details */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Consultation Details - {selectedConsultation}</CardTitle>
                  <CardDescription>Expert consultation and collaboration platform</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Case Summary */}
                <div className="border rounded p-4 bg-gray-50">
                  <h5 className="font-medium text-gray-900 mb-2">Case: Melanoma vs Nevus</h5>
                  <p className="text-sm text-gray-700 mb-2">
                    Atypical melanocytic lesion with concerning features. 45-year-old male with changing mole on back. 
                    Lesion shows asymmetry, irregular borders, and color variation.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Patient:</strong> John Doe</p>
                      <p><strong>Requested by:</strong> Dr. Smith</p>
                    </div>
                    <div>
                      <p><strong>Consultant:</strong> Dr. Expert</p>
                      <p><strong>Specialty:</strong> Dermatopathology</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="space-y-3">
                  <h6 className="font-medium text-gray-900">Consultation Messages</h6>
                  {messages.map((message, index) => (
                    <div key={index} className={`p-3 rounded ${
                      message.type === 'request' ? 'bg-blue-50 border-l-4 border-l-blue-500' :
                      message.type === 'response' ? 'bg-green-50 border-l-4 border-l-green-500' :
                      'bg-gray-50 border-l-4 border-l-gray-400'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">{message.sender}</p>
                        <span className="text-xs text-gray-500">{message.time}</span>
                      </div>
                      <p className="text-sm text-gray-700">{message.message}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Box */}
                <div className="border-t pt-4">
                  <Textarea
                    placeholder="Type your response or follow-up question..."
                    className="mb-3"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4" />
                        Attach Images
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                        View Case
                      </Button>
                    </div>
                    <Button size="sm" className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Send Reply
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image Gallery */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Case Images</CardTitle>
              <CardDescription className="text-xs">Shared diagnostic images</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="aspect-square bg-gray-200 rounded border flex items-center justify-center cursor-pointer hover:bg-gray-300">
                    <Camera className="h-8 w-8 text-gray-500" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Educational Resources */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Educational Cases</CardTitle>
              <CardDescription className="text-xs">Learning resources and case libraries</CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-3">
                {educationalCases.map((eduCase, index) => (
                  <div key={index} className="border rounded p-2">
                    <p className="text-sm font-medium text-gray-900">{eduCase.title}</p>
                    <p className="text-xs text-gray-600">{eduCase.specialty}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{eduCase.cases} cases</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs">{eduCase.rating}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className={`mt-1 text-xs ${
                      eduCase.difficulty === 'Expert' ? 'border-red-500 text-red-700' :
                      eduCase.difficulty === 'Advanced' ? 'border-orange-500 text-orange-700' :
                      'border-blue-500 text-blue-700'
                    }`}>
                      {eduCase.difficulty}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Consultation Stats</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">15</p>
                <p className="text-xs text-gray-600">Active Consultations</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center p-2 border rounded">
                  <p className="font-medium">2.4h</p>
                  <p className="text-gray-600">Avg Response</p>
                </div>
                <div className="text-center p-2 border rounded">
                  <p className="font-medium">98%</p>
                  <p className="text-gray-600">Satisfaction</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <Button size="sm" className="w-full flex items-center gap-2">
                <MessageSquare className="h-3 w-3" />
                New Consultation
              </Button>
              <Button size="sm" variant="outline" className="w-full flex items-center gap-2">
                <BookOpen className="h-3 w-3" />
                Browse Cases
              </Button>
              <Button size="sm" variant="outline" className="w-full flex items-center gap-2">
                <Users className="h-3 w-3" />
                Find Expert
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
