# 🐛 Debugging Guide - CPR Point Tidak Muncul

## Langkah-langkah Debugging:

### 1. Check Console Logs di Expo

**Di Terminal Expo:**
- Lihat output: "Starting mock detection..."
- Lihat output: "Initial CPR point: {x: ..., y: ..., confidence: ...}"
- Lihat output: "CPROverlay render: ..."

**Di Expo Go App:**
1. Shake device
2. Pilih "Show Developer Menu"
3. Tap "Debug JS Remotely" atau "Open JS Debugger"
4. Lihat console di browser

### 2. Expected Console Output:

```
Starting mock detection...
Initial CPR point: { x: 0.5, y: 0.42, confidence: 0.85 }
Camera dimensions: 375 667
CPROverlay render: { cprPoint: {...}, width: 375, height: 667 }
Rendering CPR point at: { x: 187.5, y: 280.14, confidence: 0.85 } with color: #00FF00
CPR point updated: { x: 0.5, y: 0.42, confidence: 0.85 }
```

### 3. Troubleshooting Steps:

#### Problem: Console tidak ada output
**Fix:** 
```bash
# Restart Expo
Ctrl+C
npx expo start
# Scan QR lagi
```

#### Problem: "CPR point: null"
**Fix:**
- Check `utils/cprCalculation.js` - pastikan file ada
- Verify mock keypoints format benar

#### Problem: "CPROverlay render" tapi marker tidak terlihat
**Fix:**
- Coba toggle skeleton: Tap tombol "Show Skeleton"
- Marker mungkin di luar screen - check pixel coordinates
- SVG rendering issue - coba restart app

#### Problem: Camera dimensions 0x0
**Fix:**
```javascript
// Fallback dimensions sudah ada: 375x667
// Tapi bisa di-adjust manual
```

### 4. Manual Test CPR Calculation:

Di terminal Expo, tekan **'j'** untuk open debugger, lalu di console browser:

```javascript
// Test calculation
const mockKeypoints = [
  { x: 0.5, y: 0.2, score: 0.9 },  // nose
  // ... (17 keypoints)
];

// Should return: { x: 0.5, y: ~0.42, confidence: 0.85 }
```

### 5. Quick Fix: Force Visible Marker

Jika masih tidak muncul, kita bisa hardcode test marker:

Edit `components/CameraScreen.js`:
```javascript
// Set fixed test point
useEffect(() => {
  setCprPoint({
    x: 0.5,  // Center horizontal
    y: 0.4,  // Center chest area
    confidence: 0.95
  });
}, []);
```

### 6. Check SVG Rendering:

Di `CPROverlay.js`, verify:
- `StyleSheet.absoluteFill` applied
- SVG dimensions match camera
- Circle coordinates within bounds

### 7. Alternative: Simple View Marker

Replace SVG dengan View untuk debugging:

```javascript
<View style={{
  position: 'absolute',
  left: pixelPoint.x - 25,
  top: pixelPoint.y - 25,
  width: 50,
  height: 50,
  borderRadius: 25,
  backgroundColor: 'rgba(255, 255, 0, 0.5)',
  borderWidth: 3,
  borderColor: color
}} />
```

## Expected Result:

Setelah fix, kamu harus lihat:
- ✅ Yellow/Green circle di center screen
- ✅ Crosshair around circle
- ✅ "CPR POINT" label
- ✅ Confidence percentage
- ✅ Status: "CPR DETECTED" di top bar

## Still Not Working?

Share console output atau screenshot error!
