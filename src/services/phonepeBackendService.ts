// PhonePe Express Backend URL
const PHONEPE_BACKEND_URL = process.env.NODE_ENV === 'production' 
  ? 'https://urcare.vercep.app/api/phonepe'
  : 'http://localhost:5000';

// Create PhonePe payment order using Express Backend
export async function createPhonePePayment(orderId: string, amount: number, userId: string, planSlug?: string, billingCycle?: string) {
  try {
    console.log("Creating PhonePe payment via Express Backend:", {
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

    console.log("📤 Sending request to Express Backend:", JSON.stringify(requestBody, null, 2));

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
  } catch (error) {
    console.error("PhonePe Payment Error:", error);
    throw error;
  }
}

// Check payment status using Express Backend
export async function checkPhonePeStatus(orderId: string, userId?: string) {
  try {
    console.log("Checking PhonePe payment status via Express Backend:", orderId);

    const response = await fetch(`${PHONEPE_BACKEND_URL}/api/phonepe/status`, {
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
    // Get plan ID from subscription_plans table
    let planId = null;
    if (planSlug) {
      const { data: plan, error: planError } = await supabase
        .from('subscription_plans')
        .select('id')
        .eq('slug', planSlug)
        .single();

      if (planError) {
        console.error("Plan not found:", planError);
        // Use a default plan ID or create a basic plan entry
        planId = 1; // Default plan ID
      } else {
        planId = plan.id;
      }
    }

    const { error } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        plan_id: planId,
        amount: amount / 100, // Convert from paise to rupees
        currency: 'INR',
        status: status,
        payment_method: 'phonepe',
        billing_cycle: billingCycle || 'annual', // Default to annual if not provided
        phonepe_merchant_transaction_id: orderId,
        is_first_time: true
      });

    if (error) {
      console.error("Failed to store payment record:", error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Store Payment Record Error:", error);
    throw error;
  }
}
