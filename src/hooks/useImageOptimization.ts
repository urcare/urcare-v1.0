
import { useState, useCallback, useEffect } from 'react';

interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  width?: number;
  height?: number;
  lazy?: boolean;
}

interface OptimizedImage {
  src: string;
  srcSet: string;
  sizes: string;
  format: string;
  isLoaded: boolean;
  isError: boolean;
}

export const useImageOptimization = (
  originalSrc: string,
  options: ImageOptimizationOptions = {}
) => {
  const [optimizedImage, setOptimizedImage] = useState<OptimizedImage>({
    src: originalSrc,
    srcSet: '',
    sizes: '',
    format: 'jpeg',
    isLoaded: false,
    isError: false
  });

  const optimizeImage = useCallback(async () => {
    if (!originalSrc) return;

    try {
      // Check browser support for modern formats
      const supportsWebP = await checkWebPSupport();
      const supportsAVIF = await checkAVIFSupport();

      let format = options.format || 'jpeg';
      
      // Auto-select best format based on browser support
      if (!options.format) {
        if (supportsAVIF) {
          format = 'avif';
        } else if (supportsWebP) {
          format = 'webp';
        }
      }

      // Generate responsive srcSet
      const srcSet = generateSrcSet(originalSrc, format, options);
      const sizes = generateSizes(options);

      setOptimizedImage({
        src: originalSrc,
        srcSet,
        sizes,
        format,
        isLoaded: false,
        isError: false
      });
    } catch (error) {
      console.error('Image optimization failed:', error);
      setOptimizedImage(prev => ({ ...prev, isError: true }));
    }
  }, [originalSrc, options]);

  useEffect(() => {
    optimizeImage();
  }, [optimizeImage]);

  const handleLoad = useCallback(() => {
    setOptimizedImage(prev => ({ ...prev, isLoaded: true }));
  }, []);

  const handleError = useCallback(() => {
    setOptimizedImage(prev => ({ ...prev, isError: true }));
  }, []);

  return {
    ...optimizedImage,
    onLoad: handleLoad,
    onError: handleError
  };
};

// Helper functions
const checkWebPSupport = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

const checkAVIFSupport = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const avif = new Image();
    avif.onload = avif.onerror = () => {
      resolve(avif.height === 2);
    };
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });
};

const generateSrcSet = (
  src: string, 
  format: string, 
  options: ImageOptimizationOptions
): string => {
  const widths = [320, 640, 768, 1024, 1280, 1536];
  
  return widths
    .map(width => {
      const optimizedSrc = src.replace(/\.(jpg|jpeg|png|webp)$/i, `.${format}`);
      return `${optimizedSrc}?w=${width}&q=${options.quality || 75} ${width}w`;
    })
    .join(', ');
};

const generateSizes = (options: ImageOptimizationOptions): string => {
  if (options.width) {
    return `${options.width}px`;
  }
  
  return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
};

// Progressive loading hook
export const useProgressiveImage = (src: string, placeholder?: string) => {
  const [imgSrc, setImgSrc] = useState(placeholder || src);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImgSrc(src);
      setIsLoaded(true);
    };
  }, [src]);

  return { src: imgSrc, isLoaded };
};
