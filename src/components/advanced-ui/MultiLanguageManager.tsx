
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, 
  Languages, 
  Download, 
  Upload,
  Calendar,
  MapPin,
  FileText,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
  translationProgress: number;
  medicalTerms: number;
}

interface LocalizationSettings {
  primaryLanguage: string;
  fallbackLanguage: string;
  autoDetect: boolean;
  rtlSupport: boolean;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  numberFormat: string;
}

export const MultiLanguageManager = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [settings, setSettings] = useState<LocalizationSettings>({
    primaryLanguage: 'en',
    fallbackLanguage: 'en',
    autoDetect: true,
    rtlSupport: true,
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    currency: 'USD',
    numberFormat: 'US'
  });

  const [translationProgress, setTranslationProgress] = useState(0);
  const [isTranslating, setIsTranslating] = useState(false);

  const supportedLanguages: Language[] = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      rtl: false,
      translationProgress: 100,
      medicalTerms: 15420
    },
    {
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      flag: '🇪🇸',
      rtl: false,
      translationProgress: 95,
      medicalTerms: 14650
    },
    {
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      flag: '🇫🇷',
      rtl: false,
      translationProgress: 87,
      medicalTerms: 13400
    },
    {
      code: 'de',
      name: 'German',
      nativeName: 'Deutsch',
      flag: '🇩🇪',
      rtl: false,
      translationProgress: 92,
      medicalTerms: 14200
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      flag: '🇸🇦',
      rtl: true,
      translationProgress: 78,
      medicalTerms: 12000
    },
    {
      code: 'zh',
      name: 'Chinese',
      nativeName: '中文',
      flag: '🇨🇳',
      rtl: false,
      translationProgress: 85,
      medicalTerms: 13100
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      flag: '🇮🇳',
      rtl: false,
      translationProgress: 72,
      medicalTerms: 11100
    },
    {
      code: 'pt',
      name: 'Portuguese',
      nativeName: 'Português',
      flag: '🇧🇷',
      rtl: false,
      translationProgress: 89,
      medicalTerms: 13700
    }
  ];

  const dateFormats = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (EU)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' },
    { value: 'DD.MM.YYYY', label: 'DD.MM.YYYY (German)' }
  ];

  const currencies = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'JPY', label: 'Japanese Yen (¥)' },
    { value: 'INR', label: 'Indian Rupee (₹)' }
  ];

  const handleLanguageChange = (languageCode: string) => {
    const language = supportedLanguages.find(lang => lang.code === languageCode);
    if (!language) return;

    setCurrentLanguage(languageCode);
    updateSettings('primaryLanguage', languageCode);
    
    // Apply RTL if needed
    const root = document.documentElement;
    if (language.rtl) {
      root.setAttribute('dir', 'rtl');
      root.classList.add('rtl');
    } else {
      root.setAttribute('dir', 'ltr');
      root.classList.remove('rtl');
    }
    
    toast.success(`Language changed to ${language.name}`);
  };

  const updateSettings = (key: keyof LocalizationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success(`${key} updated`);
  };

  const downloadTranslationFile = (languageCode: string) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'Downloading translation file...',
        success: 'Translation file downloaded',
        error: 'Download failed'
      }
    );
  };

  const uploadTranslationFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.po,.xliff';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast.success(`Translation file ${file.name} uploaded`);
      }
    };
    input.click();
  };

  const runAutoTranslation = () => {
    setIsTranslating(true);
    setTranslationProgress(0);
    
    const interval = setInterval(() => {
      setTranslationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTranslating(false);
          toast.success('Auto-translation completed');
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const exportTranslations = () => {
    toast.success('Translation export initiated');
  };

  const getCurrentLanguage = () => {
    return supportedLanguages.find(lang => lang.code === currentLanguage);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Multi-Language Management</h2>
          <p className="text-muted-foreground">Internationalization and localization settings</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Current:</span>
          <Badge className="flex items-center gap-2">
            <span>{getCurrentLanguage()?.flag}</span>
            {getCurrentLanguage()?.name}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              Language Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Primary Language</label>
              <Select value={currentLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supportedLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                        <span className="text-muted-foreground">({lang.nativeName})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fallback Language</label>
              <Select value={settings.fallbackLanguage} onValueChange={(value) => updateSettings('fallbackLanguage', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supportedLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-medium">Auto-detect Language</span>
                <p className="text-sm text-muted-foreground">Detect language from browser settings</p>
              </div>
              <Switch
                checked={settings.autoDetect}
                onCheckedChange={(value) => updateSettings('autoDetect', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-medium">RTL Support</span>
                <p className="text-sm text-muted-foreground">Right-to-left language support</p>
              </div>
              <Switch
                checked={settings.rtlSupport}
                onCheckedChange={(value) => updateSettings('rtlSupport', value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Localization Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Regional Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date Format
              </label>
              <Select value={settings.dateFormat} onValueChange={(value) => updateSettings('dateFormat', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dateFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Time Format</label>
              <Select value={settings.timeFormat} onValueChange={(value) => updateSettings('timeFormat', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                  <SelectItem value="24h">24-hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Currency</label>
              <Select value={settings.currency} onValueChange={(value) => updateSettings('currency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Number Format</label>
              <Select value={settings.numberFormat} onValueChange={(value) => updateSettings('numberFormat', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">US (1,234.56)</SelectItem>
                  <SelectItem value="EU">European (1.234,56)</SelectItem>
                  <SelectItem value="IN">Indian (1,23,456.78)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Translation Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Translation Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isTranslating && (
            <div className="p-4 bg-blue-50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Auto-translation in progress...</span>
                <span className="text-sm">{translationProgress}%</span>
              </div>
              <Progress value={translationProgress} className="h-2" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {supportedLanguages.map((lang) => (
              <div key={lang.code} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{lang.flag}</span>
                    <div>
                      <h4 className="font-medium">{lang.name}</h4>
                      <p className="text-sm text-muted-foreground">{lang.nativeName}</p>
                    </div>
                  </div>
                  {lang.rtl && <Badge variant="secondary">RTL</Badge>}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Translation Progress</span>
                    <span>{lang.translationProgress}%</span>
                  </div>
                  <Progress value={lang.translationProgress} className="h-2" />
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Medical Terms: {lang.medicalTerms.toLocaleString()}
                </div>
                
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadTranslationFile(lang.code)}
                    className="flex-1"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  {lang.translationProgress < 100 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={runAutoTranslation}
                      disabled={isTranslating}
                      className="flex-1"
                    >
                      <Languages className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={uploadTranslationFile} variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Translation
            </Button>
            <Button onClick={runAutoTranslation} disabled={isTranslating}>
              <Languages className="h-4 w-4 mr-2" />
              Auto-Translate Missing
            </Button>
            <Button onClick={exportTranslations} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
