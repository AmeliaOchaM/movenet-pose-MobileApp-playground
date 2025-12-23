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

# Check if conda is available
echo -e "\n2. Checking for Conda..."
if command -v conda &> /dev/null; then
    echo "✓ Conda found"
    
    # Create conda environment
    echo -e "\n3. Creating Conda environment 'movenet-env'..."
    conda create -n movenet-env python=3.10 -y
    
    if [ $? -ne 0 ]; then
        echo "✗ Failed to create conda environment"
        exit 1
    fi
    
    echo "✓ Conda environment created"
    echo "Activating environment..."
    
    # Activate conda environment
    eval "$(conda shell.bash hook)"
    conda activate movenet-env
    
    echo "✓ Environment activated: movenet-env"
else
    echo "✗ Conda not found. Creating venv instead..."
    python3 -m venv venv
    echo "✓ Virtual environment created"
    source venv/bin/activate
fi

# Install requirements
echo -e "\n4. Installing Python dependencies..."
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "✗ Failed to install dependencies"
    exit 1
fi

echo "✓ Dependencies installed"

# Check model file
echo -e "\n5. Checking model file..."
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
echo -e "\nConda environment: movenet-env"
echo -e "\nTo activate environment:"
echo "  conda activate movenet-env"
echo -e "\nNext steps:"
echo "1. Prepare a test image (person standing/posing)"
echo "2. Run: python simple_test.py"
echo "   or: python test_movenet.py"
echo -e "\nHappy testing! 🚀"
