import { devUtils, isDevelopment } from "@/config/development";
import { useCallback, useEffect, useState } from "react";

interface DevNotification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export const useDevNotifications = () => {
  const [notifications, setNotifications] = useState<DevNotification[]>([]);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (isDevelopment()) {
      setIsEnabled(true);
      devUtils.log("Development notifications enabled");

      // Listen for file changes and other development events
      if (typeof window !== "undefined") {
        // Listen for hot module replacement
        if (import.meta.hot) {
          import.meta.hot.on("vite:beforeUpdate", () => {
            addNotification(
              "info",
              "Hot Reload",
              "Code changes detected, updating..."
            );
          });

          import.meta.hot.on("vite:afterUpdate", () => {
            addNotification(
              "success",
              "Hot Reload",
              "Code updated successfully!"
            );
          });
        }

        // Listen for authentication changes
        window.addEventListener("storage", (e) => {
          if (e.key === "supabase.auth.token") {
            addNotification(
              "info",
              "Auth Update",
              "Authentication state changed"
            );
          }
        });

        // Periodic development status updates
        const interval = setInterval(() => {
          if (Math.random() > 0.8) {
            // 20% chance every 30 seconds
            addNotification(
              "info",
              "Dev Status",
              "Development server is running smoothly"
            );
          }
        }, 30000);

        return () => clearInterval(interval);
      }
    }
  }, []);

  const addNotification = useCallback(
    (type: DevNotification["type"], title: string, message: string) => {
      if (!isEnabled) return;

      const notification: DevNotification = {
        id: `dev-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        title,
        message,
        timestamp: new Date(),
        read: false,
      };

      setNotifications((prev) => [notification, ...prev.slice(0, 9)]); // Keep last 10
      devUtils.log(`Notification: ${title} - ${message}`);
    },
    [isEnabled]
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const getUnreadCount = useCallback(() => {
    return notifications.filter((notif) => !notif.read).length;
  }, [notifications]);

  return {
    notifications,
    isEnabled,
    unreadCount: getUnreadCount(),
    addNotification,
    markAsRead,
    clearNotification,
    clearAllNotifications,
    toggleEnabled: () => setIsEnabled(!isEnabled),
  };
};
