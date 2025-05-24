
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Search, Filter, FileText, Download, Eye } from 'lucide-react';

interface TimelineDocument {
  id: string;
  name: string;
  category: string;
  condition: string;
  date: Date;
  doctor: string;
  hospital: string;
  summary: string;
  type: 'pdf' | 'image';
  urgent: boolean;
}

// Sample timeline data
const timelineDocuments: TimelineDocument[] = [
  {
    id: '1',
    name: 'Emergency Room Visit - Chest Pain',
    category: 'Emergency Records',
    condition: 'Heart Health',
    date: new Date('2024-01-20'),
    doctor: 'Dr. Smith',
    hospital: 'City General Hospital',
    summary: 'Chest pain evaluation, ECG normal, discharged with follow-up',
    type: 'pdf',
    urgent: true
  },
  {
    id: '2',
    name: 'Blood Test Results - Complete Panel',
    category: 'Lab Results',
    condition: 'Diabetes Management',
    date: new Date('2024-01-15'),
    doctor: 'Dr. Johnson',
    hospital: 'Health Center Labs',
    summary: 'HbA1c improved to 6.8%, cholesterol within range',
    type: 'pdf',
    urgent: false
  },
  {
    id: '3',
    name: 'Chest X-Ray Report',
    category: 'Imaging Reports',
    condition: 'Respiratory Health',
    date: new Date('2024-01-10'),
    doctor: 'Dr. Wilson',
    hospital: 'Imaging Center',
    summary: 'Clear lung fields, no acute findings',
    type: 'image',
    urgent: false
  },
  {
    id: '4',
    name: 'Prescription Update - Metformin',
    category: 'Prescriptions',
    condition: 'Diabetes Management',
    date: new Date('2024-01-08'),
    doctor: 'Dr. Johnson',
    hospital: 'Health Center',
    summary: 'Increased dosage to 1000mg twice daily',
    type: 'image',
    urgent: false
  },
  {
    id: '5',
    name: 'Cardiology Consultation',
    category: 'Specialist Reports',
    condition: 'Heart Health',
    date: new Date('2024-01-05'),
    doctor: 'Dr. Martinez',
    hospital: 'Heart Institute',
    summary: 'Routine follow-up, heart function normal',
    type: 'pdf',
    urgent: false
  }
];

export const DocumentTimeline = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUrgentOnly, setShowUrgentOnly] = useState(false);

  const categories = Array.from(new Set(timelineDocuments.map(doc => doc.category)));

  const filteredDocuments = timelineDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.condition.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesUrgent = !showUrgentOnly || doc.urgent;
    
    return matchesSearch && matchesCategory && matchesUrgent;
  });

  // Group by month for timeline display
  const groupedByMonth = filteredDocuments.reduce((acc, doc) => {
    const monthKey = doc.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(doc);
    return acc;
  }, {} as Record<string, TimelineDocument[]>);

  const handleViewDocument = (doc: TimelineDocument) => {
    console.log('Viewing document:', doc.name);
  };

  const handleDownloadDocument = (doc: TimelineDocument) => {
    console.log('Downloading document:', doc.name);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Medical Records Timeline
        </CardTitle>
        <CardDescription>
          Chronological view of all your medical documents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documents, doctors, conditions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={showUrgentOnly ? 'default' : 'outline'}
              onClick={() => setShowUrgentOnly(!showUrgentOnly)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Urgent Only
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory('all')}
            >
              All Categories
            </Badge>
            {categories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-6">
          {Object.entries(groupedByMonth).map(([month, docs]) => (
            <div key={month} className="space-y-4">
              <h3 className="font-semibold text-lg text-blue-600 border-b border-blue-200 pb-2">
                {month}
              </h3>
              
              <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                {docs.map((doc, index) => (
                  <div key={doc.id} className="relative">
                    {/* Timeline dot */}
                    <div className={`absolute -left-6 top-4 w-3 h-3 rounded-full border-2 border-white ${
                      doc.urgent ? 'bg-red-500' : 'bg-blue-500'
                    }`} />
                    
                    <Card className={`${doc.urgent ? 'border-red-200 bg-red-50' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <h4 className="font-medium">{doc.name}</h4>
                              {doc.urgent && (
                                <Badge variant="destructive" className="text-xs">
                                  Urgent
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>{doc.date.toLocaleDateString()}</span>
                              <span>•</span>
                              <span>{doc.doctor}</span>
                              <span>•</span>
                              <span>{doc.hospital}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {doc.category}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {doc.condition}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-gray-700">{doc.summary}</p>
                          </div>
                          
                          <div className="flex items-center gap-1 ml-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewDocument(doc)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDownloadDocument(doc)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No documents found matching your criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
