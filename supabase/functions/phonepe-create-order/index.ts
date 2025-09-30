import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
  ENVIRONMENT: Deno.env.get('PHONEPE_ENV') || 'SANDBOX', // Change to PRODUCTION when going live
  REDIRECT_URL: (Deno.env.get('FRONTEND_URL') || 'http://localhost:8080') + '/phonecheckout/result',
  CALLBACK_URL: (Deno.env.get('SUPABASE_URL') || '') + '/functions/v1/phonepe-payment-callback',
  MERCHANT_USERNAME: Deno.env.get('MERCHANT_USERNAME') || 'M23XRS3XN3QMF',
  MERCHANT_PASSWORD: Deno.env.get('MERCHANT_PASSWORD') || '713219fb-38d0-468d-8268-8b15955468b0',
};

// Generate PhonePe checksum
function generateChecksum(payload: string, apiKey: string): string {
  const crypto = require('crypto');
  const hash = crypto.createHmac('sha256', apiKey).update(payload).digest('hex');
  return Buffer.from(hash).toString('base64');
}

// Generate UUID for merchant order ID
function generateMerchantOrderId(): string {
  return `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Generate UUID (for backward compatibility)
function generateUUID(): string {
  return generateMerchantOrderId();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { amount, userId, planSlug, billingCycle, merchantOrderId, redirectUrl, sdkMode } = await req.json();

    if (!amount || !userId || !planSlug || !billingCycle) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: amount, userId, planSlug, billingCycle' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Generate merchant order ID if not provided
    const orderId = merchantOrderId || generateMerchantOrderId();
    const finalRedirectUrl = redirectUrl || `${PHONEPE_CONFIG.REDIRECT_URL}?orderId=${orderId}&plan=${planSlug}&cycle=${billingCycle}`;
    
    // Convert amount to paise (multiply by 100)
    const amountInPaise = Math.round(amount * 100);

    // For SDK mode, create SDK order
    if (sdkMode) {
      const sdkOrderRequest = {
        merchantOrderId: orderId,
        amount: amountInPaise,
        redirectUrl: finalRedirectUrl,
        redirectMode: 'POST',
        callbackUrl: PHONEPE_CONFIG.CALLBACK_URL,
        mobileNumber: '9999999999',
        paymentInstrument: {
          type: 'PAY_PAGE'
        }
      };

      // In a real implementation, you would call PhonePe's SDK order creation API
      // For now, we'll simulate the response
      const mockSdkResponse = {
        success: true,
        token: `sdk_token_${orderId}`,
        orderId: orderId,
        checkoutUrl: `${PHONEPE_CONFIG.BASE_URL}/pg/v1/pay?merchantId=${PHONEPE_CONFIG.MERCHANT_ID}&merchantOrderId=${orderId}&amount=${amountInPaise}&redirectUrl=${encodeURIComponent(finalRedirectUrl)}`
      };

      // Store payment record in database
      await storePaymentRecord(userId, planSlug, billingCycle, amount, orderId, 'processing', sdkOrderRequest, mockSdkResponse);

      return new Response(
        JSON.stringify(mockSdkResponse),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // For regular checkout, create PhonePe payload
    const payload = {
      merchantId: PHONEPE_CONFIG.MERCHANT_ID,
      merchantTransactionId: orderId,
      amount: amountInPaise,
      redirectUrl: finalRedirectUrl,
      redirectMode: 'POST',
      callbackUrl: PHONEPE_CONFIG.CALLBACK_URL,
      mobileNumber: '9999999999',
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    };

    // Convert payload to string for checksum
    const payloadString = JSON.stringify(payload);
    
    // Generate checksum
    const checksum = generateChecksum(payloadString, PHONEPE_CONFIG.API_KEY);

    // Create PhonePe request
    const phonepeRequest = {
      request: Buffer.from(payloadString).toString('base64')
    };

    console.log('PhonePe Create Order Request:', {
      merchantId: PHONEPE_CONFIG.MERCHANT_ID,
      orderId,
      amount: amountInPaise,
      checksum: checksum.substring(0, 20) + '...'
    });

    // Call PhonePe API
    const phonepeResponse = await fetch(`${PHONEPE_CONFIG.BASE_URL}/pg/v1/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum + '###' + PHONEPE_CONFIG.KEY_INDEX,
        'accept': 'application/json'
      },
      body: JSON.stringify(phonepeRequest)
    });

    const phonepeData = await phonepeResponse.json();
    console.log('PhonePe API Response:', phonepeData);

    if (!phonepeResponse.ok) {
      throw new Error(`PhonePe API error: ${phonepeData.message || 'Unknown error'}`);
    }

    if (phonepeData.code !== 'PAYMENT_INITIATED') {
      throw new Error(`PhonePe error: ${phonepeData.message || 'Payment initiation failed'}`);
    }

    // Store payment record in database
    await storePaymentRecord(userId, planSlug, billingCycle, amount, orderId, 'processing', payload, phonepeData);

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        transactionId: orderId,
        orderId: orderId,
        redirectUrl: phonepeData.data.instrumentResponse.redirectInfo.url,
        amount: amount,
        planSlug: planSlug,
        billingCycle: billingCycle
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in phonepe-create-order:', error);
    
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

// Helper function to store payment record
async function storePaymentRecord(userId: string, planSlug: string, billingCycle: string, amount: number, orderId: string, status: string, request: any, response: any) {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  );

  const { data: plan, error: planError } = await supabaseClient
    .from('subscription_plans')
    .select('id')
    .eq('slug', planSlug)
    .single();

  if (planError || !plan) {
    console.error('Plan not found in DB for payment record:', planError);
    // Continue, but log the error
  }

  const { error: paymentError } = await supabaseClient
    .from('payments')
    .insert({
      user_id: userId,
      plan_id: plan?.id || null,
      amount: amount,
      currency: 'INR',
      status: status,
      payment_method: 'phonepe',
      billing_cycle: billingCycle,
      phonepe_merchant_transaction_id: orderId,
      is_first_time: true,
      phonepe_request: request,
      phonepe_response: response
    });

  if (paymentError) {
    console.error('Failed to create payment record:', paymentError);
    // Continue, but log the error
  }
}
