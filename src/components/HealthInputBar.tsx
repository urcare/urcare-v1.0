import { useAuth } from "@/contexts/AuthContext";
import { healthPlanSearchService } from "@/services/healthPlanSearchService";
import {
  AlertCircle,
  Loader2,
  Mic,
  MicOff,
  Paperclip,
  Send,
} from "lucide-react";
import React, { useRef, useState } from "react";

interface HealthInputBarProps {
  onPlanGenerate?: (input: string) => void;
}

export const HealthInputBar: React.FC<HealthInputBarProps> = ({
  onPlanGenerate,
}) => {
  const { user, profile } = useAuth();
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tokenUsage, setTokenUsage] = useState<{
    tokens: number;
    cost: number;
  } | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize speech recognition
  const initializeSpeechRecognition = () => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setIsRecording(false);
      };
    }
  };

  const handleMicClick = () => {
    if (!isRecording) {
      initializeSpeechRecognition();
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsRecording(true);
      }
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      setIsListening(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      return;
    }
    console.log("[HealthInputBar] Submit fired with input:", input);
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setTokenUsage(null);

    try {
      // If onPlanGenerate is provided, use it for the new flow
      if (onPlanGenerate) {
        console.log(
          "[HealthInputBar] onPlanGenerate prop detected. Calling parent with goal."
        );
        onPlanGenerate(input);
        setInput("");
        setAttachedFile(null);
        setIsLoading(false);
        return;
      }

      // Read file content if attached
      let fileContent = "";
      if (attachedFile) {
        fileContent = await readFileContent(attachedFile);
      }

      // Estimate token usage
      const estimatedTokens = healthPlanSearchService.estimateTokenUsage(
        input,
        true
      );
      console.log("[HealthInputBar] Estimated tokens:", estimatedTokens);

      // Generate health plan
      const result = await healthPlanSearchService.generateHealthPlanFromQuery(
        {
          query: input,
          userProfile: profile,
          maxTokens: 4000,
          includeFileContext: !!attachedFile,
          fileContent: fileContent,
        },
        user?.id || ""
      );

      if (result.success) {
        setSuccess("Health plan generated successfully!");
        setTokenUsage({
          tokens: result.tokensUsed || 0,
          cost: result.estimatedCost || 0,
        });
        setInput("");
        setAttachedFile(null);
      } else {
        console.error("[HealthInputBar] Generation failed:", result.error);
        setError(result.error || "Failed to generate health plan");
      }
    } catch (error) {
      console.error("[HealthInputBar] Error generating health plan:", error);
      setError("An error occurred while generating your health plan");
    } finally {
      setIsLoading(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        // Limit file content to prevent excessive token usage
        const maxLength = 5000; // characters
        resolve(
          content.length > maxLength
            ? content.substring(0, maxLength) + "..."
            : content
        );
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleAttachClick = () => {
    // Handle file attachment
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setAttachedFile(file);
        console.log("File attached:", file.name);
      }
    };
    input.click();
  };

  return (
    <div className="bg-transparent">
      <div className="flex flex-col justify-center">
        {/* Input Container - White Glassy Theme */}

        <div className="bg-card-bg/95 backdrop-blur-xl rounded-[2rem] p-4 sm:p-6 shadow-xl border border-border-accent/50 w-full">
          <form onSubmit={handleSubmit} className="relative">
            {/* Text Input */}
            <div className="mb-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Set your health goals or ask for advice..."
                className="w-full p-4 bg-gray-50/80 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                disabled={isLoading}
              />
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center justify-between">
              {/* Left Side - Attach Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAttachClick}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100/80 hover:bg-gray-200/80 text-gray-700 rounded-xl transition-all duration-200 text-xs disabled:opacity-50"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Attach</span>
                </button>
              </div>

              {/* Right Side - Voice Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleMicClick}
                  disabled={isLoading}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all duration-200 text-xs ${
                    isRecording || isListening
                      ? "bg-red-500/80 text-white animate-pulse"
                      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-700"
                  } ${
                    isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  {isListening ? (
                    <MicOff className="w-3.5 h-3.5" />
                  ) : (
                    <Mic className="w-3.5 h-3.5" />
                  )}
                  <span>Voice</span>
                </button>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    input.trim() && !isLoading
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Attached File Display */}
          {attachedFile && (
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
              <Paperclip className="w-4 h-4" />
              <span className="flex-1">{attachedFile.name}</span>
              <button
                onClick={() => setAttachedFile(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          )}

          {/* Status Indicators */}
          {isLoading && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="font-medium">
                  Generating your personalized health plan...
                </span>
              </div>
              <div className="text-xs text-blue-500">
                Our AI is analyzing your data and creating a comprehensive plan
                tailored to your needs
              </div>
            </div>
          )}

          {isListening && (
            <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>Listening... Speak now</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mt-3 flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{success}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Token Usage Display */}
          {tokenUsage && (
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
              <span>Tokens used: {tokenUsage.tokens}</span>
              <span>•</span>
              <span>Cost: ${tokenUsage.cost.toFixed(4)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
