import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import PhonePeService from "./phonepe-service.js";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Deno type declarations
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

// Initialize PhonePe Service for Supabase Edge Function
const phonepeService = new PhonePeService();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Health Check
  if (req.method === 'GET') {
    return new Response(
      JSON.stringify({
        status: 'ok',
        message: 'PhonePe SDK Edge Function is running',
        timestamp: new Date().toISOString(),
        config: phonepeService.getConfig()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    const { action, ...params } = await req.json();

    console.log('📥 PhonePe SDK Edge Function Request:', { action, params });

    let result;

    switch (action) {
      case 'create-order':
        result = await phonepeService.createPaymentOrder(params);
        break;

      case 'check-status':
        result = await phonepeService.checkPaymentStatus(params.transactionId);
        break;

      case 'verify-callback':
        result = await phonepeService.verifyPaymentCallback(params);
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ PhonePe SDK Edge Function Error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error'
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

