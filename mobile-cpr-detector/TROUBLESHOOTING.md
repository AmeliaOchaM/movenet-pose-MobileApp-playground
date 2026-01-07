# 🔧 Troubleshooting - Network Issues

## Masalah yang Dialami
```
npm error network read ETIMEDOUT
```

## Solusi Alternatif

### Opsi 1: Gunakan Yarn (Lebih Stabil untuk Koneksi Lambat)

```bash
# Install Yarn (jika belum ada)
npm install -g yarn

# Gunakan Yarn untuk install
yarn install
```

### Opsi 2: Gunakan Mirror Registry (CDN Indonesia)

```bash
# Gunakan Taobao mirror (lebih cepat untuk Asia)
npm config set registry https://registry.npmmirror.com

# Atau gunakan cnpm
npm install -g cnpm --registry=https://registry.npmmirror.com
cnpm install
```

### Opsi 3: Install Manual Step-by-Step

Jika masih timeout, coba install dependencies satu per satu:

```bash
# 1. Install core Expo
npm install expo --legacy-peer-deps

# 2. Install React
npm install react react-native --legacy-peer-deps

# 3. Install camera
npm install expo-camera --legacy-peer-deps

# 4. Install TensorFlow (paling besar, butuh waktu)
npm install @tensorflow/tfjs @tensorflow-models/pose-detection --legacy-peer-deps

# 5. Install UI
npm install react-native-svg expo-status-bar --legacy-peer-deps
```

### Opsi 4: Gunakan Expo Init (Recommended!)

**Cara paling mudah dan reliable:**

```bash
# Keluar dari folder ini
cd ..

# Buat project baru dengan Expo CLI
npx create-expo-app cpr-detector-app --template blank

# Masuk ke project
cd cpr-detector-app

# Install dependencies yang diperlukan (lebih sedikit)
npm install expo-camera
npm install react-native-svg
npm install @tensorflow/tfjs
npm install @tensorflow-models/pose-detection
```

Kemudian copy file-file yang sudah saya buat:
- `components/CameraScreen.js`
- `components/CPROverlay.js`
- `utils/cprCalculation.js`
- `App.js`

### Opsi 5: Gunakan Mobile Hotspot

Jika WiFi kantor/kampus bermasalah:
```bash
# Gunakan hotspot dari HP
# Kemudian coba install lagi
npm install --legacy-peer-deps
```

### Opsi 6: Increase Timeout & Retry

```bash
npm config set fetch-timeout 300000
npm config set fetch-retry-mintimeout 20000
npm config set fetch-retry-maxtimeout 120000

npm install --legacy-peer-deps
```

## Rekomendasi Saya: Gunakan Opsi 4 (Expo Init)

Ini **paling reliable** karena:
- Template sudah optimized
- Dependencies lebih sedikit
- Network request lebih kecil
- Faster installation

Mau saya buatkan script untuk Opsi 4?
