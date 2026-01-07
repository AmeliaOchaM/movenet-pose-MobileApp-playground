# Quick Start - Camera Feature

## 🎯 Tujuan
Panduan cepat untuk menggunakan fitur kamera di aplikasi MoveNet Pose Detection

## 🚀 Langkah-langkah Cepat

### 1. Install & Run
```bash
cd react-native-movenet
npm install
npx expo start
```

### 2. Scan QR Code
- Buka aplikasi Expo Go di smartphone Anda
- Scan QR code yang muncul di terminal

### 3. Berikan Permission
Saat aplikasi pertama kali dibuka, Anda akan diminta memberikan izin:
- ✅ **Camera Access** - Untuk mengambil foto
- ✅ **Media Library** - Untuk akses galeri

### 4. Gunakan Fitur Kamera

#### Opsi 1: Ambil Foto dengan Kamera
1. Tap tombol **"📸 Buka Kamera"**
2. Arahkan kamera ke objek
3. Tap tombol **lingkaran putih besar** untuk ambil foto
4. Foto akan otomatis dipilih

#### Opsi 2: Pilih dari Galeri
1. Tap tombol **"🖼️ Pilih dari Galeri"**
2. Pilih foto yang diinginkan
3. Foto akan ditampilkan di aplikasi

### 5. Deteksi Pose
1. Setelah foto dipilih, tap tombol **"🔍 Detect Pose"**
2. Tunggu beberapa detik
3. Hasil deteksi akan muncul:
   - Skeleton overlay pada gambar
   - Jumlah keypoints terdeteksi
   - Confidence score
   - Daftar keypoints yang terdeteksi

## 🎮 Kontrol Kamera

Saat kamera terbuka:
- **⚪ Tombol Putih Besar**: Ambil foto
- **🔄 Tombol Flip**: Toggle kamera depan/belakang
- **✕ Tombol Close**: Tutup kamera

## 💡 Tips

1. **Cahaya yang Baik**: Pastikan area cukup terang untuk hasil terbaik
2. **Full Body**: Untuk deteksi pose lengkap, pastikan seluruh tubuh masuk frame
3. **Jarak Optimal**: Berdiri sekitar 2-3 meter dari kamera
4. **Pose yang Jelas**: Gunakan pose yang jelas dan tidak terhalang

## 🔧 Troubleshooting

### Kamera tidak muncul?
```bash
# Reinstall camera package
npx expo install expo-camera
```

### Permission ditolak?
- Buka Settings smartphone
- Cari aplikasi Expo Go
- Berikan izin Camera dan Media Library

### Aplikasi crash?
```bash
# Clear cache dan restart
npx expo start --clear
```

## 📱 Testing

### Recommended Testing Flow:
1. ✅ Test permission request
2. ✅ Test camera opening
3. ✅ Test photo capture
4. ✅ Test camera flip (front/back)
5. ✅ Test gallery picker
6. ✅ Test pose detection
7. ✅ Test close camera

## 🎨 UI Overview

```
┌──────────────────────────┐
│   MoveNet Detection      │ <- Header
│   ✓ Model Ready          │
├──────────────────────────┤
│  [📸 Buka Kamera]        │
│  [🖼️ Pilih dari Galeri]  │ <- Action Buttons
│  [🔍 Detect Pose]        │
├──────────────────────────┤
│                          │
│   [Preview Image]        │ <- Image Display
│   + Skeleton Overlay     │
│                          │
├──────────────────────────┤
│  Detection Results:      │
│  • Keypoints: 15/17      │ <- Results
│  • Confidence: 87.5%     │
│  • Quality: GOOD         │
└──────────────────────────┘
```

## 📋 Checklist Sebelum Deploy

- [ ] Dependencies terinstall lengkap
- [ ] Model file tersedia
- [ ] Permission handling berfungsi
- [ ] Camera berfungsi di real device
- [ ] Gallery picker berfungsi
- [ ] Pose detection memberikan hasil
- [ ] UI responsive di berbagai ukuran layar
- [ ] Error handling berfungsi

## 🆘 Need Help?

Lihat dokumentasi lengkap:
- `CAMERA_GUIDE.md` - Panduan lengkap fitur kamera
- `README.md` - Dokumentasi utama project
- `PROJECT_STRUCTURE_EXPLAINED.md` - Struktur project

## 🎉 Happy Coding!

Selamat menggunakan aplikasi MoveNet Pose Detection!
