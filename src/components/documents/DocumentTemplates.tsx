
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileTemplate, 
  Edit, 
  Copy, 
  Download, 
  Upload,
  Eye,
  Settings,
  Plus,
  Trash2,
  Save
} from 'lucide-react';

interface MergeField {
  id: string;
  name: string;
  type: 'text' | 'date' | 'number' | 'dropdown' | 'checkbox';
  defaultValue?: string;
  options?: string[];
  required: boolean;
}

interface DocumentTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  version: string;
  lastModified: string;
  author: string;
  usage: number;
  fields: MergeField[];
  previewUrl: string;
  outputFormats: string[];
}

export const DocumentTemplates = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const documentTemplates: DocumentTemplate[] = [
    {
      id: 'temp-1',
      name: 'Patient Consent Form',
      category: 'Consent Forms',
      description: 'Standard patient consent form for medical procedures',
      version: '2.1',
      lastModified: '2024-01-20',
      author: 'Legal Team',
      usage: 145,
      previewUrl: '/templates/consent-form.pdf',
      outputFormats: ['PDF', 'Word', 'HTML'],
      fields: [
        { id: 'f1', name: 'patient_name', type: 'text', required: true },
        { id: 'f2', name: 'patient_dob', type: 'date', required: true },
        { id: 'f3', name: 'procedure_type', type: 'dropdown', options: ['Surgery', 'Diagnostic', 'Treatment'], required: true },
        { id: 'f4', name: 'physician_name', type: 'text', required: true },
        { id: 'f5', name: 'consent_date', type: 'date', required: true }
      ]
    },
    {
      id: 'temp-2',
      name: 'Discharge Summary',
      category: 'Discharge Documents',
      description: 'Comprehensive discharge summary template',
      version: '3.0',
      lastModified: '2024-01-18',
      author: 'Dr. Smith',
      usage: 89,
      previewUrl: '/templates/discharge-summary.pdf',
      outputFormats: ['PDF', 'Word'],
      fields: [
        { id: 'f1', name: 'patient_name', type: 'text', required: true },
        { id: 'f2', name: 'admission_date', type: 'date', required: true },
        { id: 'f3', name: 'discharge_date', type: 'date', required: true },
        { id: 'f4', name: 'primary_diagnosis', type: 'text', required: true },
        { id: 'f5', name: 'medications', type: 'text', required: false },
        { id: 'f6', name: 'follow_up_required', type: 'checkbox', required: false }
      ]
    },
    {
      id: 'temp-3',
      name: 'Lab Report Template',
      category: 'Laboratory',
      description: 'Standard laboratory test report format',
      version: '1.5',
      lastModified: '2024-01-15',
      author: 'Lab Manager',
      usage: 234,
      previewUrl: '/templates/lab-report.pdf',
      outputFormats: ['PDF', 'Excel', 'CSV'],
      fields: [
        { id: 'f1', name: 'patient_id', type: 'text', required: true },
        { id: 'f2', name: 'test_date', type: 'date', required: true },
        { id: 'f3', name: 'test_type', type: 'dropdown', options: ['Blood Work', 'Urine Test', 'Imaging'], required: true },
        { id: 'f4', name: 'results', type: 'text', required: true },
        { id: 'f5', name: 'reference_range', type: 'text', required: false }
      ]
    }
  ];

  const templateCategories = [
    { name: 'All Templates', count: documentTemplates.length },
    { name: 'Consent Forms', count: 12 },
    { name: 'Discharge Documents', count: 8 },
    { name: 'Laboratory', count: 15 },
    { name: 'Prescription', count: 6 },
    { name: 'Insurance', count: 9 }
  ];

  const getFieldTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return '📝';
      case 'date': return '📅';
      case 'number': return '🔢';
      case 'dropdown': return '📋';
      case 'checkbox': return '☑️';
      default: return '📄';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Document Templates</h2>
          <p className="text-gray-600">Manage customizable templates with merge fields and versioning</p>
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
          <TabsTrigger value="templates">Template Library</TabsTrigger>
          <TabsTrigger value="editor">Template Editor</TabsTrigger>
          <TabsTrigger value="merge-fields">Merge Fields</TabsTrigger>
          <TabsTrigger value="versions">Version Management</TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Category Sidebar */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {templateCategories.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer"
                    >
                      <span className="text-sm font-medium">{category.name}</span>
                      <Badge variant="outline">{category.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Templates Grid */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center gap-4">
                <Input placeholder="Search templates..." className="flex-1" />
                <Button variant="outline">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {documentTemplates.map(template => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <FileTemplate className="h-8 w-8 text-blue-600" />
                          <Badge variant="outline">v{template.version}</Badge>
                        </div>
                        
                        <div>
                          <h3 className="font-medium">{template.name}</h3>
                          <p className="text-sm text-gray-600">{template.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>Category: {template.category}</span>
                            <span>Used {template.usage} times</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>Fields: {template.fields.length}</span>
                            <span>Updated: {template.lastModified}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {template.outputFormats.map(format => (
                              <Badge key={format} variant="outline" className="text-xs">
                                {format}
                              </Badge>
                            ))}
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
          </div>
        </TabsContent>

        <TabsContent value="editor">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Template Editor */}
            <Card>
              <CardHeader>
                <CardTitle>Template Editor</CardTitle>
                <CardDescription>Create and edit document templates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Template Name</label>
                    <Input defaultValue="Patient Consent Form" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select className="w-full border rounded px-3 py-2">
                      <option>Consent Forms</option>
                      <option>Discharge Documents</option>
                      <option>Laboratory</option>
                      <option>Prescription</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea 
                      className="w-full border rounded px-3 py-2 h-20 resize-none"
                      defaultValue="Standard patient consent form for medical procedures"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Template Content</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <FileTemplate className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600">Rich text editor would be displayed here</p>
                      <p className="text-sm text-gray-500">Drag merge fields into the document</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Preview</Button>
                  <Button className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Template
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Merge Fields Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Available Merge Fields</CardTitle>
                <CardDescription>Drag fields into your template</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add New Field
                  </Button>
                  
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {documentTemplates[0]?.fields.map(field => (
                      <div 
                        key={field.id}
                        className="flex items-center justify-between p-3 border rounded cursor-move hover:bg-gray-50"
                        draggable
                      >
                        <div className="flex items-center gap-2">
                          <span>{getFieldTypeIcon(field.type)}</span>
                          <div>
                            <p className="text-sm font-medium">{field.name}</p>
                            <p className="text-xs text-gray-600">{field.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {field.required && (
                            <Badge variant="outline" className="text-xs">Required</Badge>
                          )}
                          <Button size="sm" variant="ghost">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="merge-fields">
          <Card>
            <CardHeader>
              <CardTitle>Merge Field Configuration</CardTitle>
              <CardDescription>Configure dynamic content fields for templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Patient Consent Form Fields</h3>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Field
                  </Button>
                </div>

                <div className="space-y-4">
                  {documentTemplates[0]?.fields.map(field => (
                    <div key={field.id} className="p-4 border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Field Name</label>
                          <Input defaultValue={field.name} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Type</label>
                          <select className="w-full border rounded px-3 py-2" defaultValue={field.type}>
                            <option value="text">Text</option>
                            <option value="date">Date</option>
                            <option value="number">Number</option>
                            <option value="dropdown">Dropdown</option>
                            <option value="checkbox">Checkbox</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Default Value</label>
                          <Input defaultValue={field.defaultValue || ''} />
                        </div>
                        <div className="flex items-end gap-2">
                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              defaultChecked={field.required}
                              className="rounded"
                            />
                            <label className="text-sm">Required</label>
                          </div>
                          <Button size="sm" variant="outline" className="ml-auto">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {field.type === 'dropdown' && field.options && (
                        <div className="mt-3">
                          <label className="block text-sm font-medium mb-1">Options</label>
                          <div className="flex items-center gap-2">
                            <Input 
                              defaultValue={field.options.join(', ')} 
                              placeholder="Comma-separated options"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="versions">
          <Card>
            <CardHeader>
              <CardTitle>Template Version Management</CardTitle>
              <CardDescription>Track template versions and manage updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { version: '2.1', date: '2024-01-20', author: 'Legal Team', changes: 'Updated consent language', status: 'current' },
                  { version: '2.0', date: '2024-01-10', author: 'Legal Team', changes: 'Added HIPAA compliance section', status: 'archived' },
                  { version: '1.5', date: '2023-12-15', author: 'Dr. Smith', changes: 'Minor formatting updates', status: 'archived' },
                  { version: '1.0', date: '2023-11-01', author: 'Admin', changes: 'Initial template creation', status: 'archived' }
                ].map((version, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">v{version.version}</span>
                          <Badge className={version.status === 'current' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {version.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{version.changes}</p>
                        <p className="text-xs text-gray-500">{version.date} by {version.author}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3" />
                      </Button>
                      {version.status !== 'current' && (
                        <Button size="sm" variant="outline">
                          Restore
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
