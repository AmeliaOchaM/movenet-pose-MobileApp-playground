# 📥 Download MoveNet TFJS Model - Manual Instructions

Karena download otomatis tidak berfungsi, ikuti langkah manual berikut:

## Opsi 1: Download dari Browser (EASIEST)

### 1. Buka Browser dan ke URL ini:
```
https://www.kaggle.com/models/google/movenet/tfJs/singlepose-lightning/4
```

### 2. Steps:
1. Login ke Kaggle (buat account gratis jika belum punya)
2. Klik tombol **"Download"** atau **"New Notebook"**
3. Jika download, extract file `.tar.gz` yang didownload
4. Copy file-file berikut ke folder `react-native-movenet/assets/models/`:
   - `model.json`
   - `group1-shard1of1.bin` (atau file .bin lainnya)

---

## Opsi 2: Gunakan tfjs-models Package

Install package yang sudah include model:

```bash
npm install @tensorflow-models/posenet
```

Tapi ini untuk PoseNet, bukan MoveNet. Untuk MoveNet lebih kompleks.

---

## Opsi 3: Manual Download via Python

Buat script Python sederhana:

```python
import urllib.request
import os

# Create directory
os.makedirs('assets/models', exist_ok=True)

# Model URLs (pre-hosted)
base_url = "https://storage.googleapis.com/tfhub-lite-models/google/lite-model/movenet/singlepose/lightning/3.tflite"

# Download
print("Downloading MoveNet model...")
urllib.request.urlretrieve(base_url, 'assets/models/movenet_lightning.tflite')
print("Done!")
```

---

## ⚡ QUICK SOLUTION: Gunakan Mock Model Dulu

Untuk sementara, aplikasi sudah configured dengan **Mock Model** yang:
- ✅ Bisa membuka kamera
- ✅ Bisa ambil foto
- ✅ UI berjalan normal
- ⚠️ Pose detection results adalah simulasi (random keypoints untuk demo)

### Kapan Mock Model Cukup?
- Testing UI/UX
- Development frontend
- Demo aplikasi
- Testing camera functionality

### Kapan Perlu Real Model?
- Production release
- Actual pose detection needed
- Accuracy testing

---

## 🎯 FOR NOW: Test dengan Mock Model

Aplikasi Anda sudah bisa digunakan! Mari test:

1. **Buka Expo Go** di HP
2. **Scan QR code** dari terminal  
3. **Tap "📸 Buka Kamera"**
4. **Ambil foto**
5. **Tap "🔍 Detect Pose"**
6. Lihat hasil (simulated keypoints)

Model sudah di-configure untuk return mock data, jadi UI akan show overlay skeleton (meskipun data nya random).

---

## 📝 Next Steps untuk Production

Ketika siap untuk production:

### Option A: Download TFJS Model Manual
1. Download dari Kaggle (link di atas)
2. Copy files ke `assets/models/`
3. Update `MoveNetModel.js` untuk load real model (instructions below)

### Option B: Use Development Build
1. Create EAS development build
2. Use react-native-tflite untuk load `.tflite` directly
3. No conversion needed!

---

## 🔧 Update Code untuk Real Model

Ketika model sudah downloaded, update file `src/models/MoveNetModel.js`:

```javascript
async loadModelFromAssets() {
  try {
    console.log('Loading model from assets...');
    await tf.ready();
    
    // Load real TFJS model
    const modelJson = require('../../assets/models/model.json');
    const modelWeights = require('../../assets/models/group1-shard1of1.bin');
    
    this.model = await tf.loadGraphModel(
      bundleResourceIO(modelJson, modelWeights)
    );
    
    this.isModelLoaded = true;
    console.log('✓ Real model loaded!');
    return true;
  } catch (error) {
    console.error('Error loading model:', error);
    // Fallback to mock
    this.model = this.createMockModel();
    this.isModelLoaded = true;
    return true;
  }
}
```

---

**Current Status:** 🟢 App Running with Mock Model  
**Camera:** ✅ Working  
**Pose Detection:** 🟡 Simulated (Mock Data)  
**Production Ready:** ⏳ Needs Real Model Download
