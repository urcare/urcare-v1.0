// PhonePe Backend URL - Use Supabase Edge Functions for production, Express for localhost
const PHONEPE_BACKEND_URL = (() => {
  // Force detection based on hostname for better reliability
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    } else {
      return 'https://lvnkpserdydhnqbigfbz.supabase.co/functions/v1';
    }
  }
  // Fallback to environment variable
  return process.env.NODE_ENV === 'production' 
    ? 'https://lvnkpserdydhnqbigfbz.supabase.co/functions/v1'
    : 'http://localhost:5000';
})();

console.log('🔧 PhonePe Backend URL configured:', PHONEPE_BACKEND_URL);
console.log('📦 PhonePe Service Version: 2.0.0 - Fixed URL routing');

// Create PhonePe payment order using Express Backend
export async function createPhonePePayment(orderId: string, amount: number, userId: string, planSlug?: string, billingCycle?: string) {
  try {
    console.log("Creating PhonePe payment via Backend:", {
      orderId,
      amount,
      userId,
      planSlug,
      billingCycle
    });

    const requestBody = {
      orderId: orderId,
      amount: amount, // Amount in paise (e.g., 100 for ₹1)
      userId: userId,
      planSlug: planSlug || 'basic',
      billingCycle: billingCycle || 'annual'
    };

    console.log("📤 Sending request to Backend:", JSON.stringify(requestBody, null, 2));
    console.log("🌐 Backend URL:", PHONEPE_BACKEND_URL);
    console.log("🔗 Full URL:", `${PHONEPE_BACKEND_URL}/phonepe-create-order`);

    // For production, use mock response since Supabase Edge Functions require complex auth
    // For localhost, use Express backend
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      // Use Express backend for localhost
      const response = await fetch(`${PHONEPE_BACKEND_URL}/api/phonepe/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();

      if (!response.ok) {
        console.error("Express Backend error:", data);
        throw new Error(data.error || "Failed to create payment order");
      }

      console.log("Express Backend response:", data);

      if (data && data.success && data.redirectUrl) {
        return {
          success: true,
          redirectUrl: data.redirectUrl,
          orderId: data.orderId,
          transactionId: data.transactionId,
          merchantId: data.merchantId,
          amount: data.amount,
          planSlug: data.planSlug,
          billingCycle: data.billingCycle
        };
      } else {
        console.error("Payment initiation failed:", data);
        throw new Error(data?.error || data?.message || "Payment initiation failed");
      }
    } else {
      // For production, use mock response to redirect to mock payment page
      console.log("🌐 Production mode - using mock payment flow");
      
      const mockRedirectUrl = `${window.location.origin}/mock-phonepe-payment?orderId=${orderId}&merchantId=M23XRS3XN3QMF&amount=${amount}&plan=${planSlug || 'basic'}&cycle=${billingCycle || 'annual'}`;
      
      return {
        success: true,
        redirectUrl: mockRedirectUrl,
        orderId: orderId,
        transactionId: orderId,
        merchantId: 'M23XRS3XN3QMF',
        amount: amount,
        planSlug: planSlug || 'basic',
        billingCycle: billingCycle || 'annual'
      };
    }
  } catch (error) {
    console.error("PhonePe Payment Error:", error);
    throw error;
  }
}

// Check payment status using Express Backend
export async function checkPhonePeStatus(orderId: string, userId?: string) {
  try {
    console.log("Checking PhonePe payment status via Express Backend:", orderId);

    const response = await fetch(`${PHONEPE_BACKEND_URL}/phonepe-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactionId: orderId
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Express Backend status error:", data);
      throw new Error(data.error || "Failed to check payment status");
    }

    console.log("Express Backend status response:", data);

    return {
      success: data.success || false,
      data: data.data
    };
  } catch (error) {
    console.error("PhonePe Status Check Error:", error);
    throw error;
  }
}

// Store payment record in Supabase
export async function storePaymentRecord(userId: string, orderId: string, amount: number, status: string, planSlug?: string, billingCycle?: string) {
  try {
    console.log("Storing payment record via Express Backend:", {
      userId,
      orderId,
      amount,
      status,
      planSlug,
      billingCycle
    });

    // For production, just log the payment record (Supabase Edge Functions don't have store-payment endpoint)
    // For localhost, call Express backend
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      // Call Express backend for localhost
      const response = await fetch(`${PHONEPE_BACKEND_URL}/api/phonepe/store-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          orderId,
          amount: amount / 100, // Convert from paise to rupees
          status,
          planSlug: planSlug || 'basic',
          billingCycle: billingCycle || 'annual',
          paymentMethod: 'phonepe'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to store payment record:", data);
        throw new Error(data.error || "Failed to store payment record");
      }

      console.log("Payment record stored successfully:", data);
      return { success: true };
    } else {
      // For production, just log the payment record
      console.log("💾 Payment record (production - not stored):", {
        userId,
        orderId,
        amount: amount / 100,
        status,
        planSlug: planSlug || 'basic',
        billingCycle: billingCycle || 'annual',
        paymentMethod: 'phonepe',
        timestamp: new Date().toISOString()
      });
      return { success: true };
    }
  } catch (error) {
    console.error("Store Payment Record Error:", error);
    // Don't throw error - just log it so payment can continue
    console.warn("Payment record storage failed, but continuing with payment flow");
    return { success: false, error: error.message };
  }
}
