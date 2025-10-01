import pkg from 'phonepe-pg-sdk-node';
const { PhonePe } = pkg;
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * PhonePe Payment Service using Official SDK
 * Compatible with Supabase Edge Functions and Node.js backends
 */
class PhonePeService {
  constructor() {
    this.merchantId = process.env.PHONEPE_MERCHANT_ID || 'M23XRS3XN3QMF';
    this.apiKey = process.env.PHONEPE_API_KEY || '713219fb-38d0-468d-8268-8b15955468b0';
    this.saltIndex = process.env.PHONEPE_SALT_INDEX || '1';
    this.environment = process.env.PHONEPE_ENVIRONMENT || 'sandbox';
    this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8081';
    this.backendCallbackUrl = process.env.BACKEND_CALLBACK_URL || 'http://localhost:8081/api/phonepe/callback';

    // Initialize PhonePe SDK
    this.phonepe = new PhonePe({
      merchantId: this.merchantId,
      saltKey: this.apiKey,
      saltIndex: parseInt(this.saltIndex),
      environment: this.environment // 'sandbox' or 'production'
    });

    console.log('🔧 PhonePe SDK Initialized:', {
      merchantId: this.merchantId,
      environment: this.environment,
      saltIndex: this.saltIndex,
      frontendUrl: this.frontendUrl
    });
  }

  /**
   * Create Payment Order
   * @param {Object} params - Payment parameters
   * @param {string} params.orderId - Unique order ID
   * @param {number} params.amount - Amount in paise
   * @param {string} params.userId - User ID
   * @param {string} params.planSlug - Plan slug (optional)
   * @param {string} params.billingCycle - Billing cycle (optional)
   * @returns {Promise<Object>} Payment response
   */
  async createPaymentOrder({ orderId, amount, userId, planSlug = 'basic', billingCycle = 'annual' }) {
    try {
      console.log('📦 Creating PhonePe payment order:', {
        orderId,
        amount,
        userId,
        planSlug,
        billingCycle
      });

      // Validate input
      if (!orderId || !amount || !userId) {
        throw new Error('Missing required fields: orderId, amount, userId');
      }

      if (amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      // Create payment request payload
      const paymentRequest = {
        merchantId: this.merchantId,
        merchantTransactionId: orderId,
        merchantUserId: userId,
        amount: amount, // Amount in paise
        redirectUrl: `${this.frontendUrl}/payment/success?orderId=${orderId}&plan=${planSlug}&cycle=${billingCycle}`,
        redirectMode: 'REDIRECT',
        callbackUrl: this.backendCallbackUrl,
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
          orderId: orderId,
          transactionId: orderId,
          merchantId: this.merchantId,
          amount: amount,
          planSlug: planSlug,
          billingCycle: billingCycle
        };
      } else {
        throw new Error(response.message || 'Payment initiation failed');
      }

    } catch (error) {
      console.error('❌ PhonePe Payment Creation Error:', error);
      throw new Error(`Payment creation failed: ${error.message}`);
    }
  }

  /**
   * Check Payment Status
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<Object>} Payment status
   */
  async checkPaymentStatus(transactionId) {
    try {
      console.log('🔍 Checking PhonePe payment status:', transactionId);

      if (!transactionId) {
        throw new Error('Transaction ID is required');
      }

      // Check payment status using SDK
      const response = await this.phonepe.pgPayments.getPaymentStatus({
        merchantId: this.merchantId,
        transactionId: transactionId
      });

      console.log('📨 PhonePe Status Response:', JSON.stringify(response, null, 2));

      return {
        success: true,
        data: response
      };

    } catch (error) {
      console.error('❌ PhonePe Status Check Error:', error);
      throw new Error(`Status check failed: ${error.message}`);
    }
  }

  /**
   * Verify Payment Callback
   * @param {Object} callbackData - Callback data from PhonePe
   * @returns {Promise<Object>} Verification result
   */
  async verifyPaymentCallback(callbackData) {
    try {
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

    } catch (error) {
      console.error('❌ PhonePe Callback Verification Error:', error);
      throw new Error(`Callback verification failed: ${error.message}`);
    }
  }

  /**
   * Get SDK Configuration
   * @returns {Object} SDK configuration
   */
  getConfig() {
    return {
      merchantId: this.merchantId,
      environment: this.environment,
      saltIndex: this.saltIndex,
      frontendUrl: this.frontendUrl,
      backendCallbackUrl: this.backendCallbackUrl
    };
  }
}

export default PhonePeService;
