import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";
import { MobileLoadingScreen } from "@/components/MobileLoadingScreen";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboardingComplete?: boolean;
  requireSubscription?: boolean;
}

export const ProtectedRouteNew: React.FC<ProtectedRouteProps> = ({
  children,
  requireOnboardingComplete = false,
  requireSubscription = false,
}) => {
  // Always render children - relaxed routing as requested
  console.log("🔓 Relaxed routing mode - allowing access to all routes");
  return <>{children}</>;
};
