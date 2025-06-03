
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  FileText, 
  Download, 
  Mail,
  MessageSquare,
  Printer,
  Eye,
  Settings,
  Languages,
  MapPin
} from 'lucide-react';

interface LanguageConfig {
  code: string;
  name: string;
  localName: string;
  enabled: boolean;
  fontFamily: string;
  textDirection: 'ltr' | 'rtl';
}

interface BillTemplate {
  id: string;
  name: string;
  description: string;
  languages: string[];
  category: string;
}

export const MultiLingualBilling = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [previewMode, setPreviewMode] = useState(false);

  const languages: LanguageConfig[] = [
    {
      code: 'en',
      name: 'English',
      localName: 'English',
      enabled: true,
      fontFamily: 'Arial, sans-serif',
      textDirection: 'ltr'
    },
    {
      code: 'hi',
      name: 'Hindi',
      localName: 'हिंदी',
      enabled: true,
      fontFamily: 'Noto Sans Devanagari, Arial',
      textDirection: 'ltr'
    },
    {
      code: 'ta',
      name: 'Tamil',
      localName: 'தமிழ்',
      enabled: true,
      fontFamily: 'Noto Sans Tamil, Arial',
      textDirection: 'ltr'
    },
    {
      code: 'te',
      name: 'Telugu',
      localName: 'తెలుగు',
      enabled: false,
      fontFamily: 'Noto Sans Telugu, Arial',
      textDirection: 'ltr'
    },
    {
      code: 'kn',
      name: 'Kannada',
      localName: 'ಕನ್ನಡ',
      enabled: false,
      fontFamily: 'Noto Sans Kannada, Arial',
      textDirection: 'ltr'
    },
    {
      code: 'ml',
      name: 'Malayalam',
      localName: 'മലയാളം',
      enabled: false,
      fontFamily: 'Noto Sans Malayalam, Arial',
      textDirection: 'ltr'
    }
  ];

  const billTemplates: BillTemplate[] = [
    {
      id: 'BT001',
      name: 'Standard Medical Bill',
      description: 'General purpose medical billing template',
      languages: ['en', 'hi', 'ta'],
      category: 'General'
    },
    {
      id: 'BT002',
      name: 'Pharmacy Invoice',
      description: 'Pharmacy-specific billing format',
      languages: ['en', 'hi'],
      category: 'Pharmacy'
    },
    {
      id: 'BT003',
      name: 'Diagnostic Report Bill',
      description: 'Lab and diagnostic services billing',
      languages: ['en', 'ta', 'te'],
      category: 'Diagnostics'
    }
  ];

  const translationDatabase = {
    en: {
      'hospital_name': 'UrCare Medical Center',
      'bill_title': 'Medical Bill',
      'patient_name': 'Patient Name',
      'date': 'Date',
      'amount': 'Amount',
      'description': 'Description',
      'total': 'Total',
      'thank_you': 'Thank you for choosing our services'
    },
    hi: {
      'hospital_name': 'यूआरकेयर मेडिकल सेंटर',
      'bill_title': 'चिकित्सा बिल',
      'patient_name': 'रोगी का नाम',
      'date': 'दिनांक',
      'amount': 'राशि',
      'description': 'विवरण',
      'total': 'कुल',
      'thank_you': 'हमारी सेवाओं को चुनने के लिए धन्यवाद'
    },
    ta: {
      'hospital_name': 'யூஆர்கேர் மருத்துவ மையம்',
      'bill_title': 'மருத்துவ பில்',
      'patient_name': 'நோயாளியின் பெயர்',
      'date': 'தேதி',
      'amount': 'தொகை',
      'description': 'விவரம்',
      'total': 'மொத்தம்',
      'thank_you': 'எங்கள் சேவைகளை தேர்வு செய்ததற்கு நன்றி'
    }
  };

  const sampleBillData = {
    patientName: 'Rajesh Kumar',
    billNumber: 'URB-2024-001',
    date: '2024-06-05',
    items: [
      { description: 'Consultation', amount: 500 },
      { description: 'Blood Test', amount: 800 },
      { description: 'X-Ray', amount: 300 }
    ],
    total: 1600
  };

  const regionalFormats = {
    en: {
      currency: '₹',
      dateFormat: 'DD/MM/YYYY',
      numberFormat: 'en-IN'
    },
    hi: {
      currency: '₹',
      dateFormat: 'DD/MM/YYYY',
      numberFormat: 'hi-IN'
    },
    ta: {
      currency: '₹',
      dateFormat: 'DD/MM/YYYY',
      numberFormat: 'ta-IN'
    }
  };

  const getLanguageBadge = (enabled: boolean) => {
    return enabled ? (
      <Badge className="bg-green-100 text-green-800">Active</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
    );
  };

  const formatCurrency = (amount: number, langCode: string) => {
    const format = regionalFormats[langCode as keyof typeof regionalFormats];
    return new Intl.NumberFormat(format.numberFormat, {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const translate = (key: string, langCode: string) => {
    return translationDatabase[langCode as keyof typeof translationDatabase]?.[key as keyof typeof translationDatabase.en] || key;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Multi-Lingual Billing System</h2>
          <p className="text-gray-600">Generate bills and documents in multiple languages</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configure Languages
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <FileText className="w-4 h-4 mr-2" />
            Generate Bill
          </Button>
        </div>
      </div>

      {/* Language Selection & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="w-5 h-5" />
              Language Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {languages.filter(lang => lang.enabled).map((lang) => (
                <div
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedLanguage === lang.code ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{lang.name}</h4>
                      <p className="text-sm text-gray-600" style={{ fontFamily: lang.fontFamily }}>
                        {lang.localName}
                      </p>
                    </div>
                    {getLanguageBadge(lang.enabled)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Bill Preview - {languages.find(l => l.code === selectedLanguage)?.name}
            </CardTitle>
            <CardDescription>Live preview of bill in selected language</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-6 bg-white" style={{ 
              fontFamily: languages.find(l => l.code === selectedLanguage)?.fontFamily 
            }}>
              <div className="text-center border-b pb-4 mb-4">
                <h1 className="text-xl font-bold">{translate('hospital_name', selectedLanguage)}</h1>
                <h2 className="text-lg font-medium mt-2">{translate('bill_title', selectedLanguage)}</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">{translate('patient_name', selectedLanguage)}:</p>
                  <p className="font-medium">{sampleBillData.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{translate('date', selectedLanguage)}:</p>
                  <p className="font-medium">{sampleBillData.date}</p>
                </div>
              </div>
              
              <table className="w-full mb-4">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">{translate('description', selectedLanguage)}</th>
                    <th className="text-right py-2">{translate('amount', selectedLanguage)}</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleBillData.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{item.description}</td>
                      <td className="text-right py-2">{formatCurrency(item.amount, selectedLanguage)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-bold">
                    <td className="py-2">{translate('total', selectedLanguage)}</td>
                    <td className="text-right py-2">{formatCurrency(sampleBillData.total, selectedLanguage)}</td>
                  </tr>
                </tfoot>
              </table>
              
              <div className="text-center text-sm text-gray-600 mt-4">
                {translate('thank_you', selectedLanguage)}
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button size="sm" variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button size="sm" variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Language Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Language Configuration
          </CardTitle>
          <CardDescription>Manage supported languages and regional settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {languages.map((lang) => (
              <div key={lang.code} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{lang.name}</h4>
                    <p className="text-sm text-gray-600" style={{ fontFamily: lang.fontFamily }}>
                      {lang.localName}
                    </p>
                  </div>
                  {getLanguageBadge(lang.enabled)}
                </div>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Font: {lang.fontFamily.split(',')[0]}</p>
                  <p>Direction: {lang.textDirection.toUpperCase()}</p>
                </div>
                
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    Configure
                  </Button>
                  <Button 
                    size="sm" 
                    variant={lang.enabled ? "outline" : "default"}
                    className="text-xs"
                  >
                    {lang.enabled ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bill Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Multi-Lingual Templates
          </CardTitle>
          <CardDescription>Manage bill templates with language support</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {billTemplates.map((template) => (
              <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Supported Languages</p>
                    <div className="flex gap-1 mt-1">
                      {template.languages.map((langCode) => {
                        const lang = languages.find(l => l.code === langCode);
                        return (
                          <Badge key={langCode} variant="outline" className="text-xs">
                            {lang?.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Edit Template
                    </Button>
                    <Button size="sm" variant="outline">
                      Preview
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="outline" className="w-full mt-4">
            Create New Template
          </Button>
        </CardContent>
      </Card>

      {/* Regional Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Regional Formatting
          </CardTitle>
          <CardDescription>Configure regional number and date formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-3">Number Formats</h4>
              <div className="space-y-2">
                <p className="text-sm">English: {formatCurrency(12345.67, 'en')}</p>
                <p className="text-sm">Hindi: {formatCurrency(12345.67, 'hi')}</p>
                <p className="text-sm">Tamil: {formatCurrency(12345.67, 'ta')}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Date Formats</h4>
              <div className="space-y-2">
                <p className="text-sm">English: 05/06/2024</p>
                <p className="text-sm">Hindi: ०५/०६/२०२४</p>
                <p className="text-sm">Tamil: ०५/०६/२०२४</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Address Formats</h4>
              <div className="space-y-2">
                <p className="text-sm">Indian Standard</p>
                <p className="text-sm">International</p>
                <p className="text-sm">Regional Specific</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
