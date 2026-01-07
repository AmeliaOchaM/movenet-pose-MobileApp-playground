#!/bin/bash
# Script untuk Build Development APK dengan EAS

echo "======================================"
echo "🚀 MoveNet EAS Build Script"
echo "======================================"
echo ""

cd /home/amelia-ocha/Documents/project_izin/react-native-movenet

# Step 1: Check EAS CLI
echo "📌 Step 1: Checking EAS CLI..."
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI not found. Installing..."
    npm install -g eas-cli
else
    echo "✅ EAS CLI found: $(eas --version)"
fi
echo ""

# Step 2: Login check
echo "📌 Step 2: Checking Expo login status..."
if eas whoami &> /dev/null; then
    echo "✅ Already logged in as: $(eas whoami)"
else
    echo "⚠️ Not logged in. Please run:"
    echo "   eas login"
    exit 1
fi
echo ""

# Step 3: Verify model files
echo "📌 Step 3: Verifying model files..."
if [ -f "assets/models/model.json" ] && [ -f "assets/models/group1-shard1of2.bin" ]; then
    echo "✅ Model files found"
    ls -lh assets/models/
else
    echo "❌ Model files missing!"
    exit 1
fi
echo ""

# Step 4: Build
echo "📌 Step 4: Starting EAS Build..."
echo ""
echo "Build options:"
echo "  1) Development Build (Recommended - with debugger)"
echo "  2) Preview Build (Production-like testing)"
echo "  3) Cancel"
echo ""
read -p "Choose option (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🏗️ Building Development APK..."
        echo "⏱️ This will take 10-20 minutes..."
        echo ""
        eas build --profile development --platform android
        ;;
    2)
        echo ""
        echo "🏗️ Building Preview APK..."
        echo "⏱️ This will take 10-20 minutes..."
        echo ""
        eas build --profile preview --platform android
        ;;
    3)
        echo "❌ Cancelled"
        exit 0
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "======================================"
echo "✅ Build command executed!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Wait for build to complete (~10-20 min)"
echo "2. Download APK from provided link"
echo "3. Install APK on Android device"
echo "4. Run: npx expo start --dev-client"
echo "5. Scan QR code from the installed app"
echo ""
echo "Monitor build: eas build:list"
echo ""
