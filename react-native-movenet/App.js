/**
 * App.js - Main Application Component
 * Example implementation untuk MoveNet Pose Detection
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as tf from '@tensorflow/tfjs';
import PoseDetector from './src/models/PoseDetector';
import PoseOverlay from './src/components/PoseOverlay';
import CameraView from './src/components/CameraView';

export default function App() {
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isModelReady, setIsModelReady] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [poseResult, setPoseResult] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('Initializing app...');
      
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Maaf, kami memerlukan izin akses galeri!');
      }

      // Initialize TensorFlow.js
      await tf.ready();
      console.log('TensorFlow.js ready');

      // Initialize pose detector
      // NOTE: Anda perlu convert model .tflite ke format tfjs terlebih dahulu
      // atau load dari assets yang sudah di-convert
      const success = await PoseDetector.initialize();
      
      setIsModelReady(success);
      setIsModelLoading(false);

      if (success) {
        console.log('✓ App initialized successfully!');
      } else {
        console.log('✗ Failed to initialize model');
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      setIsModelLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);
        setPoseResult(null);
        
        // Get image dimensions
        Image.getSize(imageUri, (width, height) => {
          setImageDimensions({ width, height });
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Gagal memilih gambar');
    }
  };

  const openCamera = () => {
    setShowCamera(true);
  };

  const handleCameraClose = () => {
    setShowCamera(false);
  };

  const handlePhotoCapture = (photoUri) => {
    console.log('Photo captured:', photoUri);
    setSelectedImage(photoUri);
    setPoseResult(null);
    setShowCamera(false);
    
    // Get image dimensions
    Image.getSize(photoUri, (width, height) => {
      setImageDimensions({ width, height });
    });
  };

  const detectPose = async () => {
    if (!selectedImage || !isModelReady) {
      alert('Pilih gambar terlebih dahulu atau model belum ready');
      return;
    }

    try {
      setIsDetecting(true);
      console.log('Detecting pose...');

      // Load image sebagai tensor
      const response = await fetch(selectedImage, {}, { isBinary: true });
      const imageData = await response.arrayBuffer();
      const imageTensor = decodeJpeg(new Uint8Array(imageData));

      // Detect pose
      const result = await PoseDetector.detectPose(imageTensor);
      
      setPoseResult(result);
      console.log('Pose detected:', result.stats);

      // Cleanup
      imageTensor.dispose();
    } catch (error) {
      console.error('Error detecting pose:', error);
      alert('Gagal mendeteksi pose: ' + error.message);
    } finally {
      setIsDetecting(false);
    }
  };

  if (isModelLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Loading MoveNet Model...</Text>
      </View>
    );
  }

  // Tampilkan kamera jika showCamera true
  if (showCamera) {
    return (
      <CameraView
        onClose={handleCameraClose}
        onCapture={handlePhotoCapture}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MoveNet Pose Detection</Text>
        <Text style={styles.subtitle}>
          {isModelReady ? '✓ Model Ready' : '✗ Model Not Ready'}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={openCamera}>
          <Text style={styles.buttonText}>📸 Buka Kamera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.galleryButton]} onPress={pickImage}>
          <Text style={styles.buttonText}>�️ Pilih dari Galeri</Text>
        </TouchableOpacity>

        {selectedImage && (
          <TouchableOpacity 
            style={[styles.button, styles.detectButton]} 
            onPress={detectPose}
            disabled={isDetecting || !isModelReady}
          >
            <Text style={styles.buttonText}>
              {isDetecting ? '⏳ Detecting...' : '🔍 Detect Pose'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {selectedImage && (
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: selectedImage }} 
            style={styles.image}
            resizeMode="contain"
          />
          
          {poseResult && (
            <PoseOverlay
              keypoints={poseResult.keypoints}
              imageWidth={imageDimensions.width}
              imageHeight={imageDimensions.height}
              showLabels={false}
            />
          )}
        </View>
      )}

      {poseResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Detection Results:</Text>
          <Text style={styles.resultText}>
            Keypoints Detected: {poseResult.stats.visibleKeypoints} / {poseResult.stats.totalKeypoints}
          </Text>
          <Text style={styles.resultText}>
            Average Confidence: {(poseResult.stats.averageConfidence * 100).toFixed(1)}%
          </Text>
          <Text style={styles.resultText}>
            Quality: {poseResult.stats.detectionQuality.toUpperCase()}
          </Text>

          <View style={styles.keypointsContainer}>
            <Text style={styles.keypointsTitle}>Detected Keypoints:</Text>
            {poseResult.keypoints
              .filter(kp => kp.visible)
              .map((kp, index) => (
                <Text key={index} style={styles.keypointText}>
                  • {kp.name}: {(kp.confidence * 100).toFixed(1)}%
                </Text>
              ))}
          </View>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Model: MoveNet SinglePose Lightning v4
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#0066cc',
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 8,
  },
  buttonContainer: {
    padding: 16,
    gap: 12,
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  galleryButton: {
    backgroundColor: '#6200ea',
  },
  detectButton: {
    backgroundColor: '#00cc66',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 400,
  },
  resultContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  resultText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },
  keypointsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  keypointsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  keypointText: {
    fontSize: 12,
    marginBottom: 4,
    color: '#666',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});
