# 📱 Mobile CPR Point Detector

Aplikasi React Native Expo untuk mendeteksi titik kompresi CPR menggunakan kamera smartphone secara real-time dengan AI pose detection (MoveNet).

## 🎯 Features

✅ **Real-time CPR Detection**
- Deteksi pose menggunakan MoveNet model
- Kalkulasi otomatis titik kompresi CPR
- Visualisasi marker di atas live camera

✅ **Simple & Clean UI**
- Minimalist interface
- FPS counter
- Confidence indicator
- Skeleton overlay (toggle on/off)

✅ **Mobile Optimized**
- Front camera support
- Smooth performance
- Low latency detection

## 📋 Prerequisites

- Node.js (v16 atau lebih baru)
- npm atau yarn
- Expo CLI: `npm install -g expo-cli`
- Smartphone Android/iOS dengan kamera
- Expo Go app di smartphone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))

## 🚀 Installation

### 1. Install Dependencies

```bash
cd mobile-cpr-detector
npm install
```

### 2. Start Development Server

```bash
npm start
```

atau

```bash
expo start
```

### 3. Run on Device

Setelah development server running:

**Opsi A: Scan QR Code (Recommended)**
1. Buka Expo Go app di smartphone
2. Scan QR code yang muncul di terminal/browser
3. App akan loading dan running di device

**Opsi B: Run via Emulator**
```bash
# Android
npm run android

# iOS (Mac only)
npm run ios
```

## 📱 Usage Instructions

1. **Grant Camera Permission**
   - Saat pertama kali buka app, izinkan akses kamera
   
2. **Posisikan Tubuh**
   - Hadap kamera (frontal view)
   - Tampilkan upper body (kepala sampai pinggang)
   - Pastikan pencahayaan cukup

3. **Lihat CPR Point**
   - Yellow/Green marker = CPR compression point
   - Muncul di tengah dada ketika pose terdeteksi
   - Confidence level ditampilkan di bottom bar

4. **Toggle Skeleton (Optional)**
   - Tap tombol "Show Skeleton" untuk melihat full pose keypoints
   - Tap lagi untuk hide skeleton

## 🔧 Troubleshooting

### Camera Permission Denied
```
Settings > Apps > Expo Go > Permissions > Camera > Allow
```

### Model Loading Error
- Pastikan koneksi internet stabil (first time load)
- Clear app cache: hapus dan install ulang Expo Go
- Check logs: `expo start --dev-client`

### Slow Performance
- Close other apps
- Reduce camera resolution (edit `cameraTextureHeight/Width` di CameraScreen.js)
- Test di device yang lebih powerful

### CPR Point Not Detected
- Pastikan upper body terlihat jelas
- Improve lighting
- Stand further dari camera (full upper body visible)
- Check confidence threshold (default: 0.3)

## 📂 Project Structure

```
mobile-cpr-detector/
├── App.js                      # Main app entry
├── components/
│   ├── CameraScreen.js         # Main camera & detection logic
│   └── CPROverlay.js           # SVG overlay untuk CPR marker
├── utils/
│   └── cprCalculation.js       # CPR point calculation utility
├── package.json                # Dependencies
├── app.json                    # Expo configuration
└── README.md                   # This file
```

## 🧮 CPR Calculation Formula

Titik CPR dihitung menggunakan formula geometris:

```
CPR_point = shoulder_midpoint + α × (hip_midpoint - shoulder_midpoint)
```

Dimana:
- `α = 0.42` (42% distance dari shoulders ke hips)
- `shoulder_midpoint` = midpoint antara left & right shoulder
- `hip_midpoint` = midpoint antara left & right hip

Ini menghasilkan titik di area sternum (center chest, lower sternum) yang merupakan lokasi ideal untuk kompresi CPR.

## 🎨 Customization

### Mengubah Marker Color
Edit `components/CPROverlay.js`:
```javascript
const { level, color } = getConfidenceLevel(cprPoint.confidence);
// Modify color logic di utils/cprCalculation.js
```

### Adjust Confidence Threshold
Edit `utils/cprCalculation.js`:
```javascript
const CONFIDENCE_THRESHOLD = 0.3; // Change to 0.4, 0.5, etc.
```

### Camera Resolution
Edit `components/CameraScreen.js`:
```javascript
<TensorCamera
  cameraTextureHeight={1920}  // Reduce for better performance
  cameraTextureWidth={1080}
  resizeHeight={192}          // Model input size
  resizeWidth={192}
/>
```

## 📊 Performance Tips

1. **Optimize for Production**
   ```bash
   expo build:android
   expo build:ios
   ```

2. **Enable Hermes (Android)**
   - Sudah enabled by default di Expo SDK 51

3. **Reduce Bundle Size**
   - Only import needed TensorFlow.js modules
   - Remove unused dependencies

## 🔐 Privacy & Security

⚠️ **Important Notes:**
- Semua processing dilakukan **locally on-device**
- Tidak ada data dikirim ke server
- Tidak ada recording/storing video
- Camera access hanya saat app aktif

## 📄 License

MIT License - Free to use and modify

## 🙏 Credits

- **MoveNet Model**: Google TensorFlow Team
- **TensorFlow.js**: TensorFlow Team
- **Expo**: Expo Team

## 📞 Support

Jika ada issue atau pertanyaan:
1. Check troubleshooting section
2. Review Expo documentation: https://docs.expo.dev
3. TensorFlow.js docs: https://www.tensorflow.org/js

---

**Made with ❤️ for CPR Training & Education**

## 🚀 Quick Start Summary

```bash
# 1. Install dependencies
cd mobile-cpr-detector
npm install

# 2. Start server
npm start

# 3. Scan QR code dengan Expo Go app
# 4. Grant camera permission
# 5. Position upper body facing camera
# 6. See CPR point detected! 🎯
```

**That's it! Simple and ready to use! 📱✨**
