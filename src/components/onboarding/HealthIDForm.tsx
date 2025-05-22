
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';

const aadhaarSchema = z.object({
  aadhaarNumber: z.string().length(12, { message: 'Aadhaar number must be 12 digits' }).regex(/^\d+$/, { message: 'Aadhaar number must contain only digits' }),
});

const otpSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be 6 digits' }),
});

const HealthIDForm = () => {
  const [verificationStep, setVerificationStep] = useState<'aadhaar' | 'otp' | 'success'>('aadhaar');
  
  const aadhaarForm = useForm<z.infer<typeof aadhaarSchema>>({
    resolver: zodResolver(aadhaarSchema),
    defaultValues: {
      aadhaarNumber: '',
    },
  });
  
  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });
  
  const onAadhaarSubmit = (data: z.infer<typeof aadhaarSchema>) => {
    // In a real implementation, this would send the Aadhaar number to an API
    console.log('Aadhaar submitted:', data);
    toast.success('OTP sent to your registered mobile number');
    setVerificationStep('otp');
  };
  
  const onOTPSubmit = (data: z.infer<typeof otpSchema>) => {
    // In a real implementation, this would verify the OTP with an API
    console.log('OTP submitted:', data);
    toast.success('Health ID linked successfully');
    setVerificationStep('success');
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Link Your Health ID</h2>
        <p className="text-muted-foreground mt-2">
          Connect your National Health ID with your UrCare profile for seamless healthcare access.
        </p>
      </div>
      
      {verificationStep === 'aadhaar' && (
        <Form {...aadhaarForm}>
          <form onSubmit={aadhaarForm.handleSubmit(onAadhaarSubmit)} className="space-y-6">
            <FormField
              control={aadhaarForm.control}
              name="aadhaarNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aadhaar Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your 12-digit Aadhaar number" 
                      {...field} 
                      maxLength={12}
                    />
                  </FormControl>
                  <FormDescription>
                    We'll use this to verify your identity and link your Health ID.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
              <p className="text-sm text-amber-700">
                <strong>Privacy Note:</strong> Your Aadhaar information is used only for verification and is not stored on our servers.
              </p>
            </div>
            
            <Button type="submit" className="w-full">Send OTP</Button>
          </form>
        </Form>
      )}
      
      {verificationStep === 'otp' && (
        <Form {...otpForm}>
          <form onSubmit={otpForm.handleSubmit(onOTPSubmit)} className="space-y-6">
            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Enter the 6-digit code sent to your registered mobile number.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setVerificationStep('aadhaar')}
              >
                Back
              </Button>
              <Button type="submit">Verify OTP</Button>
            </div>
          </form>
        </Form>
      )}
      
      {verificationStep === 'success' && (
        <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-green-800 mb-2">Health ID Successfully Linked</h3>
          <p className="text-green-700 mb-4">
            Your Health ID has been successfully linked to your UrCare profile.
          </p>
          <p className="text-green-600 font-medium">
            Health ID: ABCD-1234-5678-9XYZ
          </p>
        </div>
      )}
    </div>
  );
};

export default HealthIDForm;
