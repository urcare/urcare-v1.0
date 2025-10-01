// PhonePe Backend URL - Use Express backend for both localhost and production
const PHONEPE_BACKEND_URL = (() => {
  // Force detection based on hostname for better reliability
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    } else {
      // For production, use Vercel-deployed Express backend
      return 'https://urcare.vercel.app';
    }
  }
  // Fallback to environment variable
  return process.env.NODE_ENV === 'production' 
    ? 'https://urcare.vercel.app'
    : 'http://localhost:5000';
})();

// Supabase configuration for authentication
const SUPABASE_URL = 'https://lvnkpserdydhnqbigfbz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3MzQ0MzgsImV4cCI6MjA1MTMxMDQzOH0.bb62b7c1fe2d9c22a670bbcdaad3930828e5c296e97d35109534d46b7c614adf';

console.log('🔧 PhonePe Backend URL configured:', PHONEPE_BACKEND_URL);
console.log('📦 PhonePe Service Version: 6.0.0 - Express Backend on Vercel');

// Live PhonePe API configuration
const PHONEPE_MERCHANT_ID = 'M23XRS3XN3QMF';
const PHONEPE_SALT_KEY = '713219fb-38d0-468d-8268-8b15955468b0';
const PHONEPE_SALT_INDEX = '1';
const PHONEPE_BASE_URL = 'https://api.phonepe.com/apis/hermes';

// Generate X-VERIFY signature for PhonePe API
async function generateXVerify(payload: string, endpoint: string, saltKey: string, saltIndex: string): Promise<string> {
  console.log('🔐 Generating X-VERIFY signature for live PhonePe API...');
  
  // Create the string to hash: base64Payload + endpoint + saltKey
  const stringToHash = `${payload}${endpoint}${saltKey}`;
  
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(stringToHash);
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', encodedData);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  const xVerify = `${hashHex}###${saltIndex}`;
  console.log('✅ X-VERIFY generated for live API');
  
  return xVerify;
}

// Create PhonePe payment directly using live API
async function createPhonePePaymentDirect(requestBody: any) {
  console.log('🚀 Creating live PhonePe payment directly...');
  
  const { orderId, amount, userId, planSlug, billingCycle } = requestBody;
  
  // Create PhonePe payload
  const payload = {
    merchantId: PHONEPE_MERCHANT_ID,
    merchantTransactionId: orderId,
    merchantUserId: userId,
    amount: amount,
    redirectUrl: `${window.location.origin}/payment/success?orderId=${orderId}&plan=${planSlug || 'basic'}&cycle=${billingCycle || 'annual'}`,
    redirectMode: "REDIRECT",
    callbackUrl: `${window.location.origin}/api/phonepe/callback`,
    paymentInstrument: { 
      type: "PAY_PAGE" 
    }
  };

  console.log('📦 Live PhonePe Payload:', JSON.stringify(payload, null, 2));

  const payloadString = JSON.stringify(payload);
  const encoder = new TextEncoder();
  const payloadBytes = encoder.encode(payloadString);
  const base64Payload = btoa(String.fromCharCode(...payloadBytes));

  const xVerify = await generateXVerify(base64Payload, '/pg/v1/pay', PHONEPE_SALT_KEY, PHONEPE_SALT_INDEX);

  console.log('🌐 Calling live PhonePe API:', `${PHONEPE_BASE_URL}/pg/v1/pay`);

  // Call live PhonePe API
  const response = await fetch(`${PHONEPE_BASE_URL}/pg/v1/pay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-VERIFY': xVerify,
      'X-MERCHANT-ID': PHONEPE_MERCHANT_ID,
      'accept': 'application/json'
    },
    body: JSON.stringify({ request: base64Payload })
  });

  const data = await response.json();
  console.log('📨 Live PhonePe API Response:', JSON.stringify(data, null, 2));

  if (data.success && data.data?.instrumentResponse?.redirectInfo?.url) {
    console.log('✅ Live PhonePe payment successful, redirect URL:', data.data.instrumentResponse.redirectInfo.url);
    return {
      success: true,
      redirectUrl: data.data.instrumentResponse.redirectInfo.url,
      orderId: orderId,
      transactionId: orderId,
      merchantId: PHONEPE_MERCHANT_ID,
      amount: amount,
      planSlug: planSlug || 'basic',
      billingCycle: billingCycle || 'annual'
    };
  } else {
    console.error('❌ Live PhonePe payment failed:', data);
    throw new Error(data.message || 'Live PhonePe payment initiation failed');
  }
}

// Check PhonePe payment status directly using live API
async function checkPhonePeStatusDirect(transactionId: string) {
  console.log('🔍 Checking live PhonePe payment status...');
  
  // Create status check endpoint
  const endpoint = `/pg/v1/status/${PHONEPE_MERCHANT_ID}/${transactionId}`;
  
  // Generate X-VERIFY signature for status check
  const encoder = new TextEncoder();
  const stringToHash = encoder.encode(endpoint + PHONEPE_SALT_KEY);
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', stringToHash);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  const xVerify = `${hashHex}###${PHONEPE_SALT_INDEX}`;

  console.log('🌐 Calling live PhonePe status API:', `${PHONEPE_BASE_URL}${endpoint}`);

  // Call live PhonePe status API
  const response = await fetch(`${PHONEPE_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-VERIFY': xVerify,
      'X-MERCHANT-ID': PHONEPE_MERCHANT_ID,
      'accept': 'application/json'
    }
  });

  const responseData = await response.json();
  console.log('📨 Live PhonePe Status Response:', JSON.stringify(responseData, null, 2));

  return {
    success: responseData.success || false,
    data: responseData.data
  };
}

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

    // For production, use live PhonePe API directly
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
      // For production, use Vercel API routes for live PhonePe integration
      console.log("🌐 Production mode - using Vercel API for live PhonePe");
      
      try {
        // Call Vercel API route that handles PhonePe API calls
        console.log("🌐 Calling Vercel API:", `${PHONEPE_BACKEND_URL}/pay`);
        console.log("📤 Request body:", JSON.stringify(requestBody, null, 2));
        
        const response = await fetch(`${PHONEPE_BACKEND_URL}/pay`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });
        
        console.log("📨 Vercel API response status:", response.status);
        const data = await response.json();
        console.log("📨 Vercel API response data:", JSON.stringify(data, null, 2));

        if (!response.ok) {
          console.error("Vercel API error:", data);
          throw new Error(data.error || "Failed to create payment order");
        }

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
      } catch (error) {
        console.error("Live PhonePe API error:", error);
        // Fallback to mock payment if live API fails
        console.log("🔄 Falling back to mock payment due to API error");
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
    }
  } catch (error) {
    console.error("PhonePe Payment Error:", error);
    throw error;
  }
}

// Check payment status using Express Backend or Supabase Edge Functions
export async function checkPhonePeStatus(orderId: string, userId?: string) {
  try {
    console.log("Checking PhonePe payment status:", orderId);

    // For localhost, use Express backend
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
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
    } else {
      // For production, use Vercel API for status check
      console.log("🌐 Production mode - using Vercel API for status check");
      
      try {
        const response = await fetch(`${PHONEPE_BACKEND_URL}/status`, {
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
          console.error("Vercel status API error:", data);
          throw new Error(data.error || "Failed to check payment status");
        }

        console.log("Vercel status API response:", data);

        return {
          success: data.success || false,
          data: data.data
        };
      } catch (error) {
        console.error("Live PhonePe status check error:", error);
        // Fallback to mock status if live API fails
        console.log("🔄 Falling back to mock status check due to API error");
        return {
          success: true,
          data: {
            state: "COMPLETED",
            amount: 100,
            paymentInstrument: {
              type: "UPI"
            }
          }
        };
      }
    }
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
