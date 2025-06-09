
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dna,
  Search,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Download,
  Zap,
  Activity,
  Shield
} from 'lucide-react';

export const GenomicsAnalysisDashboard = () => {
  const [selectedGenome, setSelectedGenome] = useState(null);
  const [variantAnalysis] = useState([
    {
      id: 'VAR-001',
      gene: 'BRCA1',
      variant: 'c.5266dupC',
      type: 'Pathogenic',
      chromosome: '17',
      position: '41234470',
      significance: 'High',
      alleleFrequency: 0.0001,
      confidence: 99.2
    },
    {
      id: 'VAR-002',
      gene: 'TP53',
      variant: 'c.742C>T',
      type: 'Likely Pathogenic',
      chromosome: '17',
      position: '7577120',
      significance: 'Medium',
      alleleFrequency: 0.0023,
      confidence: 94.7
    },
    {
      id: 'VAR-003',
      gene: 'APOE',
      variant: 'c.388T>C',
      type: 'Risk Factor',
      chromosome: '19',
      position: '45411941',
      significance: 'Low',
      alleleFrequency: 0.137,
      confidence: 89.4
    }
  ]);

  const [hereditaryRisk] = useState([
    { condition: 'Breast Cancer', risk: 87, baseline: 12, genes: ['BRCA1', 'BRCA2'] },
    { condition: 'Ovarian Cancer', risk: 44, baseline: 1.3, genes: ['BRCA1', 'BRCA2'] },
    { condition: 'Colorectal Cancer', risk: 15, baseline: 4.3, genes: ['MLH1', 'MSH2'] },
    { condition: "Alzheimer's Disease", risk: 23, baseline: 11, genes: ['APOE'] }
  ]);

  const [pharmacogenomics] = useState([
    {
      drug: 'Warfarin',
      gene: 'CYP2C9',
      genotype: '*1/*3',
      metabolism: 'Intermediate',
      recommendation: 'Reduce dose by 25-50%',
      confidence: 96.8
    },
    {
      drug: 'Clopidogrel',
      gene: 'CYP2C19',
      genotype: '*2/*17',
      metabolism: 'Poor/Rapid',
      recommendation: 'Consider alternative therapy',
      confidence: 94.2
    },
    {
      drug: 'Simvastatin',
      gene: 'SLCO1B1',
      genotype: '*1/*5',
      metabolism: 'Decreased function',
      recommendation: 'Monitor for myopathy',
      confidence: 91.5
    }
  ]);

  const getSignificanceColor = (significance) => {
    switch (significance) {
      case 'High': return 'border-red-300 text-red-700 bg-red-50';
      case 'Medium': return 'border-yellow-300 text-yellow-700 bg-yellow-50';
      case 'Low': return 'border-green-300 text-green-700 bg-green-50';
      default: return 'border-gray-300 text-gray-700 bg-gray-50';
    }
  };

  const getRiskColor = (risk, baseline) => {
    const foldIncrease = risk / baseline;
    if (foldIncrease > 5) return 'text-red-600';
    if (foldIncrease > 2) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Genomics Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Sample Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Whole Exome Seq
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Targeted Panel
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Pharmacogenomics
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Analysis Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Dna className="h-4 w-4 mr-2" />
                Variant Calling
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Risk Assessment
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Activity className="h-4 w-4 mr-2" />
                Pharmacogenomics
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Quality Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">98.7%</div>
                <div className="text-sm text-gray-600">Coverage</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">Q30</div>
                <div className="text-sm text-gray-600">Quality Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                Analyze
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export VCF
              </Button>
              <Button variant="outline" className="w-full">
                <CheckCircle className="h-4 w-4 mr-2" />
                Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Variant Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dna className="h-5 w-5" />
            Genetic Variant Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {variantAnalysis.map((variant) => (
              <div key={variant.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-medium">{variant.gene} - {variant.variant}</div>
                    <div className="text-sm text-gray-600">
                      Chr{variant.chromosome}:{variant.position} | ID: {variant.id}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getSignificanceColor(variant.significance)}>
                      {variant.type}
                    </Badge>
                    <Badge variant="outline" className="border-blue-300 text-blue-700">
                      {variant.confidence}% Confidence
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{variant.gene}</div>
                    <div className="text-sm text-gray-600">Gene</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{variant.chromosome}</div>
                    <div className="text-sm text-gray-600">Chromosome</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">{variant.alleleFrequency}</div>
                    <div className="text-sm text-gray-600">Allele Frequency</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-lg font-bold text-orange-600">{variant.significance}</div>
                    <div className="text-sm text-gray-600">Clinical Significance</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm">
                    <Target className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Risk Analysis
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

      {/* Hereditary Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Hereditary Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hereditaryRisk.map((risk, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium">{risk.condition}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {(risk.risk / risk.baseline).toFixed(1)}x increased risk
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className={`text-2xl font-bold ${getRiskColor(risk.risk, risk.baseline)}`}>
                      {risk.risk}%
                    </div>
                    <div className="text-sm text-gray-600">Your Risk</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">{risk.baseline}%</div>
                    <div className="text-sm text-gray-600">Average Risk</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{risk.genes.join(', ')}</div>
                    <div className="text-sm text-gray-600">Associated Genes</div>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className={`h-3 rounded-full ${
                      risk.risk / risk.baseline > 5 ? 'bg-red-500' :
                      risk.risk / risk.baseline > 2 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(100, (risk.risk / risk.baseline) * 20)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pharmacogenomics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Pharmacogenomics Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pharmacogenomics.map((pgx, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium">{pgx.drug}</div>
                  <Badge variant="outline" className="border-blue-300 text-blue-700">
                    {pgx.confidence}% Confidence
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600">Gene</div>
                    <div className="font-medium">{pgx.gene}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Genotype</div>
                    <div className="font-medium">{pgx.genotype}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Metabolism</div>
                    <div className="font-medium">{pgx.metabolism}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Recommendation</div>
                    <div className="font-medium text-blue-600">{pgx.recommendation}</div>
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">
                      Clinical consideration required for optimal dosing
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personalized Medicine Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Personalized Medicine Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <div className="font-medium text-blue-800">Targeted Screening</div>
                </div>
                <div className="text-sm text-blue-700">
                  Enhanced screening for breast and ovarian cancers based on BRCA1 variant
                </div>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="font-medium text-green-800">Preventive Measures</div>
                </div>
                <div className="text-sm text-green-700">
                  Consider prophylactic interventions and lifestyle modifications
                </div>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  <div className="font-medium text-purple-800">Family Testing</div>
                </div>
                <div className="text-sm text-purple-700">
                  Genetic counseling and testing recommended for family members
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <div className="font-medium text-orange-800">Clinical Action Required</div>
                </div>
                <div className="text-sm text-orange-700">
                  High-risk variants identified requiring immediate clinical review
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline">
                  <Target className="h-4 w-4 mr-2" />
                  Schedule Consultation
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
