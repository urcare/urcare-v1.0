import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Razorpay from 'https://esm.sh/razorpay@2.8.6'
import { crypto } from 'https://deno.land/std@0.168.0/crypto/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Use service role key for webhook processing
    )

    // Create Razorpay client
    const razorpay = new Razorpay({
      key_id: Deno.env.get('RAZORPAY_KEY_ID') ?? '',
      key_secret: Deno.env.get('RAZORPAY_KEY_SECRET') ?? '',
    })

    // Get webhook payload
    const webhookPayload = await req.json()
    
    // Verify webhook signature
    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET') ?? ''
    const signature = req.headers.get('x-razorpay-signature')
    
    if (!signature) {
      throw new Error('Missing webhook signature')
    }

    // Verify webhook signature
    const text = JSON.stringify(webhookPayload)
    const encoder = new TextEncoder()
    const keyData = encoder.encode(webhookSecret)
    const messageData = encoder.encode(text)
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    
    const expectedSignature = await crypto.subtle.sign('HMAC', cryptoKey, messageData)
    const expectedSignatureHex = Array.from(new Uint8Array(expectedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    if (expectedSignatureHex !== signature) {
      throw new Error('Invalid webhook signature')
    }

    const event = webhookPayload.event
    const payment = webhookPayload.payload.payment
    const order = webhookPayload.payload.order

    console.log(`Processing webhook event: ${event}`)

    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(supabaseClient, payment, order)
        break
      
      case 'payment.failed':
        await handlePaymentFailed(supabaseClient, payment, order)
        break
      
      case 'refund.processed':
        await handleRefundProcessed(supabaseClient, payment, order)
        break
      
      case 'subscription.activated':
        await handleSubscriptionActivated(supabaseClient, payment, order)
        break
      
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(supabaseClient, payment, order)
        break
      
      default:
        console.log(`Unhandled webhook event: ${event}`)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Webhook processed successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error processing webhook:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

async function handlePaymentCaptured(supabaseClient: any, payment: any, order: any) {
  console.log(`Payment captured: ${payment.id}`)
  
  // Update subscription status if payment was successful
  const { error } = await supabaseClient
    .from('subscriptions')
    .update({ 
      status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('payment_method_id', payment.id)

  if (error) {
    console.error('Error updating subscription status:', error)
  }
}

async function handlePaymentFailed(supabaseClient: any, payment: any, order: any) {
  console.log(`Payment failed: ${payment.id}`)
  
  // Update subscription status to failed
  const { error } = await supabaseClient
    .from('subscriptions')
    .update({ 
      status: 'failed',
      updated_at: new Date().toISOString()
    })
    .eq('payment_method_id', payment.id)

  if (error) {
    console.error('Error updating subscription status:', error)
  }
}

async function handleRefundProcessed(supabaseClient: any, payment: any, order: any) {
  console.log(`Refund processed: ${payment.id}`)
  
  // Update subscription status to cancelled
  const { error } = await supabaseClient
    .from('subscriptions')
    .update({ 
      status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('payment_method_id', payment.id)

  if (error) {
    console.error('Error updating subscription status:', error)
  }
}

async function handleSubscriptionActivated(supabaseClient: any, payment: any, order: any) {
  console.log(`Subscription activated: ${payment.id}`)
  
  // Update subscription status to active
  const { error } = await supabaseClient
    .from('subscriptions')
    .update({ 
      status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('payment_method_id', payment.id)

  if (error) {
    console.error('Error updating subscription status:', error)
  }
}

async function handleSubscriptionCancelled(supabaseClient: any, payment: any, order: any) {
  console.log(`Subscription cancelled: ${payment.id}`)
  
  // Update subscription status to cancelled
  const { error } = await supabaseClient
    .from('subscriptions')
    .update({ 
      status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('payment_method_id', payment.id)

  if (error) {
    console.error('Error updating subscription status:', error)
  }
} 