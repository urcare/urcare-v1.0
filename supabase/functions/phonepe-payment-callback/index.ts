import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// PhonePe Configuration - Using saved secrets
const PHONEPE_CONFIG = {
  MERCHANT_ID: Deno.env.get('PHONEPE_MERCHANT_ID') || 'M23XRS3XN3QMF',
  CLIENT_ID: Deno.env.get('PHONEPE_CLIENT_ID') || 'SU2509291721337653559173',
  CLIENT_SECRET: Deno.env.get('PHONEPE_CLIENT_SECRET') || '713219fb-38d0-468d-8268-8b15955468b0',
  CLIENT_VERSION: Deno.env.get('PHONEPE_CLIENT_VERSION') || '1',
  KEY_INDEX: Deno.env.get('PHONEPE_KEY_INDEX') || '1',
  API_KEY: Deno.env.get('PHONEPE_API_KEY') || '713219fb-38d0-468d-8268-8b15955468b0',
  BASE_URL: Deno.env.get('PHONEPE_BASE_URL') || 'https://api-preprod.phonepe.com/apis/pg-sandbox',
  ENVIRONMENT: Deno.env.get('PHONEPE_ENV') || 'SANDBOX',
  MERCHANT_USERNAME: Deno.env.get('MERCHANT_USERNAME') || 'M23XRS3XN3QMF',
  MERCHANT_PASSWORD: Deno.env.get('MERCHANT_PASSWORD') || '713219fb-38d0-468d-8268-8b15955468b0',
};

// Generate PhonePe checksum for callback validation
function generateChecksum(payload: string, apiKey: string): string {
  const crypto = require('crypto');
  const hash = crypto.createHmac('sha256', apiKey).update(payload).digest('hex');
  return Buffer.from(hash).toString('base64');
}

// Validate PhonePe callback
async function validateCallback(username: string, password: string, authorizationHeader: string, responseBody: string): Promise<boolean> {
  try {
    // In a real implementation, you would validate the callback using PhonePe's validation method
    // For now, we'll do basic validation
    if (!authorizationHeader || !responseBody) {
      return false;
    }

    // Extract checksum from authorization header
    const checksum = authorizationHeader.replace('X-VERIFY ', '');
    
    // Generate expected checksum
    const expectedChecksum = generateChecksum(responseBody, PHONEPE_CONFIG.API_KEY);
    
    // Compare checksums
    return checksum === expectedChecksum;
  } catch (error) {
    console.error('Error validating callback:', error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authorizationHeader = req.headers.get('authorization') || req.headers.get('Authorization');
    const responseBody = await req.text();

    console.log('PhonePe Callback received:', {
      authorization: authorizationHeader ? authorizationHeader.substring(0, 20) + '...' : 'None',
      bodyLength: responseBody.length
    });

    // Validate callback
    const isValid = await validateCallback(
      PHONEPE_CONFIG.MERCHANT_USERNAME,
      PHONEPE_CONFIG.MERCHANT_PASSWORD,
      authorizationHeader || '',
      responseBody
    );

    if (!isValid) {
      console.error('Invalid PhonePe callback received');
      return new Response(
        JSON.stringify({ error: 'Invalid callback' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse callback data
    const callbackData = JSON.parse(responseBody);
    console.log('PhonePe Callback Data:', callbackData);

    const orderId = callbackData.payload?.merchantOrderId;
    const status = callbackData.payload?.state;
    const phonepeTransactionId = callbackData.payload?.transactionId;

    if (!orderId || !status) {
      console.error('Missing required callback data');
      return new Response(
        JSON.stringify({ error: 'Missing required callback data' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Update payment status in database
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Map PhonePe status to our status
    let paymentStatus = 'processing';
    switch (status) {
      case 'PAYMENT_SUCCESS':
        paymentStatus = 'completed';
        break;
      case 'PAYMENT_ERROR':
      case 'PAYMENT_CANCELLED':
        paymentStatus = 'failed';
        break;
      default:
        paymentStatus = 'processing';
    }

    // Update payment record
    const { error: updateError } = await supabaseClient
      .from('payments')
      .update({
        status: paymentStatus,
        phonepe_response: callbackData,
        phonepe_transaction_id: phonepeTransactionId
      })
      .eq('phonepe_merchant_transaction_id', orderId);

    if (updateError) {
      console.error('Failed to update payment record:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update payment status' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Process callback based on type
    switch (callbackData.type) {
      case 'PAYMENT_SUCCESS':
        console.log('Payment successful for order:', orderId);
        // Here you can add additional logic like creating subscription, sending emails, etc.
        break;
      case 'PAYMENT_ERROR':
        console.log('Payment failed for order:', orderId);
        break;
      default:
        console.log('Received unknown callback type:', callbackData.type);
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Callback processed successfully',
        orderId: orderId,
        status: paymentStatus
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error processing PhonePe callback:', error);
    
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
