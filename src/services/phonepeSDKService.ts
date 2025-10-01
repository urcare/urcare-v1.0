/**
 * PhonePe Payment Service using Official SDK
 * Compatible with both Node.js backend and Supabase Edge Functions
 */

// For Node.js environments, we'll use dynamic import
// For Supabase Edge Functions, we'll use the manual implementation

export interface PhonePeConfig {
  merchantId: string;
  apiKey: string;
  saltIndex: string;
  environment: 'sandbox' | 'production';
  frontendUrl: string;
  backendCallbackUrl: string;
}

export interface PaymentRequest {
  orderId: string;
  amount: number; // in paise
  userId: string;
  planSlug?: string;
  billingCycle?: string;
}

export interface PaymentResponse {
  success: boolean;
  redirectUrl?: string;
  orderId?: string;
  transactionId?: string;
  merchantId?: string;
  amount?: number;
  planSlug?: string;
  billingCycle?: string;
  error?: string;
}

export interface StatusResponse {
  success: boolean;
  data?: any;
  error?: string;
}

class PhonePeSDKService {
  private config: PhonePeConfig;
  private phonepe: any = null;
  private initialized = false;

  constructor(config: PhonePeConfig) {
    this.config = config;
    console.log('🔧 PhonePe SDK Service Initialized:', {
      merchantId: config.merchantId,
      environment: config.environment,
      saltIndex: config.saltIndex,
      frontendUrl: config.frontendUrl
    });
  }

  /**
   * Initialize PhonePe SDK (Node.js only)
   */
  async initializeSDK(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log('🔄 Initializing PhonePe SDK...');
      
      // Dynamic import for CommonJS module
      const phonepeModule = await import('phonepe-pg-sdk-node');
      const { PhonePe } = phonepeModule.default || phonepeModule;

      // Initialize PhonePe SDK
      this.phonepe = new PhonePe({
        merchantId: this.config.merchantId,
        saltKey: this.config.apiKey,
        saltIndex: parseInt(this.config.saltIndex),
        environment: this.config.environment
      });

      this.initialized = true;
      console.log('✅ PhonePe SDK initialized successfully');

    } catch (error: any) {
      console.error('❌ Failed to initialize PhonePe SDK:', error);
      throw new Error(`SDK initialization failed: ${error.message}`);
    }
  }

  /**
   * Create Payment Order using SDK
   */
  async createPaymentOrder(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      await this.initializeSDK();

      console.log('📦 Creating PhonePe payment order:', request);

      // Validate input
      if (!request.orderId || !request.amount || !request.userId) {
        throw new Error('Missing required fields: orderId, amount, userId');
      }

      if (request.amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      // Create payment request payload
      const paymentRequest = {
        merchantId: this.config.merchantId,
        merchantTransactionId: request.orderId,
        merchantUserId: request.userId,
        amount: request.amount,
        redirectUrl: `${this.config.frontendUrl}/payment/success?orderId=${request.orderId}&plan=${request.planSlug || 'basic'}&cycle=${request.billingCycle || 'annual'}`,
        redirectMode: 'REDIRECT',
        callbackUrl: this.config.backendCallbackUrl,
        paymentInstrument: {
          type: 'PAY_PAGE'
        }
      };

      console.log('📤 PhonePe Payment Request:', JSON.stringify(paymentRequest, null, 2));

      // Create payment using SDK
      const response = await this.phonepe.pgPayments.pay({
        ...paymentRequest
      });

      console.log('📨 PhonePe SDK Response:', JSON.stringify(response, null, 2));

      if (response.success && response.data?.instrumentResponse?.redirectInfo?.url) {
        return {
          success: true,
          redirectUrl: response.data.instrumentResponse.redirectInfo.url,
          orderId: request.orderId,
          transactionId: request.orderId,
          merchantId: this.config.merchantId,
          amount: request.amount,
          planSlug: request.planSlug || 'basic',
          billingCycle: request.billingCycle || 'annual'
        };
      } else {
        throw new Error(response.message || 'Payment initiation failed');
      }

    } catch (error: any) {
      console.error('❌ PhonePe Payment Creation Error:', error);
      return {
        success: false,
        error: `Payment creation failed: ${error.message}`
      };
    }
  }

  /**
   * Check Payment Status using SDK
   */
  async checkPaymentStatus(transactionId: string): Promise<StatusResponse> {
    try {
      await this.initializeSDK();

      console.log('🔍 Checking PhonePe payment status:', transactionId);

      if (!transactionId) {
        throw new Error('Transaction ID is required');
      }

      // Check payment status using SDK
      const response = await this.phonepe.pgPayments.getPaymentStatus({
        merchantId: this.config.merchantId,
        transactionId: transactionId
      });

      console.log('📨 PhonePe Status Response:', JSON.stringify(response, null, 2));

      return {
        success: true,
        data: response
      };

    } catch (error: any) {
      console.error('❌ PhonePe Status Check Error:', error);
      return {
        success: false,
        error: `Status check failed: ${error.message}`
      };
    }
  }

  /**
   * Verify Payment Callback using SDK
   */
  async verifyPaymentCallback(callbackData: any): Promise<StatusResponse> {
    try {
      await this.initializeSDK();

      console.log('🔐 Verifying PhonePe payment callback:', callbackData);

      // Verify callback using SDK
      const response = await this.phonepe.pgPayments.verify({
        ...callbackData
      });

      console.log('📨 PhonePe Verification Response:', JSON.stringify(response, null, 2));

      return {
        success: true,
        data: response
      };

    } catch (error: any) {
      console.error('❌ PhonePe Callback Verification Error:', error);
      return {
        success: false,
        error: `Callback verification failed: ${error.message}`
      };
    }
  }

  /**
   * Get SDK Configuration
   */
  getConfig(): PhonePeConfig & { initialized: boolean } {
    return {
      ...this.config,
      initialized: this.initialized
    };
  }
}

// Export factory function for easy configuration
export function createPhonePeService(config: PhonePeConfig): PhonePeSDKService {
  return new PhonePeSDKService(config);
}

// Export default configuration based on environment
export function getDefaultPhonePeConfig(): PhonePeConfig {
  return {
    merchantId: 'M23XRS3XN3QMF',
    apiKey: '713219fb-38d0-468d-8268-8b15955468b0',
    saltIndex: '1',
    environment: 'production', // Change to 'sandbox' for testing
    frontendUrl: 'http://localhost:8081',
    backendCallbackUrl: 'http://localhost:8081/api/phonepe/callback'
  };
}

export default PhonePeSDKService;
