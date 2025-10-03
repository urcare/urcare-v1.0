import { useAuth } from "@/contexts/AuthContext";
import React, { useState } from "react";

export const HealthGraphCards: React.FC = () => {
  const { profile } = useAuth();
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    data: any;
    type: string;
  } | null>(null);

  // Generate data for Health Decline (red line) - showing decline over 3 months
  const generateHealthDeclineData = () => {
    const data = [];
    let currentScore = 78; // Starting score from the image

    // Generate 30 data points for 3 months (30 days for better visualization)
    for (let i = 0; i < 30; i++) {
      // Health decline with some fluctuations but overall downward trend
      const decline = (i / 30) * 25; // Decline by 25 points over 3 months
      const fluctuation = Math.sin(i * 0.5) * 2; // Add some fluctuation
      const score = Math.max(0, currentScore - decline + fluctuation);

      data.push({
        x: i,
        y: score,
      });
    }

    return data;
  };

  // Generate data for UCare Recovery (green line) - showing improvement over 3 months
  const generateUCareRecoveryData = () => {
    const data = [];
    let currentScore = 2; // Starting low like in the image

    // Generate 30 data points for 3 months (30 days for better visualization)
    for (let i = 0; i < 30; i++) {
      // Steady upward trend with some acceleration
      const improvement = Math.pow(i / 30, 1.5) * 85; // Accelerating improvement
      const score = Math.min(100, currentScore + improvement);

      data.push({
        x: i,
        y: score,
      });
    }

    return data;
  };

  const healthDeclineData = generateHealthDeclineData();
  const ucareRecoveryData = generateUCareRecoveryData();

  return (
    <div className="h-2/5 bg-transparent px-2 sm:px-4 pb-2 sm:pb-4">
      <div className="h-full bg-white/95 backdrop-blur-xl rounded-2xl p-2 sm:p-4 shadow-xl border border-gray-100/50 relative overflow-hidden flex flex-col">
        {/* Graph Area */}
        <div className="flex-1 relative min-h-0">
          <svg
            className="w-full h-full"
            viewBox="0 0 400 200"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Y-axis labels - corrected percentages */}
            <text x="20" y="30" fontSize="10" fill="#666" textAnchor="start">
              10%
            </text>
            <text x="20" y="110" fontSize="10" fill="#666" textAnchor="start">
              5%
            </text>
            <text x="20" y="190" fontSize="10" fill="#666" textAnchor="start">
              0%
            </text>

            {/* Y-axis label */}
            <text
              x="10"
              y="50"
              fontSize="8"
              fill="#666"
              textAnchor="start"
              transform="rotate(-90 10 50)"
            >
              Health Decline
            </text>

            {/* X-axis label */}
            <text x="200" y="195" fontSize="10" fill="#666" textAnchor="middle">
              Time (Days)
            </text>
            <text x="380" y="195" fontSize="8" fill="#666" textAnchor="end">
              Malndex
            </text>

            {/* Grid lines */}
            <defs>
              <pattern
                id="grid"
                width="40"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 20"
                  fill="none"
                  stroke="rgba(0,0,0,0.05)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect x="40" y="20" width="340" height="160" fill="url(#grid)" />

            {/* Health Decline Line (Red) */}
            <polyline
              fill="none"
              stroke="#EF4444"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={healthDeclineData
                .map((point, index) => {
                  const x = 40 + (index / (healthDeclineData.length - 1)) * 340;
                  const y = 180 - (point.y / 100) * 160;
                  return `${x},${y}`;
                })
                .join(" ")}
            />

            {/* UCare Recovery Line (Green) */}
            <polyline
              fill="none"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={ucareRecoveryData
                .map((point, index) => {
                  const x = 40 + (index / (ucareRecoveryData.length - 1)) * 340;
                  const y = 180 - (point.y / 100) * 160;
                  return `${x},${y}`;
                })
                .join(" ")}
            />

            {/* Data points for Health Decline */}
            {healthDeclineData
              .filter((_, index) => index % 5 === 0) // Show every 5th point
              .map((point, index) => {
                const x =
                  40 + ((index * 5) / (healthDeclineData.length - 1)) * 340;
                const y = 180 - (point.y / 100) * 160;
                return (
                  <circle
                    key={`decline-${index}`}
                    cx={x}
                    cy={y}
                    r={
                      hoveredPoint?.type === "decline" && hoveredPoint?.x === x
                        ? "4"
                        : "2.5"
                    }
                    fill="#EF4444"
                    stroke="white"
                    strokeWidth="1.5"
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() =>
                      setHoveredPoint({ x, y, data: point, type: "decline" })
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                    onClick={() =>
                      setHoveredPoint({ x, y, data: point, type: "decline" })
                    }
                  />
                );
              })}

            {/* Data points for UCare Recovery */}
            {ucareRecoveryData
              .filter((_, index) => index % 5 === 0) // Show every 5th point
              .map((point, index) => {
                const x =
                  40 + ((index * 5) / (ucareRecoveryData.length - 1)) * 340;
                const y = 180 - (point.y / 100) * 160;
                return (
                  <circle
                    key={`recovery-${index}`}
                    cx={x}
                    cy={y}
                    r={
                      hoveredPoint?.type === "recovery" && hoveredPoint?.x === x
                        ? "4"
                        : "2.5"
                    }
                    fill="#10B981"
                    stroke="white"
                    strokeWidth="1.5"
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() =>
                      setHoveredPoint({ x, y, data: point, type: "recovery" })
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                    onClick={() =>
                      setHoveredPoint({ x, y, data: point, type: "recovery" })
                    }
                  />
                );
              })}

            {/* Arrow at the end of UCare Recovery line */}
            <polygon points="370,30 380,25 370,20" fill="#10B981" />
          </svg>
        </div>

        {/* Tooltip */}
        {hoveredPoint && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg z-10">
            <div className="text-sm">
              <div className="font-semibold">
                {hoveredPoint.type === "decline"
                  ? "Health Index"
                  : "UCare Recovery"}
              </div>
              <div className="text-xs opacity-80">
                Day {Math.round(((hoveredPoint.x - 40) / 340) * 30) + 1}:{" "}
                {hoveredPoint.data.y.toFixed(1)}%
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex-shrink-0 mt-1 sm:mt-2">
          <div className="flex justify-between items-center px-2 sm:px-4">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Health Index</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">UCare Recovery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
