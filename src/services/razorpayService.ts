import { supabase } from '@/integrations/supabase/client';
import {
  CreateOrderRequest,
  PaymentVerificationRequest,
  SubscriptionPaymentData,
  RazorpayWebhookPayload,
  RazorpayOrder,
  RazorpayPayment
} from '@/types/razorpay';
import { subscriptionService } from './subscriptionService';

class RazorpayService {
  private readonly baseUrl = import.meta.env.VITE_SUPABASE_URL;
  private readonly apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  /**
   * Get user's currency based on location
   */
  private async getUserCurrency(userId: string): Promise<string> {
    try {
      // Get user profile to determine location
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('country, currency')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Could not fetch user profile, using default currency:', error);
        return 'INR'; // Default to INR
      }

      // Return user's preferred currency or default based on country
      if (profile?.currency) {
        return profile.currency;
      }

      // Map common countries to currencies
      const countryCurrencyMap: Record<string, string> = {
        'IN': 'INR',
        'US': 'USD',
        'GB': 'GBP',
        'EU': 'EUR',
        'CA': 'CAD',
        'AU': 'AUD',
        'JP': 'JPY',
        'SG': 'SGD',
        'AE': 'AED',
        'SA': 'SAR'
      };

      return countryCurrencyMap[profile?.country || 'IN'] || 'INR';
    } catch (error) {
      console.error('Error getting user currency:', error);
      return 'INR'; // Fallback to INR
    }
  }

  /**
   * Convert amount to smallest currency unit (paise for INR, cents for USD, etc.)
   */
  private convertToSmallestUnit(amount: number, currency: string): number {
    const currencyMultipliers: Record<string, number> = {
      'INR': 100,  // 1 INR = 100 paise
      'USD': 100,  // 1 USD = 100 cents
      'EUR': 100,  // 1 EUR = 100 cents
      'GBP': 100,  // 1 GBP = 100 pence
      'CAD': 100,  // 1 CAD = 100 cents
      'AUD': 100,  // 1 AUD = 100 cents
      'JPY': 1,    // 1 JPY = 1 yen (no smaller unit)
      'SGD': 100,  // 1 SGD = 100 cents
      'AED': 100,  // 1 AED = 100 fils
      'SAR': 100   // 1 SAR = 100 halalas
    };

    const multiplier = currencyMultipliers[currency] || 100;
    return Math.round(amount * multiplier);
  }

  /**
   * Create Razorpay order with international payment support
   */
  async createOrder(paymentData: SubscriptionPaymentData): Promise<RazorpayOrder> {
    try {
      const currency = await this.getUserCurrency(paymentData.userId);
      const amountInSmallestUnit = this.convertToSmallestUnit(paymentData.amount, currency);

      const orderRequest: CreateOrderRequest = {
        amount: amountInSmallestUnit,
        currency: currency,
        receipt: this.generateReceiptId(paymentData.userId, paymentData.planSlug),
        notes: {
          userId: paymentData.userId,
          planSlug: paymentData.planSlug,
          billingCycle: paymentData.billingCycle,
          isFirstTime: paymentData.isFirstTime.toString(),
          originalAmount: paymentData.amount.toString(),
          currency: currency
        }
      };

      const response = await fetch(`${this.baseUrl}/functions/v1/create-razorpay-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(orderRequest)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  }

  /**
   * Verify payment signature and process subscription
   */
  async verifyPayment(
    paymentId: string,
    orderId: string,
    signature: string,
    userId: string
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
        body: {
          razorpay_payment_id: paymentId,
          razorpay_order_id: orderId,
          razorpay_signature: signature,
          userId
        }
      });

      if (error) {
        throw new Error(`Payment verification failed: ${error.message}`);
      }

      return data.success;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  /**
   * Process webhook from Razorpay
   */
  async processWebhook(webhookPayload: RazorpayWebhookPayload): Promise<void> {
    try {
      const { data, error } = await supabase.functions.invoke('process-razorpay-webhook', {
        body: webhookPayload
      });

      if (error) {
        throw new Error(`Webhook processing failed: ${error.message}`);
      }

      console.log('Webhook processed successfully:', data);
    } catch (error) {
      console.error('Error processing webhook:', error);
      throw error;
    }
  }

  /**
   * Get payment details by payment ID
   */
  async getPaymentDetails(paymentId: string): Promise<RazorpayPayment | null> {
    try {
      const { data, error } = await supabase.functions.invoke('get-razorpay-payment', {
        body: { payment_id: paymentId }
      });

      if (error) {
        throw new Error(`Failed to get payment details: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error getting payment details:', error);
      throw error;
    }
  }

  /**
   * Refund a payment
   */
  async refundPayment(paymentId: string, amount?: number, notes?: string): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('refund-razorpay-payment', {
        body: {
          payment_id: paymentId,
          amount,
          notes
        }
      });

      if (error) {
        throw new Error(`Failed to refund payment: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error refunding payment:', error);
      throw error;
    }
  }

  /**
   * Get order details by order ID
   */
  async getOrderDetails(orderId: string): Promise<RazorpayOrder | null> {
    try {
      const { data, error } = await supabase.functions.invoke('get-razorpay-order', {
        body: { order_id: orderId }
      });

      if (error) {
        throw new Error(`Failed to get order details: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error getting order details:', error);
      throw error;
    }
  }

  /**
   * Calculate amount with currency conversion
   */
  async calculateAmount(planSlug: string, billingCycle: 'monthly' | 'annual', isFirstTime: boolean, userId: string): Promise<{ amount: number; currency: string }> {
    try {
      const currency = await this.getUserCurrency(userId);

      // Get plan pricing
      const { data: plan, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('slug', planSlug)
        .single();

      if (error || !plan) {
        throw new Error('Plan not found');
      }

      // Determine base price
      let basePrice: number;
      if (isFirstTime) {
        basePrice = billingCycle === 'monthly'
          ? (plan.price_first_time_monthly || plan.price_monthly)
          : (plan.price_first_time_annual || plan.price_annual);
      } else {
        basePrice = billingCycle === 'monthly' ? plan.price_monthly : plan.price_annual;
      }

      // Convert to user's currency if needed
      const convertedAmount = await this.convertCurrency(basePrice, 'INR', currency);

      return {
        amount: convertedAmount,
        currency: currency
      };
    } catch (error) {
      console.error('Error calculating amount:', error);
      // Fallback to INR
      const basePrice = isFirstTime ? 10 : 12; // Basic plan fallback
      return {
        amount: basePrice,
        currency: 'INR'
      };
    }
  }

  /**
   * Convert currency using exchange rates
   * Note: In production, you should use a reliable exchange rate API
   */
  private async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    // Simple conversion rates (in production, use real-time rates)
    const conversionRates: Record<string, number> = {
      'USD': 83.0,  // 1 USD = 83 INR
      'EUR': 90.0,  // 1 EUR = 90 INR
      'GBP': 105.0, // 1 GBP = 105 INR
      'CAD': 61.0,  // 1 CAD = 61 INR
      'AUD': 54.0,  // 1 AUD = 54 INR
      'JPY': 0.56,  // 1 JPY = 0.56 INR
      'SGD': 61.0,  // 1 SGD = 61 INR
      'AED': 22.6,  // 1 AED = 22.6 INR
      'SAR': 22.1   // 1 SAR = 22.1 INR
    };

    const rate = conversionRates[toCurrency] || 1;
    return Math.round(amount * rate * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Generate receipt ID for order
   */
  generateReceiptId(userId: string, planSlug: string): string {
    const timestamp = Date.now();
    return `urcare_${userId}_${planSlug}_${timestamp}`;
  }
}

export const razorpayService = new RazorpayService(); 