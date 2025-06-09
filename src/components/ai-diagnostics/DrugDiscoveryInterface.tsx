
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FlaskConical,
  Atom,
  Network,
  Target,
  Search,
  Download,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Zap
} from 'lucide-react';

export const DrugDiscoveryInterface = () => {
  const [selectedCompound, setSelectedCompound] = useState(null);
  const [compoundAnalysis] = useState([
    {
      id: 'CPD-001',
      name: 'Compound Alpha-47',
      structure: 'C18H21NO3',
      targetProtein: 'EGFR',
      bindingAffinity: 8.7,
      drugLikeness: 0.82,
      toxicity: 'Low',
      confidence: 94.3
    },
    {
      id: 'CPD-002',
      name: 'Beta-Lactam-23',
      structure: 'C16H19N2O4',
      targetProtein: 'PD-L1',
      bindingAffinity: 7.2,
      drugLikeness: 0.76,
      toxicity: 'Medium',
      confidence: 89.1
    },
    {
      id: 'CPD-003',
      name: 'Quinoline-89',
      structure: 'C20H24N3O2',
      targetProtein: 'VEGFR2',
      bindingAffinity: 9.1,
      drugLikeness: 0.88,
      toxicity: 'Low',
      confidence: 96.7
    }
  ]);

  const [molecularProperties] = useState({
    molecularWeight: 327.4,
    logP: 3.2,
    hbdCount: 2,
    hbaCount: 5,
    tpsa: 87.3,
    rotableBonds: 6
  });

  const [interactions] = useState([
    { residue: 'Lys745', type: 'Hydrogen Bond', distance: '2.1 Å', strength: 'Strong' },
    { residue: 'Met790', type: 'Hydrophobic', distance: '3.4 Å', strength: 'Medium' },
    { residue: 'Cys797', type: 'Covalent', distance: '1.8 Å', strength: 'Very Strong' },
    { residue: 'Asp855', type: 'Electrostatic', distance: '2.7 Å', strength: 'Strong' }
  ]);

  const getToxicityColor = (toxicity) => {
    switch (toxicity) {
      case 'High': return 'border-red-300 text-red-700 bg-red-50';
      case 'Medium': return 'border-yellow-300 text-yellow-700 bg-yellow-50';
      case 'Low': return 'border-green-300 text-green-700 bg-green-50';
      default: return 'border-gray-300 text-gray-700 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Drug Discovery Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Compound Library
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Kinase Inhibitors
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Antibody Conjugates
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Small Molecules
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Target Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Atom className="h-4 w-4 mr-2" />
                Binding Site
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Network className="h-4 w-4 mr-2" />
                Interactions
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Affinity
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5" />
              Analysis Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                ADMET Prediction
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Toxicity Screen
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Drug Likeness
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Research Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                Run Analysis
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" className="w-full">
                <CheckCircle className="h-4 w-4 mr-2" />
                Save Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Molecular Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3D Molecular Viewer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Atom className="h-5 w-5" />
              Molecular Structure Viewer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative border rounded-lg bg-gray-900 h-80 flex items-center justify-center">
              <div className="text-white text-center">
                <Atom className="h-16 w-16 mx-auto mb-4 opacity-60 animate-spin" />
                <div className="text-lg">3D Molecular Structure</div>
                <div className="text-sm opacity-75">Interactive Visualization</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-2">
                <Button size="sm" variant="outline">Rotate</Button>
                <Button size="sm" variant="outline">Zoom</Button>
                <Button size="sm" variant="outline">Bonds</Button>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">Reset</Button>
                <Button size="sm" variant="outline">Export</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Protein-Drug Interaction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Protein-Drug Interactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {interactions.map((interaction, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{interaction.residue}</div>
                    <Badge variant="outline" className={
                      interaction.strength === 'Very Strong' ? 'border-green-300 text-green-700' :
                      interaction.strength === 'Strong' ? 'border-blue-300 text-blue-700' :
                      'border-yellow-300 text-yellow-700'
                    }>
                      {interaction.strength}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Type:</span> {interaction.type}
                    </div>
                    <div>
                      <span className="text-gray-600">Distance:</span> {interaction.distance}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compound Analysis Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Compound Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {compoundAnalysis.map((compound) => (
              <div key={compound.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-medium">{compound.name}</div>
                    <div className="text-sm text-gray-600">ID: {compound.id} | Structure: {compound.structure}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getToxicityColor(compound.toxicity)}>
                      {compound.toxicity} Toxicity
                    </Badge>
                    <Badge variant="outline" className="border-blue-300 text-blue-700">
                      {compound.confidence}% Confidence
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{compound.bindingAffinity}</div>
                    <div className="text-sm text-gray-600">Binding Affinity (pKd)</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{compound.drugLikeness}</div>
                    <div className="text-sm text-gray-600">Drug Likeness</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">{compound.targetProtein}</div>
                    <div className="text-sm text-gray-600">Target Protein</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-lg font-bold text-orange-600">{compound.confidence}%</div>
                    <div className="text-sm text-gray-600">AI Confidence</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm">
                    <Atom className="h-3 w-3 mr-1" />
                    View Structure
                  </Button>
                  <Button size="sm" variant="outline">
                    <Network className="h-3 w-3 mr-1" />
                    Interactions
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Molecular Properties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5" />
            Molecular Properties & ADMET Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <div className="text-lg font-bold text-blue-600">{molecularProperties.molecularWeight}</div>
              <div className="text-sm text-gray-600">Molecular Weight (Da)</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-lg font-bold text-green-600">{molecularProperties.logP}</div>
              <div className="text-sm text-gray-600">LogP</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-lg font-bold text-purple-600">{molecularProperties.hbdCount}</div>
              <div className="text-sm text-gray-600">HBD Count</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-lg font-bold text-orange-600">{molecularProperties.hbaCount}</div>
              <div className="text-sm text-gray-600">HBA Count</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-lg font-bold text-red-600">{molecularProperties.tpsa}</div>
              <div className="text-sm text-gray-600">TPSA (Ų)</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-lg font-bold text-cyan-600">{molecularProperties.rotableBonds}</div>
              <div className="text-sm text-gray-600">Rotatable Bonds</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
