import { useState, useRef } from 'react';
import { toast } from 'sonner';

interface FileUploadOptions {
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  maxFiles?: number;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  content: string; // base64 or text content
}

export const useFileUpload = (options: FileUploadOptions = {}) => {
  const {
    acceptedTypes = ['.txt', '.pdf'],
    maxSize = 10, // 10MB
    maxFiles = 5
  } = options;

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      return `File type not supported. Please upload: ${acceptedTypes.join(', ')}`;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File too large. Maximum size: ${maxSize}MB`;
    }

    return null;
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      // Read as text for .txt files, base64 for .pdf files
      if (file.type === 'text/plain') {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    });
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Check file count
    if (uploadedFiles.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setIsUploading(true);
    const newFiles: UploadedFile[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file
        const validationError = validateFile(file);
        if (validationError) {
          toast.error(validationError);
          continue;
        }

        // Read file content
        const content = await readFileContent(file);
        
        const uploadedFile: UploadedFile = {
          id: `${Date.now()}-${i}`,
          name: file.name,
          size: file.size,
          type: file.type,
          content: content
        };

        newFiles.push(uploadedFile);
      }

      if (newFiles.length > 0) {
        setUploadedFiles(prev => [...prev, ...newFiles]);
        toast.success(`${newFiles.length} file(s) uploaded successfully`);
      }
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('Failed to upload files');
    } finally {
      setIsUploading(false);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    toast.success('File removed');
  };

  const clearAllFiles = () => {
    setUploadedFiles([]);
    toast.success('All files removed');
  };

  const getFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return {
    uploadedFiles,
    isUploading,
    fileInputRef,
    openFileDialog,
    handleFileUpload,
    removeFile,
    clearAllFiles,
    getFileSize
  };
};
