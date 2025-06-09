
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Tv, 
  Wifi,
  Volume2,
  Settings,
  Users,
  Heart,
  Bell,
  Calendar,
  Clock
} from 'lucide-react';

interface TVRoom {
  id: string;
  roomNumber: string;
  patientName: string;
  tvStatus: 'online' | 'offline' | 'maintenance';
  currentContent: string;
  volume: number;
  nurseCallEnabled: boolean;
}

interface TVContent {
  id: string;
  title: string;
  type: 'health-info' | 'entertainment' | 'system' | 'emergency';
  duration: string;
  enabled: boolean;
}

export const SmartTVIntegration = () => {
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [broadcastMode, setBroadcastMode] = useState(false);
  
  const [tvRooms, setTvRooms] = useState<TVRoom[]>([
    {
      id: 'room101',
      roomNumber: '101',
      patientName: 'John Smith',
      tvStatus: 'online',
      currentContent: 'Health Education',
      volume: 65,
      nurseCallEnabled: true
    },
    {
      id: 'room102',
      roomNumber: '102',
      patientName: 'Sarah Johnson',
      tvStatus: 'online',
      currentContent: 'Entertainment',
      volume: 45,
      nurseCallEnabled: true
    },
    {
      id: 'room103',
      roomNumber: '103',
      patientName: 'Michael Brown',
      tvStatus: 'offline',
      currentContent: 'None',
      volume: 0,
      nurseCallEnabled: false
    },
    {
      id: 'room104',
      roomNumber: '104',
      patientName: 'Emily Davis',
      tvStatus: 'maintenance',
      currentContent: 'System Update',
      volume: 0,
      nurseCallEnabled: false
    }
  ]);

  const [availableContent] = useState<TVContent[]>([
    {
      id: 'health-basics',
      title: 'Health Education Basics',
      type: 'health-info',
      duration: '15 min',
      enabled: true
    },
    {
      id: 'medication-info',
      title: 'Medication Information',
      type: 'health-info',
      duration: '10 min',
      enabled: true
    },
    {
      id: 'wellness-tips',
      title: 'Wellness Tips',
      type: 'health-info',
      duration: '12 min',
      enabled: true
    },
    {
      id: 'entertainment-mix',
      title: 'Entertainment Mix',
      type: 'entertainment',
      duration: '30 min',
      enabled: true
    },
    {
      id: 'relaxation',
      title: 'Relaxation Content',
      type: 'entertainment',
      duration: '20 min',
      enabled: true
    }
  ]);

  const [systemStats] = useState({
    onlineRooms: 24,
    totalRooms: 32,
    activeBroadcasts: 3,
    nurseCalls: 7,
    maintenanceAlerts: 2,
    contentLibrarySize: 156
  });

  const updateRoomVolume = (roomId: string, volume: number) => {
    setTvRooms(prev => 
      prev.map(room => 
        room.id === roomId 
          ? { ...room, volume }
          : room
      )
    );
  };

  const toggleNurseCall = (roomId: string) => {
    setTvRooms(prev => 
      prev.map(room => 
        room.id === roomId 
          ? { ...room, nurseCallEnabled: !room.nurseCallEnabled }
          : room
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'offline': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'health-info': return 'bg-blue-100 text-blue-800';
      case 'entertainment': return 'bg-purple-100 text-purple-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tv className="h-5 w-5" />
            Smart TV System Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{systemStats.onlineRooms}</div>
              <div className="text-sm text-gray-600">Online Rooms</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{systemStats.totalRooms}</div>
              <div className="text-sm text-gray-600">Total Rooms</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{systemStats.activeBroadcasts}</div>
              <div className="text-sm text-gray-600">Active Broadcasts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{systemStats.nurseCalls}</div>
              <div className="text-sm text-gray-600">Nurse Calls</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{systemStats.maintenanceAlerts}</div>
              <div className="text-sm text-gray-600">Maintenance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{systemStats.contentLibrarySize}</div>
              <div className="text-sm text-gray-600">Content Items</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Broadcast Mode</span>
              <Switch
                checked={broadcastMode}
                onCheckedChange={setBroadcastMode}
              />
            </div>
            {broadcastMode && (
              <Badge className="bg-red-100 text-red-800">
                Broadcasting to All Rooms
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Room Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Room Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tvRooms.map((room) => (
              <div key={room.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Room {room.roomNumber}</div>
                    <div className="text-sm text-gray-600">{room.patientName}</div>
                  </div>
                  <Badge className={getStatusColor(room.tvStatus)}>
                    {room.tvStatus}
                  </Badge>
                </div>

                {room.tvStatus === 'online' && (
                  <>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-gray-600">Current: </span>
                        <span className="font-medium">{room.currentContent}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Volume</span>
                          <span>{room.volume}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Volume2 className="h-4 w-4 text-gray-500" />
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={room.volume}
                            onChange={(e) => updateRoomVolume(room.id, parseInt(e.target.value))}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Nurse Call</span>
                      </div>
                      <Switch
                        checked={room.nurseCallEnabled}
                        onCheckedChange={() => toggleNurseCall(room.id)}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedRoom(room.id)}
                      >
                        Select
                      </Button>
                    </div>
                  </>
                )}

                {room.tvStatus === 'offline' && (
                  <div className="text-center py-4">
                    <Wifi className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <div className="text-sm text-gray-500">TV Offline</div>
                    <Button size="sm" variant="outline" className="mt-2">
                      Reconnect
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Library */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Content Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {availableContent.map((content) => (
              <div key={content.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-medium">{content.title}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-3 w-3" />
                      {content.duration}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge className={getContentTypeColor(content.type)}>
                    {content.type.replace('-', ' ')}
                  </Badge>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Preview
                    </Button>
                    <Button size="sm">
                      {selectedRoom ? 'Send to Room' : 'Broadcast'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health Information Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Patient Health Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Display Options</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Medication Schedule</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Appointment Reminders</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Meal Times</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Visitor Hours</span>
                  <Switch />
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Emergency Features</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Emergency Alerts</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Code Blue Override</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Evacuation Instructions</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Staff Notifications</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
