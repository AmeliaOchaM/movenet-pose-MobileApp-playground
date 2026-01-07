#!/usr/bin/env python3
"""
Script untuk convert TFLite model ke TensorFlow.js format
Requirement: tensorflowjs, tensorflow
"""

import os
import sys
import subprocess

def check_dependencies():
    """Check if required packages are installed"""
    try:
        import tensorflowjs
        import tensorflow as tf
        print("✓ Dependencies found")
        return True
    except ImportError as e:
        print("❌ Missing dependencies!")
        print("Please install:")
        print("  pip install tensorflowjs tensorflow")
        return False

def convert_tflite_to_tfjs(tflite_path, output_dir):
    """
    Convert TFLite model to TensorFlow.js format
    
    Args:
        tflite_path: Path to .tflite file
        output_dir: Output directory for TFJS model
    """
    if not os.path.exists(tflite_path):
        print(f"❌ TFLite file not found: {tflite_path}")
        return False
    
    print(f"Converting {tflite_path} to TensorFlow.js format...")
    print(f"Output directory: {output_dir}")
    
    try:
        # Create output directory if not exists
        os.makedirs(output_dir, exist_ok=True)
        
        # Convert using tensorflowjs_converter
        cmd = [
            'tensorflowjs_converter',
            '--input_format=tf_frozen_model',
            '--output_format=tfjs_graph_model',
            '--signature_name=serving_default',
            '--saved_model_tags=serve',
            tflite_path,
            output_dir
        ]
        
        # Alternative: Direct conversion from TFLite
        # Note: TFLite to TFJS conversion might need intermediate steps
        import tensorflowjs as tfjs
        import tensorflow as tf
        
        print("Loading TFLite model...")
        interpreter = tf.lite.Interpreter(model_path=tflite_path)
        interpreter.allocate_tensors()
        
        # Get input and output details
        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()
        
        print("Model Input Details:")
        for detail in input_details:
            print(f"  - Shape: {detail['shape']}, Type: {detail['dtype']}")
        
        print("Model Output Details:")
        for detail in output_details:
            print(f"  - Shape: {detail['shape']}, Type: {detail['dtype']}")
        
        print("\n⚠️ Direct TFLite to TFJS conversion is complex!")
        print("Recommended approach:")
        print("1. Convert TFLite back to SavedModel format")
        print("2. Then convert SavedModel to TFJS format")
        print("\nAlternatively, use the original SavedModel if available:")
        print("  tensorflowjs_converter \\")
        print("    --input_format=tf_saved_model \\")
        print("    --output_format=tfjs_graph_model \\")
        print("    /path/to/saved_model \\")
        print("    /path/to/output/tfjs")
        
        return True
        
    except Exception as e:
        print(f"❌ Conversion failed: {e}")
        print("\nTroubleshooting:")
        print("1. Make sure tensorflowjs is installed: pip install tensorflowjs")
        print("2. You may need the original SavedModel instead of TFLite")
        print("3. Download pre-converted TFJS model from TensorFlow Hub")
        return False

def download_tfjs_model():
    """Download pre-converted TFJS MoveNet model"""
    print("\n📥 Downloading pre-converted MoveNet TFJS model...")
    print("MoveNet SinglePose Lightning TFJS:")
    print("https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4")
    print("\nSteps:")
    print("1. Go to the URL above")
    print("2. Click 'Download' button")
    print("3. Extract the downloaded .tar.gz file")
    print("4. Copy model.json and group1-shard*.bin to:")
    print("   react-native-movenet/assets/models/")

if __name__ == "__main__":
    print("=" * 60)
    print("TFLite to TensorFlow.js Converter")
    print("=" * 60)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Default paths
    tflite_path = "../../../4.tflite"
    output_dir = "../assets/models/tfjs"
    
    # Allow custom paths from command line
    if len(sys.argv) > 1:
        tflite_path = sys.argv[1]
    if len(sys.argv) > 2:
        output_dir = sys.argv[2]
    
    # Try conversion
    success = convert_tflite_to_tfjs(tflite_path, output_dir)
    
    if not success:
        print("\n" + "=" * 60)
        download_tfjs_model()
        print("=" * 60)
