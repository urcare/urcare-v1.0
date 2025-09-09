import { DEV_CONFIG, devUtils, isDevelopment } from "@/config/development";
import React, { useEffect } from "react";

export const DevRedirectHandler: React.FC = () => {
  useEffect(() => {
    if (!isDevelopment()) {
      return;
    }

    // Check if we're on the correct development URL
    const currentUrl = window.location.href;
    const isLocalhost =
      currentUrl.includes("localhost:8080") ||
      currentUrl.includes("127.0.0.1:8080");

    if (!isLocalhost) {
      devUtils.warn(
        `Redirecting from production URL to local development: ${currentUrl} -> ${DEV_CONFIG.URLS.local}`
      );

      // Show a brief message before redirecting
      const message = document.createElement("div");
      message.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #fbbf24;
        color: #92400e;
        padding: 12px;
        text-align: center;
        font-weight: bold;
        z-index: 9999;
        font-family: system-ui, -apple-system, sans-serif;
      `;
      message.textContent = "🔄 Redirecting to local development server...";
      document.body.appendChild(message);

      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = DEV_CONFIG.URLS.local;
      }, 1000);
    }
  }, []);

  return null; // This component doesn't render anything
};
