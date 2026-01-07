#!/bin/bash
#
# Download MoveNet TFJS Model
# Script untuk download model TFJS dari TensorFlow Hub
#

set -e

MODELS_DIR="./assets/models"
MODEL_URL="https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4?tfjs-format=file"
MODEL_FILE="movenet_tfjs.tar.gz"

echo "========================================="
echo "MoveNet TFJS Model Downloader"
echo "========================================="
echo ""

# Create models directory
echo "📁 Creating models directory..."
mkdir -p "$MODELS_DIR"

# Change to models directory
cd "$MODELS_DIR"

echo "📥 Downloading MoveNet TFJS model..."
echo "URL: $MODEL_URL"
echo ""

# Download model
if command -v wget &> /dev/null; then
    echo "Using wget..."
    wget "$MODEL_URL" -O "$MODEL_FILE"
elif command -v curl &> /dev/null; then
    echo "Using curl..."
    curl -L "$MODEL_URL" -o "$MODEL_FILE"
else
    echo "❌ Error: Neither wget nor curl found!"
    echo "Please install wget or curl, or download manually from:"
    echo "$MODEL_URL"
    exit 1
fi

echo ""
echo "📦 Extracting model files..."
tar -xzf "$MODEL_FILE"

echo ""
echo "🗑️  Cleaning up..."
rm "$MODEL_FILE"

echo ""
echo "✅ Model downloaded successfully!"
echo ""
echo "📂 Files in $MODELS_DIR:"
ls -lh

echo ""
echo "========================================="
echo "✓ Setup Complete!"
echo "========================================="
echo ""
echo "Model files:"
echo "  - model.json (model configuration)"
echo "  - group1-shard*.bin (model weights)"
echo ""
echo "Next steps:"
echo "1. Update src/models/MoveNetModel.js to load real model"
echo "2. Reload app in Expo Go"
echo "3. Test pose detection!"
echo ""
