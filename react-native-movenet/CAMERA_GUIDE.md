# Panduan Menggunakan Fitur Kamera

## Fitur yang Ditambahkan

Aplikasi sekarang memiliki fitur untuk membuka kamera mobile dan mengambil foto secara langsung.

## Komponen yang Ditambahkan

### 1. CameraView Component
File: `src/components/CameraView.js`

Komponen ini menyediakan:
- Akses kamera depan dan belakang
- Tombol untuk mengambil foto
- Tombol untuk toggle antara kamera depan/belakang
- Permission handling untuk akses kamera
- UI yang user-friendly dengan kontrol yang jelas

### 2. Update App.js

Fitur yang ditambahkan:
- Tombol "Buka Kamera" untuk membuka kamera
- Tombol "Pilih dari Galeri" untuk memilih gambar dari galeri
- Integrasi foto dari kamera dengan pose detection

## Cara Menggunakan

### 1. Jalankan Aplikasi

```bash
cd react-native-movenet
npm install
npx expo start
```

### 2. Buka Kamera
- Tekan tombol "📸 Buka Kamera"
- Aplikasi akan meminta izin akses kamera (berikan izin)
- Kamera akan terbuka dengan tampilan full screen

### 3. Ambil Foto
- Gunakan tombol lingkaran putih besar di bawah untuk mengambil foto
- Gunakan tombol flip di kiri bawah untuk toggle kamera depan/belakang
- Gunakan tombol X di kiri atas untuk menutup kamera

### 4. Deteksi Pose
- Setelah foto diambil, tekan tombol "🔍 Detect Pose"
- Aplikasi akan menganalisis pose dalam foto
- Hasil deteksi akan ditampilkan di bawah gambar

## Struktur UI

```
┌─────────────────────────────┐
│  Header (MoveNet Title)     │
├─────────────────────────────┤
│  📸 Buka Kamera             │
│  🖼️ Pilih dari Galeri       │
│  🔍 Detect Pose (jika ada)  │
├─────────────────────────────┤
│  Preview Gambar             │
│  + Pose Overlay             │
├─────────────────────────────┤
│  Hasil Deteksi              │
│  - Keypoints detected       │
│  - Confidence               │
│  - Quality                  │
└─────────────────────────────┘
```

## Tampilan Kamera

Saat kamera dibuka:
```
┌─────────────────────────────┐
│ X  Ambil Foto            □  │  <- Header
│                             │
│                             │
│     Live Camera View        │
│                             │
│                             │
├─────────────────────────────┤
│  🔄         ⚪         □     │  <- Controls
│ (Flip)   (Capture)          │
└─────────────────────────────┘
```

## Dependencies yang Digunakan

- `expo-camera`: ^15.0.0 - Untuk akses kamera
- `@expo/vector-icons`: Untuk ikon UI
- `react-native`: Untuk komponen UI dasar

## Permission yang Diperlukan

Aplikasi memerlukan permission:
- **Camera Access**: Untuk mengambil foto dengan kamera
- **Media Library Access**: Untuk memilih foto dari galeri

Permission akan diminta otomatis saat pertama kali digunakan.

## Troubleshooting

### Kamera tidak muncul
- Pastikan Anda sudah memberikan izin akses kamera
- Restart aplikasi jika diperlukan
- Periksa apakah device memiliki kamera

### Error saat mengambil foto
- Pastikan permission sudah diberikan
- Cek console untuk error message
- Pastikan ada cukup ruang penyimpanan

### Build Error
Jika terjadi error saat build, jalankan:
```bash
npm install
npx expo install expo-camera
```

## Catatan Penting

1. **Testing di Device Real**: Fitur kamera harus ditest di device fisik, tidak bisa di simulator/emulator karena keterbatasan akses kamera
2. **Permission**: Jika user menolak permission, aplikasi akan menampilkan pesan dan tombol untuk request permission lagi
3. **Performance**: Foto yang diambil memiliki quality tinggi (quality: 1) untuk hasil pose detection yang lebih akurat

## Next Steps

Setelah fitur kamera berjalan, Anda bisa:
1. Menambahkan real-time pose detection (live camera feed)
2. Menambahkan fitur untuk menyimpan hasil
3. Menambahkan filter atau editing foto
4. Menambahkan guidance untuk pose yang benar

## Support

Untuk pertanyaan atau issues, silakan buat issue di repository atau hubungi developer.
