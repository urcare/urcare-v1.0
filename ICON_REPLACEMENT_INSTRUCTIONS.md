# Icon Replacement Instructions

## Overview

This document explains how to replace the placeholder icons in the navigation bar with the exact Flaticon icons you specified.

## Icons to Replace

### 1. Second Icon (Healthy Icon)

- **Current Location**: `public/icons/healthy-icon.svg`
- **Target Icon**: [Healthy icons by juicy_fish](https://www.flaticon.com/free-icons/healthy)
- **Usage**: Second icon in the bottom navigation bar

### 2. Third Icon (Gym Icon)

- **Current Location**: `public/icons/gym-icon.svg`
- **Target Icon**: [Gym icons by Alfian Dwi Hartanto](https://www.flaticon.com/free-icons/gym)
- **Usage**: Third icon in the bottom navigation bar

## Steps to Replace Icons

### Step 1: Download Icons from Flaticon

1. Visit the Flaticon links above
2. Download the SVG versions of the icons you want
3. Make sure to download the exact icons you prefer from each collection

### Step 2: Replace Icon Files

1. **For Healthy Icon**:

   - Open the downloaded healthy icon SVG file
   - Copy the entire SVG content
   - Replace the content of `public/icons/healthy-icon.svg` with the copied content

2. **For Gym Icon**:
   - Open the downloaded gym icon SVG file
   - Copy the entire SVG content
   - Replace the content of `public/icons/gym-icon.svg` with the copied content

### Step 3: Verify Changes

1. The navigation bar will automatically use the new icons
2. The icons will maintain their styling (size, colors, etc.)
3. Test the navigation to ensure icons display correctly

## File Structure

```
public/
  icons/
    healthy-icon.svg  ← Replace with Flaticon healthy icon
    gym-icon.svg      ← Replace with Flaticon gym icon
```

## Important Notes

- **Keep the file names exactly as shown** - the component references these specific paths
- **SVG format is required** - the component expects SVG files
- **Icons will inherit colors** from the CSS classes applied in the component
- **Test on both desktop and mobile** to ensure proper display

## Troubleshooting

- If icons don't appear, check the file paths and names
- Ensure SVG files are valid and properly formatted
- Check browser console for any 404 errors related to icon files
- Verify that the public directory is being served correctly

## Current Implementation

The navigation component now uses `<img>` tags to reference external SVG files, making it easy to swap icons without modifying the React component code.
