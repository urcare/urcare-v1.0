
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileText, Upload, X, File } from 'lucide-react';

interface HealthRecordsProps {
  onDataChange: (data: any) => void;
}

const HealthRecords: React.FC<HealthRecordsProps> = ({ onDataChange }) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newFiles = [...uploadedFiles, ...files];
    setUploadedFiles(newFiles);
    onDataChange({ healthRecords: newFiles });
  };

  const removeFile = (indexToRemove: number) => {
    const newFiles = uploadedFiles.filter((_, index) => index !== indexToRemove);
    setUploadedFiles(newFiles);
    onDataChange({ healthRecords: newFiles });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <FileText className="w-12 h-12 text-teal-600 mx-auto mb-4" />
        <p className="text-gray-600">Upload your health documents for better care coordination.</p>
        <p className="text-sm text-gray-500 mt-2">Accepted formats: PDF, JPG, PNG (Max 10MB each)</p>
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-400 transition-colors">
        <input
          type="file"
          id="health-records"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileUpload}
          className="hidden"
        />
        <label htmlFor="health-records" className="cursor-pointer">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
          <p className="text-sm text-gray-500">Prescriptions, lab reports, diagnosis documents</p>
        </label>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Uploaded Files:</Label>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <File className="w-5 h-5 text-teal-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Example Documents */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Examples of helpful documents:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Recent prescription slips</li>
          <li>• Lab test results</li>
          <li>• Discharge summaries</li>
          <li>• Diagnosis reports</li>
          <li>• Vaccination records</li>
        </ul>
      </div>
    </div>
  );
};

export default HealthRecords;
