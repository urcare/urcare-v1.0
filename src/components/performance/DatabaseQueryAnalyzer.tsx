
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Clock, 
  TrendingDown, 
  AlertTriangle, 
  Search,
  Filter,
  Zap,
  BarChart3
} from 'lucide-react';

export const DatabaseQueryAnalyzer = () => {
  const [selectedDatabase, setSelectedDatabase] = useState('all');
  const [timeFilter, setTimeFilter] = useState('1h');

  const slowQueries = [
    {
      id: 1,
      query: "SELECT p.*, d.name as doctor_name FROM patients p JOIN doctors d ON p.doctor_id = d.id WHERE p.created_at > '2024-01-01'",
      executionTime: 2450,
      frequency: 145,
      database: 'hospital_db',
      table: 'patients',
      lastExecuted: '2 minutes ago',
      status: 'critical'
    },
    {
      id: 2,
      query: "UPDATE appointments SET status = 'completed' WHERE date_time < NOW() - INTERVAL '1 day'",
      executionTime: 1200,
      frequency: 67,
      database: 'hospital_db',
      table: 'appointments',
      lastExecuted: '5 minutes ago',
      status: 'warning'
    },
    {
      id: 3,
      query: "SELECT COUNT(*) FROM medical_records WHERE patient_id IN (SELECT id FROM patients WHERE department = 'cardiology')",
      executionTime: 890,
      frequency: 234,
      database: 'hospital_db',
      table: 'medical_records',
      lastExecuted: '1 minute ago',
      status: 'warning'
    }
  ];

  const queryStats = [
    { metric: 'Total Queries', value: '45,678', change: '+12%', color: 'blue' },
    { metric: 'Slow Queries', value: '127', change: '-8%', color: 'red' },
    { metric: 'Avg Execution Time', value: '145ms', change: '-15%', color: 'green' },
    { metric: 'Cache Hit Rate', value: '94.2%', change: '+2%', color: 'purple' }
  ];

  const tableStats = [
    { table: 'patients', queries: 12456, avgTime: 95, slowest: 2450 },
    { table: 'appointments', queries: 8934, avgTime: 78, slowest: 1200 },
    { table: 'medical_records', queries: 15678, avgTime: 120, slowest: 890 },
    { table: 'doctors', queries: 3421, avgTime: 45, slowest: 234 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'good': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatQuery = (query: string) => {
    return query.length > 100 ? query.substring(0, 100) + '...' : query;
  };

  return (
    <div className="space-y-6">
      {/* Database Analytics Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Query Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {queryStats.map((stat, index) => (
              <div key={index} className="text-center p-4 bg-white/50 rounded-lg">
                <div className={`text-2xl font-bold ${
                  stat.color === 'blue' ? 'text-blue-600' :
                  stat.color === 'red' ? 'text-red-600' :
                  stat.color === 'green' ? 'text-green-600' :
                  'text-purple-600'
                }`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.metric}</div>
                <div className={`text-xs ${stat.change.startsWith('+') ? 'text-red-600' : 'text-green-600'}`}>
                  {stat.change} from last hour
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="text-sm font-medium">Database:</span>
              <select
                value={selectedDatabase}
                onChange={(e) => setSelectedDatabase(e.target.value)}
                className="px-3 py-1 border rounded text-sm"
              >
                <option value="all">All Databases</option>
                <option value="hospital_db">Hospital DB</option>
                <option value="analytics_db">Analytics DB</option>
                <option value="backup_db">Backup DB</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Time Range:</span>
              {['1h', '6h', '24h', '7d'].map((range) => (
                <Button
                  key={range}
                  variant={timeFilter === range ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeFilter(range)}
                >
                  {range}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="slow-queries" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="slow-queries">Slow Queries</TabsTrigger>
          <TabsTrigger value="frequent-queries">Frequent Queries</TabsTrigger>
          <TabsTrigger value="table-stats">Table Statistics</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="slow-queries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Slow Queries ({slowQueries.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {slowQueries.map((query) => (
                  <Card key={query.id} className="border-l-4 border-l-red-500">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                              {formatQuery(query.query)}
                            </div>
                          </div>
                          <Badge className={getStatusColor(query.status)}>
                            {query.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{query.executionTime}ms</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BarChart3 className="h-3 w-3" />
                            <span>{query.frequency} executions</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Database className="h-3 w-3" />
                            <span>{query.table}</span>
                          </div>
                          <div className="text-gray-600">
                            Last: {query.lastExecuted}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Search className="h-3 w-3 mr-1" />
                            Analyze
                          </Button>
                          <Button size="sm" variant="outline">
                            <Zap className="h-3 w-3 mr-1" />
                            Optimize
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="table-stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Table Performance Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Table Name</th>
                      <th className="text-right p-2">Total Queries</th>
                      <th className="text-right p-2">Avg Time (ms)</th>
                      <th className="text-right p-2">Slowest (ms)</th>
                      <th className="text-center p-2">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableStats.map((table, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{table.table}</td>
                        <td className="p-2 text-right">{table.queries.toLocaleString()}</td>
                        <td className="p-2 text-right">{table.avgTime}</td>
                        <td className="p-2 text-right font-bold text-red-600">{table.slowest}</td>
                        <td className="p-2 text-center">
                          <Badge className={
                            table.avgTime < 100 ? 'bg-green-100 text-green-800' :
                            table.avgTime < 200 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {table.avgTime < 100 ? 'Good' : table.avgTime < 200 ? 'Fair' : 'Poor'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Query Optimization Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-l-blue-500 bg-blue-50">
                  <h4 className="font-semibold text-blue-800">Index Recommendations</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Add composite index on (patient_id, created_at) for patients table to improve query performance by 65%.
                  </p>
                  <Button size="sm" className="mt-2" variant="outline">
                    Apply Suggestion
                  </Button>
                </div>
                <div className="p-4 border-l-4 border-l-green-500 bg-green-50">
                  <h4 className="font-semibold text-green-800">Query Rewrite</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Replace subquery with JOIN in medical_records query to reduce execution time by 40%.
                  </p>
                  <Button size="sm" className="mt-2" variant="outline">
                    View Rewrite
                  </Button>
                </div>
                <div className="p-4 border-l-4 border-l-orange-500 bg-orange-50">
                  <h4 className="font-semibold text-orange-800">Caching Opportunity</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    Enable query result caching for frequently accessed appointment status updates.
                  </p>
                  <Button size="sm" className="mt-2" variant="outline">
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
