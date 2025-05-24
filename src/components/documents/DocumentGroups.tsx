
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, FolderOpen, Calendar, Download, Eye } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  category: string;
  condition: string;
  date: Date;
  type: 'pdf' | 'image';
  size: string;
}

// Sample document data grouped by medical conditions
const sampleDocuments: Document[] = [
  {
    id: '1',
    name: 'Blood Test Results - Complete Metabolic Panel',
    category: 'Lab Results',
    condition: 'Diabetes Management',
    date: new Date('2024-01-15'),
    type: 'pdf',
    size: '245 KB'
  },
  {
    id: '2',
    name: 'Chest X-Ray Report',
    category: 'Imaging Reports',
    condition: 'Respiratory Health',
    date: new Date('2024-01-10'),
    type: 'pdf',
    size: '1.2 MB'
  },
  {
    id: '3',
    name: 'Metformin Prescription',
    category: 'Prescriptions',
    condition: 'Diabetes Management',
    date: new Date('2024-01-08'),
    type: 'image',
    size: '890 KB'
  },
  {
    id: '4',
    name: 'Cardiology Consultation Notes',
    category: 'Referrals',
    condition: 'Heart Health',
    date: new Date('2024-01-05'),
    type: 'pdf',
    size: '567 KB'
  },
  {
    id: '5',
    name: 'Annual Physical Exam Summary',
    category: 'General Medical',
    condition: 'Preventive Care',
    date: new Date('2023-12-20'),
    type: 'pdf',
    size: '1.8 MB'
  }
];

export const DocumentGroups = () => {
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Group documents by condition
  const documentsByCondition = sampleDocuments.reduce((acc, doc) => {
    if (!acc[doc.condition]) {
      acc[doc.condition] = [];
    }
    acc[doc.condition].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  // Get unique categories
  const categories = Array.from(new Set(sampleDocuments.map(doc => doc.category)));
  const conditions = Object.keys(documentsByCondition);

  const filteredDocuments = sampleDocuments.filter(doc => {
    const conditionMatch = selectedCondition === 'all' || doc.condition === selectedCondition;
    const categoryMatch = selectedCategory === 'all' || doc.category === selectedCategory;
    return conditionMatch && categoryMatch;
  });

  const handleViewDocument = (doc: Document) => {
    console.log('Viewing document:', doc.name);
    // In a real app, this would open the document viewer
  };

  const handleDownloadDocument = (doc: Document) => {
    console.log('Downloading document:', doc.name);
    // In a real app, this would trigger download
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Document Groups
          </CardTitle>
          <CardDescription>
            Documents automatically organized by medical condition and category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCondition} onValueChange={setSelectedCondition}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="all">All Conditions</TabsTrigger>
              {conditions.slice(0, 3).map(condition => (
                <TabsTrigger key={condition} value={condition}>
                  {condition.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mt-4 space-y-4">
              {/* Category Filter */}
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

              <TabsContent value="all" className="space-y-4">
                {Object.entries(documentsByCondition).map(([condition, docs]) => (
                  <Card key={condition}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{condition}</CardTitle>
                      <CardDescription>{docs.length} documents</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {docs.map(doc => (
                          <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="font-medium text-sm">{doc.name}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Badge variant="secondary" className="text-xs">
                                    {doc.category}
                                  </Badge>
                                  <span>{doc.date.toLocaleDateString()}</span>
                                  <span>{doc.size}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
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
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {conditions.map(condition => (
                <TabsContent key={condition} value={condition} className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{condition}</CardTitle>
                      <CardDescription>
                        {documentsByCondition[condition].length} documents in this condition
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {documentsByCondition[condition]
                          .filter(doc => selectedCategory === 'all' || doc.category === selectedCategory)
                          .map(doc => (
                            <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                              <div className="flex items-center gap-3">
                                <FileText className="h-4 w-4 text-gray-500" />
                                <div>
                                  <p className="font-medium text-sm">{doc.name}</p>
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Badge variant="secondary" className="text-xs">
                                      {doc.category}
                                    </Badge>
                                    <span>{doc.date.toLocaleDateString()}</span>
                                    <span>{doc.size}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
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
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
