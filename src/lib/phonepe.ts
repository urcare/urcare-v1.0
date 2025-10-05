// PhonePe Payment Integration
// Note: This is a client-side implementation. For production, move crypto operations to server-side API

// Environment variables (set these on Vercel)
const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || 'M23XRS3XN3QMF';
const PHONEPE_API_KEY = process.env.PHONEPE_API_KEY || '713219fb-38d0-468d-8268-8b15955468b0';
const PHONEPE_SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1';
const PHONEPE_ENVIRONMENT = process.env.VITE_PHONEPE_ENV || 'production';
const BUSINESS_NAME = process.env.BUSINESS_NAME || 'UrCare org';
const PAYMENT_AMOUNT_IN_PAISE = process.env.PAYMENT_AMOUNT_IN_PAISE || '100'; // ₹1 = 100 paise

// PhonePe API endpoints
const PHONEPE_BASE_URL = PHONEPE_ENVIRONMENT === 'production' 
  ? 'https://api.phonepe.com/apis/pg-sandbox' 
  : 'https://api-preprod.phonepe.com/apis/pg-sandbox';

export interface PhonePeTransactionRequest {
  amountPaise: number;
  orderId?: string;
  userId?: string;
  redirectUrl?: string;
}

export interface PhonePeTransactionResponse {
  success: boolean;
  redirectUrl?: string;
  orderId?: string;
  phonepeTxnId?: string;
  error?: string;
}

export interface PhonePeVerifyResponse {
  success: boolean;
  status?: 'SUCCESS' | 'PENDING' | 'FAILED' | 'EXPIRED';
  orderId?: string;
  phonepeTxnId?: string;
  amount?: number;
  error?: string;
}

// Generate PhonePe signature using Web Crypto API (browser-compatible)
export async function generatePhonePeSignature(payload: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(payload + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex + '###' + PHONEPE_SALT_INDEX;
}

// Create PhonePe transaction
export async function createPhonePeTransaction(
  request: PhonePeTransactionRequest
): Promise<PhonePeTransactionResponse> {
  try {
    const orderId = request.orderId || `urcare_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const amount = request.amountPaise || parseInt(PAYMENT_AMOUNT_IN_PAISE);
    
    const payload = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId: orderId,
      merchantUserId: request.userId || 'urcare_user',
      amount: amount,
      redirectUrl: request.redirectUrl || `${process.env.VERCEL_URL || 'https://urcarebyarsh.vercel.app'}/api/phonepe/callback`,
      redirectMode: 'POST',
      callbackUrl: `${process.env.VERCEL_URL || 'https://urcarebyarsh.vercel.app'}/api/phonepe/notify`,
      mobileNumber: '9999999999',
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    const payloadString = JSON.stringify(payload);
    const signature = await generatePhonePeSignature(payloadString, PHONEPE_API_KEY);

    const requestPayload = {
      request: Buffer.from(payloadString).toString('base64')
    };

    const response = await fetch(`${PHONEPE_BASE_URL}/pg/v1/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': signature,
        'accept': 'application/json'
      },
      body: JSON.stringify(requestPayload)
    });

    const responseData = await response.json();

    if (responseData.success && responseData.data) {
      const { data } = responseData;
      return {
        success: true,
        redirectUrl: data.instrumentResponse.redirectInfo.url,
        orderId: orderId,
        phonepeTxnId: data.transactionId
      };
    } else {
      return {
        success: false,
        error: responseData.message || 'Failed to create PhonePe transaction'
      };
    }
  } catch (error) {
    console.error('PhonePe transaction creation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Verify PhonePe transaction
export async function verifyPhonePeTransaction(orderId: string): Promise<PhonePeVerifyResponse> {
  try {
    const payload = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId: orderId,
      transactionId: orderId
    };

    const payloadString = JSON.stringify(payload);
    const signature = await generatePhonePeSignature(payloadString, PHONEPE_API_KEY);

    const response = await fetch(`${PHONEPE_BASE_URL}/pg/v1/status/${PHONEPE_MERCHANT_ID}/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': signature,
        'X-MERCHANT-ID': PHONEPE_MERCHANT_ID,
        'accept': 'application/json'
      }
    });

    const responseData = await response.json();

    if (responseData.success && responseData.data) {
      const { data } = responseData;
      return {
        success: true,
        status: data.state,
        orderId: orderId,
        phonepeTxnId: data.transactionId,
        amount: data.amount
      };
    } else {
      return {
        success: false,
        error: responseData.message || 'Failed to verify PhonePe transaction'
      };
    }
  } catch (error) {
    console.error('PhonePe transaction verification failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Verify PhonePe webhook signature
export async function verifyPhonePeWebhook(payload: string, signature: string): Promise<boolean> {
  try {
    const expectedSignature = await generatePhonePeSignature(payload, PHONEPE_API_KEY);
    return signature === expectedSignature;
  } catch (error) {
    console.error('PhonePe webhook verification failed:', error);
    return false;
  }
}

// In-memory store for demo purposes (replace with Redis/DB in production)
const orderStore = new Map<string, {
  orderId: string;
  phonepeTxnId?: string;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED';
  createdAt: Date;
  userId?: string;
}>();

export function storeOrder(orderId: string, amount: number, phonepeTxnId?: string, userId?: string) {
  orderStore.set(orderId, {
    orderId,
    phonepeTxnId,
    amount,
    status: 'PENDING',
    createdAt: new Date(),
    userId
  });
}

export function updateOrderStatus(orderId: string, status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED') {
  const order = orderStore.get(orderId);
  if (order) {
    order.status = status;
    orderStore.set(orderId, order);
  }
}

export function getOrder(orderId: string) {
  return orderStore.get(orderId);
}

export function getAllOrders() {
  return Array.from(orderStore.values());
}
