#!/bin/bash

# Setup script untuk testing MoveNet model
# Usage: bash setup.sh

echo "=========================================="
echo "MoveNet Setup Script"
echo "=========================================="

# Check Python version
echo -e "\n1. Checking Python version..."
python3 --version

if [ $? -ne 0 ]; then
    echo "✗ Python 3 not found! Please install Python 3.8+"
    exit 1
fi

echo "✓ Python 3 found"

# Create virtual environment (optional)
echo -e "\n2. Creating virtual environment (recommended)..."
read -p "Create virtual environment? (y/n): " create_venv

if [ "$create_venv" = "y" ]; then
    python3 -m venv venv
    echo "✓ Virtual environment created"
    echo "Activate it with: source venv/bin/activate"
    source venv/bin/activate
fi

# Install requirements
echo -e "\n3. Installing Python dependencies..."
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "✗ Failed to install dependencies"
    exit 1
fi

echo "✓ Dependencies installed"

# Check model file
echo -e "\n4. Checking model file..."
if [ -f "4.tflite" ]; then
    echo "✓ Model file found: 4.tflite"
else
    echo "✗ Model file not found: 4.tflite"
    echo "Please download the model and place it in this directory"
    exit 1
fi

# Done
echo -e "\n=========================================="
echo "✓ Setup complete!"
echo "=========================================="
echo -e "\nNext steps:"
echo "1. Prepare a test image (person standing/posing)"
echo "2. Run: python simple_test.py"
echo "   or: python test_movenet.py"
echo -e "\nHappy testing! 🚀"
