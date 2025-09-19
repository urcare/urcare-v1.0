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
import React, { useEffect, useRef, useState } from "react";
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    console.log("Camera component mounted");
    startCamera();

    return () => {
      console.log("Camera component unmounting");
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    if (isStarting || stream) {
      console.log("Camera already starting or started");
      return;
    }

    try {
      setIsStarting(true);
      setIsLoading(true);
      setError(null);

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported in this browser");
      }

      // Request camera access
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      setIsLoading(false);
      setIsStarting(false);
    } catch (err) {
      console.error("Error accessing camera:", err);
      let errorMessage = "Unable to access camera. Please check permissions.";

      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          errorMessage =
            "Camera permission denied. Please allow camera access.";
        } else if (err.name === "NotFoundError") {
          errorMessage = "No camera found on this device.";
        } else if (err.name === "NotSupportedError") {
          errorMessage = "Camera not supported in this browser.";
        }
      }

      setError(errorMessage);
      setIsLoading(false);
      setIsStarting(false);
    }
  };

  const stopCamera = () => {
    try {
      console.log("Stopping camera...");

      if (stream) {
        // Stop all tracks
        stream.getTracks().forEach((track) => {
          console.log("Stopping track:", track.kind);
          track.stop();
        });
        setStream(null);
      }

      // Clear video source
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      // Reset states
      setIsStarting(false);
      setIsLoading(false);

      console.log("Camera stopped successfully");
    } catch (error) {
      console.error("Error stopping camera:", error);
    }
  };

  const handleClose = () => {
    // Stop camera before navigating away
    stopCamera();
    // Navigate back to dashboard
    navigate("/dashboard");
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsScanning(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) {
      setIsScanning(false);
      return;
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

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
          setIsScanning(false);
        }
      },
      "image/jpeg",
      0.8
    );
  };

  const toggleFlash = () => {
    setFlashOn(!flashOn);
  };

  const switchCamera = async () => {
    if (!stream) return;

    try {
      // Stop current stream
      stopCamera();

      // Get current video track constraints
      const videoTrack = stream.getVideoTracks()[0];
      const currentConstraints = videoTrack?.getConstraints();

      // Switch facing mode
      const newConstraints = {
        video: {
          ...currentConstraints,
          facingMode:
            currentConstraints?.facingMode === "user" ? "environment" : "user",
        },
        audio: false,
      };

      // Start new stream with switched camera
      const newStream = await navigator.mediaDevices.getUserMedia(
        newConstraints
      );
      setStream(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Error switching camera:", err);
      setError("Unable to switch camera");
    }
  };

  const openGallery = () => {
    // Open photo gallery
  };

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
              <div className="text-white text-center p-6">
                <CameraIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-4">{error}</p>
                <button
                  onClick={startCamera}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Try Again
                </button>
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
