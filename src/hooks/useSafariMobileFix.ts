import { useEffect } from "react";

export const useSafariMobileFix = () => {
  useEffect(() => {
    // Detect if we're on Safari iOS
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isSafari && isIOS) {
      // Fix viewport height issues
      const setViewportHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
      };

      // Set initial viewport height
      setViewportHeight();

      // Update on resize (orientation change, etc.)
      window.addEventListener("resize", setViewportHeight);
      window.addEventListener("orientationchange", setViewportHeight);

      // Prevent zoom on input focus
      const preventZoom = () => {
        const inputs = document.querySelectorAll("input, select, textarea");
        inputs.forEach((input) => {
          input.addEventListener("focus", () => {
            document.body.style.zoom = "1";
          });
        });
      };

      preventZoom();

      // Fix scroll issues
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.height = "100%";
      document.body.style.overflow = "hidden";

      const root = document.getElementById("root");
      if (root) {
        root.style.height = "100%";
        root.style.overflowY = "auto";
        root.style.webkitOverflowScrolling = "touch";
      }

      return () => {
        window.removeEventListener("resize", setViewportHeight);
        window.removeEventListener("orientationchange", setViewportHeight);
      };
    }
  }, []);
};
