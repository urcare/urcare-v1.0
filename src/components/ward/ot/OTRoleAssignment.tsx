
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Users, UserPlus, Edit, Clock, AlertTriangle } from 'lucide-react';

export const OTRoleAssignment = () => {
  const [selectedOT, setSelectedOT] = useState('OT-1');

  const operatingRooms = ['OT-1', 'OT-2', 'OT-3', 'OT-4', 'OT-5'];

  const roles = [
    { id: 1, name: 'Primary Surgeon', required: true, category: 'Surgical Team' },
    { id: 2, name: 'Assistant Surgeon', required: false, category: 'Surgical Team' },
    { id: 3, name: 'Anesthesiologist', required: true, category: 'Anesthesia Team' },
    { id: 4, name: 'Anesthesia Technician', required: true, category: 'Anesthesia Team' },
    { id: 5, name: 'Scrub Nurse', required: true, category: 'Nursing Team' },
    { id: 6, name: 'Circulating Nurse', required: true, category: 'Nursing Team' },
    { id: 7, name: 'OR Technician', required: false, category: 'Support Staff' },
    { id: 8, name: 'Perfusionist', required: false, category: 'Specialized Staff' },
  ];

  const availableStaff = [
    { id: 1, name: 'Dr. Smith', specialties: ['Primary Surgeon', 'Assistant Surgeon'], status: 'available' },
    { id: 2, name: 'Dr. Johnson', specialties: ['Anesthesiologist'], status: 'available' },
    { id: 3, name: 'Nurse Wilson', specialties: ['Scrub Nurse', 'Circulating Nurse'], status: 'available' },
    { id: 4, name: 'Nurse Davis', specialties: ['Circulating Nurse'], status: 'busy' },
    { id: 5, name: 'Tech Brown', specialties: ['Anesthesia Technician', 'OR Technician'], status: 'available' },
    { id: 6, name: 'Dr. Miller', specialties: ['Assistant Surgeon'], status: 'available' },
    { id: 7, name: 'Nurse Garcia', specialties: ['Scrub Nurse'], status: 'available' },
    { id: 8, name: 'Tech Anderson', specialties: ['OR Technician'], status: 'available' },
  ];

  const [assignments, setAssignments] = useState([
    { otRoom: 'OT-1', roleId: 1, staffId: 1, staffName: 'Dr. Smith', roleName: 'Primary Surgeon' },
    { otRoom: 'OT-1', roleId: 3, staffId: 2, staffName: 'Dr. Johnson', roleName: 'Anesthesiologist' },
    { otRoom: 'OT-1', roleId: 5, staffId: 3, staffName: 'Nurse Wilson', roleName: 'Scrub Nurse' },
    { otRoom: 'OT-2', roleId: 1, staffId: 6, staffName: 'Dr. Miller', roleName: 'Primary Surgeon' },
    { otRoom: 'OT-2', roleId: 6, staffId: 4, staffName: 'Nurse Davis', roleName: 'Circulating Nurse' },
  ]);

  const getRoleAssignments = (room: string) => {
    return assignments.filter(assignment => assignment.otRoom === room);
  };

  const getUnassignedRoles = (room: string) => {
    const assignedRoleIds = getRoleAssignments(room).map(a => a.roleId);
    return roles.filter(role => !assignedRoleIds.includes(role.id));
  };

  const getStaffForRole = (roleName: string) => {
    return availableStaff.filter(staff => 
      staff.specialties.includes(roleName) && staff.status === 'available'
    );
  };

  const addAssignment = (room: string, roleId: number, staffId: number) => {
    const role = roles.find(r => r.id === roleId);
    const staff = availableStaff.find(s => s.id === staffId);
    if (role && staff) {
      setAssignments(prev => [...prev, {
        otRoom: room,
        roleId,
        staffId,
        staffName: staff.name,
        roleName: role.name
      }]);
    }
  };

  const removeAssignment = (room: string, roleId: number) => {
    setAssignments(prev => prev.filter(a => !(a.otRoom === room && a.roleId === roleId)));
  };

  const groupedRoles = roles.reduce((acc, role) => {
    if (!acc[role.category]) {
      acc[role.category] = [];
    }
    acc[role.category].push(role);
    return acc;
  }, {} as Record<string, typeof roles>);

  const getCompletionStatus = (room: string) => {
    const requiredRoles = roles.filter(role => role.required);
    const assignedRequiredRoles = getRoleAssignments(room).filter(assignment => 
      requiredRoles.some(role => role.id === assignment.roleId)
    );
    return {
      completed: assignedRequiredRoles.length,
      total: requiredRoles.length,
      percentage: Math.round((assignedRequiredRoles.length / requiredRoles.length) * 100)
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6 text-purple-600" />
          OT Role Assignment Panel
        </h2>
        <Button className="bg-purple-600 hover:bg-purple-700">
          Export Assignments
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        {operatingRooms.map(room => {
          const status = getCompletionStatus(room);
          return (
            <Button
              key={room}
              variant={selectedOT === room ? "default" : "outline"}
              onClick={() => setSelectedOT(room)}
              className="flex items-center gap-2"
            >
              {room}
              <Badge variant={status.percentage === 100 ? "default" : "destructive"}>
                {status.completed}/{status.total}
              </Badge>
            </Button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Current Assignments - {selectedOT}
              </CardTitle>
              <Badge variant={getCompletionStatus(selectedOT).percentage === 100 ? "default" : "destructive"}>
                {getCompletionStatus(selectedOT).percentage}% Complete
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(groupedRoles).map(([category, categoryRoles]) => (
                <div key={category}>
                  <h3 className="font-semibold text-lg mb-3 text-purple-800">{category}</h3>
                  <div className="space-y-2">
                    {categoryRoles.map(role => {
                      const assignment = getRoleAssignments(selectedOT).find(a => a.roleId === role.id);
                      return (
                        <div key={role.id} className={`border rounded-lg p-3 ${assignment ? 'bg-green-50 border-green-200' : role.required ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{role.name}</span>
                              {role.required && <Badge variant="destructive">Required</Badge>}
                            </div>
                            {assignment ? (
                              <div className="flex items-center gap-2">
                                <span className="text-green-600 font-medium">{assignment.staffName}</span>
                                <Button size="sm" variant="outline" onClick={() => removeAssignment(selectedOT, role.id)}>
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <UserPlus className="h-3 w-3 mr-1" />
                                    Assign
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>Assign {role.name} to {selectedOT}</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <Label>Available Staff</Label>
                                    <Select onValueChange={(value) => addAssignment(selectedOT, role.id, parseInt(value))}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select staff member" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {getStaffForRole(role.name).map(staff => (
                                          <SelectItem key={staff.id} value={staff.id.toString()}>
                                            {staff.name} - {staff.specialties.join(', ')}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Staff Availability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availableStaff.map(staff => (
                <div key={staff.id} className={`border rounded-lg p-3 ${staff.status === 'available' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{staff.name}</h4>
                      <p className="text-sm text-gray-600">{staff.specialties.join(', ')}</p>
                    </div>
                    <Badge variant={staff.status === 'available' ? "default" : "destructive"}>
                      {staff.status === 'available' ? 'Available' : 'Busy'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Assignment Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {operatingRooms.map(room => {
              const status = getCompletionStatus(room);
              const roomAssignments = getRoleAssignments(room);
              return (
                <div key={room} className={`border rounded-lg p-4 ${status.percentage === 100 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <h3 className="font-semibold text-center mb-2">{room}</h3>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${status.percentage === 100 ? 'text-green-600' : 'text-red-600'}`}>
                      {status.percentage}%
                    </div>
                    <div className="text-sm text-gray-600">
                      {status.completed}/{status.total} Required
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {roomAssignments.length} Total Assigned
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
