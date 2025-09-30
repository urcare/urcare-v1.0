// PhonePe Client Utility for Frontend
class PhonePeClient {
  constructor() {
    this.baseUrl = import.meta.env.VITE_SUPABASE_URL;
    this.merchantId = 'M23XRS3XN3QMF';
    this.clientId = 'SU2509291721337653559173';
    this.keyIndex = '1';
    this.apiKey = '713219fb-38d0-468d-8268-8b15955468b0';
    this.environment = 'SANDBOX'; // Change to PRODUCTION when going live
  }

  // Generate UUID for merchant order ID
  generateMerchantOrderId() {
    return `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Initiate payment via PhonePe checkout page
  async initiatePayment(amount, userId, planSlug, billingCycle) {
    try {
      const merchantOrderId = this.generateMerchantOrderId();
      const redirectUrl = `${window.location.origin}/phonecheckout/result?orderId=${merchantOrderId}&plan=${planSlug}&cycle=${billingCycle}`;

      const response = await fetch(`${this.baseUrl}/functions/v1/phonepe-create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          amount: amount,
          userId: userId,
          planSlug: planSlug,
          billingCycle: billingCycle,
          merchantOrderId: merchantOrderId,
          redirectUrl: redirectUrl
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Payment initiation failed');
      }

      return {
        success: true,
        checkoutUrl: data.redirectUrl,
        orderId: merchantOrderId
      };
    } catch (error) {
      console.error('Payment initiation error:', error);
      throw error;
    }
  }

  // Check payment status
  async checkPaymentStatus(orderId) {
    try {
      const response = await fetch(`${this.baseUrl}/functions/v1/phonepe-payment-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          transactionId: orderId
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Status check failed');
      }

      return {
        success: true,
        status: data.code,
        data: data
      };
    } catch (error) {
      console.error('Payment status check error:', error);
      throw error;
    }
  }

  // Create SDK order for Frontend SDK integration
  async createSdkOrder(amount, userId, planSlug, billingCycle) {
    try {
      const merchantOrderId = this.generateMerchantOrderId();
      const redirectUrl = `${window.location.origin}/phonecheckout/result?orderId=${merchantOrderId}&plan=${planSlug}&cycle=${billingCycle}`;

      const response = await fetch(`${this.baseUrl}/functions/v1/phonepe-create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          amount: amount,
          userId: userId,
          planSlug: planSlug,
          billingCycle: billingCycle,
          merchantOrderId: merchantOrderId,
          redirectUrl: redirectUrl,
          sdkMode: true
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'SDK order creation failed');
      }

      return {
        success: true,
        token: data.token,
        orderId: merchantOrderId,
        checkoutUrl: data.redirectUrl
      };
    } catch (error) {
      console.error('SDK order creation error:', error);
      throw error;
    }
  }
}

// Create singleton instance
const phonePeClient = new PhonePeClient();
Object.freeze(phonePeClient);

export default phonePeClient;
