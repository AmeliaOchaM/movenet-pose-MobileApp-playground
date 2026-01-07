# 🚀 Cara Menjalankan Development Build

## ✅ YANG BENAR - Step by Step:

### 1️⃣ Start Metro Bundler DULU
```bash
cd /home/amelia-ocha/Documents/project_izin/react-native-movenet
npx expo start --dev-client --clear
```

**Tunggu sampai muncul QR Code di terminal!**

### 2️⃣ Buka Aplikasi di HP
- Buka app "MoveNet Pose Detection" yang sudah terinstall
- Jangan download lagi, pakai yang sudah ada

### 3️⃣ Scan QR Code dari Terminal
- Scan QR code yang muncul di terminal (bukan dari EAS build)
- Tunggu loading...
- Aplikasi akan terbuka dengan model asli!

---

## 🔄 Mode Alternatif

### Jika WiFi Sama (Recommended - Lebih Cepat):
```bash
npx expo start --dev-client --clear
```

### Jika WiFi Berbeda (Gunakan Tunnel):
```bash
npx expo start --dev-client --tunnel
```

### Jika Error "Port in use":
```bash
npx expo start --dev-client --clear --port 8083
```

---

## ⚠️ Yang SALAH:

❌ Scan QR dari EAS build lagi → Itu untuk download APK
❌ Buka Expo Go → Development Build bukan Expo Go
❌ Metro bundler tidak jalan → Harus jalan dulu sebelum scan

---

## ✅ Yang BENAR:

1. Metro Bundler jalan ✅
2. QR Code muncul di terminal ✅
3. Buka app yang sudah terinstall ✅
4. Scan QR dari terminal ✅
5. Aplikasi load JavaScript ✅

---

## 📱 Status Check:

- [ ] APK sudah terinstall di HP
- [ ] Metro Bundler jalan di laptop
- [ ] HP dan laptop di WiFi yang sama (atau pakai --tunnel)
- [ ] Scan QR dari terminal Metro Bundler (bukan dari EAS)
- [ ] Aplikasi berhasil load

---

## 🎯 Setelah Berhasil Connect:

Anda bisa:
- ✅ Edit code → Auto reload
- ✅ Test kamera dengan model asli
- ✅ Debug di console
- ✅ Hot reload seperti Expo Go

**Hanya perlu start Metro Bundler setiap kali mau development!**
