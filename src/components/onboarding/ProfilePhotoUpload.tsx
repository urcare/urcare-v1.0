
import { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Pencil, Trash, User } from 'lucide-react';
import { toast } from 'sonner';

const ProfilePhotoUpload = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setIsUploading(true);
        
        // Simulate file processing delay
        setTimeout(() => {
          const reader = new FileReader();
          reader.onload = () => {
            setPhoto(reader.result as string);
            setIsUploading(false);
            toast.success('Profile photo uploaded');
          };
          reader.readAsDataURL(file);
        }, 1000);
      } else {
        toast.error('Please select an image file');
      }
    }
  };
  
  const handleRemovePhoto = () => {
    setPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info('Profile photo removed');
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setIsUploading(true);
        
        // Simulate file processing delay
        setTimeout(() => {
          const reader = new FileReader();
          reader.onload = () => {
            setPhoto(reader.result as string);
            setIsUploading(false);
            toast.success('Profile photo uploaded');
          };
          reader.readAsDataURL(file);
        }, 1000);
      } else {
        toast.error('Please drop an image file');
      }
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Profile Photo</h2>
        <p className="text-muted-foreground mt-2">
          Add a photo to personalize your profile.
        </p>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="mb-6 relative group">
          <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
            {isUploading ? (
              <div className="w-full h-full flex items-center justify-center bg-slate-200 animate-pulse">
                <span className="text-sm text-slate-600">Loading...</span>
              </div>
            ) : (
              <>
                <AvatarImage src={photo || ''} alt="Profile" />
                <AvatarFallback className="bg-primary/10 text-primary">
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </>
            )}
          </Avatar>
          
          {photo && (
            <div className="absolute -bottom-3 right-0 flex space-x-2">
              <Button 
                size="icon" 
                variant="outline" 
                className="h-8 w-8 rounded-full bg-background shadow-md"
                onClick={triggerFileInput}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="outline" 
                className="h-8 w-8 rounded-full bg-background shadow-md"
                onClick={handleRemovePhoto}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        
        {!photo && !isUploading && (
          <Card
            className={`w-full max-w-md p-6 border-dashed cursor-pointer hover:border-primary transition-colors ${isDragging ? 'border-primary bg-primary/5' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <CardContent className="flex flex-col items-center justify-center py-6 text-center">
              <Camera className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg mb-2">Upload Profile Photo</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag & drop an image here, or click to select a file
              </p>
              <p className="text-xs text-muted-foreground">
                Supported formats: JPG, PNG, GIF (Max 5MB)
              </p>
            </CardContent>
          </Card>
        )}
        
        {isUploading && (
          <div className="mt-4">
            <p className="text-center text-sm text-muted-foreground">Processing your photo...</p>
          </div>
        )}
      </div>
      
      {photo && (
        <div className="text-center space-y-4">
          <h3 className="font-medium">Looking good!</h3>
          <p className="text-sm text-muted-foreground">
            Your profile photo has been uploaded and will be visible to your healthcare providers.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoUpload;
