import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Star, Clock, Target, Zap } from 'lucide-react';

const CustomPlan = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Personalized Health Goals",
      description: "AI-powered recommendations based on your profile"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Daily Schedule",
      description: "Customized meal times, workout schedules, and sleep patterns"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Progress Tracking",
      description: "Monitor your health improvements with detailed analytics"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Expert Guidance",
      description: "Access to health professionals and nutritionists"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Custom Health Plan</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your Custom Health Plan is Ready!
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Based on your health profile, we've created a personalized plan tailored specifically for you.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Plan Preview */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Your Personalized Plan Preview
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Morning Routine */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-orange-800 mb-4">Morning Routine</h4>
              <ul className="space-y-2 text-orange-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                  Wake up at 6:00 AM
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                  Hydration: 500ml water
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                  Breakfast at 7:00 AM
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                  Light stretching
                </li>
              </ul>
            </div>

            {/* Workout Plan */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-blue-800 mb-4">Workout Plan</h4>
              <ul className="space-y-2 text-blue-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  Gym session: 45 minutes
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  Cardio: 20 minutes
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  Strength training
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  Cool down: 10 minutes
                </li>
              </ul>
            </div>

            {/* Evening Routine */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-purple-800 mb-4">Evening Routine</h4>
              <ul className="space-y-2 text-purple-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Dinner at 7:00 PM
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Relaxation time
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Sleep at 10:00 PM
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Hydration check
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-colors text-lg"
          >
            Start Your Health Journey
          </button>
          
          <p className="text-gray-600">
            Your plan will be saved and you can access it anytime from your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomPlan;


