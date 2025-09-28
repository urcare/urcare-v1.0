/**
 * PhonePe Payment Gateway Service
 *
 * This service handles all PhonePe payment operations including:
 * - Payment initiation
 * - Payment status checking
 * - Refund processing
 * - Webhook handling
 */

import crypto from "crypto";

// PhonePe Configuration
const PHONEPE_CONFIG = {
  // Test credentials
  MERCHANT_ID: "PHONEPEPGUAT",
  KEY_INDEX: 1,
  SECRET_KEY: "c817ffaf-8471-48b5-a7e2-a27e5b7efbd3",

  // API URLs
  BASE_URL: "https://api-preprod.phonepe.com/apis/pg-sandbox",
  PAY_URL: "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
  STATUS_URL: "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status",
  REFUND_URL: "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/refund",
  REFUND_STATUS_URL:
    "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/refund/status",

  // Production URLs (uncomment when going live)
  // BASE_URL: 'https://api.phonepe.com/apis/pg',
  // PAY_URL: 'https://api.phonepe.com/apis/pg/pg/v1/pay',
  // STATUS_URL: 'https://api.phonepe.com/apis/pg/pg/v1/status',
  // REFUND_URL: 'https://api.phonepe.com/apis/pg/pg/v1/refund',
  // REFUND_STATUS_URL: 'https://api.phonepe.com/apis/pg/pg/v1/refund/status',
};

// PhonePe API Response Types
export interface PhonePePayRequest {
  merchantId: string;
  merchantTransactionId: string;
  merchantUserId: string;
  amount: number;
  redirectUrl: string;
  redirectMode: "POST" | "GET";
  callbackUrl: string;
  mobileNumber?: string;
  paymentInstrument: {
    type:
      | "PAY_PAGE"
      | "UPI_INTENT"
      | "UPI_COLLECT"
      | "UPI_QR"
      | "CARD"
      | "NET_BANKING";
    targetApp?: string;
    vpa?: string;
    cardDetails?: {
      cardNumber: string;
      cardType: string;
      cardIssuer: string;
      expiryMonth: number;
      expiryYear: number;
      cvv: string;
    };
    bankCode?: string;
  };
}

export interface PhonePePayResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    merchantId: string;
    merchantTransactionId: string;
    transactionId: string;
    amount: number;
    state: string;
    responseCode: string;
    paymentInstrument: {
      type: string;
      utr?: string;
      cardDetails?: any;
    };
    redirectInfo?: {
      url: string;
      method: string;
    };
  };
}

export interface PhonePeStatusResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    merchantId: string;
    merchantTransactionId: string;
    transactionId: string;
    amount: number;
    state: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";
    responseCode: string;
    paymentInstrument: {
      type: string;
      utr?: string;
      cardDetails?: any;
    };
  };
}

export interface PhonePeRefundRequest {
  merchantId: string;
  merchantUserId: string;
  originalTransactionId: string;
  merchantRefundId: string;
  amount: number;
  callbackUrl: string;
}

export interface PhonePeRefundResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    merchantId: string;
    merchantRefundId: string;
    transactionId: string;
    amount: number;
    state: "PENDING" | "SUCCESS" | "FAILED";
    responseCode: string;
  };
}

export interface PaymentInitiationParams {
  userId: string;
  amount: number;
  planId: string;
  billingCycle: "monthly" | "annual";
  userEmail?: string;
  userPhone?: string;
  paymentMethod:
    | "PAY_PAGE"
    | "UPI_INTENT"
    | "UPI_COLLECT"
    | "UPI_QR"
    | "CARD"
    | "NET_BANKING";
  upiVpa?: string;
  targetApp?: string;
  bankCode?: string;
  cardDetails?: {
    cardNumber: string;
    cardType: string;
    cardIssuer: string;
    expiryMonth: number;
    expiryYear: number;
    cvv: string;
  };
}

class PhonePeService {
  private base64Encode(data: string): string {
    return Buffer.from(data).toString("base64");
  }

  private generateChecksum(payload: string): string {
    const hash = crypto.createHash("sha256");
    hash.update(payload + PHONEPE_CONFIG.SECRET_KEY);
    return hash.digest("hex");
  }

  private generateMerchantTransactionId(): string {
    return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Initiate payment with PhonePe
   */
  async initiatePayment(
    params: PaymentInitiationParams
  ): Promise<PhonePePayResponse> {
    try {
      const merchantTransactionId = this.generateMerchantTransactionId();

      const payRequest: PhonePePayRequest = {
        merchantId: PHONEPE_CONFIG.MERCHANT_ID,
        merchantTransactionId,
        merchantUserId: params.userId,
        amount: params.amount * 100, // Convert to paise
        redirectUrl: `${window.location.origin}/payment/success`,
        redirectMode: "POST",
        callbackUrl: `${window.location.origin}/api/phonepe/callback`,
        mobileNumber: params.userPhone,
        paymentInstrument: {
          type: params.paymentMethod,
          ...(params.paymentMethod === "UPI_INTENT" && {
            targetApp: params.targetApp,
          }),
          ...(params.paymentMethod === "UPI_COLLECT" && { vpa: params.upiVpa }),
          ...(params.paymentMethod === "CARD" && {
            cardDetails: params.cardDetails,
          }),
          ...(params.paymentMethod === "NET_BANKING" && {
            bankCode: params.bankCode,
          }),
        },
      };

      const payload = JSON.stringify(payRequest);
      const base64Payload = this.base64Encode(payload);
      const checksum = this.generateChecksum(base64Payload);

      const requestBody = {
        request: base64Payload,
      };

      const response = await fetch(PHONEPE_CONFIG.PAY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum + "###" + PHONEPE_CONFIG.KEY_INDEX,
          accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Payment initiation failed");
      }

      return result;
    } catch (error) {
      console.error("PhonePe payment initiation error:", error);
      throw error;
    }
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(
    merchantTransactionId: string
  ): Promise<PhonePeStatusResponse> {
    try {
      const apiEndpoint = `${PHONEPE_CONFIG.STATUS_URL}/${PHONEPE_CONFIG.MERCHANT_ID}/${merchantTransactionId}`;
      const checksum = this.generateChecksum(
        `/pg/v1/status/${PHONEPE_CONFIG.MERCHANT_ID}/${merchantTransactionId}${PHONEPE_CONFIG.SECRET_KEY}`
      );

      const response = await fetch(apiEndpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum + "###" + PHONEPE_CONFIG.KEY_INDEX,
          accept: "application/json",
        },
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("PhonePe status check error:", error);
      throw error;
    }
  }

  /**
   * Process refund
   */
  async processRefund(params: {
    originalTransactionId: string;
    amount: number;
    userId: string;
    reason?: string;
  }): Promise<PhonePeRefundResponse> {
    try {
      const merchantRefundId = `REF_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const refundRequest: PhonePeRefundRequest = {
        merchantId: PHONEPE_CONFIG.MERCHANT_ID,
        merchantUserId: params.userId,
        originalTransactionId: params.originalTransactionId,
        merchantRefundId,
        amount: params.amount * 100, // Convert to paise
        callbackUrl: `${window.location.origin}/api/phonepe/refund-callback`,
      };

      const payload = JSON.stringify(refundRequest);
      const base64Payload = this.base64Encode(payload);
      const checksum = this.generateChecksum(base64Payload);

      const requestBody = {
        request: base64Payload,
      };

      const response = await fetch(PHONEPE_CONFIG.REFUND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum + "###" + PHONEPE_CONFIG.KEY_INDEX,
          accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("PhonePe refund error:", error);
      throw error;
    }
  }

  /**
   * Check refund status
   */
  async checkRefundStatus(
    merchantRefundId: string
  ): Promise<PhonePeRefundResponse> {
    try {
      const apiEndpoint = `${PHONEPE_CONFIG.REFUND_STATUS_URL}/${PHONEPE_CONFIG.MERCHANT_ID}/${merchantRefundId}`;
      const checksum = this.generateChecksum(
        `/pg/v1/refund/status/${PHONEPE_CONFIG.MERCHANT_ID}/${merchantRefundId}${PHONEPE_CONFIG.SECRET_KEY}`
      );

      const response = await fetch(apiEndpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum + "###" + PHONEPE_CONFIG.KEY_INDEX,
          accept: "application/json",
        },
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("PhonePe refund status check error:", error);
      throw error;
    }
  }

  /**
   * Validate VPA (Virtual Payment Address) for UPI
   */
  async validateVPA(vpa: string): Promise<boolean> {
    try {
      const response = await fetch(
        `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/validate/vpa`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({
            vpa: vpa,
          }),
        }
      );

      const result = await response.json();
      return result.success && result.data?.isValid === true;
    } catch (error) {
      console.error("VPA validation error:", error);
      return false;
    }
  }

  /**
   * Get available banks for net banking
   */
  async getAvailableBanks(): Promise<any[]> {
    try {
      const response = await fetch(
        "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/paymentOptions",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        }
      );

      const result = await response.json();
      return result.data?.netBankingOptions || [];
    } catch (error) {
      console.error("Get banks error:", error);
      return [];
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const expectedSignature = this.generateChecksum(payload);
    return signature === expectedSignature;
  }

  /**
   * Get test card details for development
   */
  getTestCardDetails() {
    return {
      cardNumber: "4622943126146407",
      cardType: "DEBIT_CARD",
      cardIssuer: "VISA",
      expiryMonth: 12,
      expiryYear: 2023,
      cvv: "936",
    };
  }

  /**
   * Get test UPI details for development
   */
  getTestUPIDetails() {
    return {
      vpa: "test@upi",
      targetApps: ["phonepe", "gpay", "paytm", "bhim"],
    };
  }

  /**
   * Get test net banking details for development
   */
  getTestNetBankingDetails() {
    return {
      username: "Test",
      password: "Test",
    };
  }
}

export const phonepeService = new PhonePeService();
export default phonepeService;
