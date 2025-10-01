import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import RazorpayGateway from "@/components/payment/RazorpayGateway";

export default function PhonePeCheckout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get payment data from location state or URL params
  const { planSlug, billingCycle, amount } = location.state || {};
  const urlParams = new URLSearchParams(location.search);
  const amountFromUrl = urlParams.get('amount');
  const planFromUrl = urlParams.get('plan');
  const cycleFromUrl = urlParams.get('cycle');
  
  // Use data from state or URL params, with defaults for testing
  const finalAmount = amount || parseFloat(amountFromUrl || '1'); // Default to ₹1 for testing
  const finalPlan = planSlug || planFromUrl || 'basic';
  const finalCycle = billingCycle || cycleFromUrl || 'annual';

  useEffect(() => {
    if (!user) {
      navigate("/paywall");
      return;
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Will redirect
  }

  return (
    <RazorpayGateway
      amount={finalAmount}
      userId={user.id}
      planSlug={finalPlan}
      billingCycle={finalCycle}
    />
  );
}