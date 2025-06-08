
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  FileText, 
  Calendar, 
  User, 
  Tag,
  Eye,
  Download,
  Star,
  Clock,
  MapPin,
  Hash
} from 'lucide-react';

interface SearchFilter {
  category: string;
  options: { label: string; value: string; count?: number }[];
}

interface DocumentResult {
  id: string;
  title: string;
  type: string;
  content: string;
  author: string;
  date: string;
  size: string;
  tags: string[];
  location: string;
  relevanceScore: number;
  highlighted: string[];
}

export const AdvancedDocumentSearch = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  const searchFilters: SearchFilter[] = [
    {
      category: 'Document Type',
      options: [
        { label: 'Medical Records', value: 'medical', count: 234 },
        { label: 'Lab Reports', value: 'lab', count: 156 },
        { label: 'Discharge Summaries', value: 'discharge', count: 89 },
        { label: 'Prescriptions', value: 'prescription', count: 312 },
        { label: 'Consent Forms', value: 'consent', count: 67 }
      ]
    },
    {
      category: 'Date Range',
      options: [
        { label: 'Last 7 days', value: '7d' },
        { label: 'Last 30 days', value: '30d' },
        { label: 'Last 3 months', value: '3m' },
        { label: 'Last year', value: '1y' },
        { label: 'Custom range', value: 'custom' }
      ]
    },
    {
      category: 'Department',
      options: [
        { label: 'Cardiology', value: 'cardiology', count: 145 },
        { label: 'Emergency', value: 'emergency', count: 203 },
        { label: 'Laboratory', value: 'laboratory', count: 178 },
        { label: 'Radiology', value: 'radiology', count: 122 },
        { label: 'Pharmacy', value: 'pharmacy', count: 156 }
      ]
    },
    {
      category: 'Status',
      options: [
        { label: 'Draft', value: 'draft', count: 45 },
        { label: 'Final', value: 'final', count: 567 },
        { label: 'Archived', value: 'archived', count: 234 },
        { label: 'Under Review', value: 'review', count: 23 }
      ]
    }
  ];

  const searchResults: DocumentResult[] = [
    {
      id: 'doc-1',
      title: 'Patient Discharge Summary - John Doe',
      type: 'Discharge Summary',
      content: 'Patient admitted with acute chest pain. ECG showed ST elevation in leads II, III, aVF. Cardiac catheterization revealed 90% occlusion of RCA...',
      author: 'Dr. Sarah Smith',
      date: '2024-01-22',
      size: '2.4 MB',
      tags: ['Cardiology', 'Emergency', 'STEMI'],
      location: 'ICU Ward 3',
      relevanceScore: 95,
      highlighted: ['chest pain', 'ECG', 'ST elevation']
    },
    {
      id: 'doc-2',
      title: 'Lab Report - Complete Blood Count',
      type: 'Lab Report',
      content: 'CBC results for patient ID 12345. WBC: 8.5 K/uL (Normal), RBC: 4.2 M/uL (Normal), Hemoglobin: 14.2 g/dL (Normal)...',
      author: 'Lab Technician Maria',
      date: '2024-01-21',
      size: '856 KB',
      tags: ['Laboratory', 'Blood Work', 'CBC'],
      location: 'Central Lab',
      relevanceScore: 88,
      highlighted: ['CBC', 'WBC', 'Hemoglobin']
    },
    {
      id: 'doc-3',
      title: 'Prescription - Cardiovascular Medications',
      type: 'Prescription',
      content: 'Metoprolol 50mg BID, Lisinopril 10mg daily, Atorvastatin 40mg at bedtime. Patient counseled on side effects...',
      author: 'Dr. Michael Johnson',
      date: '2024-01-20',
      size: '1.2 MB',
      tags: ['Cardiology', 'Medication', 'Prescription'],
      location: 'Outpatient Clinic',
      relevanceScore: 82,
      highlighted: ['Metoprolol', 'Lisinopril', 'cardiovascular']
    }
  ];

  const recentSearches = [
    'cardiac catheterization reports',
    'diabetes medication protocols',
    'emergency procedures documentation',
    'lab results blood glucose',
    'patient consent forms surgery'
  ];

  const popularTags = [
    { tag: 'Emergency', count: 234 },
    { tag: 'Cardiology', count: 189 },
    { tag: 'Laboratory', count: 156 },
    { tag: 'Medication', count: 298 },
    { tag: 'Surgery', count: 145 },
    { tag: 'Radiology', count: 123 }
  ];

  const handleFilterChange = (category: string, value: string) => {
    setSelectedFilters(prev => {
      const categoryFilters = prev[category] || [];
      const newFilters = categoryFilters.includes(value)
        ? categoryFilters.filter(f => f !== value)
        : [...categoryFilters, value];
      
      return { ...prev, [category]: newFilters };
    });
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-blue-100 text-blue-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Advanced Document Search</h2>
          <p className="text-gray-600">Search documents with full-text search, filters, and metadata organization</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Star className="h-4 w-4" />
          Saved Searches
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="search">Search & Results</TabsTrigger>
          <TabsTrigger value="filters">Advanced Filters</TabsTrigger>
          <TabsTrigger value="analytics">Search Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="search">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Search Sidebar */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Search Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Recent Searches</h4>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        className="text-xs text-left w-full p-2 hover:bg-gray-50 rounded text-gray-600"
                        onClick={() => setSearchQuery(search)}
                      >
                        <Clock className="h-3 w-3 inline mr-1" />
                        {search}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Popular Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map(item => (
                      <Badge 
                        key={item.tag}
                        variant="outline" 
                        className="cursor-pointer hover:bg-blue-50"
                        onClick={() => setSearchQuery(item.tag)}
                      >
                        {item.tag} ({item.count})
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Quick Filters</h4>
                  {searchFilters.slice(0, 2).map(filter => (
                    <div key={filter.category} className="space-y-2">
                      <p className="text-xs font-medium text-gray-700">{filter.category}</p>
                      <div className="space-y-1">
                        {filter.options.slice(0, 3).map(option => (
                          <label key={option.value} className="flex items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              className="rounded"
                              checked={selectedFilters[filter.category]?.includes(option.value) || false}
                              onChange={() => handleFilterChange(filter.category, option.value)}
                            />
                            <span>{option.label}</span>
                            {option.count && (
                              <span className="text-gray-400">({option.count})</span>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Search Results */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search documents, content, metadata..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                <Button>Search</Button>
              </div>

              {/* Active Filters */}
              {Object.entries(selectedFilters).some(([_, values]) => values.length > 0) && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {Object.entries(selectedFilters).map(([category, values]) =>
                    values.map(value => (
                      <Badge 
                        key={`${category}-${value}`}
                        variant="secondary" 
                        className="cursor-pointer"
                        onClick={() => handleFilterChange(category, value)}
                      >
                        {value} ×
                      </Badge>
                    ))
                  )}
                </div>
              )}

              {/* Search Results */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Found {searchResults.length} documents in 0.24 seconds
                  </p>
                  <select className="text-sm border rounded px-3 py-1">
                    <option>Relevance</option>
                    <option>Date (newest)</option>
                    <option>Date (oldest)</option>
                    <option>Title (A-Z)</option>
                  </select>
                </div>

                {searchResults.map(result => (
                  <Card key={result.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <FileText className="h-4 w-4 text-blue-600" />
                              <h3 className="font-medium">{result.title}</h3>
                              <Badge className={getRelevanceColor(result.relevanceScore)}>
                                {result.relevanceScore}% match
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{result.type}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="text-sm">
                          <p className="mb-2">
                            {result.content.substring(0, 200)}...
                          </p>
                          {result.highlighted.length > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">Matches:</span>
                              {result.highlighted.map((term, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {term}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {result.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {result.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {result.location}
                            </span>
                          </div>
                          <span>{result.size}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {result.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              <Tag className="h-2 w-2 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="filters">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchFilters.map(filter => (
              <Card key={filter.category}>
                <CardHeader>
                  <CardTitle className="text-lg">{filter.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {filter.options.map(option => (
                      <label key={option.value} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="rounded"
                            checked={selectedFilters[filter.category]?.includes(option.value) || false}
                            onChange={() => handleFilterChange(filter.category, option.value)}
                          />
                          <span className="text-sm">{option.label}</span>
                        </div>
                        {option.count && (
                          <Badge variant="outline" className="text-xs">
                            {option.count}
                          </Badge>
                        )}
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Documents</p>
                    <p className="text-2xl font-bold">12,847</p>
                    <p className="text-sm text-green-600">+234 this month</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Searches Today</p>
                    <p className="text-2xl font-bold">1,456</p>
                    <p className="text-sm text-blue-600">Avg 0.3s response</p>
                  </div>
                  <Search className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Top Search Term</p>
                    <p className="text-2xl font-bold">cardiac</p>
                    <p className="text-sm text-gray-600">289 searches</p>
                  </div>
                  <Hash className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold">94.2%</p>
                    <p className="text-sm text-green-600">+2.1% this week</p>
                  </div>
                  <Star className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
