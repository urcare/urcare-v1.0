-- Create PhonePe payment integration functions
-- This migration creates database functions to support PhonePe payment processing

-- Function to create a payment record for PhonePe
CREATE OR REPLACE FUNCTION create_phonepe_payment(
  p_user_id UUID,
  p_plan_id UUID,
  p_amount DECIMAL(10,2),
  p_currency VARCHAR(3) DEFAULT 'INR',
  p_payment_method VARCHAR(50),
  p_billing_cycle VARCHAR(10),
  p_merchant_transaction_id VARCHAR(255)
)
RETURNS UUID AS $$
DECLARE
  payment_id UUID;
BEGIN
  INSERT INTO payments (
    user_id,
    plan_id,
    amount,
    currency,
    status,
    payment_method,
    billing_cycle,
    phonepe_merchant_transaction_id,
    is_first_time
  ) VALUES (
    p_user_id,
    p_plan_id,
    p_amount,
    p_currency,
    'pending',
    p_payment_method,
    p_billing_cycle,
    p_merchant_transaction_id,
    true
  ) RETURNING id INTO payment_id;
  
  RETURN payment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update payment status
CREATE OR REPLACE FUNCTION update_payment_status(
  p_payment_id UUID,
  p_status VARCHAR(20),
  p_phonepe_transaction_id VARCHAR(255) DEFAULT NULL,
  p_phonepe_response JSONB DEFAULT NULL,
  p_failure_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE payments SET
    status = p_status,
    phonepe_transaction_id = COALESCE(p_phonepe_transaction_id, phonepe_transaction_id),
    phonepe_response = COALESCE(p_phonepe_response, phonepe_response),
    failure_reason = COALESCE(p_failure_reason, failure_reason),
    processed_at = CASE 
      WHEN p_status = 'completed' THEN NOW()
      ELSE processed_at
    END,
    updated_at = NOW()
  WHERE id = p_payment_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create or update subscription after successful payment
CREATE OR REPLACE FUNCTION create_or_update_subscription(
  p_user_id UUID,
  p_plan_id UUID,
  p_billing_cycle VARCHAR(10),
  p_phonepe_transaction_id VARCHAR(255)
)
RETURNS UUID AS $$
DECLARE
  subscription_id UUID;
  existing_subscription_id UUID;
  period_start TIMESTAMP WITH TIME ZONE;
  period_end TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Check if user already has an active subscription
  SELECT id INTO existing_subscription_id
  FROM subscriptions
  WHERE user_id = p_user_id
  AND status = 'active'
  AND current_period_end > NOW();
  
  period_start := NOW();
  
  -- Calculate period end based on billing cycle
  IF p_billing_cycle = 'monthly' THEN
    period_end := period_start + INTERVAL '1 month';
  ELSE
    period_end := period_start + INTERVAL '1 year';
  END IF;
  
  IF existing_subscription_id IS NOT NULL THEN
    -- Update existing subscription
    UPDATE subscriptions SET
      plan_id = p_plan_id,
      billing_cycle = p_billing_cycle,
      current_period_start = period_start,
      current_period_end = period_end,
      status = 'active',
      phonepe_subscription_id = p_phonepe_transaction_id,
      updated_at = NOW()
    WHERE id = existing_subscription_id
    RETURNING id INTO subscription_id;
  ELSE
    -- Create new subscription
    INSERT INTO subscriptions (
      user_id,
      plan_id,
      status,
      billing_cycle,
      current_period_start,
      current_period_end,
      phonepe_subscription_id
    ) VALUES (
      p_user_id,
      p_plan_id,
      'active',
      p_billing_cycle,
      period_start,
      period_end,
      p_phonepe_transaction_id
    ) RETURNING id INTO subscription_id;
  END IF;
  
  RETURN subscription_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cancel subscription
CREATE OR REPLACE FUNCTION cancel_subscription(
  p_user_id UUID,
  p_cancel_at_period_end BOOLEAN DEFAULT true
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE subscriptions SET
    status = CASE 
      WHEN p_cancel_at_period_end THEN 'active'
      ELSE 'canceled'
    END,
    cancel_at_period_end = p_cancel_at_period_end,
    canceled_at = CASE 
      WHEN p_cancel_at_period_end THEN NULL
      ELSE NOW()
    END,
    updated_at = NOW()
  WHERE user_id = p_user_id
  AND status = 'active';
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get payment history for a user
CREATE OR REPLACE FUNCTION get_user_payment_history(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  payment_id UUID,
  plan_name VARCHAR(100),
  amount DECIMAL(10,2),
  currency VARCHAR(3),
  status VARCHAR(20),
  payment_method VARCHAR(50),
  billing_cycle VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE,
  processed_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as payment_id,
    sp.name as plan_name,
    p.amount,
    p.currency,
    p.status,
    p.payment_method,
    p.billing_cycle,
    p.created_at,
    p.processed_at
  FROM payments p
  JOIN subscription_plans sp ON p.plan_id = sp.id
  WHERE p.user_id = p_user_id
  ORDER BY p.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get subscription analytics
CREATE OR REPLACE FUNCTION get_subscription_analytics(
  p_user_id UUID
)
RETURNS TABLE (
  total_payments INTEGER,
  total_amount DECIMAL(10,2),
  successful_payments INTEGER,
  failed_payments INTEGER,
  current_subscription_status VARCHAR(20),
  current_plan_name VARCHAR(100),
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(p.id)::INTEGER as total_payments,
    COALESCE(SUM(p.amount), 0) as total_amount,
    COUNT(CASE WHEN p.status = 'completed' THEN 1 END)::INTEGER as successful_payments,
    COUNT(CASE WHEN p.status = 'failed' THEN 1 END)::INTEGER as failed_payments,
    COALESCE(s.status, 'none') as current_subscription_status,
    COALESCE(sp.name, 'none') as current_plan_name,
    s.current_period_start as subscription_start_date,
    s.current_period_end as subscription_end_date
  FROM payments p
  LEFT JOIN subscriptions s ON s.user_id = p.user_id AND s.status = 'active'
  LEFT JOIN subscription_plans sp ON s.plan_id = sp.id
  WHERE p.user_id = p_user_id
  GROUP BY s.status, sp.name, s.current_period_start, s.current_period_end;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if payment is eligible for refund
CREATE OR REPLACE FUNCTION is_payment_refundable(
  p_payment_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  payment_record RECORD;
  days_since_payment INTEGER;
BEGIN
  SELECT * INTO payment_record
  FROM payments
  WHERE id = p_payment_id;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Check if payment is completed
  IF payment_record.status != 'completed' THEN
    RETURN FALSE;
  END IF;
  
  -- Check if already refunded
  IF payment_record.status = 'refunded' THEN
    RETURN FALSE;
  END IF;
  
  -- Check if payment is within refund window (30 days)
  days_since_payment := EXTRACT(DAYS FROM (NOW() - payment_record.processed_at));
  
  IF days_since_payment > 30 THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION create_phonepe_payment(UUID, UUID, DECIMAL, VARCHAR, VARCHAR, VARCHAR, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION update_payment_status(UUID, VARCHAR, VARCHAR, JSONB, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION create_or_update_subscription(UUID, UUID, VARCHAR, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION cancel_subscription(UUID, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_payment_history(UUID, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_subscription_analytics(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_payment_refundable(UUID) TO authenticated;

-- Grant execute permissions to service role
GRANT EXECUTE ON FUNCTION create_phonepe_payment(UUID, UUID, DECIMAL, VARCHAR, VARCHAR, VARCHAR, VARCHAR) TO service_role;
GRANT EXECUTE ON FUNCTION update_payment_status(UUID, VARCHAR, VARCHAR, JSONB, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION create_or_update_subscription(UUID, UUID, VARCHAR, VARCHAR) TO service_role;
GRANT EXECUTE ON FUNCTION cancel_subscription(UUID, BOOLEAN) TO service_role;
GRANT EXECUTE ON FUNCTION get_user_payment_history(UUID, INTEGER, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION get_subscription_analytics(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION is_payment_refundable(UUID) TO service_role;

-- Add comments for documentation
COMMENT ON FUNCTION create_phonepe_payment IS 'Creates a new payment record for PhonePe payment processing';
COMMENT ON FUNCTION update_payment_status IS 'Updates payment status and PhonePe response data';
COMMENT ON FUNCTION create_or_update_subscription IS 'Creates new subscription or updates existing one after successful payment';
COMMENT ON FUNCTION cancel_subscription IS 'Cancels user subscription immediately or at period end';
COMMENT ON FUNCTION get_user_payment_history IS 'Returns payment history for a specific user';
COMMENT ON FUNCTION get_subscription_analytics IS 'Returns subscription analytics and statistics for a user';
COMMENT ON FUNCTION is_payment_refundable IS 'Checks if a payment is eligible for refund based on status and time window';
