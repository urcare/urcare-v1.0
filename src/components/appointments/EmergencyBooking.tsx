
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const emergencyTypes = [
  { value: 'urgent_care', label: 'Urgent Care (Not Life Threatening)' },
  { value: 'emergency', label: 'Emergency (Serious but Stable)' },
  { value: 'critical', label: 'Critical (Life Threatening)' },
];

export const EmergencyBooking = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [symptoms, setSymptoms] = useState('');
  const [emergencyType, setEmergencyType] = useState('urgent_care');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPreexistingCondition, setHasPreexistingCondition] = useState(false);
  const [preexistingConditions, setPreexistingConditions] = useState('');
  const [isPatientMinor, setIsPatientMinor] = useState(false);
  
  const handleEmergencyBooking = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to book an emergency appointment.",
        variant: "destructive"
      });
      return;
    }
    
    if (!symptoms) {
      toast({
        title: "Information Required",
        description: "Please describe your symptoms for proper triage.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // In a real application, determine priority based on emergencyType
      let priorityLevel = 0;
      switch (emergencyType) {
        case 'critical': priorityLevel = 1; break;
        case 'emergency': priorityLevel = 2; break;
        case 'urgent_care': priorityLevel = 3; break;
        default: priorityLevel = 3;
      }
      
      // Create an emergency appointment record
      const now = new Date();
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          patient_id: user.id,
          // In a real app, you would assign a doctor based on specialty needed
          doctor_id: 'emergency_doctor', // This would be replaced with actual doctor ID
          date_time: now.toISOString(),
          type: 'emergency',
          status: 'scheduled',
          notes: `PRIORITY: ${priorityLevel}. Symptoms: ${symptoms}. 
                 ${hasPreexistingCondition ? `Pre-existing: ${preexistingConditions}` : 'No pre-existing conditions.'} 
                 Emergency Contact: ${contactName} (${contactPhone}). 
                 ${isPatientMinor ? 'MINOR PATIENT' : ''}`
        });
      
      if (error) throw error;
      
      toast({
        title: "Emergency Request Submitted",
        description: "A medical professional will attend to you as soon as possible.",
      });
      
      // Reset form after submission
      setSymptoms('');
      setEmergencyType('urgent_care');
      setContactName('');
      setContactPhone('');
      setHasPreexistingCondition(false);
      setPreexistingConditions('');
      setIsPatientMinor(false);
      
    } catch (error) {
      console.error('Emergency booking error:', error);
      toast({
        title: "Booking Error",
        description: "There was a problem submitting your emergency request. Please call our emergency number directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="grid gap-6">
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="bg-red-100">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-6 w-6" />
            <CardTitle>Emergency Fast Booking</CardTitle>
          </div>
          <CardDescription className="text-red-700 font-medium">
            For immediate life-threatening emergencies, please call 911 or your local emergency number!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="emergency-type">Emergency Type</Label>
            <RadioGroup defaultValue={emergencyType} onValueChange={setEmergencyType} className="grid gap-3">
              {emergencyTypes.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={type.value} id={type.value} />
                  <Label htmlFor={type.value}>{type.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="symptoms">Describe Symptoms or Emergency</Label>
            <Textarea 
              id="symptoms" 
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Please describe what you're experiencing in detail..."
              className="min-h-[120px]"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Emergency Contact Name</Label>
              <Input 
                id="contact-name" 
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-phone">Emergency Contact Phone</Label>
              <Input 
                id="contact-phone" 
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="Phone number"
                type="tel"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="has-conditions" 
                checked={hasPreexistingCondition}
                onCheckedChange={(checked) => setHasPreexistingCondition(checked === true)}
              />
              <Label htmlFor="has-conditions">I have pre-existing medical conditions</Label>
            </div>
            
            {hasPreexistingCondition && (
              <Textarea 
                id="conditions" 
                value={preexistingConditions}
                onChange={(e) => setPreexistingConditions(e.target.value)}
                placeholder="Please list any pre-existing conditions, allergies, or medications..."
                className="mt-2"
              />
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="is-minor" 
              checked={isPatientMinor}
              onCheckedChange={(checked) => setIsPatientMinor(checked === true)}
            />
            <Label htmlFor="is-minor">Patient is under 18 years old</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleEmergencyBooking} 
            className="w-full bg-red-600 hover:bg-red-700"
            disabled={isSubmitting || !symptoms}
          >
            {isSubmitting ? "Submitting..." : "Request Emergency Appointment"}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>When to use Emergency Booking</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Urgent Care:</strong> Non-life-threatening issues requiring prompt attention (sprains, minor cuts, fever)</li>
            <li><strong>Emergency:</strong> Serious conditions requiring quick medical attention (broken bones, severe pain)</li>
            <li><strong>Critical:</strong> Life-threatening conditions (chest pain, difficulty breathing, severe bleeding)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
