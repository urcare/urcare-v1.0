import React from 'react';
import { useSearchParams } from 'react-router-dom';
import PhonePeQRFallback from '../components/payment/PhonePeQRFallback';

export default function PhonePeQRFallbackPage() {
  const [searchParams] = useSearchParams();
  
  const orderId = searchParams.get('orderId') || '';
  const amount = parseInt(searchParams.get('amount') || '100');
  const planSlug = searchParams.get('plan') || 'basic';
  const billingCycle = searchParams.get('cycle') || 'annual';
  const merchantId = searchParams.get('merchantId') || 'M23XRS3XN3QMF';

  return (
    <PhonePeQRFallback
      orderId={orderId}
      amount={amount}
      planSlug={planSlug}
      billingCycle={billingCycle}
      merchantId={merchantId}
    />
  );
}
