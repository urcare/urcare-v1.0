import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, QrCode, Smartphone, CheckCircle, XCircle, Upload, Copy } from "lucide-react";

export default function PaymentMonthly() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'select' | 'upi' | 'success' | 'cancelled'>('select');
  const [utr, setUtr] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const amount = 849;
  const planName = "UrCare Monthly";
  const billingCycle = "monthly";

  const handleUPI = () => {
    setStep('upi');
  };


  const handleScreenshotUpload = async (file: File) => {
    if (!user) return;
    
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('payment-screenshots')
        .upload(fileName, file);

      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('payment-screenshots')
        .getPublicUrl(fileName);
      
      setScreenshot(file);
      setScreenshotUrl(publicUrl);
      toast.success('Screenshot uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload screenshot');
    } finally {
      setUploading(false);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!user) return;
    const utrClean = utr.trim();
    const utrValid = /^[A-Za-z0-9]{10,25}$/.test(utrClean);
    if (!utrValid) {
      toast.error('Enter a valid UTR (10-25 letters/numbers)');
      return;
    }
    if (!screenshotUrl) {
      toast.error('Please upload a payment screenshot');
      return;
    }

    setSubmitting(true);
    try {
      // Get plan details
      const { data: plan, error: planError } = await supabase
        .from('subscription_plans')
        .select('id')
        .eq('slug', 'basic')
        .eq('is_active', true)
        .single();

      if (planError || !plan) {
        throw new Error('Plan not found');
      }

      // Create payment record for admin verification
      const { data: payment, error: paymentError } = await supabase
        .from('manual_upi_payments')
        .insert({
          user_id: user.id,
          plan_id: plan.id,
          amount: amount,
          currency: 'INR',
          billing_cycle: billingCycle,
          status: 'processing',
          utr: utrClean,
          screenshot_url: screenshotUrl,
          transaction_ref: `${user.id}-${Date.now()}`
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Grant subscription immediately for better user experience
      const { error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          plan_id: plan.id,
          plan_slug: 'basic',
          status: 'active',
          billing_cycle: billingCycle,
          amount: amount,
          currency: 'INR',
          current_period_start: new Date().toISOString(),
          current_period_end: billingCycle === 'monthly' 
            ? new Date(Date.now() + 30*24*60*60*1000).toISOString()
            : new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
        });

      if (subscriptionError) throw subscriptionError;

      toast.success('Payment verified! Your subscription is now active.');
      setStep('success');
      setTimeout(() => navigate('/dashboard', { replace: true }), 1500);
    } catch (error) {
      console.error('Payment submission error:', error);
      toast.error('Failed to submit payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setStep('cancelled');
  };

  const copyUPIId = () => {
    navigator.clipboard.writeText('archamasaini123@okicici'); // Replace with your actual UPI ID
    toast.success('UPI ID copied to clipboard');
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Submitted!</h2>
          <p className="text-gray-600 mb-4">
            Your payment has been verified and your subscription is now active!
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 text-sm">
              🎉 Welcome to UrCare! You now have full access to all features.
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (step === 'cancelled') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h2>
          <p className="text-gray-600 mb-6">
            No worries! You can try again anytime.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setStep('select')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/paywall')}
              className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Plans
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'upi') {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setStep('select')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">₹{amount}</div>
              <div className="text-sm text-gray-500">{planName}</div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Scan QR Code to Pay</h3>
              <p className="text-sm text-gray-600">Use any UPI app to scan and pay</p>
            </div>
            
            <div className="flex justify-center mb-4">
              <img 
                src="/images/payment.jpg" 
                alt="UPI QR Code" 
                className="w-64 h-64 border border-gray-200 rounded-lg object-contain bg-white shadow-sm"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">UPI ID</p>
                  <p className="font-mono text-lg">archamasaini123@okicici</p>
                </div>
                <button
                  onClick={copyUPIId}
                  className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => window.open('upi://pay?pa=archamasaini123@okicici&pn=UrCare&am=849&tn=UrCare%20Monthly%20Subscription&cu=INR', '_blank')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Open in UPI App
              </button>
            </div>
          </div>

          {/* Payment Confirmation Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Payment</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UTR/Reference ID *
                </label>
                <input
                  type="text"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  placeholder="Enter UTR from your UPI app"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Screenshot (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {screenshot ? (
                    <div className="text-green-600">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Screenshot uploaded</p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Upload screenshot of payment</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleScreenshotUpload(e.target.files[0])}
                        className="hidden"
                        id="screenshot-upload"
                      />
                      <label
                        htmlFor="screenshot-upload"
                        className="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
                      >
                        {uploading ? 'Uploading...' : 'Choose File'}
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePaymentSubmit}
                disabled={!utr.trim() || submitting}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Submitting...' : 'I Paid, Verify'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/paywall')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">₹{amount}</div>
            <div className="text-sm text-gray-500">{planName}</div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4">
          <div
            onClick={handleUPI}
            className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <QrCode className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Pay with UPI</h3>
                <p className="text-sm text-gray-600">Scan QR code or use UPI ID</p>
              </div>
              <div className="text-blue-600">→</div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Secure payment processing</p>
        </div>
      </div>
    </div>
  );
}
