// Email service for sending verification codes
// This is a mock implementation - in production, you would integrate with a real email service

interface VerificationData {
  email: string;
  fullName: string;
  resend?: boolean;
}

interface VerificationResult {
  success: boolean;
  message: string;
  code?: string;
}

// Mock verification codes storage (in production, use a database)
const verificationCodes = new Map<string, { code: string; expires: number; userData: any }>();

// Generate a 6-digit verification code
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Clean up expired codes
const cleanupExpiredCodes = () => {
  const now = Date.now();
  for (const [email, data] of verificationCodes.entries()) {
    if (data.expires < now) {
      verificationCodes.delete(email);
    }
  }
};

export const emailService = {
  // Send verification code
  async sendVerificationCode(data: VerificationData): Promise<VerificationResult> {
    try {
      cleanupExpiredCodes();
      
      const { email, fullName, resend = false } = data;
      
      // Check if email already has a valid code (unless resending)
      if (!resend && verificationCodes.has(email)) {
        const existingData = verificationCodes.get(email);
        if (existingData && existingData.expires > Date.now()) {
          return {
            success: false,
            message: 'Verification code already sent. Please check your email or wait before requesting a new one.'
          };
        }
      }
      
      // Generate new verification code
      const code = generateVerificationCode();
      const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
      
      // Store verification data
      verificationCodes.set(email, {
        code,
        expires,
        userData: { email, fullName }
      });
      
      // In production, you would send an actual email here
      // For now, we'll just log it and return success
      console.log(`📧 Verification code for ${email}: ${code}`);
      console.log(`📧 Email would be sent to: ${email}`);
      console.log(`📧 Subject: Verify your UrCare account`);
      console.log(`📧 Body: Hi ${fullName}, your verification code is: ${code}. This code expires in 5 minutes.`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'Verification code sent successfully',
        code: process.env.NODE_ENV === 'development' ? code : undefined // Only return code in development
      };
    } catch (error) {
      console.error('Email service error:', error);
      return {
        success: false,
        message: 'Failed to send verification code. Please try again.'
      };
    }
  },

  // Verify code
  async verifyCode(email: string, code: string): Promise<{ success: boolean; message: string; userData?: any }> {
    try {
      cleanupExpiredCodes();
      
      const storedData = verificationCodes.get(email);
      
      if (!storedData) {
        return {
          success: false,
          message: 'No verification code found for this email. Please request a new one.'
        };
      }
      
      if (storedData.expires < Date.now()) {
        verificationCodes.delete(email);
        return {
          success: false,
          message: 'Verification code has expired. Please request a new one.'
        };
      }
      
      if (storedData.code !== code) {
        return {
          success: false,
          message: 'Invalid verification code. Please check and try again.'
        };
      }
      
      // Code is valid, remove it from storage
      const userData = storedData.userData;
      verificationCodes.delete(email);
      
      return {
        success: true,
        message: 'Email verified successfully',
        userData
      };
    } catch (error) {
      console.error('Verification error:', error);
      return {
        success: false,
        message: 'Verification failed. Please try again.'
      };
    }
  },

  // Check if email has pending verification
  hasPendingVerification(email: string): boolean {
    cleanupExpiredCodes();
    const storedData = verificationCodes.get(email);
    return storedData ? storedData.expires > Date.now() : false;
  },

  // Get stored verification data
  getVerificationData(email: string): any {
    cleanupExpiredCodes();
    const storedData = verificationCodes.get(email);
    return storedData ? storedData.userData : null;
  }
};

// Mock API endpoints for the frontend
export const mockEmailAPI = {
  // Send verification code endpoint
  async sendVerification(data: VerificationData): Promise<Response> {
    const result = await emailService.sendVerificationCode(data);
    
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { 'Content-Type': 'application/json' }
    });
  },

  // Verify code endpoint
  async verifyEmail(email: string, code: string): Promise<Response> {
    const result = await emailService.verifyCode(email, code);
    
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
