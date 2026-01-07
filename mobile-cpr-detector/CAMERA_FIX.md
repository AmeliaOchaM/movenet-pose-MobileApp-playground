# 🔧 Camera Fix - Mobile CPR Detector

## Masalah yang Diperbaiki

### ❌ Masalah Sebelumnya:
1. **Kamera tidak terbuka** - Hanya menampilkan background hitam
2. **Expo Camera API tidak kompatibel** - Versi 15.0.0 menggunakan API baru yang berbeda
3. **`takePictureAsync()` tidak tersedia** di `CameraView` component
4. **Processing terlalu berat** - Mengambil foto terus-menerus menyebabkan lag

### ✅ Solusi yang Diterapkan:

1. **Downgrade expo-camera ke versi 13.4.4**
   - Versi ini lebih stabil dan kompatibel dengan Expo 51
   - Menggunakan komponen `Camera` klasik, bukan `CameraView`

2. **Mengubah permission handling**
   - Dari `useCameraPermissions()` hook ke `Camera.requestCameraPermissionsAsync()`
   - Lebih reliable dan konsisten

3. **Menyederhanakan frame processing**
   - Menghapus `takePictureAsync()` yang tidak tersedia
   - Menggunakan interval-based processing yang lebih ringan
   - Rate limiting ke ~5 FPS untuk mengurangi beban

4. **Perbaikan struktur komponen**
   - Overlay dan controls sekarang berada di dalam `<Camera>` component
   - Memastikan camera view terlihat dengan benar

## 🚀 Cara Menjalankan

```bash
# 1. Install dependencies yang sudah diperbaiki
cd mobile-cpr-detector
npm install

# 2. Hapus cache (penting!)
expo start -c

# 3. Scan QR code dengan Expo Go app
```

## 📝 Catatan Penting

### Permission di Device:
Pastikan Expo Go app memiliki permission kamera:
- **Android**: Settings → Apps → Expo Go → Permissions → Camera ✅
- **iOS**: Settings → Expo Go → Camera ✅

### Jika Masih Hitam:
1. **Force close Expo Go app** di smartphone
2. **Clear cache**: `expo start -c`
3. **Restart Metro bundler**: Ctrl+C lalu `npm start`
4. **Scan QR code lagi**

### Known Limitations:
- Frame processing saat ini simplified (placeholder)
- Untuk production, perlu native bridge untuk capture camera frames
- TensorFlow.js di React Native memiliki keterbatasan performa
- Pertimbangkan menggunakan TensorFlow Lite untuk performa lebih baik

## 🔍 Debugging

Jika kamera masih tidak muncul, cek console log:
```javascript
// Akan muncul di terminal Expo:
- "TensorFlow.js ready"
- "MoveNet detector loaded"
- "Backend: webgl"
```

Jika ada error, kemungkinan:
- Permission ditolak user
- Expo Go version tidak kompatibel
- Device tidak support WebGL untuk TensorFlow.js

## 📚 Referensi
- [Expo Camera Docs v13](https://docs.expo.dev/versions/v47.0.0/sdk/camera/)
- [TensorFlow.js React Native](https://js.tensorflow.org/api/latest/)
- [MoveNet Pose Detection](https://github.com/tensorflow/tfjs-models/tree/master/pose-detection)
