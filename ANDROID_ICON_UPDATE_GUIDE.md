# Android App Icon Update Guide

## Overview
To update the UrCare Android APK to use the new logo instead of the default Gradle icon, you need to replace the existing icon files in the Android project.

## Steps to Update Android Icons

### 1. Generate Icon Sizes
Using the SVG logo file (`public/urcare-logo.svg`), generate PNG files in the following sizes:

- **mdpi**: 48x48px → `android/app/src/main/res/mipmap-mdpi/ic_launcher.png`
- **hdpi**: 72x72px → `android/app/src/main/res/mipmap-hdpi/ic_launcher.png`
- **xhdpi**: 96x96px → `android/app/src/main/res/mipmap-xhdpi/ic_launcher.png`
- **xxhdpi**: 144x144px → `android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png`
- **xxxhdpi**: 192x192px → `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png`

### 2. Generate Round Icon Sizes
For round icons (`ic_launcher_round.png`), use the same sizes as above but with rounded corners.

### 3. Generate Foreground Icons
For adaptive icons (`ic_launcher_foreground.png`), create foreground-only versions (transparent background):

- Same sizes as main icons
- Place in respective mipmap directories

### 4. Tools for Icon Generation
You can use the following tools:

#### Online Tools:
- **Android Asset Studio**: https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html
- **AppIcon.co**: https://appicon.co/
- **IconKitchen**: https://icon.kitchen/

#### Manual Method:
1. Convert SVG to PNG using tools like:
   - GIMP
   - Inkscape
   - Online converters like CloudConvert
2. Resize to required dimensions
3. Save as PNG with transparency

### 5. Replace Existing Files
Replace the existing PNG files in these directories:
```
android/app/src/main/res/
├── mipmap-hdpi/
│   ├── ic_launcher.png
│   ├── ic_launcher_foreground.png
│   └── ic_launcher_round.png
├── mipmap-mdpi/
│   ├── ic_launcher.png
│   ├── ic_launcher_foreground.png
│   └── ic_launcher_round.png
├── mipmap-xhdpi/
│   ├── ic_launcher.png
│   ├── ic_launcher_foreground.png
│   └── ic_launcher_round.png
├── mipmap-xxhdpi/
│   ├── ic_launcher.png
│   ├── ic_launcher_foreground.png
│   └── ic_launcher_round.png
└── mipmap-xxxhdpi/
    ├── ic_launcher.png
    ├── ic_launcher_foreground.png
    └── ic_launcher_round.png
```

### 6. Update Adaptive Icon XML (if needed)
The adaptive icon XML files are located at:
- `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml`
- `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml`

These should already reference the correct foreground and background resources.

### 7. Build and Test
After replacing the icons:
1. Run `npx cap sync android`
2. Build the APK: `cd android && ./gradlew assembleDebug`
3. Install and test on device/emulator

## Current Configuration
- App name: "UrCare" (already configured)
- Package: com.urcare.app
- The app manifest is already properly configured to use the icon resources

## Logo Design
The new UrCare logo features:
- Green heart shape with gradient (#22c55e to #15803d)
- White medical cross in the top right
- Circuit board pattern on the left side
- Modern, healthcare-focused design

## Troubleshooting
- If icons don't appear after update, try uninstalling and reinstalling the app
- Clear Android Studio cache: `Build > Clean Project`
- Verify icon sizes match exactly with requirements
- Ensure PNG files have transparent backgrounds where appropriate 