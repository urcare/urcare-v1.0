import { App } from '@capacitor/app';
import { Dialog } from '@capacitor/dialog';
import { Browser } from '@capacitor/browser';

export interface AppUpdateInfo {
  version: string;
  downloadUrl: string;
  releaseNotes: string;
  releaseDate: string;
}

// GitHub repository information
const GITHUB_REPO = 'yourusername/urcare-v1.0'; // Replace with your actual repo
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;

/**
 * Check for app updates from GitHub releases
 */
export const checkForUpdates = async (): Promise<boolean> => {
  try {
    console.log('Checking for app updates...');
    
    // Get current app version
    const currentAppInfo = await App.getInfo();
    const currentVersion = currentAppInfo.version;
    
    console.log('Current app version:', currentVersion);
    
    // Fetch latest release from GitHub
    const response = await fetch(GITHUB_API_URL);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const release = await response.json();
    const latestVersion = release.tag_name.replace('v', ''); // Remove 'v' prefix if present
    
    console.log('Latest version:', latestVersion);
    
    // Compare versions
    if (isNewerVersion(latestVersion, currentVersion)) {
      const updateInfo: AppUpdateInfo = {
        version: latestVersion,
        downloadUrl: release.assets[0]?.browser_download_url || release.html_url,
        releaseNotes: release.body || 'Bug fixes and improvements',
        releaseDate: release.published_at
      };
      
      await promptUserForUpdate(updateInfo);
      return true;
    } else {
      console.log('App is up to date');
      return false;
    }
  } catch (error) {
    console.error('Error checking for updates:', error);
    return false;
  }
};

/**
 * Compare two version strings to determine if the first is newer
 */
const isNewerVersion = (latestVersion: string, currentVersion: string): boolean => {
  const latest = latestVersion.split('.').map(Number);
  const current = currentVersion.split('.').map(Number);
  
  for (let i = 0; i < Math.max(latest.length, current.length); i++) {
    const latestPart = latest[i] || 0;
    const currentPart = current[i] || 0;
    
    if (latestPart > currentPart) return true;
    if (latestPart < currentPart) return false;
  }
  
  return false;
};

/**
 * Show update dialog to user
 */
const promptUserForUpdate = async (updateInfo: AppUpdateInfo): Promise<void> => {
  try {
    const { value } = await Dialog.confirm({
      title: 'Update Available',
      message: `Version ${updateInfo.version} is available.\n\n${updateInfo.releaseNotes.substring(0, 100)}...`,
      okButtonTitle: 'Update Now',
      cancelButtonTitle: 'Later'
    });
    
    if (value) {
      // Open download URL
      await Browser.open({
        url: updateInfo.downloadUrl,
        windowName: '_system'
      });
    }
  } catch (error) {
    console.error('Error showing update dialog:', error);
  }
};

/**
 * Check for updates when app becomes active
 */
export const setupUpdateChecker = (): void => {
  // Check for updates when app starts
  checkForUpdates();
  
  // Check for updates when app becomes active
  App.addListener('appStateChange', ({ isActive }) => {
    if (isActive) {
      // Add a small delay to avoid immediate checks
      setTimeout(() => {
        checkForUpdates();
      }, 2000);
    }
  });
  
  // Check for updates periodically (every 30 minutes)
  setInterval(() => {
    checkForUpdates();
  }, 30 * 60 * 1000);
};

/**
 * Manual update check (for settings page)
 */
export const checkForUpdatesManually = async (): Promise<void> => {
  const hasUpdate = await checkForUpdates();
  
  if (!hasUpdate) {
    await Dialog.alert({
      title: 'No Updates',
      message: 'You are using the latest version of the app.'
    });
  }
};

/**
 * Get current app information
 */
export const getAppInfo = async () => {
  try {
    return await App.getInfo();
  } catch (error) {
    console.error('Error getting app info:', error);
    return {
      name: 'UrCare',
      version: '1.0.0',
      build: '1'
    };
  }
}; 