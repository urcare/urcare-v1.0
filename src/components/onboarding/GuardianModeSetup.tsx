
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const guardianSchema = z.object({
  enableGuardian: z.boolean().default(false),
  relationship: z.string().optional(),
  guardianName: z.string().min(2, { message: 'Name must be at least 2 characters' }).optional(),
  guardianPhone: z.string().regex(/^\d{10}$/, { message: 'Phone number must be 10 digits' }).optional(),
  guardianEmail: z.string().email({ message: 'Please enter a valid email' }).optional(),
  accessLevel: z.enum(['full', 'limited', 'emergency']).optional(),
});

type GuardianRelationship = 'parent' | 'child' | 'spouse' | 'sibling' | 'caretaker' | 'other';

const GuardianModeSetup = () => {
  const [enableGuardian, setEnableGuardian] = useState(false);
  
  const form = useForm<z.infer<typeof guardianSchema>>({
    resolver: zodResolver(guardianSchema),
    defaultValues: {
      enableGuardian: false,
      relationship: undefined,
      guardianName: '',
      guardianPhone: '',
      guardianEmail: '',
      accessLevel: 'limited',
    },
  });
  
  const relationships: { value: GuardianRelationship; label: string }[] = [
    { value: 'parent', label: 'Parent' },
    { value: 'child', label: 'Child' },
    { value: 'spouse', label: 'Spouse' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'caretaker', label: 'Caretaker' },
    { value: 'other', label: 'Other' },
  ];
  
  const accessLevels = [
    { value: 'full', label: 'Full Access', description: 'Can view and manage all health records and appointments' },
    { value: 'limited', label: 'Limited Access', description: 'Can view health records but cannot make changes' },
    { value: 'emergency', label: 'Emergency Only', description: 'Access only in emergency situations' },
  ];
  
  const onSubmit = (data: z.infer<typeof guardianSchema>) => {
    console.log('Guardian data:', data);
    toast.success('Guardian access configured successfully');
  };
  
  const handleGuardianToggle = (checked: boolean) => {
    setEnableGuardian(checked);
    form.setValue('enableGuardian', checked);
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Guardian Mode Setup</h2>
        <p className="text-muted-foreground mt-2">
          Allow trusted individuals to access and manage your health profile when needed.
        </p>
      </div>
      
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
        <div>
          <h3 className="text-lg font-medium">Enable Guardian Mode</h3>
          <p className="text-sm text-muted-foreground">
            Allow a trusted person to access your medical information
          </p>
        </div>
        <Switch 
          checked={enableGuardian}
          onCheckedChange={handleGuardianToggle}
        />
      </div>
      
      {enableGuardian && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship to Guardian</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {relationships.map(relationship => (
                        <SelectItem 
                          key={relationship.value} 
                          value={relationship.value}
                        >
                          {relationship.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How is this person related to you?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="guardianName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guardian's Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="guardianPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guardian's Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="guardianEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guardian's Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    We'll send an invitation to this email address.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="accessLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Access Level</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {accessLevels.map(level => (
                      <Card 
                        key={level.value}
                        className={`cursor-pointer hover:border-primary transition-colors ${field.value === level.value ? 'border-primary bg-primary/5' : ''}`}
                        onClick={() => form.setValue('accessLevel', level.value as any)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-4 h-4 rounded-full ${field.value === level.value ? 'bg-primary' : 'bg-gray-200'}`}></div>
                            <h4 className="font-medium">{level.label}</h4>
                          </div>
                          <p className="text-xs text-muted-foreground">{level.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mt-4">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Your guardian will receive an email invitation to create an account and connect to your profile.
              </p>
            </div>
            
            <Button type="submit" className="w-full">Save Guardian Settings</Button>
          </form>
        </Form>
      )}
      
      {!enableGuardian && (
        <div className="bg-slate-100 p-6 rounded-lg text-center">
          <p className="text-muted-foreground">
            Guardian mode is disabled. Enable it to allow trusted individuals to access your profile.
          </p>
        </div>
      )}
    </div>
  );
};

export default GuardianModeSetup;
