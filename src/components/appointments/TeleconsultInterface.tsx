
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Camera, Clock, FileText, Mic, Phone, Share2, Video, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const TeleconsultInterface = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{id: string, sender: string, text: string, timestamp: Date}>>([
    {id: '1', sender: 'system', text: 'Welcome to your teleconsultation session. Please wait for the doctor to join.', timestamp: new Date()}
  ]);
  const [inCall, setInCall] = useState(false);
  const [sharedFiles, setSharedFiles] = useState<Array<{id: string, name: string, type: string, size: number}>>([]);
  
  // Fetch upcoming teleconsult appointments
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['teleconsult-appointments', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const today = new Date();
      const { data, error } = await supabase
        .from('appointments')
        .select('*, doctors(*)')
        .eq('patient_id', user.id)
        .eq('status', 'scheduled')
        .eq('type', 'teleconsult')
        .gte('date_time', today.toISOString())
        .order('date_time', { ascending: true });
      
      if (error) throw error;
      
      // If no data, return a sample appointment
      if (!data || data.length === 0) {
        return [{
          id: 'sample-1',
          date_time: new Date(Date.now() + 86400000).toISOString(), // tomorrow
          doctors: { profile_id: 'Dr. Smith' },
          type: 'teleconsult',
          status: 'scheduled'
        }];
      }
      
      return data;
    },
    enabled: !!user?.id
  });
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      sender: 'you',
      text: message,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setMessage('');
    
    // Simulate doctor response
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev, 
        {
          id: `dr-${Date.now()}`,
          sender: 'doctor',
          text: 'I've received your message. Let me check your information.',
          timestamp: new Date()
        }
      ]);
    }, 2000);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Process uploaded files
    Array.from(files).forEach(file => {
      const newFile = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size
      };
      
      setSharedFiles(prev => [...prev, newFile]);
      
      // Add a message about the file
      setChatMessages(prev => [
        ...prev, 
        {
          id: `file-${Date.now()}`,
          sender: 'you',
          text: `Shared file: ${file.name}`,
          timestamp: new Date()
        }
      ]);
    });
    
    toast({
      title: "File Shared",
      description: `${files.length} file(s) shared with the doctor.`
    });
  };
  
  const handleJoinCall = () => {
    setInCall(true);
    toast({
      title: "Call Started",
      description: "You've joined the teleconsultation call."
    });
    
    // Simulate doctor joining
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev, 
        {
          id: `join-${Date.now()}`,
          sender: 'system',
          text: 'Dr. Smith has joined the call.',
          timestamp: new Date()
        }
      ]);
    }, 1500);
  };
  
  const handleEndCall = () => {
    setInCall(false);
    toast({
      title: "Call Ended",
      description: "Your teleconsultation session has ended."
    });
    
    setChatMessages(prev => [
      ...prev, 
      {
        id: `end-${Date.now()}`,
        sender: 'system',
        text: 'The call has ended. Thank you for using our teleconsultation service.',
        timestamp: new Date()
      }
    ]);
  };
  
  const handleBookTeleconsult = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select both a date and time for your teleconsultation.",
        variant: "destructive"
      });
      return;
    }
    
    // Code to book appointment would go here
    toast({
      title: "Teleconsultation Scheduled",
      description: `Your teleconsultation has been booked for ${selectedDate.toLocaleDateString()} at ${selectedTime}.`
    });
    
    // Reset form
    setSelectedTime('');
  };
  
  const formatAppointmentDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="upcoming">Upcoming Teleconsults</TabsTrigger>
        <TabsTrigger value="session">Active Session</TabsTrigger>
        <TabsTrigger value="book">Book Teleconsult</TabsTrigger>
      </TabsList>
      
      {/* Upcoming Teleconsults Tab */}
      <TabsContent value="upcoming">
        <Card>
          <CardHeader>
            <CardTitle>Your Teleconsultation Appointments</CardTitle>
            <CardDescription>
              Join your scheduled video consultations with healthcare providers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading appointments...</p>
            ) : appointments?.length ? (
              <div className="space-y-4">
                {appointments.map((appointment) => {
                  const { date, time } = formatAppointmentDate(appointment.date_time);
                  return (
                    <Card key={appointment.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-100 p-3 rounded-full">
                            <Video className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Teleconsultation with {appointment.doctors?.profile_id || 'Doctor'}</p>
                            <div className="flex items-center text-slate-500 text-sm mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{date}</span>
                              <Clock className="h-4 w-4 mx-1 ml-2" />
                              <span>{time}</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          onClick={() => {
                            setActiveTab('session');
                            setTimeout(() => handleJoinCall(), 500);
                          }}
                        >
                          Join Now
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-slate-500">No upcoming teleconsultation appointments found.</p>
                <Button className="mt-4" onClick={() => setActiveTab('book')}>
                  Book a Teleconsultation
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Active Session Tab */}
      <TabsContent value="session">
        <Card>
          <CardHeader>
            <CardTitle>Teleconsultation Session</CardTitle>
            <CardDescription>
              Connect with your healthcare provider via secure video call
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Video Call Area */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className={`bg-slate-800 rounded-lg h-72 md:h-96 flex items-center justify-center relative ${inCall ? 'border-2 border-green-500' : ''}`}>
                  {inCall ? (
                    <>
                      {/* Main video feed */}
                      <div className="text-white text-center">
                        <Avatar className="h-24 w-24 mb-4 mx-auto">
                          <AvatarImage src="https://avatars.githubusercontent.com/u/1234567" />
                          <AvatarFallback>DR</AvatarFallback>
                        </Avatar>
                        <p className="font-medium">Dr. Smith</p>
                        <p className="text-xs text-slate-400">Connected</p>
                      </div>
                      
                      {/* Self view */}
                      <div className="absolute bottom-4 right-4 w-32 h-24 bg-slate-600 rounded-lg flex items-center justify-center">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="https://avatars.githubusercontent.com/u/1234567" />
                          <AvatarFallback>YO</AvatarFallback>
                        </Avatar>
                      </div>
                      
                      {/* Call controls */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-slate-700/80 rounded-full px-4 py-2">
                        <Button size="icon" variant="ghost" className="rounded-full text-white hover:bg-slate-600">
                          <Mic className="h-5 w-5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="rounded-full text-white hover:bg-slate-600">
                          <Camera className="h-5 w-5" />
                        </Button>
                        <Button size="icon" variant="destructive" className="rounded-full" onClick={handleEndCall}>
                          <Phone className="h-5 w-5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="rounded-full text-white hover:bg-slate-600">
                          <Share2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-8">
                      <Video className="h-12 w-12 text-slate-400 mb-4 mx-auto" />
                      <h3 className="text-white font-medium text-lg">Start Video Consultation</h3>
                      <p className="text-slate-400 mb-4 max-w-sm">Connect with your doctor through secure video call</p>
                      <Button onClick={handleJoinCall}>Join Call</Button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Chat and Files Area */}
              <div>
                <Tabs defaultValue="chat">
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                    <TabsTrigger value="files">Files</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="chat" className="h-64 md:h-80">
                    <Card className="h-full flex flex-col">
                      <ScrollArea className="flex-grow p-4">
                        <div className="space-y-4">
                          {chatMessages.map(msg => (
                            <div 
                              key={msg.id} 
                              className={`flex ${msg.sender === 'you' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div 
                                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                  msg.sender === 'you' 
                                    ? 'bg-blue-500 text-white' 
                                    : msg.sender === 'system' 
                                    ? 'bg-slate-200 text-slate-700' 
                                    : 'bg-slate-100'
                                }`}
                              >
                                {msg.sender !== 'you' && msg.sender !== 'system' && (
                                  <p className="text-xs font-medium text-slate-500">Dr. Smith</p>
                                )}
                                <p>{msg.text}</p>
                                <p className="text-xs opacity-70 mt-1">
                                  {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      <div className="p-4 border-t">
                        <div className="flex space-x-2">
                          <Input 
                            placeholder="Type a message..." 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                          />
                          <Button onClick={handleSendMessage}>Send</Button>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="files" className="h-64 md:h-80">
                    <Card className="h-full flex flex-col">
                      <ScrollArea className="flex-grow p-4">
                        {sharedFiles.length > 0 ? (
                          <div className="space-y-2">
                            {sharedFiles.map(file => (
                              <div key={file.id} className="flex items-center justify-between p-2 border rounded-md">
                                <div className="flex items-center">
                                  <FileText className="h-5 w-5 mr-2 text-blue-500" />
                                  <div>
                                    <p className="text-sm font-medium">{file.name}</p>
                                    <p className="text-xs text-gray-500">
                                      {(file.size / 1024).toFixed(1)} KB
                                    </p>
                                  </div>
                                </div>
                                <Button variant="ghost" size="icon">
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-center">
                            <FileText className="h-8 w-8 text-slate-400 mb-2" />
                            <p className="text-slate-500">No files shared yet</p>
                            <p className="text-xs text-slate-400 mt-1">Share files for your consultation</p>
                          </div>
                        )}
                      </ScrollArea>
                      <div className="p-4 border-t">
                        <Input
                          type="file" 
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload">
                          <Button variant="outline" className="w-full" type="button" asChild>
                            <span>Share Files</span>
                          </Button>
                        </label>
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Book Teleconsult Tab */}
      <TabsContent value="book">
        <Card>
          <CardHeader>
            <CardTitle>Book a Teleconsultation</CardTitle>
            <CardDescription>
              Schedule a virtual appointment with a healthcare provider
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="consultation-type">Consultation Type</Label>
                  <Select defaultValue="general">
                    <SelectTrigger>
                      <SelectValue placeholder="Select consultation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Consultation</SelectItem>
                      <SelectItem value="follow-up">Follow-up Appointment</SelectItem>
                      <SelectItem value="specialist">Specialist Consultation</SelectItem>
                      <SelectItem value="mental-health">Mental Health</SelectItem>
                      <SelectItem value="prescription">Prescription Renewal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Select Department</Label>
                  <Select>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Choose a department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="dermatology">Dermatology</SelectItem>
                      <SelectItem value="neurology">Neurology</SelectItem>
                      <SelectItem value="orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="psychiatry">Psychiatry</SelectItem>
                      <SelectItem value="gp">General Practice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-sm font-medium">Time Slot</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger id="time">
                      <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="13:00">1:00 PM</SelectItem>
                      <SelectItem value="14:00">2:00 PM</SelectItem>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                      <SelectItem value="16:00">4:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Consultation</Label>
                  <Textarea id="reason" placeholder="Briefly describe your symptoms or reason for the appointment" />
                </div>
                
                <Button className="w-full" onClick={handleBookTeleconsult}>
                  Book Teleconsultation
                </Button>
              </div>
              
              <div className="space-y-4">
                <Label>Select Date</Label>
                <Card>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const day = date.getDay();
                      
                      return date < today || day === 0 || day === 6;
                    }}
                  />
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
