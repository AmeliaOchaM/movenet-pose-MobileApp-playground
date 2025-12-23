# 🎯 CPR-Only Detection Mode

## Mode Tampilan

Script `test_movenet.py` mendukung 2 mode visualisasi:

### 1. **CPR-Only Mode** (Default) ⭐
Hanya menampilkan **titik CPR**, tanpa keypoints lainnya.

```python
result = detector.draw_keypoints(image, keypoints, 
                                 show_cpr=True,           # Tampilkan CPR
                                 show_all_keypoints=False) # Sembunyikan keypoints
```

**Output:**
- ✅ Gambar original
- ✅ **Hanya titik CPR** (marker kuning + crosshair)
- ❌ Tidak ada skeleton
- ❌ Tidak ada 17 keypoints lainnya

---

### 2. **Full Detection Mode**
Menampilkan **semua keypoints + skeleton + CPR point**.

```python
result = detector.draw_keypoints(image, keypoints, 
                                 show_cpr=True,          # Tampilkan CPR
                                 show_all_keypoints=True) # Tampilkan semua
```

**Output:**
- ✅ Semua 17 keypoints
- ✅ Skeleton (garis hijau)
- ✅ Titik CPR

---

## 🚀 Cara Menggunakan

### Default (CPR Only)
```bash
python test_movenet.py
# Input: gambar
# Output: gambar + HANYA titik CPR
```

### Jika Ingin Semua Keypoints
Edit `test_movenet.py` line ~380:

```python
# Dari:
result_image = detector.draw_keypoints(original_image, keypoints_with_scores, 
                                       show_cpr=True, show_all_keypoints=False)

# Menjadi:
result_image = detector.draw_keypoints(original_image, keypoints_with_scores, 
                                       show_cpr=True, show_all_keypoints=True)
```

---

## 📊 Visualisasi CPR Point

### Marker CPR:
- 🔴 **Lingkaran merah** (outer, radius 15px)
- 🟡 **Lingkaran kuning** (inner, radius 10px, filled)
- ⚪ **Dot putih** (center, radius 3px)
- ➕ **Crosshair kuning** (20px horizontal & vertical)

### Label:
- **"CPR POINT: 0.89"** (confidence score)
- **"Titik Kompresi RJP"** (subtitle)

---

## 🎯 Keuntungan CPR-Only Mode

### ✅ Untuk Edukasi
- Fokus pada titik kompresi
- Tidak membingungkan dengan banyak titik
- Lebih jelas untuk pembelajaran

### ✅ Untuk Aplikasi
- UI lebih bersih
- Performa lebih baik (less drawing)
- User experience lebih baik

### ✅ Untuk Dokumentasi
- Hasil lebih professional
- Fokus pada tujuan (CPR training)
- Mudah dipahami non-teknis

---

## 🔧 Advanced Usage

### Programmatic Control

```python
from test_movenet import MoveNetDetector

detector = MoveNetDetector('4.tflite')
keypoints, image = detector.detect('image.jpg')

# Mode 1: CPR only
cpr_only = detector.draw_keypoints(image, keypoints, 
                                    show_cpr=True, 
                                    show_all_keypoints=False)

# Mode 2: Full detection
full_detection = detector.draw_keypoints(image, keypoints, 
                                         show_cpr=True, 
                                         show_all_keypoints=True)

# Mode 3: Keypoints only (no CPR)
keypoints_only = detector.draw_keypoints(image, keypoints, 
                                         show_cpr=False, 
                                         show_all_keypoints=True)

# Mode 4: Original image (no overlay)
original = detector.draw_keypoints(image, keypoints, 
                                   show_cpr=False, 
                                   show_all_keypoints=False)
```

---

## 📋 Parameter Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `show_cpr` | bool | `True` | Tampilkan titik CPR |
| `show_all_keypoints` | bool | `False` | Tampilkan semua 17 keypoints |
| `confidence_threshold` | float | `0.3` | Min confidence untuk detection |

---

## 💡 Use Cases

### 1. Training CPR
```python
# Hanya tampilkan CPR point untuk instruksi
show_cpr=True, show_all_keypoints=False
```

### 2. Full Body Analysis
```python
# Tampilkan semua untuk analisis pose
show_cpr=True, show_all_keypoints=True
```

### 3. Research/Development
```python
# Flexible sesuai kebutuhan
show_cpr=True/False, show_all_keypoints=True/False
```

---

## 📸 Example Output

### CPR-Only Mode:
```
[Original Image] | [Image + CPR Point Only]
     foto            foto + 🎯 (1 titik kuning)
```

### Full Mode:
```
[Original Image] | [Image + All Keypoints + CPR]
     foto            foto + 17 titik + skeleton + 🎯
```

---

## ⚙️ Default Settings

**Current default:** CPR-Only Mode

Kenapa?
- ✅ Lebih sesuai untuk aplikasi CPR training
- ✅ UI lebih clean
- ✅ Fokus pada tujuan utama

Jika butuh full detection → Edit parameter `show_all_keypoints=True`

---

## 🎓 Recommendations

| Scenario | show_cpr | show_all_keypoints |
|----------|----------|-------------------|
| **CPR Training** | ✅ True | ❌ False |
| **Pose Analysis** | ❌ False | ✅ True |
| **Full Demo** | ✅ True | ✅ True |
| **Benchmark** | ❌ False | ❌ False |

---

**Mode default sekarang: CPR-Only untuk fokus pada aplikasi RJP! 🚑**
