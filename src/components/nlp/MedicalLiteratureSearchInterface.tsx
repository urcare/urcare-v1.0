
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  BookOpen,
  Star,
  Download,
  ExternalLink,
  Brain,
  TrendingUp,
  Calendar,
  Users
} from 'lucide-react';

export const MedicalLiteratureSearchInterface = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const mockResults = [
    {
      id: 1,
      title: 'Efficacy of AI-assisted diagnosis in cardiovascular imaging',
      authors: ['Smith J.', 'Johnson M.', 'Williams R.'],
      journal: 'Journal of Cardiovascular Medicine',
      year: 2024,
      relevanceScore: 96.2,
      citationCount: 45,
      abstractSummary: 'This study demonstrates significant improvement in diagnostic accuracy when AI assistance is integrated into cardiovascular imaging workflows...',
      keyFindings: ['94% accuracy improvement', 'Reduced diagnosis time by 40%', 'Lower false positive rates'],
      doi: '10.1016/j.jcvm.2024.01.001'
    },
    {
      id: 2,
      title: 'Machine learning approaches to predictive maintenance in hospital equipment',
      authors: ['Brown A.', 'Davis K.', 'Miller L.'],
      journal: 'Healthcare Technology Review',
      year: 2024,
      relevanceScore: 92.8,
      citationCount: 32,
      abstractSummary: 'Implementing machine learning algorithms for predictive maintenance shows promising results in reducing equipment downtime...',
      keyFindings: ['30% reduction in equipment failures', 'Cost savings of $2.1M annually', 'Improved patient safety'],
      doi: '10.1016/j.htr.2024.02.003'
    }
  ];

  const performSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate AI-powered search
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSearchResults(mockResults);
    setIsSearching(false);
  };

  const recentSearches = [
    'AI in medical imaging',
    'Predictive maintenance healthcare',
    'Natural language processing EMR',
    'Machine learning drug discovery'
  ];

  const savedPapers = [
    {
      title: 'Deep learning in radiology: A systematic review',
      authors: 'Thompson et al.',
      saved: '2024-06-08'
    },
    {
      title: 'NLP applications in clinical documentation',
      authors: 'Anderson et al.',
      saved: '2024-06-07'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            AI-Powered Literature Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search medical literature with AI semantic understanding..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && performSearch()}
              />
              <Button 
                onClick={performSearch} 
                disabled={!searchQuery.trim() || isSearching}
                className="flex items-center gap-2"
              >
                {isSearching ? (
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  <Brain className="h-4 w-4" />
                )}
                {isSearching ? 'Searching...' : 'AI Search'}
              </Button>
            </div>
            
            {/* Recent Searches */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Recent Searches</h4>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-blue-50"
                    onClick={() => setSearchQuery(search)}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Search Results ({searchResults.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {searchResults.map((result) => (
                <div key={result.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{result.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {result.authors.join(', ')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {result.year}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {result.citationCount} citations
                        </span>
                      </div>
                      <div className="text-blue-600 text-sm mb-3">{result.journal}</div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge variant="outline" className="text-green-600">
                        {result.relevanceScore}% relevance
                      </Badge>
                      <Button variant="outline" size="icon">
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-1">AI Summary</h4>
                      <p className="text-gray-700 text-sm">{result.abstractSummary}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Key Findings</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.keyFindings.map((finding, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {finding}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs text-gray-500">DOI: {result.doi}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Full Text
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Papers */}
      <Card>
        <CardHeader>
          <CardTitle>Saved Papers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {savedPapers.map((paper, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{paper.title}</div>
                  <div className="text-sm text-gray-600">{paper.authors} • Saved {paper.saved}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <BookOpen className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search Analytics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">1,247</div>
            <div className="text-sm text-gray-600">Papers Searched</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">96.2%</div>
            <div className="text-sm text-gray-600">Avg Relevance</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">1.8s</div>
            <div className="text-sm text-gray-600">Search Time</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">47</div>
            <div className="text-sm text-gray-600">Saved Papers</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
