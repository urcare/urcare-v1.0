// PhonePe Payment Service
// Handles payment creation, verification, and webhook processing

interface PhonePeConfig {
  merchantId: string;
  secret: string;
  environment: 'sandbox' | 'production';
  baseUrl: string;
}

interface PaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  userId: string;
  planName: string;
  billingCycle: string;
}

interface PaymentResponse {
  success: boolean;
  data?: {
    transactionId: string;
    paymentUrl?: string;
    qrCode?: string;
  };
  error?: string;
}

interface WebhookData {
  transactionId: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  amount: number;
  currency: string;
  orderId: string;
  signature: string;
}

class PhonePeService {
  private config: PhonePeConfig;

  constructor() {
    this.config = {
      merchantId: import.meta.env.VITE_PHONEPE_MERCHANT_ID || '',
      secret: import.meta.env.VITE_PHONEPE_SECRET || '',
      environment: (import.meta.env.VITE_PHONEPE_ENV as 'sandbox' | 'production') || 'sandbox',
      baseUrl: import.meta.env.VITE_PHONEPE_BASE_URL || 'https://api.phonepe.com/apis/pg-sandbox'
    };
  }

  // Create payment order
  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await fetch('/api/phonepe/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: request.amount,
          currency: request.currency,
          orderId: request.orderId,
          userId: request.userId,
          planName: request.planName,
          billingCycle: request.billingCycle,
          redirectUrl: `${window.location.origin}/payment/phonepe/success`,
          webhookUrl: `${window.location.origin}/api/phonepe/webhook`
        })
      });

      if (!response.ok) {
        throw new Error(`Payment creation failed: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: {
          transactionId: data.transactionId,
          paymentUrl: data.paymentUrl,
          qrCode: data.qrCode
        }
      };
    } catch (error) {
      console.error('PhonePe payment creation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment creation failed'
      };
    }
  }

  // Verify payment status
  async verifyPayment(transactionId: string): Promise<PaymentResponse> {
    try {
      const response = await fetch(`/api/phonepe/status/${transactionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Payment verification failed: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: {
          transactionId: data.transactionId,
          status: data.status
        }
      };
    } catch (error) {
      console.error('PhonePe payment verification error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment verification failed'
      };
    }
  }

  // Generate order ID
  generateOrderId(): string {
    return `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Validate webhook signature
  validateWebhookSignature(payload: any, signature: string): boolean {
    // This should be implemented on the server side for security
    // For now, we'll return true for demo purposes
    return true;
  }

  // Process webhook data
  async processWebhook(webhookData: WebhookData): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('/api/phonepe/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });

      if (!response.ok) {
        throw new Error(`Webhook processing failed: ${response.status}`);
      }

      return { success: true };
    } catch (error) {
      console.error('PhonePe webhook processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Webhook processing failed'
      };
    }
  }
}

// Export singleton instance
export const phonepeService = new PhonePeService();
export default phonepeService;