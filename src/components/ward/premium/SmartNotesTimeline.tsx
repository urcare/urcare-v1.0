
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Clock, User, Stethoscope, Activity, Plus, Filter } from 'lucide-react';

interface Note {
  id: string;
  type: 'progress' | 'assessment' | 'medication' | 'procedure' | 'discharge-planning' | 'family-communication';
  timestamp: string;
  author: string;
  authorRole: string;
  content: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  linkedTo?: string[];
  aiSuggestions?: string[];
}

interface PatientNotes {
  patientId: string;
  patientName: string;
  bedNumber: string;
  notes: Note[];
}

const mockPatientNotes: PatientNotes = {
  patientId: 'W001',
  patientName: 'John Smith',
  bedNumber: 'A-101',
  notes: [
    {
      id: 'N001',
      type: 'assessment',
      timestamp: '2024-01-22 08:00',
      author: 'Dr. Johnson',
      authorRole: 'Attending Physician',
      content: 'Patient shows significant improvement in respiratory status. O2 saturation stable at 98% on room air. Chest X-ray shows clearing of pneumonia. Plans to continue current antibiotic regimen.',
      tags: ['respiratory', 'improvement', 'pneumonia'],
      priority: 'medium',
      aiSuggestions: ['Consider pulmonary function tests before discharge', 'Schedule follow-up chest X-ray in 1 week']
    },
    {
      id: 'N002',
      type: 'medication',
      timestamp: '2024-01-22 06:30',
      author: 'Nurse Sarah',
      authorRole: 'RN',
      content: 'Administered morning medications as ordered. Patient tolerated well, no adverse reactions noted. Vital signs stable.',
      tags: ['medications', 'vital-signs', 'stable'],
      priority: 'low',
      linkedTo: ['N001']
    },
    {
      id: 'N003',
      type: 'progress',
      timestamp: '2024-01-21 20:00',
      author: 'Dr. Brown',
      authorRole: 'Resident',
      content: 'Evening rounds completed. Patient reports decreased cough and improved appetite. Ambulating independently. No acute concerns overnight.',
      tags: ['cough', 'appetite', 'ambulating'],
      priority: 'low'
    },
    {
      id: 'N004',
      type: 'discharge-planning',
      timestamp: '2024-01-21 14:00',
      author: 'Jane Wilson',
      authorRole: 'Discharge Coordinator',
      content: 'Discharge planning initiated. Home health services arranged. Patient education materials provided. Follow-up appointment scheduled with pulmonologist.',
      tags: ['discharge-planning', 'home-health', 'follow-up'],
      priority: 'high',
      aiSuggestions: ['Ensure inhaler technique demonstration', 'Provide emergency contact information']
    }
  ]
};

export const SmartNotesTimeline = () => {
  const [patientNotes, setPatientNotes] = useState<PatientNotes>(mockPatientNotes);
  const [newNote, setNewNote] = useState({
    type: 'progress' as const,
    content: '',
    tags: '',
    priority: 'medium' as const
  });
  const [filterType, setFilterType] = useState<string>('all');

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'assessment': return 'bg-blue-500 text-white';
      case 'progress': return 'bg-green-500 text-white';
      case 'medication': return 'bg-purple-500 text-white';
      case 'procedure': return 'bg-orange-500 text-white';
      case 'discharge-planning': return 'bg-indigo-500 text-white';
      case 'family-communication': return 'bg-pink-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'assessment': return <Stethoscope className="h-4 w-4" />;
      case 'progress': return <Activity className="h-4 w-4" />;
      case 'medication': return <FileText className="h-4 w-4" />;
      case 'procedure': return <Activity className="h-4 w-4" />;
      case 'discharge-planning': return <FileText className="h-4 w-4" />;
      case 'family-communication': return <User className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const filteredNotes = filterType === 'all' 
    ? patientNotes.notes 
    : patientNotes.notes.filter(note => note.type === filterType);

  const sortedNotes = [...filteredNotes].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const addNote = () => {
    const note: Note = {
      id: `N${Date.now()}`,
      type: newNote.type,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      author: 'Current User',
      authorRole: 'Healthcare Provider',
      content: newNote.content,
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      priority: newNote.priority
    };

    setPatientNotes(prev => ({
      ...prev,
      notes: [note, ...prev.notes]
    }));

    setNewNote({
      type: 'progress',
      content: '',
      tags: '',
      priority: 'medium'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Smart Notes Timeline - {patientNotes.patientName}
          </CardTitle>
          <CardDescription>
            AI-enhanced clinical notes with care continuity insights for Bed {patientNotes.bedNumber}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by note type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Notes</SelectItem>
                  <SelectItem value="assessment">Assessments</SelectItem>
                  <SelectItem value="progress">Progress Notes</SelectItem>
                  <SelectItem value="medication">Medications</SelectItem>
                  <SelectItem value="procedure">Procedures</SelectItem>
                  <SelectItem value="discharge-planning">Discharge Planning</SelectItem>
                  <SelectItem value="family-communication">Family Communication</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {sortedNotes.map((note, index) => (
              <div key={note.id} className="relative">
                {index !== sortedNotes.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200"></div>
                )}
                <Card className="ml-0">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className={`p-2 rounded-full ${getTypeColor(note.type)}`}>
                          {getTypeIcon(note.type)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getTypeColor(note.type)}>
                              {note.type.replace('-', ' ').toUpperCase()}
                            </Badge>
                            {note.priority === 'high' && (
                              <Badge variant="destructive" className="text-xs">HIGH PRIORITY</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="h-3 w-3" />
                            {note.timestamp}
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <User className="h-3 w-3" />
                            <span className="font-medium">{note.author}</span>
                            <span>({note.authorRole})</span>
                          </div>
                          <p className="text-gray-800">{note.content}</p>
                        </div>

                        {note.tags.length > 0 && (
                          <div className="mb-3">
                            <div className="flex flex-wrap gap-1">
                              {note.tags.map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {note.aiSuggestions && note.aiSuggestions.length > 0 && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-semibold text-blue-800 text-sm mb-2">💡 AI Suggestions</h4>
                            <ul className="list-disc list-inside text-sm text-blue-700">
                              {note.aiSuggestions.map((suggestion, suggestionIndex) => (
                                <li key={suggestionIndex}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {note.linkedTo && note.linkedTo.length > 0 && (
                          <div className="mt-2 text-xs text-gray-500">
                            Related to: {note.linkedTo.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Note
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Select value={newNote.type} onValueChange={(value: any) => setNewNote(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Note Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assessment">Assessment</SelectItem>
                    <SelectItem value="progress">Progress Note</SelectItem>
                    <SelectItem value="medication">Medication</SelectItem>
                    <SelectItem value="procedure">Procedure</SelectItem>
                    <SelectItem value="discharge-planning">Discharge Planning</SelectItem>
                    <SelectItem value="family-communication">Family Communication</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={newNote.priority} onValueChange={(value: any) => setNewNote(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Textarea
                placeholder="Enter note content..."
                value={newNote.content}
                onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
              />

              <Textarea
                placeholder="Tags (comma separated)..."
                value={newNote.tags}
                onChange={(e) => setNewNote(prev => ({ ...prev, tags: e.target.value }))}
                rows={2}
              />

              <Button 
                onClick={addNote}
                disabled={!newNote.content.trim()}
                className="w-full"
              >
                Add Note
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};
