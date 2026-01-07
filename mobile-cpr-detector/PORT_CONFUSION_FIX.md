# ❌ Kesalahan: Buka App vs Buka Browser

## 🔍 Masalah yang Terjadi:

### ❌ Yang Kamu Lakukan (SALAH untuk sekarang):
```
HP: Buka app "Expo Go" atau "mobile-cpr-detector" yang sudah terinstall
App: Minta koneksi ke port 8081 (Metro bundler)
      ↓
   GAGAL! Karena belum waktunya pakai app!
```

**Port 8081 = Expo development server (npx expo start)**  
**Tapi kita BELUM jalankan itu!**

---

### ✅ Yang Harus Kamu Lakukan (BENAR untuk sekarang):
```
HP: Buka BROWSER (Chrome/Firefox/Safari)
Browser: Akses http://10.51.241.228:8000
         ↓
   Lihat list file → Download APK!
```

**Port 8000 = HTTP file server untuk download APK**

---

## 🎯 2 Tahap Berbeda

### Tahap 1: DOWNLOAD APK (Sekarang) 📥
```
GUNAKAN: Browser HP
AKSES:   http://10.51.241.228:8000
PORT:    8000 (file server)
TUJUAN:  Download file APK

Laptop server:  python3 -m http.server 8000 ✅
HP:            Buka BROWSER (bukan app!)
```

### Tahap 2: DEVELOPMENT MODE (Nanti) 🔧
```
GUNAKAN: App mobile-cpr-detector yang sudah terinstall
AKSES:   Scan QR code
PORT:    8081 (Metro bundler)
TUJUAN:  Hot reload development

Laptop server:  npx expo start --dev-client
HP:            Buka APP (scan QR code)
```

---

## 📱 SOLUSI: Buka Browser, Bukan App!

### ❌ JANGAN buka app dulu!
```
Home screen → Tap icon "mobile-cpr-detector" ← JANGAN!
atau
Home screen → Tap icon "Expo Go" ← JANGAN!
```

### ✅ BUKA Browser!
```
Home screen → Tap icon "Chrome" atau "Firefox" ← INI!
            ↓
Address bar: http://10.51.241.228:8000
            ↓
Lihat list file
            ↓
Tap: mobile-cpr-detector.apk
            ↓
Download! (174 MB)
```

---

## 🔍 Perbedaan Port

### Port 8000 (Sekarang - File Server):
```bash
# Di laptop:
python3 -m http.server 8000

# Fungsi:
- Serve file dari folder ~/Downloads
- HTTP file server sederhana
- Bisa download file APK

# Akses di HP (BROWSER):
http://10.51.241.228:8000
```

### Port 8081 (Nanti - Metro Bundler):
```bash
# Di laptop (NANTI):
npx expo start --dev-client

# Fungsi:
- Metro bundler (JavaScript bundler)
- Hot reload development
- Console logging

# Akses di HP (APP):
Scan QR code dari laptop
App auto connect ke port 8081
```

---

## 🚀 Step-by-Step BENAR

### 1. Di Laptop (Sudah Jalan):
```bash
cd ~/Downloads
python3 -m http.server 8000

# Output:
Serving HTTP on 0.0.0.0 port 8000 ...
```

### 2. Di HP - BUKA BROWSER (BUKAN APP!):

**a. Tutup app kalau terbuka**
```
Swipe up / Back button → Close app
```

**b. Buka Chrome/Firefox**
```
Home → Chrome (icon browser)
```

**c. Ketik di address bar:**
```
http://10.51.241.228:8000
```

**d. Kamu akan lihat:**
```
Index of /

📄 mobile-cpr-detector.apk    174 MB    26-Dec-2025 18:34
📄 file-lain-1.txt
📄 ...
```

**e. Tap APK:**
```
Tap: mobile-cpr-detector.apk
     ↓
Download akan mulai!
```

### 3. Setelah Download Selesai:

**a. Buka File Manager**
```
Home → Files / File Manager
      → Downloads
      → mobile-cpr-detector.apk
```

**b. Install APK**
```
Tap APK → Install → Open
```

**c. Grant Permissions**
```
Allow Camera
Allow Files
```

**d. Test App**
```
App akan buka
Camera harus muncul
Overlay harus terlihat
```

---

## ⚠️ Common Mistakes

### ❌ Mistake 1: Buka App Langsung
```
Error: "Connect to http://10.51.241.228:8081"
Why:   App cari Metro bundler (belum jalan)
Fix:   Jangan buka app dulu! Buka BROWSER!
```

### ❌ Mistake 2: Salah Port di Browser
```
Error: "http://10.51.241.228:8081" di browser
Why:   Port salah! Itu port Metro, bukan file server
Fix:   Pakai port 8000: http://10.51.241.228:8000
```

### ❌ Mistake 3: Buka Expo Go
```
Error: Expo Go minta login / QR code
Why:   Itu untuk development, bukan download APK
Fix:   Tutup Expo Go, buka Chrome browser!
```

---

## 🎯 Quick Checklist

**Di HP, pastikan:**
- [ ] BUKAN buka app mobile-cpr-detector ❌
- [ ] BUKAN buka Expo Go ❌
- [ ] ✅ BUKA Chrome/Firefox browser
- [ ] ✅ Ketik: http://10.51.241.228:8000 (port 8000!)
- [ ] ✅ Lihat list file
- [ ] ✅ Tap APK → Download
- [ ] ✅ Install setelah selesai

---

## 💡 Kenapa Port Berbeda?

### Analogi:

```
Port 8000 = Toko File (Download APK)
   ↓
Kamu datang → Ambil APK → Bawa pulang → Install

Port 8081 = Workshop Development (Hot Reload)
   ↓
Kamu datang → Coding live → Test langsung
```

**Sekarang ke TOKO dulu (port 8000), bukan ke WORKSHOP (port 8081)!**

---

## 🔗 Link yang Benar untuk HP

**COPY-PASTE ini di browser HP:**
```
http://10.51.241.228:8000
```

**JANGAN pakai ini:**
```
http://10.51.241.228:8081 ❌ (Ini untuk nanti!)
```

---

## 🎬 Video Guide (Mental Model)

**Bayangkan:**

### Cara SALAH (yang kamu lakukan):
```
1. Buka app di HP
2. App minta: "Connect to 10.51.241.228:8081"
3. GAGAL! Karena tidak ada server di 8081
```

### Cara BENAR (yang harus dilakukan):
```
1. Buka BROWSER di HP (Chrome/Firefox)
2. Ketik: http://10.51.241.228:8000
3. Download APK
4. Install APK
5. BARU buka app (tanpa perlu 8081!)
```

---

## ✅ Solusi

**Tutup app di HP, buka Chrome, ketik:**
```
http://10.51.241.228:8000
```

**Coba sekarang!** 🚀
