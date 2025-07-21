#!/bin/bash

# UrCare Mobile App Setup Script
echo "🚀 UrCare Mobile App Setup"
echo "=========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_nodejs() {
    print_status "Checking Node.js installation..."
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js is installed: $NODE_VERSION"
        return 0
    else
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        return 1
    fi
}

# Check if Java is installed
check_java() {
    print_status "Checking Java installation..."
    if command -v java &> /dev/null; then
        JAVA_VERSION=$(java -version 2>&1 | head -n 1)
        print_success "Java is installed: $JAVA_VERSION"
        return 0
    else
        print_error "Java is not installed. Please install Java 11+ from https://adoptium.net/"
        return 1
    fi
}

# Check if Android Studio is installed
check_android_studio() {
    print_status "Checking Android Studio installation..."
    if [ -d "$HOME/Android/Sdk" ] || [ -d "$ANDROID_HOME" ]; then
        print_success "Android SDK found"
        return 0
    else
        print_warning "Android SDK not found. Please install Android Studio from https://developer.android.com/studio"
        print_warning "Make sure to set ANDROID_HOME environment variable"
        return 1
    fi
}

# Install npm dependencies
install_dependencies() {
    print_status "Installing npm dependencies..."
    if npm install; then
        print_success "Dependencies installed successfully"
        return 0
    else
        print_error "Failed to install dependencies"
        return 1
    fi
}

# Initialize Capacitor
init_capacitor() {
    print_status "Initializing Capacitor..."
    
    # Check if capacitor is already initialized
    if [ -f "capacitor.config.ts" ]; then
        print_success "Capacitor already initialized"
    else
        print_status "Setting up Capacitor configuration..."
        # The capacitor.config.ts file is already created
    fi
    
    return 0
}

# Build the React app
build_react_app() {
    print_status "Building React application..."
    if npm run build; then
        print_success "React app built successfully"
        return 0
    else
        print_error "Failed to build React app"
        return 1
    fi
}

# Add Android platform
add_android_platform() {
    print_status "Adding Android platform..."
    if npx cap add android; then
        print_success "Android platform added successfully"
        return 0
    else
        print_error "Failed to add Android platform"
        return 1
    fi
}

# Sync Capacitor
sync_capacitor() {
    print_status "Syncing Capacitor..."
    if npx cap sync android; then
        print_success "Capacitor synced successfully"
        return 0
    else
        print_error "Failed to sync Capacitor"
        return 1
    fi
}

# Update app update service with correct repo
update_repo_config() {
    print_status "Updating repository configuration..."
    
    # Get GitHub repository info
    if git remote -v &> /dev/null; then
        REPO_URL=$(git remote get-url origin 2>/dev/null || echo "")
        if [[ $REPO_URL == *"github.com"* ]]; then
            # Extract username/repo from GitHub URL
            REPO_PATH=$(echo $REPO_URL | sed -n 's/.*github\.com[:/]\([^/]*\/[^/]*\)\.git.*/\1/p')
            if [ ! -z "$REPO_PATH" ]; then
                print_status "Found GitHub repository: $REPO_PATH"
                
                # Update the appUpdate.ts file
                if [ -f "src/services/appUpdate.ts" ]; then
                    sed -i.bak "s/yourusername\/urcare-v1.0/$REPO_PATH/g" src/services/appUpdate.ts
                    print_success "Updated repository configuration in appUpdate.ts"
                else
                    print_warning "appUpdate.ts not found"
                fi
            fi
        fi
    else
        print_warning "Not a git repository or no GitHub remote found"
    fi
}

# Build APK
build_apk() {
    print_status "Building Android APK..."
    cd android
    if ./gradlew assembleDebug; then
        print_success "APK built successfully!"
        print_success "APK location: android/app/build/outputs/apk/debug/app-debug.apk"
        cd ..
        return 0
    else
        print_error "Failed to build APK"
        cd ..
        return 1
    fi
}

# Open Android Studio
open_android_studio() {
    print_status "Opening project in Android Studio..."
    if npx cap open android; then
        print_success "Android Studio opened"
        return 0
    else
        print_warning "Failed to open Android Studio automatically"
        print_status "You can manually open the 'android' folder in Android Studio"
        return 1
    fi
}

# Main setup function
main() {
    echo
    print_status "Starting UrCare mobile app setup..."
    echo
    
    # Check prerequisites
    PREREQ_OK=true
    
    if ! check_nodejs; then
        PREREQ_OK=false
    fi
    
    if ! check_java; then
        PREREQ_OK=false
    fi
    
    if ! check_android_studio; then
        PREREQ_OK=false
    fi
    
    if [ "$PREREQ_OK" = false ]; then
        print_error "Prerequisites not met. Please install the required software and try again."
        exit 1
    fi
    
    echo
    print_status "All prerequisites met. Proceeding with setup..."
    echo
    
    # Setup steps
    install_dependencies || exit 1
    echo
    
    init_capacitor || exit 1
    echo
    
    update_repo_config
    echo
    
    build_react_app || exit 1
    echo
    
    add_android_platform || exit 1
    echo
    
    sync_capacitor || exit 1
    echo
    
    # Ask user if they want to build APK now
    read -p "Do you want to build the APK now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo
        build_apk
        echo
    fi
    
    # Ask user if they want to open Android Studio
    read -p "Do you want to open Android Studio? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo
        open_android_studio
        echo
    fi
    
    echo
    print_success "🎉 Setup completed!"
    echo
    echo "Next steps:"
    echo "1. Set up GitHub secrets for automatic APK building:"
    echo "   - VITE_SUPABASE_URL"
    echo "   - VITE_SUPABASE_ANON_KEY"
    echo "2. Commit your changes to trigger automatic APK builds"
    echo "3. Check the GitHub Actions tab for build progress"
    echo "4. Download APKs from the Releases section"
    echo
    echo "Available commands:"
    echo "  npm run android          - Build and open in Android Studio"
    echo "  npm run android:build    - Build APK only"
    echo "  npm run cap:sync         - Sync changes to native project"
    echo "  npm run cap:doctor       - Check Capacitor setup"
    echo
    print_success "Happy coding! 🚀"
}

# Run main function
main "$@" 