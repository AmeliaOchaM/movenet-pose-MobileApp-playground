# Menggunakan Model MoveNet Offline di React Native

## 🎯 Tujuan
Menggunakan model MoveNet (`4.tflite`) secara offline di aplikasi React Native Expo.

## ⚠️ Masalah dengan TFLite di Expo Go
**TFLite tidak didukung secara native di Expo Go!**

Anda punya 3 opsi:

---

## ✅ OPSI 1: Gunakan Model TFJS (RECOMMENDED untuk Expo Go)

### Download Model TFJS dari TensorFlow Hub

```bash
# 1. Download model TFJS yang sudah di-convert
cd react-native-movenet/assets/models/

# Download menggunakan wget atau curl
wget https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4?tfjs-format=file -O movenet_tfjs.tar.gz

# Atau download manual dari browser:
# https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4

# 2. Extract
tar -xzf movenet_tfjs.tar.gz

# 3. Verify files
ls -la
# Harus ada: model.json dan beberapa file *.bin (group1-shard1of1.bin)
```

### Update Code untuk Load TFJS Model

File sudah diupdate di `src/models/MoveNetModel.js`

---

## 🔧 OPSI 2: Convert TFLite ke TFJS

### Requirement:
```bash
pip install tensorflowjs tensorflow
```

### Langkah Conversion:

**PENTING:** TFLite to TFJS conversion butuh intermediate format. Lebih mudah download yang sudah jadi.

Jika Anda punya akses ke SavedModel format asli:
```bash
tensorflowjs_converter \
  --input_format=tf_saved_model \
  --output_format=tfjs_graph_model \
  /path/to/saved_model \
  react-native-movenet/assets/models/
```

Jika hanya punya TFLite, gunakan script:
```bash
cd react-native-movenet/scripts
python convert_tflite_to_tfjs.py
```

---

## 🚀 OPSI 3: Development Build dengan TFLite (Advanced)

Untuk menggunakan TFLite langsung, Anda butuh Development Build (bukan Expo Go):

### 1. Install EAS CLI
```bash
npm install -g eas-cli
eas login
```

### 2. Create Development Build
```bash
eas build --platform android --profile development
```

### 3. Install react-native-tflite
```bash
npm install react-native-tflite
```

### 4. Update app.json
Tambahkan plugin untuk TFLite support.

---

## 📝 Current Implementation

Saat ini aplikasi menggunakan **Mock Model** untuk testing UI:
- ✅ Kamera works
- ✅ UI works  
- ⚠️ Pose detection is simulated (random keypoints)

Untuk real pose detection, pilih salah satu opsi di atas.

---

## 🎯 RECOMMENDED QUICK START

### Gunakan TFJS Model (Easiest):

1. **Download model TFJS:**
```bash
cd react-native-movenet/assets/models
# Download dari: https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4
# Extract ke folder ini
```

2. **Update MoveNetModel.js** untuk load model yang benar (bukan mock)

3. **Test di HP** dengan reload app

---

## 📚 Resources

- TensorFlow Hub MoveNet: https://tfhub.dev/google/movenet/singlepose/lightning/4
- TFJS Model: https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4
- TensorFlow.js Converter: https://github.com/tensorflow/tfjs/tree/master/tfjs-converter

---

## 🔍 File Structure Setelah Setup

```
react-native-movenet/
├── assets/
│   └── models/
│       ├── model.json          # TFJS model config
│       ├── group1-shard1of1.bin # TFJS weights
│       └── movenet.tflite      # Original TFLite (reference)
├── src/
│   └── models/
│       ├── MoveNetModel.js     # Model loader (updated)
│       └── PoseDetector.js
```

---

**Status:** 🟡 Using Mock Model (Camera works, pose detection simulated)  
**Next Step:** Download TFJS model untuk real pose detection
