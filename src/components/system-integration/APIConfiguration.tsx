
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Key, 
  Link, 
  Shield, 
  Database, 
  Edit, 
  Plus, 
  Trash2,
  TestTube,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';

export const APIConfiguration = () => {
  const [showSecrets, setShowSecrets] = useState(false);

  const apiEndpoints = [
    {
      id: '1',
      name: 'Epic EMR',
      url: 'https://epic.hospital.com/api/v1',
      type: 'HL7 FHIR',
      status: 'active',
      authType: 'OAuth 2.0',
      rateLimit: '1000/min',
      lastTested: '2 mins ago'
    },
    {
      id: '2',
      name: 'Cerner EHR',
      url: 'https://cerner.hospital.com/fhir/r4',
      type: 'FHIR R4',
      status: 'active',
      authType: 'Bearer Token',
      rateLimit: '500/min',
      lastTested: '5 mins ago'
    },
    {
      id: '3',
      name: 'Sunquest LIMS',
      url: 'https://lims.sunquest.com/api',
      type: 'REST API',
      status: 'warning',
      authType: 'API Key',
      rateLimit: '200/min',
      lastTested: '1 hour ago'
    },
    {
      id: '4',
      name: 'Anthem Payer',
      url: 'https://api.anthem.com/eligibility',
      type: 'REST API',
      status: 'error',
      authType: 'OAuth 2.0',
      rateLimit: '100/min',
      lastTested: 'Failed'
    }
  ];

  const authSettings = [
    {
      system: 'Epic EMR',
      type: 'OAuth 2.0',
      clientId: 'epic_client_***',
      clientSecret: showSecrets ? 'ep1c_s3cr3t_k3y_2024' : '••••••••••••••••',
      tokenUrl: 'https://epic.hospital.com/oauth/token',
      scope: 'patient/*.read'
    },
    {
      system: 'Cerner EHR',
      type: 'Bearer Token',
      token: showSecrets ? 'bearer_token_cerner_2024' : '••••••••••••••••',
      refreshToken: showSecrets ? 'refresh_token_cerner' : '••••••••••••••••',
      expiresIn: '3600 seconds',
      scope: 'system/*.read'
    },
    {
      system: 'Sunquest LIMS',
      type: 'API Key',
      apiKey: showSecrets ? 'sq_api_key_lab_2024' : '••••••••••••••••',
      headerName: 'X-API-Key',
      description: 'Laboratory data access',
      permissions: 'read,write'
    }
  ];

  const mappingRules = [
    {
      id: '1',
      source: 'Epic EMR',
      sourceField: 'Patient.name.given',
      destination: 'HIMS',
      destinationField: 'patient_first_name',
      transformation: 'concat',
      status: 'active'
    },
    {
      id: '2',
      source: 'Sunquest LIMS',
      sourceField: 'result.value',
      destination: 'EMR',
      destinationField: 'lab_result_value',
      transformation: 'direct',
      status: 'active'
    },
    {
      id: '3',
      source: 'Anthem API',
      sourceField: 'eligibility.coverage',
      destination: 'Billing',
      destinationField: 'insurance_coverage',
      transformation: 'format_currency',
      status: 'inactive'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">API Configuration</h3>
          <p className="text-gray-600">Manage API endpoints, authentication, and data mapping</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Test All
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Endpoint
          </Button>
        </div>
      </div>

      <Tabs defaultValue="endpoints" className="space-y-6">
        <TabsList>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="mapping">Data Mapping</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
              <CardDescription>Configure and manage external system connections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiEndpoints.map((endpoint, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        endpoint.status === 'active' ? 'bg-green-500' : 
                        endpoint.status === 'warning' ? 'bg-orange-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <h5 className="font-medium text-gray-900">{endpoint.name}</h5>
                        <p className="text-sm text-gray-600">{endpoint.url}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-gray-500">{endpoint.type}</span>
                          <span className="text-xs text-gray-500">{endpoint.authType}</span>
                          <span className="text-xs text-gray-500">Rate: {endpoint.rateLimit}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Badge variant="outline" className={`${
                          endpoint.status === 'active' ? 'border-green-500 text-green-700' :
                          endpoint.status === 'warning' ? 'border-orange-500 text-orange-700' :
                          'border-red-500 text-red-700'
                        }`}>
                          {endpoint.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">Last test: {endpoint.lastTested}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <TestTube className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authentication" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Authentication Settings</CardTitle>
                  <CardDescription>Manage API keys, tokens, and authentication credentials</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSecrets(!showSecrets)}
                  className="flex items-center gap-2"
                >
                  {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showSecrets ? 'Hide' : 'Show'} Secrets
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {authSettings.map((auth, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-900">{auth.system}</h5>
                      <Badge variant="outline">{auth.type}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {auth.type === 'OAuth 2.0' && (
                        <>
                          <div>
                            <span className="text-gray-600">Client ID:</span>
                            <p className="font-mono">{auth.clientId}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Client Secret:</span>
                            <p className="font-mono">{auth.clientSecret}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Token URL:</span>
                            <p className="font-mono">{auth.tokenUrl}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Scope:</span>
                            <p className="font-mono">{auth.scope}</p>
                          </div>
                        </>
                      )}
                      {auth.type === 'Bearer Token' && (
                        <>
                          <div>
                            <span className="text-gray-600">Token:</span>
                            <p className="font-mono">{auth.token}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Refresh Token:</span>
                            <p className="font-mono">{auth.refreshToken}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Expires In:</span>
                            <p className="font-mono">{auth.expiresIn}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Scope:</span>
                            <p className="font-mono">{auth.scope}</p>
                          </div>
                        </>
                      )}
                      {auth.type === 'API Key' && (
                        <>
                          <div>
                            <span className="text-gray-600">API Key:</span>
                            <p className="font-mono">{auth.apiKey}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Header Name:</span>
                            <p className="font-mono">{auth.headerName}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Description:</span>
                            <p>{auth.description}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Permissions:</span>
                            <p>{auth.permissions}</p>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex justify-end mt-3">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Mapping Rules</CardTitle>
              <CardDescription>Configure field mappings and data transformations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mappingRules.map((rule, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          rule.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                        <h5 className="font-medium text-gray-900">Mapping Rule #{rule.id}</h5>
                      </div>
                      <Badge variant="outline" className={
                        rule.status === 'active' ? 'border-green-500 text-green-700' : 'border-gray-500 text-gray-700'
                      }>
                        {rule.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Source:</span>
                        <p className="font-medium">{rule.source}</p>
                        <p className="font-mono text-xs">{rule.sourceField}</p>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-px bg-gray-300"></div>
                          <Badge variant="secondary" className="text-xs">{rule.transformation}</Badge>
                          <div className="w-8 h-px bg-gray-300"></div>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Destination:</span>
                        <p className="font-medium">{rule.destination}</p>
                        <p className="font-mono text-xs">{rule.destinationField}</p>
                      </div>
                    </div>
                    <div className="flex justify-end mt-3 gap-2">
                      <Button variant="outline" size="sm">
                        <TestTube className="h-4 w-4 mr-2" />
                        Test
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
