// Razorpay Service for Frontend Integration
import { loadScript } from './loadScript';

// Razorpay Configuration
const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_1234567890'; // Replace with your actual key

console.log('🔧 Razorpay Service initialized with Key ID:', RAZORPAY_KEY_ID);

// Load Razorpay script dynamically
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    loadScript('https://checkout.razorpay.com/v1/checkout.js')
      .then(() => {
        console.log('✅ Razorpay script loaded successfully');
        resolve(true);
      })
      .catch((error) => {
        console.error('❌ Failed to load Razorpay script:', error);
        resolve(false);
      });
  });
};

// Create Razorpay order
export async function createRazorpayOrder(orderId: string, amount: number, userId: string, planSlug?: string, billingCycle?: string) {
  try {
    console.log("Creating Razorpay order:", {
      orderId,
      amount,
      userId,
      planSlug,
      billingCycle
    });

    const requestBody = {
      orderId: orderId,
      amount: amount, // Amount in paise
      userId: userId,
      planSlug: planSlug || 'basic',
      billingCycle: billingCycle || 'annual'
    };

    console.log("📤 Sending request to Razorpay API:", JSON.stringify(requestBody, null, 2));

    const response = await fetch('/api/razorpay/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    const data = await response.json();

    if (!response.ok) {
      console.error("Razorpay API error:", data);
      throw new Error(data.error || "Failed to create Razorpay order");
    }

    console.log("Razorpay API response:", data);

    if (data && data.success && data.orderId) {
      return {
        success: true,
        orderId: data.orderId,
        amount: data.amount,
        currency: data.currency,
        keyId: data.keyId,
        planSlug: data.planSlug,
        billingCycle: data.billingCycle
      };
    } else {
      console.error("Order creation failed:", data);
      throw new Error(data?.error || data?.message || "Order creation failed");
    }
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);
    throw error;
  }
}

// Verify Razorpay payment
export async function verifyRazorpayPayment(razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string, userId: string, planSlug?: string, billingCycle?: string) {
  try {
    console.log("Verifying Razorpay payment:", {
      razorpay_order_id,
      razorpay_payment_id,
      userId,
      planSlug,
      billingCycle
    });

    const requestBody = {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      planSlug: planSlug || 'basic',
      billingCycle: billingCycle || 'annual'
    };

    console.log("📤 Sending verification request:", JSON.stringify(requestBody, null, 2));

    const response = await fetch('/api/razorpay/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    const data = await response.json();

    if (!response.ok) {
      console.error("Razorpay verification error:", data);
      throw new Error(data.error || "Failed to verify payment");
    }

    console.log("Razorpay verification response:", data);

    return {
      success: data.success || false,
      verified: data.verified || false,
      paymentId: data.paymentId,
      orderId: data.orderId,
      message: data.message
    };
  } catch (error) {
    console.error("Razorpay Payment Verification Error:", error);
    throw error;
  }
}

// Open Razorpay checkout
export async function openRazorpayCheckout(orderData: any, onSuccess: (response: any) => void, onError: (error: any) => void) {
  try {
    // Load Razorpay script first
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error('Failed to load Razorpay script');
    }

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'UrCare',
      description: `UrCare ${orderData.planSlug} ${orderData.billingCycle} subscription`,
      order_id: orderData.orderId,
      handler: onSuccess,
      prefill: {
        name: 'User',
        email: 'user@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#8B5CF6' // Purple theme to match your design
      },
      modal: {
        ondismiss: () => {
          console.log('Razorpay modal dismissed');
        }
      }
    };

    console.log('🚀 Opening Razorpay checkout with options:', options);

    const razorpay = new window.Razorpay(options);
    razorpay.on('payment.failed', onError);
    razorpay.open();
  } catch (error) {
    console.error('❌ Error opening Razorpay checkout:', error);
    onError(error);
  }
}

// Declare Razorpay type for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}
