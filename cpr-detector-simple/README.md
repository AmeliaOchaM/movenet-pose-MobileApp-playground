# 📱 CPR Detector - Simple Mobile App (UI Demo)

Aplikasi React Native Expo untuk menampilkan **UI Demo** deteksi titik kompresi CPR.

⚠️ **IMPORTANT: Ini adalah UI DEMO dengan MOCK detection data**
- ✅ Camera: Working
- ✅ UI/UX: Complete
- ✅ CPR Calculation: Working
- ⚠️ Pose Detection: Simulated (mock keypoints)

## 🎯 Purpose

Demo ini dibuat untuk:
1. **Show UI/UX** - Menampilkan interface dan design
2. **Test CPR Calculation** - Formula α=0.42 bekerja dengan benar
3. **Mobile App Structure** - Template untuk implementasi real detection

## ⚠️ Kenapa Mock Detection?

**TensorFlow.js pose-detection TIDAK KOMPATIBEL dengan Expo/React Native:**
- `@mediapipe/pose` dependency error
- `@tensorflow/tfjs-react-native` dependency conflicts
- Web backend terlalu slow untuk mobile

**Solusi Production:**
- Gunakan **native TFLite model** (`4.tflite` yang sudah kamu punya)
- Implement native module bridge (Java/Kotlin untuk Android, Swift/Obj-C untuk iOS)
- Atau tunggu TensorFlow Lite React Native support yang lebih baik

## 🚀 Quick Start

```bash
# 1. Masuk ke directory
cd cpr-detector-simple

# 2. Start development server
npm start
```

Kemudian:
1. Download **Expo Go** di smartphone
2. Scan QR code
3. Grant camera permission
4. Done! 🎉

## 📱 Demo

1. Buka app di smartphone
2. Izinkan camera permission
3. Tunggu model loading (~1 menit untuk first time)
4. Position upper body facing camera
5. Lihat yellow CPR point marker!

## ⚠️ Important Notes

**Ini adalah DEMO version dengan TensorFlow.js web backend:**

- ✅ Works: Detection functional
- ⚠️ Performance: Slower than native (5-15 FPS)
- ⚠️ Battery: More drain
- ⚠️ Model Loading: 1-2 minutes first time

**Untuk Production:**
- Gunakan TFLite native model
- Copy model `4.tflite` ke assets
- Implement native bridge
- Expected: 20-30 FPS

## 🎯 Features

- Real-time pose detection
- CPR point calculation (α=0.42 formula)
- Yellow marker overlay
- Confidence indicator
- Skeleton toggle (optional)
- Simple & clean UI

## 📂 Project Structure

```
cpr-detector-simple/
├── App.js                    # Main app
├── components/
│   ├── CameraScreen.js       # Camera + detection
│   └── CPROverlay.js         # CPR marker overlay
├── utils/
│   └── cprCalculation.js     # CPR calculation
└── package.json              # Dependencies
```

## 🔧 Commands

```bash
# Start development
npm start

# Run on Android
npm run android

# Run on iOS  
npm run ios

# Run on Web
npm run web
```

## 💡 Next Steps

### Option 1: Test Demo Version
```bash
npm start
# Test di device dengan Expo Go
```

### Option 2: Upgrade to Native TFLite
1. Copy `4.tflite` model ke `assets/models/`
2. Install `expo-file-system`
3. Implement TFLite interpreter
4. Much better performance!

## 🐛 Troubleshooting

### Model Loading Stuck
- Wait 1-2 minutes (first time)
- Check internet connection
- Check console logs

### Camera Not Working
```
Settings > Apps > Expo Go > Permissions > Camera > Allow
```

### Low FPS
- Normal untuk web backend (5-15 FPS)
- Untuk better performance: gunakan native TFLite

## 📝 Notes

Project ini dibuat dengan approach simplified karena ada issue dengan:
- `@tensorflow/tfjs-react-native` (dependency conflicts)
- `expo-gl-cpp` (tidak diperlukan untuk simple demo)

Menggunakan TensorFlow.js web backend sebagai demo proof-of-concept.

---

**Made with ❤️ for CPR Training**
