# How to Build APK from GitHub

## Option 1: Build APK Locally (Recommended)

### Prerequisites
- Node.js 18+ installed
- Android Studio installed
- Java JDK 11+ installed
- Git installed

### Steps:

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd urcare-v1.0
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the web app:**
   ```bash
   npm run build
   ```

4. **Sync Capacitor:**
   ```bash
   npx cap sync android
   ```

5. **Open in Android Studio:**
   ```bash
   npx cap open android
   ```

6. **Build APK in Android Studio:**
   - Wait for Gradle sync to complete
   - Go to `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - Wait for build to complete
   - Click `locate` in the notification to find the APK
   - APK will be in: `android/app/build/outputs/apk/debug/app-debug.apk`

7. **For Release APK (signed):**
   - Go to `Build` → `Generate Signed Bundle / APK`
   - Select APK
   - Create or use existing keystore
   - Select build variant: `release`
   - APK will be in: `android/app/build/outputs/apk/release/app-release.apk`

## Option 2: Build APK Using GitHub Actions (If configured)

1. Push code to GitHub
2. Go to Actions tab
3. Run the build workflow
4. Download APK from artifacts

## Option 3: Quick Build Script

Run this script to automate the process:

```bash
# Build and sync
npm run build && npx cap sync android

# Then open Android Studio manually
npx cap open android
```

## Troubleshooting

- **Gradle sync fails:** Update Android Studio and Gradle
- **Build errors:** Check `android/app/build.gradle` for issues
- **Dependencies missing:** Run `npm install` again
- **Capacitor sync errors:** Delete `android` folder and run `npx cap add android` again

## APK Location

After building, find your APK at:
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release.apk`

