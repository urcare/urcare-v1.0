import React, { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { HealthReportService, HealthReport } from '@/services/healthReportService';

interface HealthReportUploadProps {
  userId: string;
  onUploadSuccess?: (report: HealthReport) => void;
  onUploadError?: (error: string) => void;
}

const HealthReportUpload: React.FC<HealthReportUploadProps> = ({
  userId,
  onUploadSuccess,
  onUploadError
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [reportName, setReportName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus('idle');
      setErrorMessage('');
      
      // Auto-generate report name from filename if not provided
      if (!reportName) {
        const nameWithoutExt = file.name.split('.').slice(0, -1).join('.');
        setReportName(nameWithoutExt);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !reportName.trim()) {
      setErrorMessage('Please select a file and enter a report name');
      setUploadStatus('error');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus('idle');

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await HealthReportService.uploadHealthReport(
        selectedFile,
        reportName.trim(),
        userId
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        setUploadStatus('success');
        setSelectedFile(null);
        setReportName('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onUploadSuccess?.(result as any);
      } else {
        setUploadStatus('error');
        setErrorMessage(result.error || 'Upload failed');
        onUploadError?.(result.error || 'Upload failed');
      }
    } catch (error: any) {
      setUploadStatus('error');
      setErrorMessage(error.message || 'Upload failed');
      onUploadError?.(error.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      setTimeout(() => {
        setUploadStatus('idle');
        setUploadProgress(0);
      }, 3000);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setReportName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setUploadStatus('idle');
    setErrorMessage('');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
        {/* Upload Area */}
        <div className="space-y-4">
          <div className="flex flex-col items-center">
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload Health Report
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload your health reports (PDF, JPG, PNG, DOC)
            </p>
          </div>

          {/* File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />

          {/* Report Name Input */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Name
            </label>
            <input
              type="text"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="Enter report name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isUploading}
            />
          </div>

          {/* Selected File Display */}
          {selectedFile && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-blue-500" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="text-gray-400 hover:text-red-500"
                  disabled={isUploading}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="w-full">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Status Messages */}
          {uploadStatus === 'success' && (
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Upload successful!</span>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="flex items-center justify-center space-x-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || !reportName.trim() || isUploading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading ? 'Uploading...' : 'Upload Report'}
          </button>

          {/* File Requirements */}
          <div className="text-xs text-gray-500 text-center">
            <p>Supported formats: PDF, JPG, PNG, DOC, DOCX</p>
            <p>Maximum file size: 10MB</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthReportUpload;
