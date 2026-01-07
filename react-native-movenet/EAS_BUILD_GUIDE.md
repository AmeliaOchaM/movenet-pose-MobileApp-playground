# Panduan EAS Build - MoveNet Pose Detection

## 📋 Prerequisites

1. ✅ EAS CLI sudah terinstall (v16.28.0)
2. ✅ Project sudah dikonfigurasi dengan `eas.json`
3. ✅ Model files ada di `assets/models/`
4. Account Expo (gratis)

---

## 🚀 Langkah-langkah Build

### Step 1: Login ke Expo Account

```bash
cd /home/amelia-ocha/Documents/project_izin/react-native-movenet
eas login
```

Jika belum punya account:
```bash
eas register
```

### Step 2: Configure Project (Optional - sudah dilakukan)

```bash
eas build:configure
```

### Step 3: Build Development APK untuk Android

```bash
eas build --profile development --platform android
```

**Pilihan saat build:**
- Generate new keystore? → **Yes** (untuk pertama kali)
- Proses build akan berjalan di cloud Expo (butuh waktu 10-20 menit)

### Step 4: Download dan Install APK

Setelah build selesai:
1. Anda akan mendapat link download APK
2. Download APK ke HP Android
3. Install APK (enable "Install from Unknown Sources" jika perlu)
4. Buka aplikasi

### Step 5: Connect untuk Development

Dengan Development Build, Anda bisa:

**Opsi A: Run dengan Metro Bundler (Recommended)**
```bash
npx expo start --dev-client
```
- Scan QR code dari aplikasi yang terinstall di HP
- Code changes akan hot-reload seperti Expo Go

**Opsi B: Run dengan Tunnel (jika berbeda network)**
```bash
npx expo start --dev-client --tunnel
```

---

## 🎯 Keuntungan Development Build vs Expo Go

| Fitur | Expo Go | Development Build |
|-------|---------|-------------------|
| Setup | Instant | Build diperlukan (10-20 min) |
| File Binary Besar | ❌ Tidak support | ✅ Support |
| Native Modules | ❌ Terbatas | ✅ Semua module |
| Model ML (.bin files) | ❌ Tidak bisa | ✅ Bisa |
| Camera Performance | ⚠️ Terbatas | ✅ Full native |
| Hot Reload | ✅ Yes | ✅ Yes |

---

## 📱 Build Options

### Development Build (Untuk Testing)
```bash
eas build --profile development --platform android
```
- APK size lebih besar
- Termasuk debugging tools
- Bisa connect ke Metro bundler
- **Recommended untuk development**

### Preview Build (Untuk Testing Production-like)
```bash
eas build --profile preview --platform android
```
- APK size lebih kecil
- Standalone app (tidak perlu Metro)
- Cocok untuk testing sebelum production

### Production Build (Untuk Release)
```bash
eas build --profile production --platform android
```
- Optimized dan minified
- Siap upload ke Play Store

---

## 🔧 Troubleshooting

### Build Failed - Out of Memory
```bash
# Tambahkan ke eas.json di profile development:
{
  "android": {
    "buildType": "apk",
    "gradleCommand": ":app:assembleRelease",
    "env": {
      "GRADLE_OPTS": "-Xmx4096m -XX:MaxPermSize=512m"
    }
  }
}
```

### Model Files Tidak Ter-bundle
Pastikan di `app.json`:
```json
"assetBundlePatterns": [
  "**/*",
  "assets/**/*",
  "assets/models/**/*"
]
```

### APK Terlalu Besar
File model `.bin` memang besar (total ~13MB). Ini normal untuk ML models.

---

## 📊 Monitoring Build

### Check Build Status
```bash
eas build:list
```

### View Build Details
```bash
eas build:view [BUILD_ID]
```

### Cancel Build
```bash
eas build:cancel [BUILD_ID]
```

---

## 🎬 Setelah Install Development Build

1. **Install APK** di HP Android
2. **Buka aplikasi** (akan muncul "Development Build" screen)
3. **Di laptop, run:**
   ```bash
   npx expo start --dev-client
   ```
4. **Di HP, scan QR code** dari terminal
5. **Aplikasi akan load** dengan model yang sebenarnya!

---

## 💡 Tips

1. **Gunakan WiFi yang sama** untuk laptop dan HP (lebih cepat)
2. **Simpan APK** hasil build, bisa dipakai berkali-kali
3. **Code changes** akan auto-reload tanpa rebuild APK
4. **Rebuild APK** hanya jika:
   - Update native dependencies
   - Update app.json configuration
   - Update native code

---

## 🆘 Help

Jika ada masalah:
```bash
eas build --profile development --platform android --clear-cache
```

Atau lihat logs lengkap di: https://expo.dev/accounts/[username]/projects/movenet-pose-detection/builds

---

## 📝 Next Steps Setelah Build Berhasil

1. ✅ Install Development Build APK
2. ✅ Test kamera dengan model asli
3. ✅ Validate pose detection accuracy
4. ✅ Optimize performance jika perlu
5. ✅ Build Preview/Production jika sudah siap

**Good luck! 🚀**
