import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// PhonePe Configuration from environment variables
const PHONEPE_BASE_URL = Deno.env.get('PHONEPE_BASE_URL') || 'https://api.phonepe.com/apis/hermes';
const PHONEPE_MERCHANT_ID = Deno.env.get('PHONEPE_MERCHANT_ID') || 'M23XRS3XN3QMF';
const PHONEPE_SALT_KEY = Deno.env.get('PHONEPE_API_KEY') || '713219fb-38d0-468d-8268-8b15955468b0';
const PHONEPE_SALT_INDEX = Deno.env.get('PHONEPE_SALT_INDEX') || '1';

// Generate X-VERIFY signature for status check
async function generateXVerify(endpoint: string, saltKey: string, saltIndex: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(endpoint + saltKey);
  
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
    const { transactionId } = await req.json();

    // Validate input
    if (!transactionId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required field: transactionId' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create status check endpoint
    const endpoint = `/pg/v1/status/${PHONEPE_MERCHANT_ID}/${transactionId}`;
    
    // Generate X-VERIFY signature
    const xVerify = await generateXVerify(endpoint, PHONEPE_SALT_KEY, PHONEPE_SALT_INDEX);

    console.log('Checking status for transaction:', transactionId);
    console.log('Status endpoint:', `${PHONEPE_BASE_URL}${endpoint}`);

    // Call PhonePe status API
    const phonepeResponse = await fetch(`${PHONEPE_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        'X-MERCHANT-ID': PHONEPE_MERCHANT_ID,
        'accept': 'application/json'
      }
    });

    const phonepeData = await phonepeResponse.json();
    console.log('PhonePe Status Response:', JSON.stringify(phonepeData, null, 2));

    // Return the status response
    return new Response(
      JSON.stringify({
        success: phonepeData.success || false,
        code: phonepeData.code,
        message: phonepeData.message,
        data: phonepeData.data,
        transactionId: transactionId
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in phonepe-status:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});



