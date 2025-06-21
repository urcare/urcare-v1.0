
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Zap,
  Search,
  BarChart3
} from 'lucide-react';

interface QueryMetric {
  id: string;
  query: string;
  executionTime: number;
  frequency: number;
  impact: 'low' | 'medium' | 'high';
  status: 'optimized' | 'needs-attention' | 'critical';
}

export const DatabaseQueryAnalyzer = () => {
  const [selectedTab, setSelectedTab] = useState('slow-queries');

  const slowQueries: QueryMetric[] = [
    {
      id: '1',
      query: 'SELECT * FROM patients WHERE created_at > NOW() - INTERVAL 30 DAY',
      executionTime: 1250,
      frequency: 450,
      impact: 'high',
      status: 'critical'
    },
    {
      id: '2',
      query: 'SELECT appointments.*, doctors.name FROM appointments JOIN doctors',
      executionTime: 890,
      frequency: 320,
      impact: 'medium',
      status: 'needs-attention'
    },
    {
      id: '3',
      query: 'UPDATE medical_records SET status = ? WHERE patient_id = ?',
      executionTime: 450,
      frequency: 180,
      impact: 'low',
      status: 'optimized'
    }
  ];

  const frequentQueries: QueryMetric[] = [
    {
      id: '4',
      query: 'SELECT * FROM user_profiles WHERE id = ?',
      executionTime: 15,
      frequency: 2850,
      impact: 'medium',
      status: 'optimized'
    },
    {
      id: '5',
      query: 'SELECT COUNT(*) FROM appointments WHERE date = CURRENT_DATE',
      executionTime: 85,
      frequency: 1240,
      impact: 'medium',
      status: 'needs-attention'
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimized': return 'bg-green-100 text-green-800';
      case 'needs-attention': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const QueryCard = ({ query }: { query: QueryMetric }) => (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <code className="text-sm bg-gray-100 p-2 rounded flex-1 break-all">
            {query.query}
          </code>
          <div className="flex gap-2">
            <Badge className={getImpactColor(query.impact)}>
              {query.impact}
            </Badge>
            <Badge className={getStatusColor(query.status)}>
              {query.status}
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-gray-600">Execution Time</p>
              <p className="font-medium">{query.executionTime}ms</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-gray-600">Frequency</p>
              <p className="font-medium">{query.frequency}/day</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            <div>
              <p className="text-gray-600">Total Impact</p>
              <p className="font-medium">{Math.round(query.executionTime * query.frequency / 1000)}s/day</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Query ID: {query.id}
          </div>
          <Button size="sm" variant="outline">
            Analyze
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6 text-green-600" />
            Database Query Analyzer
          </CardTitle>
          <CardDescription>
            Monitor and optimize database query performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">1,247</div>
              <div className="text-sm text-gray-600">Total Queries</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">156ms</div>
              <div className="text-sm text-gray-600">Avg Response</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">23</div>
              <div className="text-sm text-gray-600">Slow Queries</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">5</div>
              <div className="text-sm text-gray-600">Critical Issues</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="slow-queries">Slow Queries</TabsTrigger>
          <TabsTrigger value="frequent-queries">Frequent Queries</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="slow-queries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Slowest Queries</CardTitle>
              <CardDescription>Queries taking the longest time to execute</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {slowQueries.map((query) => (
                <QueryCard key={query.id} query={query} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="frequent-queries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Most Frequent Queries</CardTitle>
              <CardDescription>Queries executed most often</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {frequentQueries.map((query) => (
                <QueryCard key={query.id} query={query} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Optimization Recommendations</CardTitle>
              <CardDescription>AI-powered suggestions to improve query performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-l-blue-500 bg-blue-50">
                  <h4 className="font-semibold text-blue-800">Index Optimization</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Add composite index on (patient_id, created_at) for the patients table to improve date range queries
                  </p>
                  <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                    Apply Index
                  </Button>
                </div>
                
                <div className="p-4 border-l-4 border-l-yellow-500 bg-yellow-50">
                  <h4 className="font-semibold text-yellow-800">Query Rewrite</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Replace SELECT * with specific columns in appointment queries to reduce data transfer
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">
                    View Suggestion
                  </Button>
                </div>
                
                <div className="p-4 border-l-4 border-l-green-500 bg-green-50">
                  <h4 className="font-semibold text-green-800">Caching Opportunity</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Implement Redis caching for user profile lookups to reduce database load
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Configure Cache
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
