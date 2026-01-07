# 🚀 Kapan & Di Mana Jalankan `npx expo`?

## ❓ Pertanyaan: "npx expo ini jalan dimana?"

**Jawaban:**
`npx expo` akan kamu jalankan **NANTI, SETELAH install APK di HP!**

---

## 📋 Timeline: Sekarang vs Nanti

### ✅ SEKARANG (Yang Sedang Kita Lakukan):

```
1. Build APK di cloud (EAS Build) ✅ SELESAI
2. Download APK (174 MB) ✅ SELESAI
3. Transfer APK ke HP via WiFi 🔄 SEDANG PROSES
4. Install APK di HP ⏳ BELUM
5. Test app pertama kali ⏳ BELUM
```

**Status:** Server WiFi jalan di laptop untuk transfer APK.

---

### ⏳ NANTI (Setelah APK Terinstall di HP):

```
6. Jalankan dev server di laptop 📍 ← `npx expo start` DI SINI!
7. Scan QR code dari HP
8. App terhubung ke dev server
9. Bisa hot reload (edit kode → auto refresh di HP)
```

**Status:** Development mode untuk coding.

---

## 🎯 2 Mode Berbeda

### Mode 1: Standalone APK (Sekarang)
```
APK sudah di-compile
├── Install di HP
├── Buka app
├── Jalan langsung (offline)
└── TIDAK perlu laptop/server

Gunakan untuk:
- Testing pertama kali
- Distribusi ke orang lain
- Production build
```

**Tidak perlu `npx expo start`!**

---

### Mode 2: Development Mode (Nanti)
```
APK custom (dengan expo-dev-client)
├── Install di HP
├── Jalankan `npx expo start` di laptop 📍
├── Scan QR code di HP
└── App terhubung ke laptop untuk development

Gunakan untuk:
- Coding & testing
- Hot reload (edit kode → auto update)
- Debug real-time
```

**Butuh `npx expo start`!**

---

## 📱 Alur Lengkap

### Fase 1: Install APK (Sekarang - Tidak Perlu `npx expo`)

**Di Laptop:**
```bash
# Server WiFi untuk transfer APK
cd ~/Downloads
python3 -m http.server 8000
```

**Di HP:**
```
1. Buka browser: http://10.51.241.228:8000
2. Download mobile-cpr-detector.apk
3. Install APK
4. Buka app pertama kali
5. Test camera & overlay
```

**App akan jalan langsung! Tidak perlu expo server!**

---

### Fase 2: Development (Nanti - Butuh `npx expo`)

**Di Laptop:**
```bash
# Stop server WiFi (Ctrl+C di terminal Downloads)

# Pindah ke folder project
cd /home/amelia-ocha/Documents/project_izin/mobile-cpr-detector

# Jalankan Expo dev server
npx expo start --dev-client
```

Output:
```
Metro waiting on exp://10.51.241.228:8081

› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
› Press a │ open Android

┌──────────────────────────────────────┐
│                                      │
│   ██ ██ ██ ██ ██ ██ ██ ██ ██ ██    │ ← QR CODE
│   ██                            ██    │
│   ██   ██ ██ ██ ██ ██ ██ ██   ██    │
│   ...                                │
└──────────────────────────────────────┘

Metro bundler started!
```

**Di HP:**
```
1. Buka app mobile-cpr-detector yang sudah terinstall
2. Scan QR code dari layar laptop
3. App akan connect ke dev server
4. Sekarang bisa hot reload!
```

---

## 🔄 Perbedaan 2 Cara Jalankan App

### Cara 1: Standalone (Tanpa Expo Server)
```
Install APK → Buka app → Langsung jalan ✅

Kelebihan:
- Tidak perlu laptop menyala
- Offline 100%
- Seperti app normal

Kekurangan:
- Tidak bisa hot reload
- Edit kode → harus build ulang APK
```

### Cara 2: Development Mode (Dengan Expo Server)
```
Install APK → Jalankan `npx expo start` di laptop → Scan QR → Connect ✅

Kelebihan:
- Hot reload (edit kode → auto refresh)
- Fast development
- Bisa lihat console.log di terminal

Kekurangan:
- Butuh laptop menyala
- HP & laptop harus WiFi sama
- Butuh dev server jalan
```

---

## 🎯 Kapan Pakai `npx expo start`?

### ✅ PAKAI saat:
1. Mau coding & test perubahan
2. Mau debug dengan hot reload
3. Development/testing fitur baru
4. Mau lihat console.log real-time

### ❌ TIDAK PAKAI saat:
1. Pertama kali install APK (cukup buka app)
2. Testing standalone (tanpa laptop)
3. Distribusi ke user lain
4. Production testing

---

## 📍 Di Mana Jalankan `npx expo start`?

### Location (Folder):
```bash
# HARUS di folder project React Native:
cd /home/amelia-ocha/Documents/project_izin/mobile-cpr-detector

# JANGAN di folder Downloads!
# JANGAN di folder lain!
```

### Command:
```bash
# Standard (Expo Go):
npx expo start

# Development build (APK custom kita):
npx expo start --dev-client
```

**Gunakan `--dev-client` karena kita build custom APK!**

---

## 🚦 Status Sekarang

### ✅ Yang Sudah Selesai:
```
1. Build APK ✅
2. Download APK ✅
3. Server WiFi jalan ✅
```

### 🔄 Yang Sedang Dikerjakan:
```
4. Transfer APK ke HP via WiFi (http://10.51.241.228:8000)
```

### ⏳ Yang Akan Dilakukan Nanti:
```
5. Install APK di HP
6. Test app pertama kali (tanpa npx expo)
7. Implement camera frame capture (coding)
8. Jalankan npx expo start --dev-client (untuk development)
9. Test real-time detection
```

---

## 💡 Kesimpulan

**"npx expo ini jalan dimana?"**

**Jawaban:**
1. **Lokasi:** Di folder project (`/home/.../mobile-cpr-detector/`)
2. **Waktu:** **NANTI**, setelah APK terinstall di HP
3. **Tujuan:** Development mode (hot reload, debugging)
4. **Command:** `npx expo start --dev-client`

**SEKARANG fokus:**
1. Transfer APK ke HP ← Sedang proses
2. Install APK
3. Test app

**`npx expo` tunggu nanti saat mau coding!** 🚀

---

## 🔗 Quick Reference

### Sekarang (Transfer APK):
```bash
# Di terminal Downloads:
python3 -m http.server 8000

# Di HP browser:
http://10.51.241.228:8000
```

### Nanti (Development):
```bash
# Stop server WiFi (Ctrl+C)

# Pindah ke project:
cd /home/amelia-ocha/Documents/project_izin/mobile-cpr-detector

# Start dev server:
npx expo start --dev-client

# Scan QR code di HP
```

---

**Fokus sekarang: Download APK di HP dulu!** 📱
