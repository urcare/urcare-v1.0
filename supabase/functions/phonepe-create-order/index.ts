import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Deno type declarations
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// PhonePe Configuration with fallbacks
const PHONEPE_BASE_URL = Deno.env.get('PHONEPE_BASE_URL') || 'https://api.phonepe.com/apis/hermes';
const PHONEPE_MERCHANT_ID = Deno.env.get('PHONEPE_MERCHANT_ID') || 'M23XRS3XN3QMF';
const PHONEPE_SALT_KEY = Deno.env.get('PHONEPE_API_KEY') || '713219fb-38d0-468d-8268-8b15955468b0';
const PHONEPE_SALT_INDEX = Deno.env.get('PHONEPE_SALT_INDEX') || '1';
const FRONTEND_URL = Deno.env.get('FRONTEND_URL') || 'http://localhost:8080';
const BACKEND_CALLBACK_URL = Deno.env.get('BACKEND_CALLBACK_URL') || `${FRONTEND_URL}/api/phonepe/callback`;

// Check if we have valid credentials
const hasValidCredentials = PHONEPE_MERCHANT_ID && PHONEPE_SALT_KEY && PHONEPE_SALT_INDEX;

// Log configuration (remove in production)
console.log('🔧 PhonePe Production Configuration:', {
  baseUrl: PHONEPE_BASE_URL,
  merchantId: PHONEPE_MERCHANT_ID,
  saltKeyPrefix: PHONEPE_SALT_KEY?.substring(0, 15) + '...',
  saltIndex: PHONEPE_SALT_INDEX,
  frontendUrl: FRONTEND_URL
});

// Generate PhonePe X-VERIFY signature (Deno Web Crypto API)
async function generateXVerify(payload: string, endpoint: string, saltKey: string, saltIndex: string): Promise<string> {
  console.log('🔐 Generating X-VERIFY signature...');
  console.log('📦 Payload:', payload.substring(0, 100) + '...');
  console.log('🔗 Endpoint:', endpoint);
  console.log('🔑 Salt Key (first 10 chars):', saltKey.substring(0, 10) + '...');
  console.log('🔢 Salt Index:', saltIndex);
  
  // Create the string to hash: base64Payload + endpoint + saltKey
  const stringToHash = `${payload}${endpoint}${saltKey}`;
  console.log('🔗 String to hash length:', stringToHash.length);
  
  const encoder = new TextEncoder();
  const data = encoder.encode(stringToHash);
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  const xVerify = `${hashHex}###${saltIndex}`;
  console.log('✅ X-VERIFY generated:', xVerify.substring(0, 30) + '...');
  
  return xVerify;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Simple health check endpoint
  if (req.method === 'GET') {
    return new Response(
      JSON.stringify({ 
        status: 'ok', 
        message: 'PhonePe Edge Function is running',
        timestamp: new Date().toISOString(),
        config: {
          baseUrl: PHONEPE_BASE_URL,
          hasMerchantId: !!PHONEPE_MERCHANT_ID,
          hasSaltKey: !!PHONEPE_SALT_KEY,
          hasSaltIndex: !!PHONEPE_SALT_INDEX
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  // Skip authentication for payment processing
  // This allows anonymous requests to create payment orders
  console.log('📥 Processing payment request (anonymous access allowed)');

  try {
    const requestBody = await req.json();
    console.log('📥 Raw request body:', JSON.stringify(requestBody, null, 2));
    
    const { orderId, amount, userId, planSlug, billingCycle } = requestBody;

    console.log('📥 PhonePe Production Payment Request:', { 
      orderId, 
      amount, 
      userId, 
      planSlug, 
      billingCycle,
      amountType: typeof amount,
      userIdType: typeof userId
    });

    // Validate input with detailed error messages
    if (!orderId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required field: orderId',
          received: { orderId, amount, userId, planSlug, billingCycle }
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing or invalid amount. Amount must be greater than 0',
          received: { orderId, amount, userId, planSlug, billingCycle }
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    if (!userId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required field: userId',
          received: { orderId, amount, userId, planSlug, billingCycle }
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if we have valid PhonePe credentials
    if (!hasValidCredentials) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'PhonePe credentials not configured. Please set environment variables.',
          debug: {
            hasMerchantId: !!PHONEPE_MERCHANT_ID,
            hasSaltKey: !!PHONEPE_SALT_KEY,
            hasSaltIndex: !!PHONEPE_SALT_INDEX,
            merchantId: PHONEPE_MERCHANT_ID?.substring(0, 10) + '...',
            saltKey: PHONEPE_SALT_KEY?.substring(0, 10) + '...',
            saltIndex: PHONEPE_SALT_INDEX
          }
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Convert amount to paise (ensure it's a number)
    const amountInPaise = Math.round(Number(amount));
    
    // Validate amount is in paise (must be > 0)
    if (amountInPaise <= 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid amount. Amount must be greater than 0 paise',
          received: { amount, amountInPaise }
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create PhonePe production payload (exactly as PhonePe requires)
    const payload = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId: orderId, // PhonePe expects merchantTransactionId, not transactionId
      merchantUserId: userId,
      amount: amountInPaise,
      redirectUrl: `${FRONTEND_URL}/payment/success?orderId=${orderId}&plan=${planSlug || 'basic'}&cycle=${billingCycle || 'annual'}`,
      redirectMode: "REDIRECT", // PhonePe requires redirectMode
      callbackUrl: BACKEND_CALLBACK_URL,
      paymentInstrument: { 
        type: "PAY_PAGE" 
      }
    };

    console.log('📦 PhonePe Payload:', JSON.stringify(payload, null, 2));
    console.log('💰 Amount validation:', { 
      originalAmount: amount, 
      amountInPaise: amountInPaise, 
      isValid: amountInPaise > 0 
    });

    const payloadString = JSON.stringify(payload);
    const encoder = new TextEncoder();
    const payloadBytes = encoder.encode(payloadString);
    const base64Payload = btoa(String.fromCharCode(...payloadBytes));

    const xVerify = await generateXVerify(base64Payload, '/pg/v1/pay', PHONEPE_SALT_KEY, PHONEPE_SALT_INDEX);

    console.log('🔐 X-VERIFY:', xVerify.substring(0, 30) + '...');
    console.log('🌐 Calling PhonePe Production API:', `${PHONEPE_BASE_URL}/pg/v1/pay`);

    // Prepare headers for PhonePe API
    const headers = {
      'Content-Type': 'application/json',
      'X-VERIFY': xVerify,
      'X-MERCHANT-ID': PHONEPE_MERCHANT_ID,
      'accept': 'application/json'
    };

    console.log('📤 Headers being sent:', {
      'Content-Type': headers['Content-Type'],
      'X-VERIFY': headers['X-VERIFY'].substring(0, 30) + '...',
      'X-MERCHANT-ID': headers['X-MERCHANT-ID'],
      'accept': headers['accept']
    });

    // POST to PhonePe production API
    const phonepeResponse = await fetch(`${PHONEPE_BASE_URL}/pg/v1/pay`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ request: base64Payload })
    });

    const phonepeData = await phonepeResponse.json();
    console.log('📨 PhonePe Production Response:', JSON.stringify(phonepeData, null, 2));
    console.log('📨 PhonePe Response Status:', phonepeResponse.status);

    // Check if payment initiation was successful
    if (phonepeData.success && phonepeData.data?.instrumentResponse?.redirectInfo?.url) {
      console.log('✅ Payment initiation successful, redirect URL:', phonepeData.data.instrumentResponse.redirectInfo.url);
      return new Response(
        JSON.stringify({
          success: true,
          redirectUrl: phonepeData.data.instrumentResponse.redirectInfo.url,
          orderId: orderId,
          transactionId: orderId,
          merchantId: PHONEPE_MERCHANT_ID,
          amount: amountInPaise,
          planSlug: planSlug || 'basic',
          billingCycle: billingCycle || 'annual'
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } else {
      console.log('❌ Payment initiation failed:', phonepeData);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: phonepeData.message || 'Payment initiation failed',
          code: phonepeData.code,
          data: phonepeData,
          debug: {
            hasData: !!phonepeData.data,
            hasInstrumentResponse: !!phonepeData.data?.instrumentResponse,
            hasRedirectInfo: !!phonepeData.data?.instrumentResponse?.redirectInfo,
            hasUrl: !!phonepeData.data?.instrumentResponse?.redirectInfo?.url
          }
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error('❌ Error in phonepe-create-order:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error',
        stack: error.stack
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
