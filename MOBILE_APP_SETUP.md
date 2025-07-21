# UrCare Mobile App Setup Guide

## 📱 Convert React Web App to Android APK with Auto-Updates

### Prerequisites
- Node.js 16+ installed
- Android Studio installed
- Java 8+ installed
- GitHub repository access

## Step 1: Install Capacitor

```bash
# Install Capacitor CLI globally
npm install -g @capacitor/cli

# Add Capacitor to your project
npm install @capacitor/core @capacitor/android
npx cap init
```

When prompted:
- **App name**: UrCare
- **App ID**: `com.urcare.app` (or your preferred domain)
- **Web directory**: `dist` (or your build output directory)

## Step 2: Configure Capacitor

### Update `capacitor.config.ts`
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.urcare.app',
  appName: 'UrCare',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    allowNavigation: [
      'urcare.vercel.app',
      '*.supabase.co',
      'accounts.google.com'
    ]
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      showSpinner: false
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
```

## Step 3: Add Android Platform

```bash
# Build your React app first
npm run build

# Add Android platform
npx cap add android

# Sync project
npx cap sync
```

## Step 4: Configure Android Permissions

### Update `android/app/src/main/AndroidManifest.xml`
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
```

## Step 5: Install Auto-Update Plugin

```bash
# Install Capacitor Live Updates (for auto-updates)
npm install @capacitor/live-updates

# Alternative: Install App Update plugin
npm install @capawesome/capacitor-app-update
```

### Configure Auto-Updates

#### Option A: Capacitor Live Updates (Paid)
```typescript
// src/services/appUpdate.ts
import { LiveUpdates } from '@capacitor/live-updates';

export const checkForUpdates = async () => {
  try {
    const result = await LiveUpdates.sync();
    if (result.activeApplicationPathChanged) {
      // App updated, reload
      window.location.reload();
    }
  } catch (error) {
    console.error('Update check failed:', error);
  }
};
```

#### Option B: Manual Update Check (Free)
```typescript
// src/services/appUpdate.ts
import { App } from '@capacitor/app';
import { Dialog } from '@capacitor/dialog';

export const checkForUpdates = async () => {
  try {
    // Check your API for new version
    const response = await fetch('https://api.github.com/repos/yourusername/urcare-v1.0/releases/latest');
    const release = await response.json();
    const latestVersion = release.tag_name;
    
    const currentVersion = await App.getInfo();
    
    if (latestVersion !== currentVersion.version) {
      const { value } = await Dialog.confirm({
        title: 'Update Available',
        message: 'A new version is available. Would you like to update?',
        okButtonTitle: 'Update',
        cancelButtonTitle: 'Later'
      });
      
      if (value) {
        // Open Play Store or direct download
        window.open(release.assets[0].browser_download_url, '_system');
      }
    }
  } catch (error) {
    console.error('Update check failed:', error);
  }
};
```

## Step 6: Add to App Component

```typescript
// Add to src/App.tsx
import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { checkForUpdates } from './services/appUpdate';

function App() {
  useEffect(() => {
    // Check for updates when app starts
    checkForUpdates();
    
    // Check for updates when app becomes active
    App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        checkForUpdates();
      }
    });
  }, []);

  // ... rest of your app code
}
```

## Step 7: GitHub Actions for Automated APK Building

### Create `.github/workflows/build-android.yml`
```yaml
name: Build Android APK

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build React app
      run: npm run build
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
    
    - name: Setup Java
      uses: actions/setup-java@v3
      with:
        distribution: 'temurin'
        java-version: '11'
    
    - name: Setup Android SDK
      uses: android-actions/setup-android@v2
    
    - name: Sync Capacitor
      run: |
        npx cap sync android
    
    - name: Build APK
      run: |
        cd android
        ./gradlew assembleDebug
    
    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: urcare-debug.apk
        path: android/app/build/outputs/apk/debug/app-debug.apk
    
    - name: Create Release
      if: github.ref == 'refs/heads/main'
      uses: softprops/action-gh-release@v1
      with:
        tag_name: v1.0.${{ github.run_number }}
        name: UrCare v1.0.${{ github.run_number }}
        files: android/app/build/outputs/apk/debug/app-debug.apk
        generate_release_notes: true
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Step 8: Build and Test

```bash
# Build for production
npm run build

# Sync changes to Android
npx cap sync

# Open in Android Studio
npx cap open android

# Or build APK directly
cd android
./gradlew assembleDebug
```

## Step 9: Publishing Options

### Option A: Google Play Store
1. Create developer account ($25 one-time fee)
2. Generate signed APK/AAB
3. Upload to Play Console
4. Set up app metadata and screenshots

### Option B: Direct Distribution
1. Enable "Install from Unknown Sources" on devices
2. Distribute APK file directly
3. Users download and install manually

### Option C: Firebase App Distribution
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Deploy to Firebase App Distribution
firebase appdistribution:distribute android/app/build/outputs/apk/debug/app-debug.apk \
  --app YOUR_FIREBASE_APP_ID \
  --groups "testers"
```

## Step 10: Auto-Update Configuration

### Environment Variables to Add in GitHub Secrets:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `ANDROID_KEYSTORE` (for signed builds)
- `KEYSTORE_PASSWORD`
- `KEY_ALIAS`
- `KEY_PASSWORD`

## Step 11: Update Workflow

### Every time you commit to `main`:
1. GitHub Actions automatically builds new APK
2. Creates a new release with APK file
3. App checks for updates on startup
4. Users get notified of available updates

## Additional Features

### Push Notifications
```bash
npm install @capacitor/push-notifications
```

### Biometric Authentication
```bash
npm install @capacitor/biometric-auth
```

### Camera Access
```bash
npm install @capacitor/camera
```

### Local Storage
```bash
npm install @capacitor/storage
```

## Troubleshooting

### Common Issues:
1. **Build fails**: Check Java version (use Java 11)
2. **Permissions**: Ensure all required permissions in AndroidManifest.xml
3. **Network issues**: Add domain to allowNavigation in capacitor.config.ts
4. **White screen**: Check console for errors, ensure all assets are bundled

### Debug Commands:
```bash
# Check Capacitor doctor
npx cap doctor

# Clean and rebuild
npx cap clean android
npx cap sync android

# View logs
npx cap run android --livereload --external
```

## Next Steps

1. Test the APK on physical devices
2. Set up crash reporting (Firebase Crashlytics)
3. Configure app analytics
4. Set up proper CI/CD pipeline
5. Prepare for Play Store submission

This setup gives you:
- ✅ Native Android APK
- ✅ Auto-updates from GitHub commits
- ✅ Professional app distribution
- ✅ Easy maintenance and deployment 