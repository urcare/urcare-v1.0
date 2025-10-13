import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle, XCircle, Eye, Clock, User, CreditCard } from "lucide-react";

interface PaymentRecord {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  utr?: string;
  payer_vpa?: string;
  screenshot_url?: string;
  created_at: string;
  billing_cycle: string;
  plan_id: string;
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('manual_upi_payments')
        .select('*')
        .eq('status', 'processing')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const approvePayment = async (paymentId: string, userId: string, planId: string, billingCycle: string, amount: number) => {
    setProcessing(paymentId);
    try {
      // Update payment status
      const { error: paymentError } = await supabase
        .from('manual_upi_payments')
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', paymentId);

      if (paymentError) throw paymentError;

      // Create subscription using existing RPC function
      const { error: subscriptionError } = await supabase
        .rpc('create_subscription', {
          p_user_id: userId,
          p_plan_slug: 'basic',
          p_billing_cycle: billingCycle,
          p_razorpay_payment_id: paymentId,
          p_razorpay_subscription_id: null
        });

      if (subscriptionError) throw subscriptionError;

      toast.success('Payment approved and subscription activated!');
      fetchPayments();
    } catch (error) {
      console.error('Error approving payment:', error);
      toast.error('Failed to approve payment');
    } finally {
      setProcessing(null);
    }
  };

  const rejectPayment = async (paymentId: string) => {
    setProcessing(paymentId);
    try {
      const { error } = await supabase
        .from('manual_upi_payments')
        .update({ 
          status: 'rejected',
          rejection_reason: 'Rejected by admin'
        })
        .eq('id', paymentId);

      if (error) throw error;

      toast.success('Payment rejected');
      fetchPayments();
    } catch (error) {
      console.error('Error rejecting payment:', error);
      toast.error('Failed to reject payment');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Manual UPI Payments</h1>
            <button
              onClick={fetchPayments}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>

          {payments.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No pending payments</p>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">
                            ₹{payment.amount} {payment.billing_cycle} subscription
                          </h3>
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                            Pending
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>User ID: {payment.user_id}</p>
                          {payment.utr && <p>UTR: {payment.utr}</p>}
                          {payment.payer_vpa && <p>VPA: {payment.payer_vpa}</p>}
                          <p>Submitted: {new Date(payment.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {payment.screenshot_url && (
                        <button
                          onClick={() => window.open(payment.screenshot_url, '_blank')}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Screenshot"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => rejectPayment(payment.id)}
                        disabled={processing === payment.id}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Reject Payment"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={() => approvePayment(
                          payment.id, 
                          payment.user_id, 
                          payment.plan_id, 
                          payment.billing_cycle, 
                          payment.amount
                        )}
                        disabled={processing === payment.id}
                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Approve Payment"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
