
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Highlight, Download, Share, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DischargeSummary {
  id: string;
  patientName: string;
  admissionDate: Date;
  dischargeDate: Date;
  primaryDiagnosis: string;
  secondaryDiagnoses: string[];
  procedures: string[];
  medications: string[];
  followUpInstructions: string[];
  dischargingPhysician: string;
  hospital: string;
  highlights: {
    critical: string[];
    medications: string[];
    followUp: string[];
  };
  fullText: string;
}

const sampleSummary: DischargeSummary = {
  id: '1',
  patientName: 'John Doe',
  admissionDate: new Date('2024-01-10'),
  dischargeDate: new Date('2024-01-15'),
  primaryDiagnosis: 'Acute Myocardial Infarction',
  secondaryDiagnoses: ['Hypertension', 'Type 2 Diabetes Mellitus'],
  procedures: ['Percutaneous Coronary Intervention', 'Cardiac Catheterization'],
  medications: ['Aspirin 81mg daily', 'Metoprolol 50mg twice daily', 'Atorvastatin 40mg daily'],
  followUpInstructions: [
    'Follow up with cardiologist in 1 week',
    'Cardiac rehabilitation program enrollment',
    'Blood pressure monitoring daily'
  ],
  dischargingPhysician: 'Dr. Sarah Johnson, MD',
  hospital: 'Central Medical Center',
  highlights: {
    critical: [
      'Patient experienced STEMI requiring emergency PCI',
      'No complications during procedure',
      'Ejection fraction improved to 55%'
    ],
    medications: [
      'Continue dual antiplatelet therapy for 12 months',
      'Monitor for bleeding complications',
      'Check liver function in 6 weeks due to statin therapy'
    ],
    followUp: [
      'URGENT: Cardiology follow-up within 7 days',
      'Schedule echocardiogram in 3 months',
      'Diabetes management with endocrinologist'
    ]
  },
  fullText: `DISCHARGE SUMMARY

Patient: John Doe
DOB: 01/15/1970
MRN: 123456789

ADMISSION DATE: January 10, 2024
DISCHARGE DATE: January 15, 2024

PRIMARY DIAGNOSIS: Acute ST-Elevation Myocardial Infarction (STEMI)

SECONDARY DIAGNOSES:
- Essential Hypertension
- Type 2 Diabetes Mellitus, controlled

HOSPITAL COURSE:
Mr. Doe presented to the emergency department with acute onset chest pain and was found to have ST-elevation in leads II, III, and aVF consistent with inferior STEMI. He was taken emergently to the cardiac catheterization laboratory where he underwent successful percutaneous coronary intervention to the right coronary artery with placement of a drug-eluting stent.

Post-procedure, the patient recovered well without complications. Serial echocardiograms showed improvement in left ventricular function with ejection fraction improving from 40% to 55%.

PROCEDURES:
- Cardiac catheterization with percutaneous coronary intervention
- Drug-eluting stent placement in right coronary artery

DISCHARGE MEDICATIONS:
- Aspirin 81mg daily
- Clopidogrel 75mg daily for 12 months
- Metoprolol succinate 50mg twice daily
- Atorvastatin 40mg daily
- Lisinopril 5mg daily

FOLLOW-UP INSTRUCTIONS:
- Follow up with cardiology within 1 week
- Enroll in cardiac rehabilitation program
- Monitor blood pressure daily
- Follow up with primary care physician in 2 weeks

DISCHARGE CONDITION: Stable

Electronically signed by:
Dr. Sarah Johnson, MD
Interventional Cardiology`
};

export const DischargeSummaryViewer = () => {
  const [summary, setSummary] = useState<DischargeSummary>(sampleSummary);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('highlights');

  const handleDownload = () => {
    const blob = new Blob([summary.fullText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `discharge-summary-${summary.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Discharge Summary',
        text: summary.fullText,
      });
    } else {
      navigator.clipboard.writeText(summary.fullText);
      alert('Summary copied to clipboard');
    }
  };

  const highlightText = (text: string, search: string) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200">{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Discharge Summary Viewer
              </CardTitle>
              <CardDescription>
                View and analyze discharge summaries with intelligent highlights
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleDownload} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={handleShare} variant="outline">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary Header */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-lg">{summary.patientName}</h3>
                <p className="text-gray-600">Primary Diagnosis: {summary.primaryDiagnosis}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  Admission: {summary.admissionDate.toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Discharge: {summary.dischargeDate.toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Physician: {summary.dischargingPhysician}
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search in discharge summary..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="highlights">
                <Highlight className="h-4 w-4 mr-2" />
                Key Highlights
              </TabsTrigger>
              <TabsTrigger value="structured">
                <FileText className="h-4 w-4 mr-2" />
                Structured View
              </TabsTrigger>
              <TabsTrigger value="full">
                <FileText className="h-4 w-4 mr-2" />
                Full Text
              </TabsTrigger>
            </TabsList>

            <TabsContent value="highlights" className="space-y-4">
              {/* Critical Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-red-600">Critical Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {summary.highlights.critical.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Badge variant="destructive" className="mt-1">!</Badge>
                        <span>{highlightText(item, searchTerm)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Medication Highlights */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-blue-600">Medication Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {summary.highlights.medications.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Badge variant="secondary" className="mt-1">Rx</Badge>
                        <span>{highlightText(item, searchTerm)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Follow-up Highlights */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-green-600">Follow-up Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {summary.highlights.followUp.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Badge className="mt-1">Action</Badge>
                        <span>{highlightText(item, searchTerm)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="structured" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Diagnoses */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Diagnoses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <Badge className="mb-1">Primary</Badge>
                        <p>{highlightText(summary.primaryDiagnosis, searchTerm)}</p>
                      </div>
                      <div>
                        <Badge variant="secondary" className="mb-1">Secondary</Badge>
                        <ul className="list-disc list-inside space-y-1">
                          {summary.secondaryDiagnoses.map((diagnosis, index) => (
                            <li key={index}>{highlightText(diagnosis, searchTerm)}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Procedures */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Procedures</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1">
                      {summary.procedures.map((procedure, index) => (
                        <li key={index}>{highlightText(procedure, searchTerm)}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Medications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Discharge Medications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1">
                      {summary.medications.map((medication, index) => (
                        <li key={index}>{highlightText(medication, searchTerm)}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Follow-up */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Follow-up Instructions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1">
                      {summary.followUpInstructions.map((instruction, index) => (
                        <li key={index}>{highlightText(instruction, searchTerm)}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="full">
              <Card>
                <CardContent className="pt-6">
                  <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {highlightText(summary.fullText, searchTerm)}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
