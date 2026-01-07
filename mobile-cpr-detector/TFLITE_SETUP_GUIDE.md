# React Native Fast TFLite Implementation Guide

## ✅ Completed Steps

### 1. Dependencies Installed
```json
{
  "react-native-fast-tflite": "^1.6.1",
  "expo-dev-client": "^6.0.20"
}
```

### 2. app.json Updated
- Added `bundleIdentifier` for iOS
- Added `package` for Android
- Added `expo-dev-client` plugin

### 3. New TFLite Detector Created
File: `/services/MoveNetTFLiteDetector.js`

**Key Features:**
- ✅ Loads 4.tflite model using react-native-fast-tflite
- ✅ Real TFLite inference (when app is built)
- ✅ Fallback to mock keypoints (for development)
- ✅ CPR point calculation logic
- ✅ 17 keypoints support (MoveNet format)

---

## 🚀 Next Steps: Build Custom Development Client

⚠️ **IMPORTANT**: `react-native-fast-tflite` requires **native code** and **CANNOT run in Expo Go**.

You MUST build a custom development client.

### Option A: Local Build (Requires Android Studio)

#### Prerequisites:
```bash
# Check installations
java -version          # Need JDK 17+
android --version      # Need Android Studio
```

#### Build Steps:

```bash
# 1. Navigate to project
cd /home/amelia-ocha/Documents/project_izin/mobile-cpr-detector

# 2. Generate native Android/iOS folders
npx expo prebuild --clean

# 3. Build for Android (takes 5-10 minutes)
npx expo run:android

# This will:
# - Generate android/ folder
# - Install native dependencies (TFLite)
# - Build APK
# - Install on connected device/emulator
```

#### What You Need:
- ✅ Android Studio installed
- ✅ Android SDK (API 34 recommended)
- ✅ Android device connected OR emulator running
- ✅ USB debugging enabled

---

### Option B: EAS Build (Cloud Build - Easier!)

**Recommended if you don't have Android Studio**

#### Setup:

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to Expo account
eas login

# 3. Configure EAS
eas build:configure

# 4. Build development client (cloud)
eas build --profile development --platform android

# Wait ~10-15 minutes for cloud build
# Download APK and install on phone
```

#### Cost:
- ✅ **FREE** for limited builds/month
- ⚠️ Requires Expo account

---

## 📱 Testing After Build

### 1. Install Custom Development Client
After build completes, install the APK on your Android device.

### 2. Start Development Server
```bash
npx expo start --dev-client
```

### 3. Scan QR Code
Open the custom dev client app (NOT Expo Go!) and scan the QR code.

### 4. Expected Behavior

**On App Launch:**
```
LOG  [CameraScreen] Initializing MoveNet detector...
LOG  [MoveNet] Initializing TFLite detector...
LOG  [MoveNet] Model asset path: file:///...
LOG  [MoveNet] Model copied to: /data/user/0/.../4.tflite
LOG  [MoveNet] TFLite model loaded successfully!
LOG  [MoveNet] Input shape: {height: 192, width: 192, channels: 3}
LOG  [CameraScreen] MoveNet detector ready!
```

**During Detection:**
```
LOG  [CameraScreen] First detection: {
  keypointsCount: 17,
  cprPoint: {x: 0.5, y: 0.44, confidence: 0.85}
}
LOG  [CameraScreen] FPS: 5
```

---

## 🔧 Current Limitations

### ⚠️ Image Preprocessing NOT Implemented

The current implementation uses **mock keypoints** because we haven't implemented camera frame capture yet.

**What's needed:**
```javascript
// In CameraScreen.js, capture frame from camera:
const captureFrame = async () => {
  if (cameraRef.current) {
    const photo = await cameraRef.current.takePictureAsync({
      base64: true,
      quality: 0.5,
      skipProcessing: true
    });
    
    // Resize to 192x192
    const resized = await resizeImage(photo.uri, 192, 192);
    
    // Convert to Float32Array
    const imageData = await imageToTensor(resized);
    
    // Run detection
    const keypoints = await detector.detectPose(imageData);
  }
};
```

**Required libraries for image processing:**
```bash
npm install react-native-image-resizer
npm install @react-native-community/image-editor
```

---

## 🎯 Implementation Roadmap

### Phase 1: Build Custom App ✅ (Current)
- [x] Install react-native-fast-tflite
- [x] Create MoveNetTFLiteDetector.js
- [ ] Run `npx expo prebuild`
- [ ] Build custom development client

### Phase 2: Camera Frame Capture
- [ ] Install image processing libraries
- [ ] Implement frame capture from CameraView
- [ ] Resize frames to 192x192
- [ ] Convert to model input format

### Phase 3: Real-Time Inference
- [ ] Pass camera frames to detector
- [ ] Run TFLite inference
- [ ] Display real keypoints (not mock)
- [ ] Optimize for 15-30 FPS

### Phase 4: Optimization
- [ ] Reduce inference latency
- [ ] Implement frame skipping
- [ ] Add GPU delegation (if supported)
- [ ] Memory optimization

---

## 📊 Expected Performance

After full implementation:

| Metric | Target | Current (Mock) |
|--------|--------|----------------|
| FPS | 15-30 | 5 (artificial limit) |
| Latency | 30-50ms | N/A |
| Accuracy | 80%+ | N/A (mock data) |
| Battery | Moderate | Low |

---

## 🐛 Troubleshooting

### Build Errors

**Error: "Could not find com.android.tools.build:gradle"**
```bash
# Solution: Update android/build.gradle
# Set gradle version to 8.0+
```

**Error: "SDK location not found"**
```bash
# Solution: Create local.properties
echo "sdk.dir=/home/$USER/Android/Sdk" > android/local.properties
```

### Runtime Errors

**Error: "TFLite model not found"**
- Check model copied to FileSystem.documentDirectory
- Verify asset path in require()

**Error: "Invalid input shape"**
- Ensure image is 192x192x3
- Check data type (Float32Array or Uint8Array)

---

## 📞 Need Help?

**Current Status:**
- ✅ Library installed
- ✅ Detector code ready
- ✅ UI working with mock data
- ⚠️ Need to build custom app
- ⚠️ Need to implement camera frame capture

**Next Action:**
Choose build method (Local or EAS) and run build command.

---

## 🔗 Useful Links

- react-native-fast-tflite: https://github.com/mrousavy/react-native-fast-tflite
- Expo Dev Client: https://docs.expo.dev/develop/development-builds/introduction/
- EAS Build: https://docs.expo.dev/build/introduction/
- TensorFlow Lite: https://www.tensorflow.org/lite
- MoveNet Model: https://tfhub.dev/google/movenet/singlepose/lightning

---

Last Updated: December 26, 2025
