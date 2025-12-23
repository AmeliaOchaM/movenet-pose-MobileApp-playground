# Model Conversion Guide

## Convert TFLite ke TensorFlow.js untuk React Native

### Mengapa Perlu Convert?

File `4.tflite` adalah TensorFlow Lite model yang **TIDAK bisa langsung** digunakan di React Native/JavaScript. Anda perlu convert ke format TensorFlow.js.

---

## Option 1: Download Pre-Converted Model (RECOMMENDED)

### Langkah-langkah:

1. **Visit TensorFlow Hub:**
   ```
   https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4
   ```

2. **Download model:**
   - Click "Download" button
   - Extract file yang didownload

3. **Copy ke project:**
   ```bash
   cd react-native-movenet
   mkdir -p assets/models
   
   # Copy semua file dari download ke assets/models/
   # File yang dibutuhkan:
   # - model.json
   # - group1-shard1of1.bin (atau file .bin lainnya)
   ```

4. **Update kode di `src/models/MoveNetModel.js`:**
   ```javascript
   // Sesuaikan nama file dengan file yang di-download
   const modelJson = require('../../assets/models/model.json');
   const modelWeights = require('../../assets/models/group1-shard1of1.bin');
   ```

---

## Option 2: Convert Sendiri dari SavedModel

### Prerequisites:

```bash
pip install tensorflowjs
```

### Langkah 1: Download SavedModel

```bash
# Download MoveNet SavedModel dari TF Hub
# Visit: https://tfhub.dev/google/movenet/singlepose/lightning/4

# Atau gunakan tfhub_dev
pip install tensorflow-hub

python -c "
import tensorflow as tf
import tensorflow_hub as hub

# Load and save model
model = hub.load('https://tfhub.dev/google/movenet/singlepose/lightning/4')
tf.saved_model.save(model, './saved_model')
"
```

### Langkah 2: Convert ke TFJS

```bash
tensorflowjs_converter \
    --input_format=tf_saved_model \
    --output_format=tfjs_graph_model \
    --signature_name=serving_default \
    --saved_model_tags=serve \
    ./saved_model \
    ./tfjs_model
```

### Langkah 3: Copy ke Project

```bash
cp -r ./tfjs_model/* ./react-native-movenet/assets/models/
```

---

## Option 3: Menggunakan TFLite Langsung (Advanced)

Jika ingin tetap menggunakan file `.tflite` tanpa convert:

### Install react-native-tensorflow-lite:

```bash
cd react-native-movenet
npm install react-native-tensorflow-lite
npx pod-install  # untuk iOS
```

### Update kode untuk menggunakan TFLite interpreter:

```javascript
import * as tflite from 'react-native-tensorflow-lite';

// Load model
const model = await tflite.loadModel({
  model: require('../assets/4.tflite'),
});

// Run inference
const output = await model.run(inputData);
```

**⚠️ Note:** Package ini masih dalam development dan mungkin memiliki compatibility issues.

---

## Verification

### Setelah Convert, Verify Files:

```bash
cd react-native-movenet/assets/models
ls -la

# Expected output:
# model.json
# group1-shard1of1.bin (atau file .bin lainnya)
```

### Check model.json structure:

```bash
cat model.json | head -20

# Should contain:
# - format: "graph-model"
# - modelTopology: {...}
# - weightsManifest: [...]
```

---

## Troubleshooting

### Error: "Model format not supported"

**Solution:** Pastikan menggunakan `--output_format=tfjs_graph_model`, bukan `tfjs_layers_model`.

### Error: "Cannot find weight files"

**Solution:** 
- Check `model.json` → `weightsManifest` → `paths`
- Pastikan file .bin ada di folder yang sama dengan model.json
- Update require() path di kode

### Error: "Input shape mismatch"

**Solution:**
- TFLite model expects uint8 [1, 192, 192, 3]
- TFJS model might expect float32
- Check model.json untuk input requirements

---

## Quick Test Script

```javascript
// test_model.js
const tf = require('@tensorflow/tfjs-node');

async function testModel() {
  // Load model
  const model = await tf.loadGraphModel('file://./tfjs_model/model.json');
  
  // Create dummy input
  const input = tf.randomUniform([1, 192, 192, 3], 0, 255, 'int32');
  
  // Run inference
  const output = model.predict(input);
  
  console.log('Input shape:', input.shape);
  console.log('Output shape:', output.shape);
  
  // Should output: [1, 1, 17, 3]
}

testModel();
```

Run:
```bash
node test_model.js
```

---

## Model Size Comparison

| Format | Size | Platform |
|--------|------|----------|
| SavedModel | ~15 MB | TensorFlow/Python |
| TFLite (float16) | ~3 MB | Mobile (Android/iOS native) |
| TFJS (float16) | ~6 MB | JavaScript/React Native |

---

## Alternative: Use TensorFlow Lite Micro

Untuk embedded systems atau performance critical apps:

```bash
# Install TFLite Micro for React Native
npm install @tensorflow/tfjs-tflite
```

Check documentation: https://github.com/tensorflow/tfjs/tree/master/tfjs-tflite

---

## Resources

- TF Hub TFJS Models: https://tfhub.dev/s?deployment-format=tfjs
- TensorFlow.js Converter: https://github.com/tensorflow/tfjs/tree/master/tfjs-converter
- MoveNet Documentation: https://blog.tensorflow.org/2021/05/next-generation-pose-detection-with-movenet-and-tensorflowjs.html

---

**Recommended Path for Beginners:**

1. ✅ Download pre-converted TFJS model from TF Hub
2. ✅ Copy to assets/models/
3. ✅ Update require() paths in code
4. ✅ Test on device

**For Advanced Users:**

1. Convert dari SavedModel
2. Optimize dengan quantization
3. Custom post-processing
4. Performance tuning

---

Need help? Check main README.md or create an issue!
