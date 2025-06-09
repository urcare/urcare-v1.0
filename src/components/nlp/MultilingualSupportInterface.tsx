
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Languages,
  Globe,
  CheckCircle,
  AlertTriangle,
  Volume2,
  Copy,
  RefreshCw,
  Mic,
  FileText
} from 'lucide-react';

export const MultilingualSupportInterface = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);

  const supportedLanguages = [
    { code: 'en', name: 'English', medical: true },
    { code: 'es', name: 'Spanish', medical: true },
    { code: 'fr', name: 'French', medical: true },
    { code: 'de', name: 'German', medical: true },
    { code: 'it', name: 'Italian', medical: true },
    { code: 'pt', name: 'Portuguese', medical: true },
    { code: 'zh', name: 'Chinese', medical: true },
    { code: 'ja', name: 'Japanese', medical: false },
    { code: 'ar', name: 'Arabic', medical: true },
    { code: 'hi', name: 'Hindi', medical: false }
  ];

  const recentTranslations = [
    {
      id: 1,
      source: 'Patient reports severe chest pain radiating to left arm',
      target: 'El paciente reporta dolor severo en el pecho que se irradia al brazo izquierdo',
      sourceLang: 'en',
      targetLang: 'es',
      accuracy: 98.2,
      timestamp: '10:30 AM'
    },
    {
      id: 2,
      source: 'Administered 10mg morphine for pain management',
      target: 'Administré 10mg de morfina para el manejo del dolor',
      sourceLang: 'en',
      targetLang: 'es',
      accuracy: 97.8,
      timestamp: '10:25 AM'
    }
  ];

  const medicalTerminology = [
    { term: 'Hypertension', translations: { es: 'Hipertensión', fr: 'Hypertension', de: 'Bluthochdruck' } },
    { term: 'Diabetes', translations: { es: 'Diabetes', fr: 'Diabète', de: 'Diabetes' } },
    { term: 'Pneumonia', translations: { es: 'Neumonía', fr: 'Pneumonie', de: 'Lungenentzündung' } }
  ];

  const translate = async () => {
    if (!sourceText.trim()) return;
    
    setIsTranslating(true);
    
    // Simulate AI translation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock translation based on language pair
    const mockTranslations = {
      'en-es': 'El paciente presenta dolor agudo en el pecho que se irradia hacia el brazo izquierdo. Se recomienda evaluación cardíaca inmediata.',
      'en-fr': 'Le patient présente une douleur thoracique aiguë irradiant vers le bras gauche. Une évaluation cardiaque immédiate est recommandée.',
      'es-en': 'The patient presents acute chest pain radiating to the left arm. Immediate cardiac evaluation is recommended.'
    };
    
    const translationKey = `${sourceLanguage}-${targetLanguage}`;
    setTranslatedText(mockTranslations[translationKey] || 'Translation completed with medical terminology verification.');
    setIsTranslating(false);
  };

  const getLanguageName = (code) => {
    return supportedLanguages.find(lang => lang.code === code)?.name || code;
  };

  return (
    <div className="space-y-6">
      {/* Translation Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Medical Translation Interface
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Language Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Source Language</label>
                <select 
                  className="w-full p-2 border rounded"
                  value={sourceLanguage}
                  onChange={(e) => setSourceLanguage(e.target.value)}
                >
                  {supportedLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name} {lang.medical && '(Medical)'}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Language</label>
                <select 
                  className="w-full p-2 border rounded"
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                >
                  {supportedLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name} {lang.medical && '(Medical)'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Translation Input/Output */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Source Text ({getLanguageName(sourceLanguage)})</label>
                <Textarea
                  placeholder="Enter medical text to translate..."
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  className="min-h-32"
                />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Mic className="h-4 w-4 mr-2" />
                    Voice Input
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Translation ({getLanguageName(targetLanguage)})</label>
                <Textarea
                  placeholder="Translation will appear here..."
                  value={translatedText}
                  readOnly
                  className="min-h-32 bg-gray-50"
                />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={!translatedText}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" disabled={!translatedText}>
                    <Volume2 className="h-4 w-4 mr-2" />
                    Play Audio
                  </Button>
                </div>
              </div>
            </div>

            {/* Translation Controls */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button 
                  onClick={translate} 
                  disabled={!sourceText.trim() || isTranslating}
                  className="flex items-center gap-2"
                >
                  {isTranslating ? (
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  ) : (
                    <Languages className="h-4 w-4" />
                  )}
                  {isTranslating ? 'Translating...' : 'Translate'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const temp = sourceLanguage;
                    setSourceLanguage(targetLanguage);
                    setTargetLanguage(temp);
                    setSourceText(translatedText);
                    setTranslatedText('');
                  }}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              
              {translatedText && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-600">
                    98.2% accuracy
                  </Badge>
                  <Badge variant="outline" className="text-blue-600">
                    Medical verified
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical Terminology Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Medical Terminology Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input placeholder="Search medical terms..." />
            
            <div className="space-y-3">
              {medicalTerminology.map((item, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="font-medium mb-2">{item.term}</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(item.translations).map(([lang, translation]) => (
                      <div key={lang} className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {getLanguageName(lang)}
                        </Badge>
                        <span className="text-sm">{translation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Translations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Translations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTranslations.map((translation) => (
              <div key={translation.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {getLanguageName(translation.sourceLang)} → {getLanguageName(translation.targetLang)}
                    </Badge>
                    <span className="text-sm text-gray-600">{translation.timestamp}</span>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    {translation.accuracy}% accuracy
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Source:</span> {translation.source}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Translation:</span> {translation.target}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Language Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-sm text-gray-600">Supported Languages</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">98.2%</div>
            <div className="text-sm text-gray-600">Translation Accuracy</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">1,247</div>
            <div className="text-sm text-gray-600">Translations Today</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">5,680</div>
            <div className="text-sm text-gray-600">Medical Terms Verified</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
