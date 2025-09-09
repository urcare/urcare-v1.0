import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { isDevelopment } from "@/config/development";
import { useDevAuth } from "@/hooks/useDevAuth";
import { useDevNotifications } from "@/hooks/useDevNotifications";
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  CheckCircle,
  Eye,
  EyeOff,
  Info,
  RefreshCw,
  Settings,
  User,
  X,
} from "lucide-react";
import React, { useState } from "react";

export const DevPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "auth" | "notifications" | "settings"
  >("auth");

  const devAuth = useDevAuth();
  const devNotifications = useDevNotifications();

  if (!isDevelopment() || !devAuth.isDevMode) {
    return null;
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <>
      {/* Dev Panel Toggle Button */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          size="sm"
          className="bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
        >
          <Settings className="w-4 h-4 mr-2" />
          Dev Panel
          {devNotifications.unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
              {devNotifications.unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Dev Panel Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] bg-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-yellow-800">
                Development Panel
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Tab Navigation */}
              <div className="flex space-x-2 border-b">
                <Button
                  variant={activeTab === "auth" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("auth")}
                >
                  <User className="w-4 h-4 mr-2" />
                  Auth
                </Button>
                <Button
                  variant={activeTab === "notifications" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("notifications")}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                  {devNotifications.unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="ml-2 h-4 w-4 p-0 text-xs"
                    >
                      {devNotifications.unreadCount}
                    </Badge>
                  )}
                </Button>
                <Button
                  variant={activeTab === "settings" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>

              {/* Auth Tab */}
              {activeTab === "auth" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Development User</h3>
                      <p className="text-sm text-gray-600">
                        {devAuth.user ? "Logged in" : "Not logged in"}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {devAuth.user ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={devAuth.signOut}
                        >
                          Sign Out
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={devAuth.signIn}
                        >
                          Sign In
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={devAuth.devUtils.resetDevUser}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {devAuth.user && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">User Info</h4>
                      <div className="text-xs space-y-1">
                        <div>
                          <strong>ID:</strong> {devAuth.user.id}
                        </div>
                        <div>
                          <strong>Email:</strong> {devAuth.user.email}
                        </div>
                        <div>
                          <strong>Name:</strong> {devAuth.profile?.full_name}
                        </div>
                        <div>
                          <strong>Onboarding:</strong>{" "}
                          {devAuth.isOnboardingComplete()
                            ? "Complete"
                            : "Incomplete"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Real-time Updates</h3>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={devNotifications.toggleEnabled}
                      >
                        {devNotifications.isEnabled ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={devNotifications.clearAllNotifications}
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>

                  <ScrollArea className="h-64">
                    {devNotifications.notifications.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        No notifications yet
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {devNotifications.notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 rounded-lg border ${
                              notification.read
                                ? "bg-gray-50"
                                : "bg-blue-50 border-blue-200"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-2">
                                {getNotificationIcon(notification.type)}
                                <div className="flex-1">
                                  <div className="font-medium text-sm">
                                    {notification.title}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {notification.message}
                                  </div>
                                  <div className="text-xs text-gray-400 mt-1">
                                    {notification.timestamp.toLocaleTimeString()}
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  devNotifications.clearNotification(
                                    notification.id
                                  )
                                }
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-4">
                  <h3 className="font-medium">Development Settings</h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">Auto Login</div>
                        <div className="text-xs text-gray-600">
                          Automatically sign in development user
                        </div>
                      </div>
                      <Badge variant="outline">Enabled</Badge>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">
                          Real-time Updates
                        </div>
                        <div className="text-xs text-gray-600">
                          Show live development notifications
                        </div>
                      </div>
                      <Badge
                        variant={
                          devNotifications.isEnabled ? "default" : "outline"
                        }
                      >
                        {devNotifications.isEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">Hot Reload</div>
                        <div className="text-xs text-gray-600">
                          Automatic code updates
                        </div>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
