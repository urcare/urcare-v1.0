
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Download, Eye, Edit } from 'lucide-react';

interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'date' | 'number';
  label: string;
  required: boolean;
  options?: string[];
  value?: string;
}

interface AdmissionForm {
  id: string;
  name: string;
  department: string;
  fields: FormField[];
  status: 'draft' | 'active' | 'archived';
  createdBy: string;
  createdDate: string;
  usageCount: number;
}

const mockForms: AdmissionForm[] = [
  {
    id: 'FORM001',
    name: 'General Ward Admission',
    department: 'General Medicine',
    fields: [
      { id: 'f1', type: 'text', label: 'Patient Name', required: true },
      { id: 'f2', type: 'date', label: 'Date of Birth', required: true },
      { id: 'f3', type: 'select', label: 'Gender', required: true, options: ['Male', 'Female', 'Other'] },
      { id: 'f4', type: 'textarea', label: 'Chief Complaint', required: true },
      { id: 'f5', type: 'checkbox', label: 'Insurance Verified', required: false }
    ],
    status: 'active',
    createdBy: 'Dr. Smith',
    createdDate: '2024-01-20',
    usageCount: 45
  },
  {
    id: 'FORM002',
    name: 'ICU Admission Form',
    department: 'Intensive Care',
    fields: [
      { id: 'f1', type: 'text', label: 'Patient Name', required: true },
      { id: 'f2', type: 'select', label: 'Admission Source', required: true, options: ['Emergency', 'Ward Transfer', 'Direct'] },
      { id: 'f3', type: 'textarea', label: 'Critical Condition Details', required: true },
      { id: 'f4', type: 'checkbox', label: 'Ventilator Required', required: false }
    ],
    status: 'active',
    createdBy: 'Dr. Johnson',
    createdDate: '2024-01-18',
    usageCount: 23
  }
];

export const AdmissionFormGenerator = () => {
  const [forms, setForms] = useState<AdmissionForm[]>(mockForms);
  const [selectedForm, setSelectedForm] = useState<AdmissionForm | null>(null);
  const [newField, setNewField] = useState({
    type: 'text' as FormField['type'],
    label: '',
    required: false,
    options: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'archived': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const handleAddField = () => {
    if (!selectedForm || !newField.label) return;

    const field: FormField = {
      id: `f${Date.now()}`,
      type: newField.type,
      label: newField.label,
      required: newField.required,
      options: newField.options ? newField.options.split(',').map(o => o.trim()) : undefined
    };

    setSelectedForm({
      ...selectedForm,
      fields: [...selectedForm.fields, field]
    });

    setNewField({
      type: 'text',
      label: '',
      required: false,
      options: ''
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Admission Digital Form Generator
          </CardTitle>
          <CardDescription>
            Create and manage dynamic admission forms for different departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Forms List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Available Forms</h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  New Form
                </Button>
              </div>
              
              {forms.map((form) => (
                <Card key={form.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{form.name}</h4>
                      <Badge className={getStatusColor(form.status)}>
                        {form.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{form.department}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{form.fields.length} fields</span>
                      <span>Used {form.usageCount} times</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" onClick={() => setSelectedForm(form)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Form Editor */}
            {selectedForm && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Editing: {selectedForm.name}</h3>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Form Fields</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedForm.fields.map((field) => (
                      <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <span className="font-medium">{field.label}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{field.type}</Badge>
                            {field.required && <Badge variant="outline">Required</Badge>}
                          </div>
                        </div>
                        <Button size="sm" variant="destructive">Remove</Button>
                      </div>
                    ))}

                    <div className="border-t pt-4 space-y-3">
                      <h4 className="font-medium">Add New Field</h4>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="fieldType">Field Type</Label>
                          <Select value={newField.type} onValueChange={(value: FormField['type']) => setNewField(prev => ({ ...prev, type: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="textarea">Textarea</SelectItem>
                              <SelectItem value="select">Select</SelectItem>
                              <SelectItem value="checkbox">Checkbox</SelectItem>
                              <SelectItem value="date">Date</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="fieldLabel">Field Label</Label>
                          <Input
                            id="fieldLabel"
                            value={newField.label}
                            onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))}
                            placeholder="Enter field label"
                          />
                        </div>
                      </div>

                      {newField.type === 'select' && (
                        <div>
                          <Label htmlFor="fieldOptions">Options (comma-separated)</Label>
                          <Input
                            id="fieldOptions"
                            value={newField.options}
                            onChange={(e) => setNewField(prev => ({ ...prev, options: e.target.value }))}
                            placeholder="Option 1, Option 2, Option 3"
                          />
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="fieldRequired"
                          checked={newField.required}
                          onCheckedChange={(checked) => setNewField(prev => ({ ...prev, required: !!checked }))}
                        />
                        <Label htmlFor="fieldRequired">Required field</Label>
                      </div>

                      <Button onClick={handleAddField} disabled={!newField.label}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Field
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
