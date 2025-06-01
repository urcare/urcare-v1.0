
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Download, Upload, Copy, Star, Clock, User } from 'lucide-react';

interface NursingDocumentationTemplatesProps {
  nightMode: boolean;
}

export const NursingDocumentationTemplates = ({ nightMode }: NursingDocumentationTemplatesProps) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  const templates = [
    {
      id: 1,
      title: 'Admission Assessment',
      category: 'assessment',
      description: 'Comprehensive patient admission documentation',
      content: `Patient admitted to [Ward] at [Time] via [Route].\n\nChief Complaint: [Primary concern]\nHistory of Present Illness: [Details]\nPast Medical History: [Relevant history]\n\nVital Signs:\n- Temperature: [Temp]°F\n- Blood Pressure: [BP]\n- Heart Rate: [HR] bpm\n- Respiratory Rate: [RR]\n- Oxygen Saturation: [SpO2]%\n\nPhysical Assessment:\n- General Appearance: [Observations]\n- Cardiovascular: [Assessment]\n- Respiratory: [Assessment]\n- Neurological: [Assessment]\n- GI/GU: [Assessment]\n- Skin: [Assessment]\n\nPain Assessment: [0-10 scale, location, quality]\nMobility: [Ambulation status]\nSafety Measures: [Fall risk, precautions]\n\nNursing Diagnoses:\n1. [Primary diagnosis]\n2. [Secondary diagnosis]\n\nPlan of Care:\n- [Intervention 1]\n- [Intervention 2]\n- [Intervention 3]\n\nPatient/Family Education Provided: [Topics covered]\nDischarge Planning Initiated: [Y/N]\n\nNurse Signature: [Name], RN\nDate/Time: [Date/Time]`,
      usage: 45,
      lastModified: '2024-05-30',
      isStarred: true
    },
    {
      id: 2,
      title: 'Medication Administration',
      category: 'medication',
      description: 'Documentation for medication administration and monitoring',
      content: `Medication: [Drug name]\nDose: [Amount] [Route]\nTime: [Administration time]\nIndication: [Reason for medication]\n\nPre-Administration Assessment:\n- Vital Signs: [VS if applicable]\n- Pain Level: [0-10 scale]\n- Patient Condition: [Relevant assessment]\n- Allergies Verified: [Y/N]\n- Patient Identity Verified: [Y/N]\n\nAdministration:\n- Right Patient: ✓\n- Right Drug: ✓\n- Right Dose: ✓\n- Right Route: ✓\n- Right Time: ✓\n- Right Documentation: ✓\n\nPatient Response:\n- Immediate Response: [Observations]\n- Side Effects: [None/List]\n- Effectiveness: [Assessment]\n\nPost-Administration Monitoring:\n- 15 min: [Observations]\n- 30 min: [Observations]\n- 60 min: [Observations]\n\nPatient Education:\n- Purpose explained: [Y/N]\n- Side effects discussed: [Y/N]\n- Patient verbalized understanding: [Y/N]\n\nNurse Signature: [Name], RN\nDate/Time: [Date/Time]`,
      usage: 89,
      lastModified: '2024-05-28',
      isStarred: true
    },
    {
      id: 3,
      title: 'Shift Change Report',
      category: 'handoff',
      description: 'Standardized handoff communication template',
      content: `SBAR Handoff Report\n\nPatient: [Name] | Room: [Room] | Age: [Age]\nAdmission Date: [Date] | Diagnosis: [Primary/Secondary]\n\nSITUATION:\n- Current condition: [Stable/Critical/Improving]\n- Reason for admission: [Brief summary]\n- Current status: [Brief overview]\n\nBACKGROND:\n- Allergies: [List/NKDA]\n- Relevant medical history: [Key points]\n- Recent procedures: [Date/Type]\n- Code status: [Full/DNR/DNI]\n\nASSESSMENT:\n- Vital signs: T [Temp] BP [BP] HR [HR] RR [RR] SpO2 [O2Sat]\n- Pain level: [0-10 scale]\n- Neurological: [Alert/Oriented x3/Other]\n- Cardiovascular: [Regular rhythm/Other]\n- Respiratory: [Clear/Adventitious sounds]\n- GI/GU: [Appetite/Bowel sounds/Urine output]\n- Mobility: [Ambulatory/Assist/Bedbound]\n- Skin integrity: [Intact/Wounds]\n\nRECOMMENDATIONS:\n- Priority actions needed:\n  1. [Action 1]\n  2. [Action 2]\n  3. [Action 3]\n- Scheduled medications: [Next due]\n- Pending orders: [List]\n- Family concerns: [If any]\n- Discharge planning: [Status]\n\nSpecial Instructions: [Isolation/Fall risk/Other]\n\nReporting Nurse: [Name], RN\nReceiving Nurse: [Name], RN\nTime: [Date/Time]`,
      usage: 67,
      lastModified: '2024-05-25',
      isStarred: false
    },
    {
      id: 4,
      title: 'Wound Assessment',
      category: 'assessment',
      description: 'Comprehensive wound documentation template',
      content: `Wound Assessment Documentation\n\nWound Location: [Anatomical location]\nWound Type: [Surgical/Pressure/Traumatic/Other]\nOnset Date: [Date wound first noted]\n\nWound Characteristics:\n- Length: [cm] x Width: [cm] x Depth: [cm]\n- Shape: [Irregular/Round/Linear]\n- Edges: [Well-defined/Rolled/Undermined]\n- Wound bed: [% Granulation/% Slough/% Necrotic]\n- Drainage amount: [None/Scant/Moderate/Heavy]\n- Drainage type: [Serous/Sanguineous/Purulent]\n- Odor: [None/Mild/Moderate/Strong]\n\nPeriwound Skin:\n- Color: [Pink/Red/Dusky/Other]\n- Temperature: [Warm/Cool/Hot]\n- Edema: [None/Mild/Moderate/Severe]\n- Induration: [None/Present]\n- Maceration: [None/Present]\n\nPain Assessment:\n- Pain level: [0-10 scale]\n- Pain type: [Sharp/Dull/Burning/Throbbing]\n- Pain frequency: [Constant/Intermittent]\n\nTreatment:\n- Cleansing agent: [Saline/Other]\n- Dressing type: [Primary/Secondary]\n- Frequency: [Daily/BID/Other]\n- Next dressing change: [Date/Time]\n\nHealing Progress:\n- Compared to previous assessment: [Improved/Same/Worse]\n- Signs of infection: [None/Present - describe]\n- Healing stage: [Inflammatory/Proliferative/Maturation]\n\nPhotograph taken: [Y/N]\nMeasurement tool used: [Ruler/Wound measuring guide]\n\nNurse Signature: [Name], RN\nDate/Time: [Date/Time]`,
      usage: 34,
      lastModified: '2024-05-20',
      isStarred: false
    },
    {
      id: 5,
      title: 'Discharge Summary',
      category: 'discharge',
      description: 'Patient discharge documentation and instructions',
      content: `Discharge Summary\n\nPatient: [Name] | MRN: [Number] | DOB: [Date]\nAdmission Date: [Date] | Discharge Date: [Date]\nLength of Stay: [Days]\nDischarge Disposition: [Home/SNF/Rehab/Other]\n\nReason for Admission: [Primary diagnosis]\nSecondary Diagnoses: [List]\nProcedures Performed: [List with dates]\n\nHospital Course Summary:\n[Brief narrative of patient's stay, treatments, and progress]\n\nDischarge Condition:\n- Vital Signs: Stable\n- Pain Level: [0-10 scale]\n- Mobility: [Status]\n- Mental Status: [Alert and oriented]\n- Wounds/Incisions: [Status]\n\nDischarge Medications:\n[List with instructions]\n\nHome Care Instructions:\n- Activity Level: [Restrictions/Limitations]\n- Diet: [Regular/Restrictions]\n- Wound Care: [Instructions if applicable]\n- Bathing/Showering: [Instructions]\n- Driving: [Restrictions]\n- Work/School: [Return date]\n\nWarning Signs to Report:\n- [Sign 1]\n- [Sign 2]\n- [Sign 3]\n- Emergency contact: 911\n- Provider contact: [Phone number]\n\nFollow-up Appointments:\n- Primary Care: [Date/Time]\n- Specialist: [Date/Time if applicable]\n- Lab work: [Date if needed]\n\nEducation Provided:\n- Medication instructions: [Y/N]\n- Activity restrictions: [Y/N]\n- Diet modifications: [Y/N]\n- Warning signs: [Y/N]\n- Follow-up appointments: [Y/N]\n\nPatient/Family Understanding:\nPatient/family verbalized understanding of discharge instructions and demonstrated ability to manage care at home.\n\nDischarge Nurse: [Name], RN\nDate/Time: [Date/Time]`,
      usage: 23,
      lastModified: '2024-05-15',
      isStarred: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates', count: templates.length },
    { id: 'assessment', name: 'Assessment', count: templates.filter(t => t.category === 'assessment').length },
    { id: 'medication', name: 'Medication', count: templates.filter(t => t.category === 'medication').length },
    { id: 'handoff', name: 'Handoff', count: templates.filter(t => t.category === 'handoff').length },
    { id: 'discharge', name: 'Discharge', count: templates.filter(t => t.category === 'discharge').length }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const toggleStar = (templateId: number) => {
    // In a real app, this would update the template's starred status
    console.log(`Toggle star for template ${templateId}`);
  };

  const copyTemplate = (content: string) => {
    navigator.clipboard.writeText(content);
    // In a real app, show a toast notification
    console.log('Template copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6 text-cyan-600" />
          Nursing Documentation Templates
        </h2>
        <div className="flex gap-2">
          <Button className="bg-cyan-600 hover:bg-cyan-700">
            <Upload className="h-4 w-4 mr-2" />
            Upload Template
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      <Card className={nightMode ? 'bg-gray-800 border-gray-700' : ''}>
        <CardContent className="p-6">
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                {category.name}
                <Badge variant="secondary">{category.count}</Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template List */}
        <div className="space-y-4">
          <h3 className="font-medium">Available Templates</h3>
          {filteredTemplates.map(template => (
            <Card 
              key={template.id} 
              className={`${nightMode ? 'bg-gray-800 border-gray-700' : ''} cursor-pointer transition-all hover:shadow-md ${
                selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{template.title}</h4>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(template.id);
                      }}
                    >
                      <Star className={`h-4 w-4 ${template.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                    </Button>
                    <Badge variant="secondary">{template.category}</Badge>
                  </div>
                </div>
                <p className={`text-sm ${nightMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                  {template.description}
                </p>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Used {template.usage} times
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Modified {template.lastModified}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Template Preview/Editor */}
        <div className="space-y-4">
          <h3 className="font-medium">Template Preview</h3>
          {selectedTemplate ? (
            <Card className={nightMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {templates.find(t => t.id === selectedTemplate)?.title}
                    </CardTitle>
                    <p className={`text-sm ${nightMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {templates.find(t => t.id === selectedTemplate)?.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => copyTemplate(templates.find(t => t.id === selectedTemplate)?.content || '')}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={templates.find(t => t.id === selectedTemplate)?.content || ''}
                  className={`min-h-[400px] font-mono text-sm ${nightMode ? 'bg-gray-900' : ''}`}
                  readOnly
                />
                <div className="flex gap-2 mt-4">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Use Template
                  </Button>
                  <Button variant="outline">
                    Save as New
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className={`${nightMode ? 'bg-gray-800 border-gray-700' : ''} border-dashed`}>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className={`${nightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Select a template to preview its content
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Card className={nightMode ? 'bg-gray-800 border-gray-700' : ''}>
        <CardHeader>
          <CardTitle>Template Usage Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className={`p-4 ${nightMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg`}>
              <div className="text-2xl font-bold text-blue-600">{templates.length}</div>
              <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-blue-800'}`}>Total Templates</p>
            </div>
            <div className={`p-4 ${nightMode ? 'bg-gray-700' : 'bg-green-50'} rounded-lg`}>
              <div className="text-2xl font-bold text-green-600">
                {templates.filter(t => t.isStarred).length}
              </div>
              <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-green-800'}`}>Starred Templates</p>
            </div>
            <div className={`p-4 ${nightMode ? 'bg-gray-700' : 'bg-yellow-50'} rounded-lg`}>
              <div className="text-2xl font-bold text-yellow-600">
                {Math.round(templates.reduce((sum, t) => sum + t.usage, 0) / templates.length)}
              </div>
              <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-yellow-800'}`}>Avg Usage</p>
            </div>
            <div className={`p-4 ${nightMode ? 'bg-gray-700' : 'bg-purple-50'} rounded-lg`}>
              <div className="text-2xl font-bold text-purple-600">
                {templates.reduce((sum, t) => sum + t.usage, 0)}
              </div>
              <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-purple-800'}`}>Total Uses</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
