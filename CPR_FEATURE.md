# 🚑 CPR Point Detection - Quick Guide

## ✨ Fitur Baru!

Script `test_movenet.py` sekarang **otomatis mendeteksi titik kompresi CPR (RJP)** dari pose detection!

---

## 🎯 Output

### Console Output
```
============================================================
TITIK KOMPRESI CPR (RJP)
============================================================
Posisi (normalized):
  X: 0.5123
  Y: 0.4567
Confidence: 0.8945

Catatan:
- Titik berada di tengah dada (setengah bawah sternum)
- Estimasi: 40-45% jarak dari bahu ke pinggul
- Untuk edukasi dan simulasi CPR
============================================================
```

### Visual Output
- ⭕ **Lingkaran merah** (marker)
- 🟡 **Lingkaran kuning** (filled)
- ➕ **Crosshair** (panduan)
- 📝 **Label** "CPR POINT" + confidence

---

## 🧮 Cara Kerja

Menggunakan **4 keypoints**:
1. Left Shoulder (5)
2. Right Shoulder (6)
3. Left Hip (11)
4. Right Hip (12)

**Formula:**
1. Hitung titik tengah bahu
2. Hitung titik tengah pinggul
3. Titik CPR = 42% dari bahu ke pinggul

Detail: Lihat [CPR_CALCULATION.md](CPR_CALCULATION.md)

---

## 🚀 Cara Menggunakan

### Method 1: Test Script
```bash
python test_movenet.py
# Input path gambar
# Otomatis menampilkan titik CPR
```

### Method 2: Programmatic
```python
from test_movenet import MoveNetDetector

detector = MoveNetDetector('4.tflite')
keypoints, image = detector.detect('image.jpg')

# Calculate CPR point
cpr_point = detector.calculate_cpr_point(keypoints)

if cpr_point:
    y, x = cpr_point['position']  # normalized (0-1)
    confidence = cpr_point['confidence']
    
    # Convert to pixels
    x_px = int(x * image_width)
    y_px = int(y * image_height)
    
    print(f"CPR at ({x_px}, {y_px}), conf: {confidence}")
```

### Method 3: Draw on Image
```python
# With CPR point (default)
result = detector.draw_keypoints(image, keypoints, show_cpr=True)

# Without CPR point
result = detector.draw_keypoints(image, keypoints, show_cpr=False)
```

---

## ✅ Requirements

Untuk menghitung titik CPR, **semua 4 keypoints** harus terdeteksi dengan confidence > 0.3:
- ✓ Left Shoulder
- ✓ Right Shoulder
- ✓ Left Hip
- ✓ Right Hip

Jika salah satu missing → CPR point **tidak dihitung**

---

## 📊 Interpretasi Confidence

| Confidence | Quality | Keterangan |
|------------|---------|------------|
| > 0.8 | Excellent | Sangat akurat |
| 0.6 - 0.8 | Good | Cukup akurat |
| 0.3 - 0.6 | Fair | Gunakan dengan hati-hati |
| < 0.3 | Poor | Tidak dihitung |

---

## 🎯 Aplikasi

1. **Edukasi CPR** 
   - Panduan lokasi kompresi
   - Training visualization

2. **Simulasi AR/VR**
   - CPR training apps
   - Virtual instructor

3. **Quality Assessment**
   - Evaluasi posisi tangan saat CPR
   - Feedback real-time

4. **Penelitian AI**
   - Dataset untuk ML CPR
   - Automated assessment

---

## ⚠️ PENTING

> **DISCLAIMER:**
> 
> Ini adalah **alat edukasi**, BUKAN untuk:
> - ❌ CPR darurat nyata
> - ❌ Diagnosis medis
> - ❌ Menggantikan pelatihan CPR resmi
> 
> Untuk CPR yang benar, ikuti **panduan medis resmi**!

---

## 📖 Dokumentasi Lengkap

- **Formula & Validasi:** [CPR_CALCULATION.md](CPR_CALCULATION.md)
- **Main Documentation:** [README.md](README.md)
- **Quick Start:** [QUICKSTART.md](QUICKSTART.md)

---

## 🔧 Troubleshooting

### "Tidak dapat menghitung titik CPR"
→ Pastikan pose **frontal** dan **full body visible**

### Titik CPR tidak akurat
→ Check confidence score (harus > 0.6 untuk hasil baik)

### Titik CPR tidak muncul di gambar
→ Set `show_cpr=True` di `draw_keypoints()`

---

**Happy Training! 🚀**

*Untuk bantuan, lihat dokumentasi atau buat issue di GitHub.*
