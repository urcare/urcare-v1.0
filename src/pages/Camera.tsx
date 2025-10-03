import {
  Barcode,
  Camera as CameraIcon,
  FileText,
  HelpCircle,
  Image,
  RotateCcw,
  Scan,
  X,
  Zap,
  ZapOff,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Camera: React.FC = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [cameraMode, setCameraMode] = useState<"scan" | "barcode" | "label">(
    "scan"
  );
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    console.log("Camera component mounted");
    let isMounted = true;

    const initCamera = async () => {
      if (isMounted) {
        await startCamera();
      }
    };

    initCamera();

    return () => {
      console.log("Camera component unmounting");
      isMounted = false;
      stopCamera();
    };
  }, []);

  const startCamera = useCallback(async () => {
    if (isStarting || (stream && streamRef.current)) {
      console.log("Camera already starting or started");
      return;
    }

    try {
      setIsStarting(true);
      setIsLoading(true);
      setError(null);
      setRetryCount((prev) => prev + 1);

      // Check if getUserMedia is supported
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error("Camera not supported in this browser or device");
      }

      // Check permissions first
      try {
        const permissionStatus = await navigator.permissions.query({
          name: "camera" as PermissionName,
        });
        setHasPermission(permissionStatus.state === "granted");

        if (permissionStatus.state === "denied") {
          throw new Error(
            "Camera permission denied. Please enable camera access in your browser settings."
          );
        }
      } catch (permError) {
        console.warn("Permission check failed:", permError);
        // Continue anyway, getUserMedia will handle permissions
      }

      // Request camera access with fallback constraints
      let constraints = {
        video: {
          facingMode: "environment", // Use back camera if available
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
        },
        audio: false,
      };

      let mediaStream: MediaStream;

      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (firstError) {
        console.warn(
          "Failed with ideal constraints, trying basic:",
          firstError
        );
        // Fallback to basic constraints
        constraints = {
          video: true,
          audio: false,
        };
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      }

      // Store stream reference
      streamRef.current = mediaStream;
      setStream(mediaStream);
      setHasPermission(true);

      if (videoRef.current && mediaStream) {
        videoRef.current.srcObject = mediaStream;

        // Wait for video to be ready
        await new Promise<void>((resolve, reject) => {
          if (!videoRef.current) {
            reject(new Error("Video element not available"));
            return;
          }

          const video = videoRef.current;

          const onLoadedMetadata = () => {
            video.removeEventListener("loadedmetadata", onLoadedMetadata);
            video.removeEventListener("error", onError);
            resolve();
          };

          const onError = (e: Event) => {
            video.removeEventListener("loadedmetadata", onLoadedMetadata);
            video.removeEventListener("error", onError);
            reject(new Error(`Video loading failed: ${e}`));
          };

          video.addEventListener("loadedmetadata", onLoadedMetadata);
          video.addEventListener("error", onError);

          video.play().catch(reject);
        });
      }

      setIsLoading(false);
      setIsStarting(false);
    } catch (err) {
      console.error("Error accessing camera:", err);
      let errorMessage =
        "Unable to access camera. Please check permissions and try again.";

      if (err instanceof Error) {
        if (
          err.name === "NotAllowedError" ||
          err.message.includes("permission")
        ) {
          errorMessage =
            "Camera permission denied. Please enable camera access in your browser settings and refresh the page.";
          setHasPermission(false);
        } else if (err.name === "NotFoundError") {
          errorMessage = "No camera found on this device.";
        } else if (err.name === "NotSupportedError") {
          errorMessage =
            "Camera not supported in this browser. Please try a different browser.";
        } else if (err.name === "NotReadableError") {
          errorMessage = "Camera is already in use by another application.";
        } else if (err.name === "OverconstrainedError") {
          errorMessage =
            "Camera constraints not supported. Trying basic camera access...";
          // Auto-retry with basic constraints
          if (retryCount < 2) {
            setTimeout(() => startCamera(), 1000);
            return;
          }
        } else {
          errorMessage = err.message || errorMessage;
        }
      }

      setError(errorMessage);
      setIsLoading(false);
      setIsStarting(false);
      setHasPermission(false);
    }
  }, [isStarting, stream, retryCount]);

  const stopCamera = useCallback(() => {
    try {
      console.log("Stopping camera...");

      // Stop stream from ref first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          console.log("Stopping track:", track.kind);
          track.stop();
        });
        streamRef.current = null;
      }

      // Stop stream from state as backup
      if (stream) {
        stream.getTracks().forEach((track) => {
          console.log("Stopping track (backup):", track.kind);
          track.stop();
        });
      }

      setStream(null);

      // Clear video source
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.load(); // Reset video element
      }

      // Reset states
      setIsStarting(false);
      setIsLoading(false);
      setError(null);

      console.log("Camera stopped successfully");
    } catch (error) {
      console.error("Error stopping camera:", error);
    }
  }, [stream]);

  const handleClose = useCallback(() => {
    try {
      // Stop camera before navigating away
      stopCamera();
      // Navigate back to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback navigation
      window.location.href = "/dashboard";
    }
  }, [navigate, stopCamera]);

  const handleCapture = useCallback(() => {
    try {
      if (!videoRef.current || !canvasRef.current || !stream) {
        setError("Camera not ready for capture");
        return;
      }

      setIsScanning(true);
      setError(null);

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (!context) {
        setError("Canvas not available for capture");
        setIsScanning(false);
        return;
      }

      // Check if video is ready
      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        setError("Video not ready for capture. Please wait.");
        setIsScanning(false);
        return;
      }

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      // Draw the current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Create download link or process the image
            const url = URL.createObjectURL(blob);
            console.log("Photo captured:", url);

            // Here you would typically send the image to your backend for processing
            // For now, we'll just simulate the scanning process
            setTimeout(() => {
              setIsScanning(false);
              URL.revokeObjectURL(url); // Clean up
            }, 1000);
          } else {
            setError("Failed to capture image");
            setIsScanning(false);
          }
        },
        "image/jpeg",
        0.8
      );
    } catch (error) {
      console.error("Capture error:", error);
      setError("Failed to capture image");
      setIsScanning(false);
    }
  }, [stream]);

  const toggleFlash = useCallback(() => {
    try {
      setFlashOn((prev) => !prev);
      // Note: Flash control would require additional camera API implementation
      // This is a UI toggle for now
    } catch (error) {
      console.error("Flash toggle error:", error);
    }
  }, []);

  const switchCamera = useCallback(async () => {
    if (!stream && !streamRef.current) {
      setError("No camera active to switch");
      return;
    }

    try {
      setError(null);

      // Get current video track constraints
      const currentStream = streamRef.current || stream;
      const videoTrack = currentStream?.getVideoTracks()[0];
      const currentSettings = videoTrack?.getSettings();

      // Stop current stream
      stopCamera();

      // Switch facing mode
      const newConstraints = {
        video: {
          facingMode:
            currentSettings?.facingMode === "user" ? "environment" : "user",
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
        },
        audio: false,
      };

      // Start new stream with switched camera
      const newStream = await navigator.mediaDevices.getUserMedia(
        newConstraints
      );
      streamRef.current = newStream;
      setStream(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Error switching camera:", err);
      setError("Unable to switch camera. Restarting with original camera...");
      // Fallback: restart with original camera
      setTimeout(() => startCamera(), 1000);
    }
  }, [stream, stopCamera, startCamera]);

  const openGallery = useCallback(() => {
    try {
      // Create a file input to open gallery
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          console.log("Selected file:", file.name);
          // Process the selected image here
        }
      };
      input.click();
    } catch (error) {
      console.error("Gallery access error:", error);
      setError("Unable to access photo gallery");
    }
  }, []);

  // Retry function
  const handleRetry = useCallback(() => {
    setError(null);
    setRetryCount(0);
    startCamera();
  }, [startCamera]);

  // Add error boundary
  try {
    return (
      <div className="fixed inset-0 bg-black z-50">
        {/* Full Screen Camera View */}
        <div className="w-full h-full relative">
          {/* Real Camera Feed */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />

          {/* Hidden canvas for capturing photos */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 bg-black flex items-center justify-center">
              <div className="text-white text-center">
                <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-lg">Requesting camera access...</p>
                <p className="text-sm opacity-75 mt-2">
                  Please allow camera permissions
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="absolute inset-0 bg-black flex items-center justify-center">
              <div className="text-white text-center p-6 max-w-md">
                <CameraIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">Camera Error</h3>
                <p className="text-sm mb-6 text-gray-300">{error}</p>
                <div className="space-y-3">
                  <button
                    onClick={handleRetry}
                    className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    Try Again
                  </button>
                  {hasPermission === false && (
                    <button
                      onClick={() => window.location.reload()}
                      className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                      Refresh Page
                    </button>
                  )}
                  <button
                    onClick={handleClose}
                    className="w-full bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors font-medium"
                  >
                    Go Back to Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Scanning Overlay */}
          {isScanning && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white rounded-2xl p-6 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-black font-medium">Scanning Food...</p>
              </div>
            </div>
          )}

          {/* Floating Header */}
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
            <div className="flex items-center justify-between">
              <button
                onClick={handleClose}
                className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center">
                  <span className="text-white text-lg font-bold">U</span>
                </div>
                <span className="text-white font-semibold text-lg">UrCare</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={switchCamera}
                  className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm"
                  title="Switch Camera"
                >
                  <RotateCcw className="w-6 h-6 text-white" />
                </button>
                <button className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm">
                  <HelpCircle className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Floating Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            {/* Mode Selection */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setCameraMode("scan")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all backdrop-blur-sm ${
                  cameraMode === "scan"
                    ? "bg-blue-500 text-white"
                    : "bg-white/20 text-white"
                }`}
              >
                <Scan className="w-5 h-5" />
                <span className="font-medium">Scan Food</span>
              </button>

              <button
                onClick={() => setCameraMode("barcode")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all backdrop-blur-sm ${
                  cameraMode === "barcode"
                    ? "bg-blue-500 text-white"
                    : "bg-white/20 text-white"
                }`}
              >
                <Barcode className="w-5 h-5" />
                <span className="font-medium">Barcode</span>
              </button>

              <button
                onClick={() => setCameraMode("label")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all backdrop-blur-sm ${
                  cameraMode === "label"
                    ? "bg-blue-500 text-white"
                    : "bg-white/20 text-white"
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">Food Label</span>
              </button>
            </div>

            {/* Camera Controls */}
            <div className="flex items-center justify-between">
              {/* Flash Toggle */}
              <button
                onClick={toggleFlash}
                className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm"
              >
                {flashOn ? (
                  <Zap className="w-6 h-6 text-yellow-400" />
                ) : (
                  <ZapOff className="w-6 h-6 text-white" />
                )}
              </button>

              {/* Capture Button */}
              <button
                onClick={handleCapture}
                className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg"
              >
                <div className="w-14 h-14 rounded-full bg-white border-4 border-gray-200"></div>
              </button>

              {/* Gallery */}
              <button
                onClick={openGallery}
                className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm"
              >
                <Image className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Camera component error:", error);
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-xl font-bold mb-4">Camera Error</h2>
          <p className="mb-4">Something went wrong loading the camera.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
};

export default Camera;
