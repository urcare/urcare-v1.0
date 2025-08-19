
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Building,
    Download,
    Settings,
    Upload,
    Users
} from 'lucide-react';
import { useState } from 'react';

interface SSOProvider {
  id: string;
  name: string;
  type: 'saml' | 'oauth' | 'oidc';
  status: 'active' | 'inactive' | 'pending';
  users: number;
  lastSync: Date;
  configuration: {
    entityId?: string;
    ssoUrl?: string;
    certificate?: string;
    clientId?: string;
    clientSecret?: string;
  };
}

export const SSOIntegrationDashboard = () => {
  const [ssoProviders, setSsoProviders] = useState<SSOProvider[]>([
    {
      id: 'azure-ad',
      name: 'Microsoft Azure AD',
      type: 'saml',
      status: 'active',
      users: 1247,
      lastSync: new Date(Date.now() - 300000),
      configuration: {
        entityId: 'urn:urcare:healthcare:azure',
        ssoUrl: 'https://login.microsoftonline.com/tenant/saml2',
        certificate: 'MIICertificate...'
      }
    },
    {
      id: 'google-workspace',
      name: 'Google Workspace',
      type: 'oauth',
      status: 'active',
      users: 892,
      lastSync: new Date(Date.now() - 180000),
      configuration: {
        clientId: 'google-client-id',
        clientSecret: '••••••••••••'
      }
    },
    {
      id: 'okta',
      name: 'Okta Identity',
      type: 'oidc',
      status: 'pending',
      users: 0,
      lastSync: new Date(Date.now() - 86400000),
      configuration: {}
    }
  ]);

  const [selectedProvider, setSelectedProvider] = useState<SSOProvider | null>(null);
  const [isConfiguring, setIsConfiguring] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'saml': return 'bg-blue-100 text-blue-800';
      case 'oauth': return 'bg-purple-100 text-purple-800';
      case 'oidc': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  const totalSSOUsers = ssoProviders.reduce((sum, provider) => sum + provider.users, 0);
  const activeProviders = ssoProviders.filter(p => p.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* SSO Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Single Sign-On Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{ssoProviders.length}</div>
              <div className="text-sm text-gray-600">Total Providers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{activeProviders}</div>
              <div className="text-sm text-gray-600">Active Providers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{totalSSOUsers}</div>
              <div className="text-sm text-gray-600">SSO Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">98.7%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SSO Providers List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Identity Providers
            </span>
            <Button onClick={() => setIsConfiguring(true)}>
              Add Provider
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ssoProviders.map((provider) => (
              <div key={provider.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building className="h-6 w-6 text-blue-600" />
                    <div>
                      <div className="font-medium">{provider.name}</div>
                      <div className="text-sm text-gray-600">{provider.users} users</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(provider.status)}>
                      {provider.status}
                    </Badge>
                    <Badge className={getTypeColor(provider.type)}>
                      {provider.type.toUpperCase()}
                    </Badge>
                    <Switch 
                      checked={provider.status === 'active'} 
                      onCheckedChange={(checked) => {
                        setSsoProviders(prev => 
                          prev.map(p => 
                            p.id === provider.id 
                              ? { ...p, status: checked ? 'active' : 'inactive' }
                              : p
                          )
                        );
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Last Sync:</span>
                    <span className="ml-2">{formatTime(provider.lastSync)}</span>
                  </div>
                  <div>
                    <span className="font-medium">Active Users:</span>
                    <span className="ml-2">{provider.users}</span>
                  </div>
                  <div>
                    <span className="font-medium">Protocol:</span>
                    <span className="ml-2">{provider.type.toUpperCase()}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedProvider(provider)}
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                    <Button size="sm" variant="outline">
                      Test
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Panel */}
      {selectedProvider && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configure {selectedProvider.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedProvider.type === 'saml' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="entityId">Entity ID</Label>
                  <Input
                    id="entityId"
                    value={selectedProvider.configuration.entityId || ''}
                    placeholder="urn:your-domain:saml"
                  />
                </div>
                <div>
                  <Label htmlFor="ssoUrl">SSO URL</Label>
                  <Input
                    id="ssoUrl"
                    value={selectedProvider.configuration.ssoUrl || ''}
                    placeholder="https://your-idp.com/sso/saml"
                  />
                </div>
                <div>
                  <Label htmlFor="certificate">X.509 Certificate</Label>
                  <div className="flex gap-2">
                    <Input
                      id="certificate"
                      value={selectedProvider.configuration.certificate || ''}
                      placeholder="MIICertificate..."
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {selectedProvider.type === 'oauth' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="clientId">Client ID</Label>
                  <Input
                    id="clientId"
                    value={selectedProvider.configuration.clientId || ''}
                    placeholder="your-oauth-client-id"
                  />
                </div>
                <div>
                  <Label htmlFor="clientSecret">Client Secret</Label>
                  <Input
                    id="clientSecret"
                    type="password"
                    value={selectedProvider.configuration.clientSecret || ''}
                    placeholder="your-oauth-client-secret"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button>Save Configuration</Button>
              <Button variant="outline" onClick={() => setSelectedProvider(null)}>
                Cancel
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Metadata
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Mapping */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Attribute Mapping
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Email Attribute</Label>
                <Input defaultValue="http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress" />
              </div>
              <div>
                <Label>Name Attribute</Label>
                <Input defaultValue="http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name" />
              </div>
              <div>
                <Label>Role Attribute</Label>
                <Input defaultValue="http://schemas.microsoft.com/ws/2008/06/identity/claims/role" />
              </div>
              <div>
                <Label>Department Attribute</Label>
                <Input defaultValue="http://schemas.xmlsoap.org/claims/Department" />
              </div>
            </div>
            
            <Button>Update Mappings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
