# 🔧 Troubleshooting Guide - Expo Connection

## ❌ Masalah: Tidak Bisa Membuka di HP

### Error: "failed to download remote update"

## 🔍 Solusi Step-by-Step

### Solusi 1: Gunakan Tunnel Mode
Jika HP dan laptop di jaringan berbeda atau ada firewall:

```bash
# Stop expo yang sedang running (Ctrl+C)

# Start dengan tunnel mode
npx expo start --tunnel
```

**Kelebihan**: Bekerja meskipun berbeda jaringan
**Kekurangan**: Sedikit lebih lambat

---

### Solusi 2: Gunakan LAN Mode (Recommended)
Pastikan HP dan laptop terhubung ke WiFi yang sama:

```bash
# Stop expo yang sedang running (Ctrl+C)

# Start dengan LAN mode
npx expo start --lan
```

**Checklist**:
- ✅ HP dan laptop di WiFi yang sama
- ✅ Tidak ada firewall yang memblokir
- ✅ Router mengizinkan komunikasi antar device

---

### Solusi 3: Clear Cache & Restart

```bash
# Clear cache Expo
npx expo start --clear

# Atau lebih thorough:
rm -rf node_modules
rm -rf .expo
npm install --legacy-peer-deps
npx expo start --tunnel
```

---

### Solusi 4: Gunakan Development Build
Jika Expo Go bermasalah, gunakan development build:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login ke Expo
eas login

# Build development client
eas build --profile development --platform android
```

---

### Solusi 5: Cek Koneksi Network

#### Di Terminal Laptop:
```bash
# Cek IP address laptop
ifconfig | grep "inet " | grep -v 127.0.0.1

# Atau
ip addr show | grep "inet " | grep -v 127.0.0.1
```

#### Di HP:
1. Buka Expo Go
2. Masuk manual dengan format: `exp://[IP_LAPTOP]:8081`
3. Contoh: `exp://192.168.1.100:8081`

---

## 🎯 Quick Fix (Paling Sering Berhasil)

### Opsi A: Tunnel Mode (Paling Mudah)
```bash
npx expo start --tunnel
```
Tunggu sampai muncul QR code, scan dengan Expo Go.

### Opsi B: Connection String Manual
```bash
# 1. Lihat IP laptop
hostname -I

# 2. Start Expo
npx expo start

# 3. Di Expo Go, masukkan manual:
# exp://[YOUR_IP]:8081
```

---

## 📱 Troubleshooting Expo Go di HP

### Update Expo Go
1. Buka Play Store / App Store
2. Cari "Expo Go"
3. Update ke versi terbaru

### Clear Cache Expo Go
**Android:**
1. Settings → Apps → Expo Go
2. Storage → Clear Cache
3. Clear Data (opsional, akan logout)

**iOS:**
1. Hapus app Expo Go
2. Install ulang dari App Store

---

## 🔥 Alternative: Web Preview

Jika masih error, test dulu di web:

```bash
npx expo start --web
```

Browser akan terbuka otomatis. Ini untuk memastikan kode berfungsi.

---

## ⚙️ Cek App Configuration

Pastikan `app.json` sudah benar:

```json
{
  "expo": {
    "name": "react-native-movenet",
    "slug": "react-native-movenet",
    "version": "1.0.0",
    "orientation": "portrait",
    "platforms": [
      "ios",
      "android",
      "web"
    ],
    "assetBundlePatterns": [
      "**/*"
    ]
  }
}
```

---

## 🚨 Error Messages & Solutions

### Error: "Network response timed out"
**Solusi**: 
```bash
npx expo start --tunnel
```

### Error: "Unable to resolve module"
**Solusi**:
```bash
rm -rf node_modules
npm install --legacy-peer-deps
npx expo start --clear
```

### Error: "Couldn't start project on Android"
**Solusi**:
```bash
# Clear Android cache
cd android
./gradlew clean
cd ..
npx expo start --clear
```

### Error: "Metro bundler crashed"
**Solusi**:
```bash
# Kill all node processes
pkill -9 node

# Restart
npx expo start --clear
```

---

## 📋 Checklist Debugging

Sebelum memulai, pastikan:

- [ ] Node.js versi 18+ terinstall (`node --version`)
- [ ] NPM packages terinstall (`npm install --legacy-peer-deps`)
- [ ] Expo Go terinstall di HP (versi terbaru)
- [ ] HP dan laptop di WiFi yang sama (untuk LAN mode)
- [ ] Firewall tidak memblokir port 8081, 8082, 19000, 19001
- [ ] Tidak ada Expo lain yang running di background

---

## 🎬 Complete Restart Procedure

Jika semua gagal, restart lengkap:

```bash
# 1. Kill semua process
pkill -9 node
pkill -9 expo

# 2. Clean project
cd /home/amelia-ocha/Documents/project_izin/react-native-movenet
rm -rf node_modules
rm -rf .expo
rm -rf package-lock.json

# 3. Reinstall
npm install --legacy-peer-deps

# 4. Start fresh dengan tunnel
npx expo start --tunnel --clear
```

Di HP:
1. Force close Expo Go
2. Clear cache Expo Go
3. Buka lagi dan scan QR code

---

## 💡 Tips Tambahan

### Gunakan Terminal Output
Perhatikan error di terminal:
```bash
# Jika ada error seperti:
# "Port 8081 already in use"

# Solusi:
lsof -ti:8081 | xargs kill -9
npx expo start
```

### Test Koneksi
```bash
# Di laptop, test port terbuka:
nc -zv localhost 8081

# Atau:
curl http://localhost:8081
```

### Check Expo Status
```bash
# Lihat versi Expo CLI
npx expo --version

# Update jika perlu
npm install -g expo-cli@latest
```

---

## 📞 Jika Masih Error

1. **Screenshot error message** di HP
2. **Copy error dari terminal** di laptop
3. Cek log lengkap di: `~/.expo/logs/`
4. Share error untuk bantuan lebih lanjut

---

## ✅ Solusi Tercepat (TL;DR)

```bash
# Cara termudah:
npx expo start --tunnel

# Scan QR code dengan Expo Go
# Tunggu loading selesai
```

Jika tunnel lambat:
```bash
# Pastikan di WiFi sama, lalu:
npx expo start --lan
```

---

*Last updated: January 7, 2026*
