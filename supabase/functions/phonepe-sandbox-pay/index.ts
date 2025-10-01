import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// PhonePe Sandbox Configuration
const PHONEPE_SANDBOX_URL = 'https://api-preprod.phonepe.com/apis/pg-sandbox';
const PHONEPE_MERCHANT_ID = Deno.env.get('PHONEPE_MERCHANT_ID') || 'PGTESTPAYUAT';
const PHONEPE_SALT_KEY = Deno.env.get('PHONEPE_SALT_KEY') || '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
const PHONEPE_SALT_INDEX = Deno.env.get('PHONEPE_SALT_INDEX') || '1';
const FRONTEND_URL = Deno.env.get('FRONTEND_URL') || 'http://localhost:8081';

// Generate X-VERIFY header using SHA256
async function generateXVerify(payload: string, endpoint: string, saltKey: string, saltIndex: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(payload + endpoint + saltKey);
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return `${hashHex}###${saltIndex}`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { orderId, amount, userId } = await req.json();

    console.log('📥 PhonePe Sandbox Payment Request:', { orderId, amount, userId });

    // Validate input
    if (!orderId || !amount || !userId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: orderId, amount, userId' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create PhonePe sandbox payload (exactly as specified)
    const payload = {
      merchantId: PHONEPE_MERCHANT_ID,
      transactionId: orderId,
      merchantUserId: userId,
      amount: 100, // Fixed ₹1 test amount in paise
      redirectUrl: `${FRONTEND_URL}/payment/success?orderId=${orderId}`,
      callbackUrl: `${FRONTEND_URL}/api/phonepe/callback`,
      paymentInstrument: { 
        type: "PAY_PAGE" 
      }
    };

    console.log('📦 PhonePe Sandbox Payload:', JSON.stringify(payload, null, 2));

    // Encode payload to Base64
    const payloadString = JSON.stringify(payload);
    const encoder = new TextEncoder();
    const payloadBytes = encoder.encode(payloadString);
    const base64Payload = btoa(String.fromCharCode(...payloadBytes));

    // Generate X-VERIFY header using SHA256
    const xVerify = await generateXVerify(base64Payload, '/pg/v1/pay', PHONEPE_SALT_KEY, PHONEPE_SALT_INDEX);

    console.log('🔐 X-VERIFY:', xVerify.substring(0, 30) + '...');
    console.log('🌐 Calling PhonePe Sandbox API:', `${PHONEPE_SANDBOX_URL}/pg/v1/pay`);

    // POST request to PhonePe sandbox API
    const phonepeResponse = await fetch(`${PHONEPE_SANDBOX_URL}/pg/v1/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        'X-MERCHANT-ID': PHONEPE_MERCHANT_ID,
        'accept': 'application/json'
      },
      body: JSON.stringify({ request: base64Payload })
    });

    const phonepeData = await phonepeResponse.json();
    console.log('📨 PhonePe Sandbox Response:', JSON.stringify(phonepeData, null, 2));

    // Check if payment initiation was successful
    if (phonepeData.success && phonepeData.data?.instrumentResponse?.redirectInfo?.url) {
      return new Response(
        JSON.stringify({
          success: true,
          redirectUrl: phonepeData.data.instrumentResponse.redirectInfo.url,
          orderId: orderId,
          transactionId: orderId,
          merchantId: PHONEPE_MERCHANT_ID
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: phonepeData.message || 'Payment initiation failed',
          code: phonepeData.code,
          data: phonepeData
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error('❌ Error in phonepe-sandbox-pay:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error',
        stack: error.stack
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

