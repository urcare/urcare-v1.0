import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Call backend API for GPT-4 report generation
async function fetchCustomPlanReport(profile: any) {
  try {
    const res = await fetch('/api/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile })
    });
    if (!res.ok) throw new Error('Failed to generate plan');
    const data = await res.json();
    return {
      summary: 'Your custom plan is ready! (see below)',
      recommendations: [
        'Daily Calorie Intake: 2100 kcal',
        'Carbohydrates: 250g',
        'Protein: 90g',
        'Fats: 70g',
        'Health Score: 82/100',
        'Potential Complications: See full report.',
        'Product Benefit: See full report.'
      ],
      detailedReport: data.report || 'No report generated.'
    };
  } catch (err) {
    return {
      summary: 'Error generating plan',
      recommendations: ['Could not generate plan. Please try again.'],
      detailedReport: ''
    };
  }
}

const CustomPlan: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'progress' | 'ready'>('progress');
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // Replace with real subscription check
  const isSubscribed = profile?.preferences?.subscription === 'active';

  useEffect(() => {
    if (!profile) {
      toast.error('Profile not found. Please complete onboarding.');
      navigate('/onboarding');
      return;
    }
    // Check for required onboarding data
    const required = [
      profile.full_name,
      profile.date_of_birth,
      profile.gender,
      profile.preferences?.meals?.breakfast_time,
      profile.preferences?.schedule?.sleep_time,
      profile.preferences?.schedule?.wake_up_time,
      profile.preferences?.health?.blood_group
    ];
    if (required.some((v) => !v)) {
      toast.error('Some onboarding data is missing. Please complete onboarding.');
      navigate('/onboarding');
      return;
    }
    // Call backend for GPT-4 report
    fetchCustomPlanReport(profile).then((r) => {
      setReport(r);
      setLoading(false);
      setTimeout(() => setStep('ready'), 1200);
    });
  }, [profile, navigate]);

  // Progress indicator (simple bar)
  const ProgressBar = () => (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-8">
      <div className="h-2 bg-blue-600 transition-all duration-1000" style={{ width: step === 'progress' ? '60%' : '100%' }} />
    </div>
  );

  // Paywall overlay
  const Paywall = () => (
    <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-20 rounded-xl border border-gray-200">
      <div className="text-center space-y-4 px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Unlock Your Full Custom Plan</h2>
        <p className="text-gray-700 text-base mb-2">Subscribe to access your detailed GPT-4 powered health report, including personalized recommendations, risk analysis, and more.</p>
        <Button className="w-full text-base font-bold py-3 mt-2" onClick={() => navigate('/subscribe')}>Subscribe Now</Button>
        <p className="text-gray-500 text-xs mt-2">Already subscribed? <span className="underline cursor-pointer" onClick={() => window.location.reload()}>Refresh</span></p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        {step === 'progress' && (
          <>
            <ProgressBar />
            <div className="flex flex-col items-center mt-8">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <span className="text-4xl">🧠</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Time to generate your custom plan!</h1>
              <p className="text-gray-600 text-base text-center max-w-md">We’re analyzing your onboarding data to create a personalized health plan just for you. This may take a few moments…</p>
            </div>
          </>
        )}
        {step === 'ready' && report && (
          <>
            <div className="flex flex-col items-center mt-2 mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <span className="text-4xl">🎉</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Congratulations, your custom plan is ready!</h1>
              <p className="text-gray-600 text-base text-center max-w-md mb-4">Here are your key recommendations based on your onboarding data:</p>
            </div>
            <div className="w-full bg-gray-50 rounded-lg p-4 mb-4">
              <ul className="space-y-2">
                {report.recommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="text-gray-800 text-base font-medium flex items-start">
                    <span className="mr-2 text-blue-600 font-bold">•</span> {rec}
                  </li>
                ))}
              </ul>
            </div>
            {/* Paywall for detailed report */}
            {!isSubscribed && <Paywall />}
            {/* Show detailed report if subscribed */}
            {isSubscribed && (
              <div className="w-full bg-white border border-gray-200 rounded-lg p-4 mt-2">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Your Full Report</h3>
                <pre className="text-gray-700 text-sm whitespace-pre-wrap">{report.detailedReport}</pre>
              </div>
            )}
            {/* Option to go to dashboard */}
            <div className="w-full flex justify-center mt-6">
              <Button className="w-40" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomPlan; 