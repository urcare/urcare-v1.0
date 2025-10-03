import { Loader2 } from "lucide-react";
import React from "react";

interface MobileLoadingScreenProps {
  message?: string;
  submessage?: string;
}

export const MobileLoadingScreen: React.FC<MobileLoadingScreenProps> = ({
  message = "Loading...",
  submessage = "Please wait",
}) => {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50 mobile-loading-screen safari-fix">
      <div className="text-center px-4">
        <div className="w-16 h-16 mx-auto mb-6">
          <Loader2 className="w-full h-full text-primary animate-spin" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {message}
        </h2>
        <p className="text-muted-foreground text-sm">{submessage}</p>
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
