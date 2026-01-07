# ⚠️ TensorFlow.js Backend Issue - SOLVED

## Problem
```
Error initializing TensorFlow: [Error: Backend name 'webgl' not found in registry]
```

## Root Cause
**TensorFlow.js WebGL backend is NOT compatible with React Native/Expo!**

- `@tensorflow/tfjs-backend-webgl` works only in **web browsers**
- React Native doesn't have WebGL context like browsers do
- `@tensorflow-models/pose-detection` imports all backends including incompatible ones

## ✅ Solution Applied

### 1. Removed WebGL Backend Import
```javascript
// ❌ BEFORE (doesn't work in React Native)
import '@tensorflow/tfjs-backend-webgl';
await tf.setBackend('webgl');

// ✅ AFTER (works in React Native)
// Don't import webgl backend
await tf.ready(); // Uses default CPU backend
```

### 2. Simplified TensorFlow Initialization
- Removed forced backend selection
- Let TensorFlow use available backend automatically (CPU)
- Added better error handling with user alerts

### 3. Camera Now Works! ✅
- App loads successfully
- Camera permission works
- Camera view displays correctly
- UI overlays function properly

## 🚧 Current Limitation

**Pose Detection is Placeholder Only**

The app currently shows:
- ✅ Live camera feed
- ✅ UI controls (FPS, buttons, overlays)
- ⚠️ NO actual pose detection yet

Why? TensorFlow.js pose-detection models have compatibility issues with React Native.

## 🎯 Recommended Solutions for Real Pose Detection

### Option 1: Use TensorFlow Lite (RECOMMENDED)
Use native TensorFlow Lite with React Native bridge:

```bash
npm install @tensorflow/tfjs-react-native
npm install @react-native-community/async-storage
npm install react-native-fs
```

Resources:
- [TensorFlow Lite React Native Guide](https://www.tensorflow.org/lite/guide/react_native)
- [tfjs-react-native Package](https://www.npmjs.com/package/@tensorflow/tfjs-react-native)

### Option 2: Use Expo Camera with Frame Processor
Use `react-native-vision-camera` with frame processors:

```bash
npx expo install react-native-vision-camera
```

### Option 3: Use Pre-built Expo Module
Check if there's an Expo module for pose detection:
- Search: https://docs.expo.dev/versions/latest/

### Option 4: Backend API Approach
- Send camera frames to backend server
- Process with Python TensorFlow
- Return pose keypoints
- Less real-time but simpler

## 📝 Current App Status

### What Works ✅
- [x] Node.js v24.12.0 installed
- [x] Expo SDK 54 configured
- [x] Camera permission handling
- [x] Live camera view
- [x] UI overlays and controls
- [x] FPS counter
- [x] Skeleton toggle button
- [x] CPR point overlay (placeholder)

### What Doesn't Work Yet ⚠️
- [ ] Actual pose detection
- [ ] Real keypoint extraction
- [ ] CPR point calculation from real data
- [ ] Skeleton visualization with real data

## 🔧 Next Steps

### Immediate (App Works)
1. ✅ Camera displays correctly
2. ✅ User can grant permissions
3. ✅ UI shows all controls
4. **Ready to show as camera app demo**

### Short Term (Add Pose Detection)
1. Install TensorFlow Lite dependencies
2. Load MoveNet Lite model
3. Implement frame processing
4. Connect to pose detection

### Long Term (Production Ready)
1. Optimize performance
2. Add error recovery
3. Test on multiple devices
4. Add usage analytics
5. Implement proper state management

## 📱 How to Test Current Version

1. **Start Expo**:
   ```bash
   cd mobile-cpr-detector
   npx expo start
   ```

2. **Scan QR Code** with Expo Go app

3. **Grant Camera Permission** when prompted

4. **See Live Camera** ✅

5. **Check Console Log** for:
   ```
   Initializing TensorFlow.js...
   TensorFlow.js ready
   Backend: cpu
   Note: Full pose detection not yet implemented for React Native
   Camera will work but pose detection is placeholder
   ```

## 🐛 Troubleshooting

### Error: "Backend name 'webgl' not found"
✅ **FIXED** - Updated code to not use WebGL

### Camera shows black screen
- Check permissions in device settings
- Restart Expo app
- Clear cache: `npx expo start -c`

### App crashes on load
- Check Node version: `node --version` (should be v24+)
- Reinstall dependencies: `rm -rf node_modules && npm install`

## 📚 References

- [TensorFlow.js React Native](https://github.com/tensorflow/tfjs/tree/master/tfjs-react-native)
- [Expo Camera Docs](https://docs.expo.dev/versions/latest/sdk/camera/)
- [MoveNet Model](https://www.tensorflow.org/hub/tutorials/movenet)
- [React Native Vision Camera](https://react-native-vision-camera.com/)

---

**Status**: ✅ Camera Working | ⚠️ Pose Detection Placeholder
**Last Updated**: December 26, 2025
**Node Version**: v24.12.0
**Expo SDK**: 54
