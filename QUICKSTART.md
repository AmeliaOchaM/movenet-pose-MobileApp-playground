# Quick Start Guide

## Testing Model dengan Python (Recommended untuk Verifikasi Pertama)

### 1. Install Dependencies

```bash
pip install tensorflow opencv-python matplotlib numpy ai-edge-litert
```

### 2. Download Sample Image

Download gambar contoh untuk testing (orang berdiri atau melakukan pose):
```bash
# Contoh: download dari internet atau gunakan gambar sendiri
wget https://example.com/person-standing.jpg -O test_image.jpg
```

### 3. Run Test Script

```bash
python test_movenet.py
```

Masukkan path gambar saat diminta:
```
Path: test_image.jpg
```

### 4. Check Results

- Console akan menampilkan koordinat keypoints
- File `result_pose_detection.jpg` akan dibuat
- Window akan muncul menampilkan visualisasi

---

## Setup React Native Expo (untuk Mobile Development)

### 1. Install Expo CLI

```bash
npm install -g expo-cli
```

### 2. Setup Project

```bash
cd react-native-movenet
npm install
```

### 3. ⚠️ IMPORTANT: Convert Model

**Model TFLite perlu di-convert ke TFJS format!**

Download pre-converted model:
```bash
# Visit dan download:
# https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4

# Extract ke:
mkdir -p assets/models
# Copy model.json dan weight files ke assets/models/
```

### 4. Run App

```bash
npm start
```

Scan QR code dengan Expo Go app di smartphone Anda.

---

## First Time Setup Checklist

- [ ] Python 3.8+ installed
- [ ] pip packages installed
- [ ] File `4.tflite` ada di folder project
- [ ] Test dengan Python script berhasil
- [ ] Node.js dan npm installed (untuk React Native)
- [ ] Model di-convert ke TFJS format (untuk React Native)
- [ ] Expo CLI installed
- [ ] Expo Go app installed di smartphone

---

## Verification Steps

### Python Test
```bash
# Harus berhasil tanpa error
python test_movenet.py
```

Expected output:
```
Model loaded successfully!
Input shape: [1, 192, 192, 3]
Output shape: [1, 1, 17, 3]
✓ Testing berhasil! Model bekerja dengan baik.
```

### React Native Test
```bash
cd react-native-movenet
npm start
```

Expected:
- Metro bundler starts without errors
- QR code displayed
- App loads on device

---

## Common Issues

### Python: "No module named 'ai_edge_litert'"
```bash
pip install ai-edge-litert
```

### Python: Model not found
```bash
# Pastikan 4.tflite ada di folder yang sama dengan test_movenet.py
ls -la 4.tflite
```

### React Native: Model format error
```bash
# Convert model ke TFJS format terlebih dahulu
# Lihat README.md section "Model Conversion"
```

---

## Next Steps

1. ✅ Test dengan Python script
2. ✅ Verifikasi hasil deteksi akurat
3. 📱 Setup React Native project
4. 🔄 Convert model ke TFJS
5. 📲 Deploy ke mobile device
6. 🎥 Implement camera detection

---

**Need Help?**  
Check README.md untuk dokumentasi lengkap!
