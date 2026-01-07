# 📱 Cara Install APK ke HP Android (Tanpa USB)

**File APK:** `~/Downloads/mobile-cpr-detector.apk` (174 MB)

---

## 🌐 Metode 1: Upload ke Google Drive (PALING MUDAH!) ⭐

### Langkah di Komputer:

1. **Buka Google Drive di browser:**
   ```
   https://drive.google.com
   ```

2. **Upload APK:**
   - Klik tombol "New" / "Baru"
   - Pilih "File upload"
   - Pilih file: `~/Downloads/mobile-cpr-detector.apk`
   - Tunggu upload selesai (~2-5 menit tergantung internet)

3. **Share link (opsional untuk akses mudah):**
   - Klik kanan file APK di Drive
   - Pilih "Get link" / "Dapatkan link"
   - Set "Anyone with the link can view"
   - Copy link

### Langkah di HP Android:

1. **Buka Google Drive app di HP**
   - Atau buka browser: https://drive.google.com

2. **Download APK:**
   - Cari file `mobile-cpr-detector.apk`
   - Tap untuk download
   - Tunggu download selesai

3. **Install:**
   - Buka "Downloads" atau "File Manager"
   - Tap file APK
   - Kalau muncul warning "Install from Unknown Sources":
     * Tap "Settings"
     * Enable "Allow from this source"
     * Kembali dan tap Install
   - Tap "Install" → "Open"

---

## 📧 Metode 2: Email ke Diri Sendiri

### Langkah di Komputer:

1. **Buka Gmail atau email lainnya**

2. **Compose email baru:**
   - To: email kamu sendiri
   - Subject: APK CPR Detector
   - Attach file: `~/Downloads/mobile-cpr-detector.apk`
   - Send

**⚠️ CATATAN:** 
- Gmail limit attachment: 25 MB
- APK kita 174 MB → **TIDAK BISA via Gmail langsung**
- Tapi Gmail akan otomatis upload ke Google Drive
- Kamu akan dapat link Google Drive di email

### Langkah di HP:

1. Buka email di HP
2. Tap link Google Drive
3. Download APK
4. Install seperti metode 1

---

## 🌍 Metode 3: Local Web Server (Transfer via WiFi)

### Langkah di Komputer (Linux):

```bash
# 1. Masuk ke folder Downloads
cd ~/Downloads

# 2. Start simple HTTP server
python3 -m http.server 8000

# Server akan jalan di: http://0.0.0.0:8000
```

**Output yang akan muncul:**
```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

**Jangan tutup terminal ini!**

### Cek IP komputer:

```bash
# Buka terminal baru, jalankan:
hostname -I
```

**Contoh output:** `192.168.1.100` (IP lokal komputer kamu)

### Langkah di HP Android:

**PENTING:** HP dan komputer harus terhubung ke **WiFi yang sama!**

1. **Buka browser di HP (Chrome/Firefox)**

2. **Akses web server komputer:**
   ```
   http://192.168.1.100:8000
   ```
   *(Ganti dengan IP komputer kamu)*

3. **Download APK:**
   - Kamu akan lihat list file
   - Tap `mobile-cpr-detector.apk`
   - Download akan mulai
   - Tunggu selesai

4. **Install:**
   - Buka Downloads
   - Tap APK
   - Install

### Stop server setelah selesai:
```
Tekan Ctrl+C di terminal
```

---

## 💬 Metode 4: WhatsApp / Telegram (Kalau Ukuran Kecil)

**⚠️ TIDAK COCOK untuk APK kita!**

APK kita 174 MB, sedangkan:
- WhatsApp limit: 100 MB
- Telegram limit: 2 GB ✅ (BISA!)

### Via Telegram:

1. **Di Komputer:**
   - Buka Telegram Desktop/Web
   - Chat ke "Saved Messages" (diri sendiri)
   - Upload file `mobile-cpr-detector.apk`
   - Send

2. **Di HP:**
   - Buka Telegram app
   - Masuk ke "Saved Messages"
   - Download APK
   - Install

---

## ☁️ Metode 5: Cloud Storage Lainnya

### Dropbox:
```
1. Upload ke Dropbox di komputer
2. Install Dropbox app di HP (atau buka via browser)
3. Download APK
4. Install
```

### OneDrive (Microsoft):
```
1. Upload ke OneDrive di komputer
2. Buka OneDrive di HP
3. Download APK
4. Install
```

### MEGA / pCloud / dll:
```
Sama seperti Google Drive
```

---

## 🎯 Rekomendasi Berdasarkan Situasi

### ✅ PALING MUDAH & CEPAT:
**→ Google Drive** (Metode 1)
- Kamu pasti punya akun Google
- Tidak perlu install app tambahan
- Bisa akses dari mana saja
- Storage gratis 15 GB

### ✅ TERCEPAT (kalau WiFi sama):
**→ Local Web Server** (Metode 3)
- Transfer langsung via WiFi lokal
- Kecepatan maksimal (tidak tergantung internet)
- Tidak perlu upload ke cloud

### ✅ KALAU PUNYA TELEGRAM:
**→ Telegram Saved Messages** (Metode 4)
- Limit 2 GB (cukup untuk 174 MB)
- Cepat dan mudah
- Bisa download berkali-kali

---

## 📋 Checklist Setelah Download APK di HP

### 1. Enable Install from Unknown Sources
```
Settings → Security → Unknown Sources → ON
atau
Settings → Apps → Special Access → Install Unknown Apps → (pilih browser/file manager) → Allow
```

### 2. Install APK
```
File Manager → Downloads → mobile-cpr-detector.apk → Install
```

### 3. Grant Permissions
```
Saat pertama buka app:
- Camera → Allow
- Storage/Files → Allow
```

### 4. Test Aplikasi
```
- Buka app
- Camera harus muncul (bukan layar hitam)
- Overlay test box kuning harus terlihat
- FPS counter harus jalan
```

---

## 🚀 Quick Start: Google Drive Method

### Di Komputer (Terminal):
```bash
# 1. File sudah ada di Downloads
ls -lh ~/Downloads/mobile-cpr-detector.apk

# 2. Buka Google Drive di browser
xdg-open "https://drive.google.com" 2>/dev/null || echo "Buka manual: https://drive.google.com"

# 3. Upload manual file APK via browser
```

### Di HP:
```
1. Buka Google Drive app atau https://drive.google.com
2. Cari mobile-cpr-detector.apk
3. Tap → Download
4. Install setelah selesai
```

---

## ❓ Troubleshooting

### "Can't install app from unknown sources"
```
Solution:
Settings → Security → Enable "Unknown Sources"
atau cari "Install Unknown Apps" di Settings
```

### "App not installed / Parse error"
```
Kemungkinan:
1. Download corrupt → Download ulang
2. Storage penuh → Hapus file lain (butuh ~200 MB kosong)
3. Android version terlalu lama → Butuh Android 5.0+
```

### "Permission denied"
```
Solution:
Settings → Apps → CPR Detector → Permissions
Enable Camera & Storage
```

---

## 🎯 Pilih Metode Kamu

**Mana yang mau kamu pakai?**

1. ⭐ **Google Drive** (paling mudah)
2. 🌍 **Local WiFi Server** (paling cepat kalau WiFi sama)
3. 💬 **Telegram** (kalau punya akun)
4. 📧 **Email** (via Gmail → auto ke Drive)
5. ☁️ **Cloud lainnya** (Dropbox, OneDrive, etc)

**Kasih tau pilihan kamu, nanti saya bantu step-by-step!** 🚀
