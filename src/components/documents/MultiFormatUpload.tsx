
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, Image, File, CheckCircle, X, Camera } from 'lucide-react';
import { toast } from 'sonner';

interface UploadFile {
  id: string;
  file: File;
  type: 'pdf' | 'image' | 'document';
  category: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  preview?: string;
}

const categories = [
  'Lab Results',
  'Imaging Reports',
  'Prescriptions',
  'Referrals',
  'Insurance Documents',
  'Immunization Records',
  'Discharge Summaries',
  'Progress Notes',
  'Other'
];

export const MultiFormatUpload = () => {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const getFileType = (file: File): 'pdf' | 'image' | 'document' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type === 'application/pdf') return 'pdf';
    return 'document';
  };

  const createFilePreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  };

  const addFiles = useCallback(async (files: FileList) => {
    const newFiles: UploadFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const preview = await createFilePreview(file);
      
      newFiles.push({
        id: Date.now().toString() + i,
        file,
        type: getFileType(file),
        category: '',
        progress: 0,
        status: 'pending',
        preview
      });
    }
    
    setUploadFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      addFiles(files);
    }
  }, [addFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      addFiles(files);
    }
  }, [addFiles]);

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        addFiles(target.files);
      }
    });
    input.click();
  };

  const updateFileCategory = (fileId: string, category: string) => {
    setUploadFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, category } : file
    ));
  };

  const removeFile = (fileId: string) => {
    setUploadFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const uploadFile = async (fileId: string) => {
    const file = uploadFiles.find(f => f.id === fileId);
    if (!file || !file.category) {
      toast.error('Please select a category for the file');
      return;
    }

    setUploadFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: 'uploading' } : f
    ));

    // Simulate upload progress
    const progressSteps = [0, 25, 50, 75, 100];
    
    for (const progress of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUploadFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          progress,
          status: progress === 100 ? 'completed' : 'uploading'
        } : f
      ));
    }

    toast.success(`Successfully uploaded ${file.file.name}`);
  };

  const uploadAllFiles = async () => {
    const pendingFiles = uploadFiles.filter(f => f.status === 'pending' && f.category);
    
    if (pendingFiles.length === 0) {
      toast.error('No files ready for upload. Please add files and select categories.');
      return;
    }

    // Upload files sequentially
    for (const file of pendingFiles) {
      await uploadFile(file.id);
    }

    toast.success(`Successfully uploaded ${pendingFiles.length} files`);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-8 w-8 text-red-500" />;
      case 'image': return <Image className="h-8 w-8 text-blue-500" />;
      default: return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'uploading': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Multi-Format Document Upload
          </CardTitle>
          <CardDescription>
            Upload medical documents in various formats including PDF, images, and other document types
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Drop files here or click to browse
            </h3>
            <p className="text-gray-600 mb-4">
              Supports PDF, images, DOCX, and other document formats
            </p>
            
            <div className="flex gap-2 justify-center">
              <Button 
                onClick={() => document.getElementById('file-input')?.click()}
                variant="outline"
              >
                <Upload className="h-4 w-4 mr-2" />
                Browse Files
              </Button>
              <Button onClick={handleCameraCapture} variant="outline">
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
            </div>
            
            <input
              id="file-input"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.bmp,.tiff,.txt,.rtf,.xml,.json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Supported Formats */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Supported Formats</h4>
            <div className="flex flex-wrap gap-2">
              {['PDF', 'JPG', 'PNG', 'DOCX', 'TXT', 'XML', 'JSON', 'TIFF', 'GIF'].map((format) => (
                <Badge key={format} variant="secondary">
                  {format}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {uploadFiles.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upload Queue ({uploadFiles.length} files)</CardTitle>
              <Button 
                onClick={uploadAllFiles}
                disabled={uploadFiles.every(f => f.status !== 'pending' || !f.category)}
              >
                Upload All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadFiles.map((file) => (
                <div key={file.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    {/* File Preview/Icon */}
                    <div className="flex-shrink-0">
                      {file.preview ? (
                        <img 
                          src={file.preview} 
                          alt={file.file.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        getFileIcon(file.type)
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium truncate">{file.file.name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={getStatusColor(file.status)}>
                            {file.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFile(file.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB • {file.type.toUpperCase()}
                      </p>

                      {/* Category Selection */}
                      <div className="flex items-center gap-2 mb-2">
                        <label className="text-sm font-medium">Category:</label>
                        <Select 
                          value={file.category} 
                          onValueChange={(value) => updateFileCategory(file.id, value)}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Progress Bar */}
                      {file.status === 'uploading' && (
                        <div className="mb-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Uploading...</span>
                            <span>{file.progress}%</span>
                          </div>
                          <Progress value={file.progress} className="h-2" />
                        </div>
                      )}

                      {/* Upload Button */}
                      {file.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => uploadFile(file.id)}
                          disabled={!file.category}
                        >
                          Upload
                        </Button>
                      )}

                      {file.status === 'completed' && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">Upload completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
