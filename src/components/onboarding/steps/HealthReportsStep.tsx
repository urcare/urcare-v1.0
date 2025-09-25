import { Button } from "@/components/ui/button";
import { Download, FileText, Upload, X } from "lucide-react";
import React from "react";

interface HealthReportsStepProps {
  hasHealthReports: string;
  healthReports: string[];
  onHasHealthReportsChange: (value: string) => void;
  onAddHealthReport: (file: string) => void;
  onRemoveHealthReport: (file: string) => void;
  error?: string;
}

export const HealthReportsStep: React.FC<HealthReportsStepProps> = ({
  hasHealthReports,
  healthReports,
  onHasHealthReportsChange,
  onAddHealthReport,
  onRemoveHealthReport,
  error,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach((file) => {
        if (!healthReports.includes(file.name)) {
          onAddHealthReport(file.name);
        }
      });
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          {/* Yes/No Selection */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => onHasHealthReportsChange("Yes")}
              className={`px-8 py-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-3 ${
                hasHealthReports === "Yes"
                  ? "border-primary bg-primary text-white shadow-lg scale-105"
                  : "border-gray-200 bg-white text-gray-700 hover:border-primary/30 hover:bg-primary/5"
              }`}
            >
              <FileText className="w-6 h-6" />
              <span className="font-semibold">Yes</span>
            </button>
            <button
              onClick={() => onHasHealthReportsChange("No")}
              className={`px-8 py-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-3 ${
                hasHealthReports === "No"
                  ? "border-primary bg-primary text-white shadow-lg scale-105"
                  : "border-gray-200 bg-white text-gray-700 hover:border-primary/30 hover:bg-primary/5"
              }`}
            >
              <X className="w-6 h-6" />
              <span className="font-semibold">No</span>
            </button>
          </div>

          {/* File Upload Section */}
          {hasHealthReports === "Yes" && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload Health Reports
                </h3>
                <p className="text-sm text-gray-600">
                  Upload your existing health reports and medical documents
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-4 rounded-2xl border-2 border-dashed border-gray-300 bg-emerald-50 hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-3"
                >
                  <Upload className="w-6 h-6 text-gray-500" />
                  <span className="font-semibold text-gray-700">
                    Choose Files
                  </span>
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Health Reports List */}
              {healthReports.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Uploaded Reports:
                  </h4>
                  {healthReports.map((file) => (
                    <div
                      key={file}
                      className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl"
                    >
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {file}
                        </span>
                      </div>
                      <button
                        onClick={() => onRemoveHealthReport(file)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center mt-3">{error}</div>
      )}
    </div>
  );
};
