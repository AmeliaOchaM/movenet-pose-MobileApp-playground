# Perhitungan Titik Kompresi CPR (RJP) dari Keypoints MoveNet

Karena MoveNet tidak menyediakan titik sternum secara langsung, lokasi kompresi CPR diestimasi secara geometris menggunakan posisi bahu dan pinggul.

## Keypoints yang Digunakan
- **Left Shoulder (LS)** - Index 5
- **Right Shoulder (RS)** - Index 6
- **Left Hip (LH)** - Index 11
- **Right Hip (RH)** - Index 12

Semua koordinat berada dalam bentuk **normalized (0–1)**.

---

## Formula Perhitungan

### 1. Titik Tengah Bahu
Menentukan garis atas dada.

$$
X_s = \frac{X_{LS} + X_{RS}}{2}
$$

$$
Y_s = \frac{Y_{LS} + Y_{RS}}{2}
$$

---

### 2. Titik Tengah Pinggul
Menentukan garis bawah torso.

$$
X_h = \frac{X_{LH} + X_{RH}}{2}
$$

$$
Y_h = \frac{Y_{LH} + Y_{RH}}{2}
$$

---

### 3. Estimasi Titik CPR
Titik CPR berada di **40–45% jarak dari bahu ke pinggul**  
(digunakan konstanta α = 0.42).

$$
X_{CPR} = X_s + \alpha (X_h - X_s)
$$

$$
Y_{CPR} = Y_s + \alpha (Y_h - Y_s)
$$

Dimana: **α = 0.42** (42% dari jarak bahu ke pinggul)

---

### 4. Konversi ke Koordinat Piksel
Koordinat $(X_{CPR}, Y_{CPR})$ merupakan **perkiraan lokasi kompresi CPR (tengah dada, setengah bawah sternum)** dan dapat dikonversi ke koordinat piksel:

$$
X_{pixel} = X_{CPR} \times \text{image\_width}
$$

$$
Y_{pixel} = Y_{CPR} \times \text{image\_height}
$$

---

## Implementasi Python

```python
def calculate_cpr_point(keypoints):
    """
    Hitung titik CPR dari keypoints MoveNet
    
    Args:
        keypoints: Array [17, 3] dari MoveNet output
    
    Returns:
        (y_cpr, x_cpr): Normalized coordinates
    """
    # Ekstrak keypoints
    left_shoulder = keypoints[5]   # [y, x, confidence]
    right_shoulder = keypoints[6]
    left_hip = keypoints[11]
    right_hip = keypoints[12]
    
    # 1. Titik tengah bahu
    x_s = (left_shoulder[1] + right_shoulder[1]) / 2
    y_s = (left_shoulder[0] + right_shoulder[0]) / 2
    
    # 2. Titik tengah pinggul
    x_h = (left_hip[1] + right_hip[1]) / 2
    y_h = (left_hip[0] + right_hip[0]) / 2
    
    # 3. Estimasi titik CPR (α = 0.42)
    alpha = 0.42
    x_cpr = x_s + alpha * (x_h - x_s)
    y_cpr = y_s + alpha * (y_h - y_s)
    
    return (y_cpr, x_cpr)
```

---

## Visualisasi

Titik CPR ditampilkan dengan:
- ⭕ **Lingkaran merah** (outer)
- 🟡 **Lingkaran kuning** (inner, filled)
- ⚪ **Titik putih** (center)
- ➕ **Crosshair kuning** (panduan)
- 📝 **Label** "CPR POINT" dengan confidence score

---

## Validasi

### Confidence Score
Titik CPR hanya dihitung jika **semua 4 keypoints** (bahu kiri, bahu kanan, pinggul kiri, pinggul kanan) memiliki confidence > threshold (default: 0.3).

Confidence akhir adalah **rata-rata** dari 4 keypoints:

$$
\text{Confidence}_{CPR} = \frac{C_{LS} + C_{RS} + C_{LH} + C_{RH}}{4}
$$

---

## Akurasi dan Keterbatasan

### ✅ Kelebihan
- Tidak memerlukan keypoint sternum
- Bekerja dengan pose frontal dan slight angle
- Estimasi geometris yang konsisten
- Cocok untuk edukasi CPR

### ⚠️ Keterbatasan
- **Bukan diagnosis medis** - hanya estimasi visual
- Akurasi tergantung pada:
  - Pose tubuh (frontal lebih baik)
  - Kualitas deteksi keypoints
  - Jarak kamera
- Tidak memperhitungkan variasi anatomis individu

---

## Penggunaan

### Dalam Testing Script

```bash
python test_movenet.py
# Masukkan path ke gambar
# Output akan menampilkan titik CPR di console dan visualisasi
```

### Output Console

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

---

## Referensi Medis

Menurut panduan CPR:
- **Lokasi kompresi:** Tengah dada, setengah bawah sternum
- **Pada orang dewasa:** Sekitar 2 jari di atas xiphoid process
- **Secara visual:** Pertengahan antara puting susu (untuk referensi)

**Estimasi α = 0.42** dipilih berdasarkan:
- Sternum berada di upper 40-45% torso
- Validasi visual pada berbagai pose

---

## Aplikasi

1. **Edukasi CPR** - Panduan lokasi kompresi
2. **Simulasi Training** - AR/VR CPR training
3. **Penelitian AI** - Dataset untuk ML CPR detection
4. **Quality Assessment** - Evaluasi posisi tangan saat CPR

---

## Catatan Penting

> ⚠️ **DISCLAIMER**
> 
> Estimasi ini adalah **alat edukasi dan penelitian**, BUKAN untuk:
> - Diagnosis medis
> - Panduan CPR darurat nyata
> - Menggantikan pelatihan CPR resmi
> 
> Untuk CPR yang benar, ikuti **panduan medis resmi** dan **pelatihan bersertifikat**.

---

## Update Log

- **v1.0** (2024-12-24): Initial implementation dengan α = 0.42
- Formula validasi: Berdasarkan anatomi sternum dan guideline CPR

---

**Author:** MoveNet CPR Detection System  
**License:** Educational & Research Use  
**Contact:** See main README.md
