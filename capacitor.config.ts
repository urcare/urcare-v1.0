import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.urcare.app",
  appName: "UrCare",
  webDir: "dist",
  server: {
    androidScheme: "https",
    allowNavigation: [
      "urcare.vercel.app",
      "accounts.google.com",
      "oauth.googleusercontent.com",
    ],
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      showSpinner: false,
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: true,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#ffffff",
    },
    App: {
      launchUrl: "com.urcare.app",
    },
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      signingType: "jarsigner",
    },
  },
};

export default config;
