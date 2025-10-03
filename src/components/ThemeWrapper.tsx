import { cn } from "@/lib/utils";
import React from "react";

interface ThemeWrapperProps {
  children: React.ReactNode;
  className?: string;
  forceTheme?: boolean;
}

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({
  children,
  className,
  forceTheme = true,
}) => {
  return (
    <div
      className={cn(
        "theme-page",
        forceTheme && "bg-gray-900 text-foreground",
        className
      )}
    >
      {children}
    </div>
  );
};

// Higher-order component to wrap pages with theme support
export function withTheme<P extends object>(Component: React.ComponentType<P>) {
  return function ThemedComponent(props: P) {
    return (
      <ThemeWrapper>
        <Component {...props} />
      </ThemeWrapper>
    );
  };
}

// Theme-aware card component
export const ThemedCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground border border-border rounded-2xl shadow-sm p-6",
        className
      )}
    >
      {children}
    </div>
  );
};

// Theme-aware button component
export const ThemedButton: React.FC<{
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  className?: string;
  onClick?: () => void;
}> = ({ children, variant = "primary", className, onClick }) => {
  const variantClasses = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background px-4 py-2",
        variantClasses[variant],
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
