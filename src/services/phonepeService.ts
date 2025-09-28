import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface PaymentInitiationRequest {
  user_id: string;
  plan_id: string;
  billing_cycle: "monthly" | "annual";
  amount: number;
  currency?: string;
  payment_method: "card" | "upi" | "netbanking" | "wallet";
  redirect_url?: string;
  callback_url?: string;
}

export interface PaymentInitiationResponse {
  success: boolean;
  payment_id: string;
  merchant_transaction_id: string;
  phonepe_transaction_id: string;
  redirect_url: string;
  payment_url: string;
}

export interface PaymentStatusRequest {
  merchant_transaction_id: string;
  transaction_id?: string;
}

export interface PaymentStatusResponse {
  success: boolean;
  payment: {
    id: string;
    status: string;
    amount: number;
    currency: string;
    payment_method: string;
    billing_cycle: string;
    created_at: string;
    processed_at: string | null;
  };
  phonepe_response: any;
}

export interface RefundRequest {
  payment_id: string;
  refund_amount?: number;
  reason?: string;
}

export interface RefundResponse {
  success: boolean;
  refund_id: string;
  refund_amount: number;
  payment_id: string;
  phonepe_response: any;
}

export interface VPAValidationRequest {
  vpa: string;
}

export interface VPAValidationResponse {
  success: boolean;
  valid: boolean;
  vpa: string;
  message: string;
  phonepe_response: any;
  decoded_response: any;
}

export interface PaymentOptionsRequest {
  amount?: number;
  currency?: string;
}

export interface PaymentOptionsResponse {
  success: boolean;
  payment_options: {
    upi: {
      enabled: boolean;
      methods: string[];
    };
    card: {
      enabled: boolean;
      methods: string[];
    };
    netbanking: {
      enabled: boolean;
      methods: string[];
    };
    wallet: {
      enabled: boolean;
      methods: string[];
    };
  };
  message: string;
  phonepe_response: any;
}

export class PhonePeService {
  /**
   * Initiate a payment for subscription
   */
  static async initiatePayment(
    request: PaymentInitiationRequest
  ): Promise<PaymentInitiationResponse> {
    const { data, error } = await supabase.functions.invoke(
      "phonepe-payment-initiate",
      {
        body: request,
      }
    );

    if (error) {
      throw new Error(`Payment initiation failed: ${error.message}`);
    }

    return data;
  }

  /**
   * Check payment status
   */
  static async checkPaymentStatus(
    request: PaymentStatusRequest
  ): Promise<PaymentStatusResponse> {
    const { data, error } = await supabase.functions.invoke(
      "phonepe-payment-status",
      {
        body: request,
      }
    );

    if (error) {
      throw new Error(`Payment status check failed: ${error.message}`);
    }

    return data;
  }

  /**
   * Process refund
   */
  static async processRefund(request: RefundRequest): Promise<RefundResponse> {
    const { data, error } = await supabase.functions.invoke("phonepe-refund", {
      body: request,
    });

    if (error) {
      throw new Error(`Refund processing failed: ${error.message}`);
    }

    return data;
  }

  /**
   * Validate UPI VPA
   */
  static async validateVPA(
    request: VPAValidationRequest
  ): Promise<VPAValidationResponse> {
    const { data, error } = await supabase.functions.invoke(
      "phonepe-vpa-validate",
      {
        body: request,
      }
    );

    if (error) {
      throw new Error(`VPA validation failed: ${error.message}`);
    }

    return data;
  }

  /**
   * Get available payment options
   */
  static async getPaymentOptions(
    request?: PaymentOptionsRequest
  ): Promise<PaymentOptionsResponse> {
    const { data, error } = await supabase.functions.invoke(
      "phonepe-payment-options",
      {
        body: request || {},
      }
    );

    if (error) {
      throw new Error(`Failed to get payment options: ${error.message}`);
    }

    return data;
  }

  /**
   * Get user payment history
   */
  static async getPaymentHistory(limit: number = 10, offset: number = 0) {
    const { data, error } = await supabase.rpc("get_user_payment_history", {
      p_user_id: (await supabase.auth.getUser()).data.user?.id,
      p_limit: limit,
      p_offset: offset,
    });

    if (error) {
      throw new Error(`Failed to get payment history: ${error.message}`);
    }

    return data;
  }

  /**
   * Get subscription analytics
   */
  static async getSubscriptionAnalytics() {
    const { data, error } = await supabase.rpc("get_subscription_analytics", {
      p_user_id: (await supabase.auth.getUser()).data.user?.id,
    });

    if (error) {
      throw new Error(`Failed to get subscription analytics: ${error.message}`);
    }

    return data;
  }

  /**
   * Check if payment is refundable
   */
  static async isPaymentRefundable(paymentId: string): Promise<boolean> {
    const { data, error } = await supabase.rpc("is_payment_refundable", {
      p_payment_id: paymentId,
    });

    if (error) {
      throw new Error(`Failed to check refund eligibility: ${error.message}`);
    }

    return data;
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(
    cancelAtPeriodEnd: boolean = true
  ): Promise<boolean> {
    const { data, error } = await supabase.rpc("cancel_subscription", {
      p_user_id: (await supabase.auth.getUser()).data.user?.id,
      p_cancel_at_period_end: cancelAtPeriodEnd,
    });

    if (error) {
      throw new Error(`Failed to cancel subscription: ${error.message}`);
    }

    return data;
  }
}

// Utility functions for common operations
export class PhonePeUtils {
  /**
   * Format amount for display
   */
  static formatAmount(amount: number, currency: string = "INR"): string {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
    }).format(amount);
  }

  /**
   * Generate payment URL for redirect
   */
  static generatePaymentUrl(redirectUrl: string, paymentUrl: string): string {
    const url = new URL(paymentUrl);
    url.searchParams.set("redirect_url", redirectUrl);
    return url.toString();
  }

  /**
   * Validate VPA format
   */
  static isValidVPAFormat(vpa: string): boolean {
    const vpaRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    return vpaRegex.test(vpa);
  }

  /**
   * Get payment method display name
   */
  static getPaymentMethodDisplayName(method: string): string {
    const methodMap: { [key: string]: string } = {
      card: "Credit/Debit Card",
      upi: "UPI",
      netbanking: "Net Banking",
      wallet: "Digital Wallet",
    };
    return methodMap[method] || method;
  }

  /**
   * Get payment status display name
   */
  static getPaymentStatusDisplayName(status: string): string {
    const statusMap: { [key: string]: string } = {
      pending: "Pending",
      processing: "Processing",
      completed: "Completed",
      failed: "Failed",
      cancelled: "Cancelled",
      refunded: "Refunded",
    };
    return statusMap[status] || status;
  }
}

export default PhonePeService;
