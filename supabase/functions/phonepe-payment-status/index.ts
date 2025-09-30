import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// PhonePe Configuration
const PHONEPE_CONFIG = {
  MERCHANT_ID: Deno.env.get('PHONEPE_MERCHANT_ID') || 'M23XRS3XN3QMF',
  CLIENT_ID: Deno.env.get('PHONEPE_CLIENT_ID') || 'SU2509291721337653559173',
  KEY_INDEX: Deno.env.get('PHONEPE_KEY_INDEX') || '1',
  API_KEY: Deno.env.get('PHONEPE_API_KEY') || '713219fb-38d0-468d-8268-8b15955468b0',
  BASE_URL: Deno.env.get('PHONEPE_BASE_URL') || 'https://api-preprod.phonepe.com/apis/pg-sandbox',
};

// Generate PhonePe checksum for status check
function generateChecksum(payload: string, apiKey: string): string {
  const crypto = require('crypto');
  const hash = crypto.createHmac('sha256', apiKey).update(payload).digest('hex');
  return Buffer.from(hash).toString('base64');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { transactionId, userId } = await req.json();

    if (!transactionId || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: transactionId, userId' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Checking payment status for transaction:', transactionId);

    // Create status check payload
    const statusPayload = `/pg/v1/status/${PHONEPE_CONFIG.MERCHANT_ID}/${transactionId}`;
    
    // Generate checksum for status check
    const checksum = generateChecksum(statusPayload, PHONEPE_CONFIG.API_KEY);

    console.log('PhonePe Status Check Request:', {
      merchantId: PHONEPE_CONFIG.MERCHANT_ID,
      transactionId,
      checksum: checksum.substring(0, 20) + '...'
    });

    // Call PhonePe status API
    const phonepeResponse = await fetch(`${PHONEPE_CONFIG.BASE_URL}/pg/v1/status/${PHONEPE_CONFIG.MERCHANT_ID}/${transactionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum + '###' + PHONEPE_CONFIG.KEY_INDEX,
        'X-MERCHANT-ID': PHONEPE_CONFIG.MERCHANT_ID,
        'accept': 'application/json'
      }
    });

    const phonepeData = await phonepeResponse.json();
    console.log('PhonePe Status API Response:', phonepeData);

    if (!phonepeResponse.ok) {
      throw new Error(`PhonePe API error: ${phonepeData.message || 'Unknown error'}`);
    }

    // Check if payment was successful
    const isSuccess = phonepeData.code === 'PAYMENT_SUCCESS';
    const isFailed = phonepeData.code === 'PAYMENT_ERROR' || phonepeData.code === 'PAYMENT_CANCELLED';

    // Update payment record in database
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    if (isSuccess || isFailed) {
      const { error: updateError } = await supabaseClient
        .from('payments')
        .update({ 
          status: isSuccess ? 'completed' : 'failed',
          phonepe_response: phonepeData
        })
        .eq('phonepe_merchant_transaction_id', transactionId)
        .eq('user_id', userId);

      if (updateError) {
        console.error('Failed to update payment record:', updateError);
        // Continue even if update fails
      }
    }

    // Return status response
    return new Response(
      JSON.stringify({
        success: true,
        code: phonepeData.code,
        message: phonepeData.message,
        amount: phonepeData.data?.amount || 0,
        transactionId: transactionId,
        status: isSuccess ? 'success' : (isFailed ? 'failed' : 'pending')
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in phonepe-payment-status:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});