import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Plus, 
  Search, 
  Edit, 
  Copy,
  Trash2,
  Download,
  Upload,
  Settings,
  Eye,
  Star
} from 'lucide-react';

interface DocumentTemplate {
  id: string;
  name: string;
  type: 'form' | 'letter' | 'report' | 'contract';
  category: string;
  description: string;
  version: string;
  lastModified: string;
  usage: number;
  mergeFields: MergeField[];
  isPublic: boolean;
  createdBy: string;
}

interface MergeField {
  id: string;
  name: string;
  type: 'text' | 'date' | 'number' | 'boolean' | 'list';
  required: boolean;
  defaultValue?: string;
  options?: string[];
}

export const DocumentTemplates = () => {
  const [activeTab, setActiveTab] = useState('library');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templates: DocumentTemplate[] = [
    {
      id: 'tpl-1',
      name: 'Patient Consent Form',
      type: 'form',
      category: 'Medical Forms',
      description: 'Standard patient consent form for medical procedures',
      version: '2.1',
      lastModified: '2024-01-20',
      usage: 156,
      isPublic: true,
      createdBy: 'Dr. Smith',
      mergeFields: [
        { id: 'f1', name: 'patient_name', type: 'text', required: true },
        { id: 'f2', name: 'procedure_date', type: 'date', required: true },
        { id: 'f3', name: 'procedure_type', type: 'text', required: true },
        { id: 'f4', name: 'risks_explained', type: 'boolean', required: true }
      ]
    },
    {
      id: 'tpl-2',
      name: 'Discharge Summary',
      type: 'report',
      category: 'Medical Reports',
      description: 'Comprehensive discharge summary template',
      version: '1.3',
      lastModified: '2024-01-18',
      usage: 89,
      isPublic: true,
      createdBy: 'Nurse Johnson',
      mergeFields: [
        { id: 'f1', name: 'patient_name', type: 'text', required: true },
        { id: 'f2', name: 'admission_date', type: 'date', required: true },
        { id: 'f3', name: 'discharge_date', type: 'date', required: true },
        { id: 'f4', name: 'diagnosis', type: 'text', required: true },
        { id: 'f5', name: 'medications', type: 'list', required: false }
      ]
    }
  ];

  const categories = ['all', 'Medical Forms', 'Medical Reports', 'Legal Documents', 'Administrative'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Document Templates</h2>
          <p className="text-gray-600">Create, manage, and use document templates with merge fields</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Import Template
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Template
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="library">Template Library</TabsTrigger>
          <TabsTrigger value="builder">Template Builder</TabsTrigger>
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="library">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map(template => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div className="flex items-center gap-1">
                          <Badge variant="outline">{template.type}</Badge>
                          {template.isPublic && <Star className="h-4 w-4 text-yellow-500" />}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                      
                      <div className="space-y-2 text-xs text-gray-500">
                        <div className="flex justify-between">
                          <span>Version:</span>
                          <span>{template.version}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Usage:</span>
                          <span>{template.usage} times</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fields:</span>
                          <span>{template.mergeFields.length}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button size="sm" className="flex-1">Use Template</Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="builder">
          <Card>
            <CardHeader>
              <CardTitle>Template Builder</CardTitle>
              <CardDescription>Create new document templates with merge fields and formatting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Template Name</label>
                    <Input placeholder="Enter template name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select className="w-full px-3 py-2 border rounded-md">
                      <option>Medical Forms</option>
                      <option>Medical Reports</option>
                      <option>Legal Documents</option>
                      <option>Administrative</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea placeholder="Describe the template purpose" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Merge Fields</h4>
                    <Button size="sm" variant="outline">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Field
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: 'patient_name', type: 'Text', required: true },
                      { name: 'date', type: 'Date', required: true },
                      { name: 'doctor_name', type: 'Text', required: false }
                    ].map((field, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium text-sm">{field.name}</p>
                          <p className="text-xs text-gray-600">{field.type} • {field.required ? 'Required' : 'Optional'}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button>Save Template</Button>
                <Button variant="outline">Preview</Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Most Used Templates', count: 45, icon: Star },
              { name: 'Templates Created', count: 12, icon: Plus },
              { name: 'Total Usage', count: 1234, icon: FileText }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{stat.name}</p>
                        <p className="text-2xl font-bold">{stat.count}</p>
                      </div>
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
