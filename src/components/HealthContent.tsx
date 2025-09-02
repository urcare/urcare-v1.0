import { Heart } from "lucide-react";

export const HealthContent = () => {
  return (
    <div className="space-y-8">
      {/* Popular Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular</h2>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="inline-block bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium mb-3">
                BEST SELLER
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                AI Health Assessment Pro
              </h3>
              <p className="text-2xl font-bold text-gray-900">$29.99</p>
            </div>
            <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center">
              <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Explore Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Health Card 1 */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative">
            <div className="w-full h-32 bg-green-100 rounded-xl flex items-center justify-center mb-3">
              <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="absolute top-3 right-3">
              <Heart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="relative">
              <div className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium mb-2">
                NEW
              </div>
              <h4 className="font-medium text-gray-900">Wellness Check</h4>
            </div>
          </div>

          {/* Health Card 2 */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative">
            <div className="w-full h-32 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
              <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="absolute top-3 right-3">
              <Heart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="relative">
              <div className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium mb-2">
                NEW
              </div>
              <h4 className="font-medium text-gray-900">Mental Health</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
