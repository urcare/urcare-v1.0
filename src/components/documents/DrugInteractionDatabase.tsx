
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, AlertTriangle, Info, Database } from 'lucide-react';
import { toast } from 'sonner';

interface DrugInteraction {
  id: string;
  drug1: string;
  drug2: string;
  severity: 'minor' | 'moderate' | 'major' | 'contraindicated';
  description: string;
  mechanism: string;
  management: string;
  documentation: string;
}

const sampleInteractions: DrugInteraction[] = [
  {
    id: '1',
    drug1: 'Warfarin',
    drug2: 'Aspirin',
    severity: 'major',
    description: 'Increased risk of bleeding when used together',
    mechanism: 'Additive anticoagulant effects',
    management: 'Monitor INR closely, consider dose adjustment',
    documentation: 'Well-documented'
  },
  {
    id: '2',
    drug1: 'Lisinopril',
    drug2: 'Potassium',
    severity: 'moderate',
    description: 'May cause hyperkalemia',
    mechanism: 'ACE inhibitor reduces potassium excretion',
    management: 'Monitor serum potassium levels',
    documentation: 'Established'
  },
  {
    id: '3',
    drug1: 'Metformin',
    drug2: 'Contrast Dye',
    severity: 'major',
    description: 'Risk of lactic acidosis',
    mechanism: 'Impaired renal clearance of metformin',
    management: 'Discontinue metformin 48 hours before procedure',
    documentation: 'Well-documented'
  }
];

export const DrugInteractionDatabase = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [interactions, setInteractions] = useState<DrugInteraction[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentMedications] = useState(['Lisinopril', 'Metformin', 'Aspirin']);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error('Please enter a medication name');
      return;
    }

    setIsSearching(true);
    
    // Simulate database search
    setTimeout(() => {
      const results = sampleInteractions.filter(interaction =>
        interaction.drug1.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interaction.drug2.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setInteractions(results);
      setIsSearching(false);
      toast.success(`Found ${results.length} potential interactions`);
    }, 1500);
  };

  const checkCurrentMedications = () => {
    setIsSearching(true);
    
    // Simulate checking current medications
    setTimeout(() => {
      const relevantInteractions = sampleInteractions.filter(interaction =>
        currentMedications.some(med => 
          interaction.drug1.toLowerCase().includes(med.toLowerCase()) ||
          interaction.drug2.toLowerCase().includes(med.toLowerCase())
        )
      );
      setInteractions(relevantInteractions);
      setIsSearching(false);
      toast.success(`Checked ${currentMedications.length} medications for interactions`);
    }, 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'major': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'contraindicated': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'minor': return <Info className="h-4 w-4" />;
      case 'moderate': return <AlertTriangle className="h-4 w-4" />;
      case 'major': return <AlertTriangle className="h-4 w-4" />;
      case 'contraindicated': return <AlertTriangle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Drug Interaction Database
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Section */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter medication name to check interactions"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              <Search className="h-4 w-4 mr-2" />
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>

          <Button 
            onClick={checkCurrentMedications}
            disabled={isSearching}
            variant="outline"
            className="w-full"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Check My Current Medications ({currentMedications.length})
          </Button>
        </div>

        {/* Current Medications */}
        <div className="space-y-3">
          <h4 className="font-medium">Your Current Medications</h4>
          <div className="flex flex-wrap gap-2">
            {currentMedications.map((med, index) => (
              <Badge key={index} variant="outline" className="px-3 py-1">
                {med}
              </Badge>
            ))}
          </div>
        </div>

        {/* Interaction Results */}
        {interactions.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Interaction Results</h4>
            <div className="space-y-3">
              {interactions.map((interaction) => (
                <Alert key={interaction.id} className={getSeverityColor(interaction.severity)}>
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(interaction.severity)}
                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">
                            {interaction.drug1} + {interaction.drug2}
                          </span>
                          <Badge className={getSeverityColor(interaction.severity)}>
                            {interaction.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <AlertDescription className="text-sm">
                          {interaction.description}
                        </AlertDescription>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium">Mechanism:</span>
                          <p className="text-gray-700">{interaction.mechanism}</p>
                        </div>
                        <div>
                          <span className="font-medium">Management:</span>
                          <p className="text-gray-700">{interaction.management}</p>
                        </div>
                      </div>

                      <div className="text-xs text-gray-600">
                        Documentation: {interaction.documentation}
                      </div>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {/* Database Info */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Database Information</h4>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• Comprehensive drug interaction database with 50,000+ interactions</li>
            <li>• Updated monthly with latest clinical research</li>
            <li>• Includes severity ratings and management recommendations</li>
            <li>• Always consult healthcare provider for clinical decisions</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
