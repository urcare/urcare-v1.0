
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const emergencyProfileSchema = z.object({
  enableICE: z.boolean().default(true),
  emergencyContactName: z.string().min(2, { message: 'Name must be at least 2 characters' }).optional(),
  emergencyContactPhone: z.string().regex(/^\d{10}$/, { message: 'Phone number must be 10 digits' }).optional(),
  emergencyContactRelationship: z.string().optional(),
  bloodType: z.string().optional(),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  medicalConditions: z.string().optional(),
  organDonor: z.boolean().default(false),
  showOnLockScreen: z.boolean().default(true),
});

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const EmergencyProfile = () => {
  const form = useForm<z.infer<typeof emergencyProfileSchema>>({
    resolver: zodResolver(emergencyProfileSchema),
    defaultValues: {
      enableICE: true,
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelationship: '',
      bloodType: '',
      allergies: '',
      medications: '',
      medicalConditions: '',
      organDonor: false,
      showOnLockScreen: true,
    },
  });
  
  const enableICE = form.watch('enableICE');
  
  const onSubmit = (data: z.infer<typeof emergencyProfileSchema>) => {
    console.log('Emergency profile data:', data);
    toast.success('Emergency profile saved successfully');
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Emergency Profile (ICE)</h2>
        <p className="text-muted-foreground mt-2">
          Set up your In Case of Emergency profile to help first responders.
        </p>
      </div>
      
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
        <div>
          <h3 className="text-lg font-medium">Enable Emergency Profile</h3>
          <p className="text-sm text-muted-foreground">
            Make critical medical information available in emergencies
          </p>
        </div>
        <FormField
          control={form.control}
          name="enableICE"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Switch 
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      {enableICE && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h3 className="text-red-800 font-medium mb-2">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="emergencyContactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="emergencyContactRelationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Spouse, Parent, Friend" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Medical Information</h3>
              
              <FormField
                control={form.control}
                name="bloodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Type</FormLabel>
                    <div className="grid grid-cols-4 gap-2">
                      {bloodTypes.map(type => (
                        <Card 
                          key={type}
                          className={`cursor-pointer hover:border-primary transition-colors ${field.value === type ? 'border-primary bg-primary/5' : ''}`}
                          onClick={() => form.setValue('bloodType', type)}
                        >
                          <CardContent className="p-3 text-center">
                            {type}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allergies</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="List any allergies (e.g., medications, food, etc.)"
                        className="h-20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="medications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Medications</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="List current medications and dosages"
                        className="h-20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="medicalConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical Conditions</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="List any medical conditions (e.g., diabetes, asthma, etc.)"
                        className="h-20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Settings</h3>
              
              <FormField
                control={form.control}
                name="organDonor"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-base">Organ Donor</FormLabel>
                      <FormDescription>
                        I wish to be an organ donor in the event of my death.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="showOnLockScreen"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-base">Show on Lock Screen</FormLabel>
                      <FormDescription>
                        Make this information accessible from your device's lock screen in an emergency.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
              <p className="text-sm text-amber-700">
                <strong>Important:</strong> This information will be available to emergency responders. Only include information that may be critical in an emergency situation.
              </p>
            </div>
            
            <Button type="submit" className="w-full">Save Emergency Profile</Button>
          </form>
        </Form>
      )}
      
      {!enableICE && (
        <div className="bg-slate-100 p-6 rounded-lg text-center">
          <p className="text-muted-foreground">
            Emergency profile is disabled. Enable it to create your ICE profile.
          </p>
        </div>
      )}
    </div>
  );
};

export default EmergencyProfile;
