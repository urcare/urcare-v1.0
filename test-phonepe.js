// Test script to check PhonePe function
const testPhonePeFunction = async () => {
  const response = await fetch('https://lvnkpserdydhnqbigfbz.supabase.co/functions/v1/phonepe-payment-initiate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHloaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzQ4MDAsImV4cCI6MjA1MDU1MDgwMH0.8QZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ'
    },
    body: JSON.stringify({
      user_id: '644579f0-5e35-4b9f-891c-b40bb8f11248',
      plan_id: '87705759-4451-477f-bd6d-816a228bb68d',
      billing_cycle: 'monthly',
      amount: 12,
      currency: 'INR',
      payment_method: 'card'
    })
  });

  const data = await response.json();
  console.log('Response status:', response.status);
  console.log('Response data:', data);
};

testPhonePeFunction().catch(console.error);

