# 🚀 QUICKSTART GUIDE - Mobile CPR Detector

Panduan cepat untuk running aplikasi dalam 5 menit!

## ⚡ Super Quick Start

```bash
# 1. Navigate to project
cd mobile-cpr-detector

# 2. Install
npm install

# 3. Start
npm start
```

**Kemudian:**
- Download **Expo Go** di smartphone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))
- Scan QR code yang muncul
- Izinkan akses kamera
- **Done!** 🎉

## 📱 Step-by-Step (Detailed)

### Step 1: Install Expo Go di Smartphone

**Android:**
1. Buka Google Play Store
2. Search "Expo Go"
3. Install app

**iOS:**
1. Buka App Store
2. Search "Expo Go"
3. Install app

### Step 2: Install Dependencies

```bash
cd /home/amelia-ocha/Documents/project_izin/mobile-cpr-detector
npm install
```

Tunggu sampai selesai (~2-3 menit untuk first time).

### Step 3: Start Development Server

```bash
npm start
```

Akan muncul:
- QR code di terminal
- Browser dengan Metro bundler
- Development server running di `exp://192.168.x.x:8081`

### Step 4: Connect Device

**Pastikan smartphone dan laptop di WiFi yang sama!**

1. Buka Expo Go app
2. Tap "Scan QR code"
3. Scan QR code dari terminal/browser
4. App akan building dan loading (~30 detik untuk first load)

### Step 5: Grant Permission

Saat app pertama kali buka:
1. Pop-up permission muncul: "Allow CPR Detector to access camera?"
2. Tap **Allow**

### Step 6: Start Detecting!

1. Hadap kamera (front camera)
2. Tampilkan upper body (kepala sampai pinggang)
3. Yellow marker akan muncul di CPR point! ✨

## 🎯 What You Should See

```
┌─────────────────────────┐
│ FPS: 15  ● CPR DETECTED │  ← Top bar
├─────────────────────────┤
│                         │
│    📷 Camera View       │
│                         │
│         ⊕              │  ← Yellow CPR marker
│    (Your body)          │
│                         │
├─────────────────────────┤
│ 👁 Show Skeleton        │  ← Bottom controls
│ Confidence: 85%         │
└─────────────────────────┘
```

## ⚙️ Controls

- **Show/Hide Skeleton**: Tap tombol di bottom-left
- **View Confidence**: Lihat di bottom-right
- **Check FPS**: Lihat di top-left

## ❓ Common Issues

### "Cannot connect to Metro bundler"
**Fix:**
```bash
# Clear cache and restart
expo start -c
```

### "Camera permission denied"
**Fix:**
```
Settings > Apps > Expo Go > Permissions > Camera > Allow
```

### "Loading stuck at 100%"
**Fix:**
1. Close Expo Go app
2. Kill terminal (`Ctrl+C`)
3. Restart: `npm start`
4. Scan QR lagi

### "Laptop & Phone di WiFi berbeda"
**Fix:**
```bash
# Use tunnel mode (slower tapi bisa beda network)
expo start --tunnel
```

### "FPS sangat rendah (<5)"
**Fix:**
- Close apps lain di smartphone
- Reduce resolution (edit CameraScreen.js)
- Test di device yang lebih powerful

## 🔄 Development Workflow

### Live Reload
- Save file → App auto-reload
- Shake device → Open developer menu
- Press `r` di terminal → Manual reload

### View Logs
```bash
# Terminal shows logs from device
expo start

# Or separate log window
expo start --dev-client
```

### Stop Server
```
Press Ctrl+C in terminal
```

## 📊 Performance Expectations

| Device Type | Expected FPS | Experience |
|-------------|--------------|------------|
| Flagship (2023+) | 20-30 FPS | Smooth |
| Mid-range (2021+) | 10-20 FPS | Good |
| Budget (<2020) | 5-10 FPS | Usable |

## 🎓 Tips for Best Results

1. **Lighting**: Pastikan pencahayaan cukup (avoid backlight)
2. **Distance**: Stand ~1-2 meter dari kamera
3. **Angle**: Frontal view (avoid side angle)
4. **Clothing**: Avoid bulky clothes yang menutupi body outline
5. **Background**: Simple background lebih baik

## 🚀 Next Steps

Setelah running:

1. **Test Detection Quality**
   - Try different poses
   - Check confidence levels
   - Verify CPR point position

2. **Customize UI**
   - Edit colors di `CPROverlay.js`
   - Modify layout di `CameraScreen.js`

3. **Build for Production**
   ```bash
   # Android APK
   expo build:android
   
   # iOS IPA (need Apple Developer account)
   expo build:ios
   ```

## 📞 Need Help?

Check these resources:
- Main README: `README.md`
- Expo Docs: https://docs.expo.dev
- TensorFlow.js: https://www.tensorflow.org/js
- Troubleshooting: Section di main README

---

**That's it! Enjoy detecting CPR points! 🎯📱**
