import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import CPROverlay from './CPROverlay';
import { calculateCPRPoint } from '../utils/cprCalculation';

// Mock keypoints for demo (akan diganti dengan real detection nanti)
const generateMockKeypoints = () => {
  // Generate random keypoints untuk demo
  return [
    { x: 0.5, y: 0.2, score: 0.9 },  // nose
    { x: 0.48, y: 0.18, score: 0.8 }, // left eye
    { x: 0.52, y: 0.18, score: 0.8 }, // right eye
    { x: 0.46, y: 0.2, score: 0.7 },  // left ear
    { x: 0.54, y: 0.2, score: 0.7 },  // right ear
    { x: 0.42, y: 0.35, score: 0.85 }, // left shoulder
    { x: 0.58, y: 0.35, score: 0.85 }, // right shoulder
    { x: 0.38, y: 0.5, score: 0.75 },  // left elbow
    { x: 0.62, y: 0.5, score: 0.75 },  // right elbow
    { x: 0.36, y: 0.65, score: 0.7 },  // left wrist
    { x: 0.64, y: 0.65, score: 0.7 },  // right wrist
    { x: 0.44, y: 0.55, score: 0.85 }, // left hip
    { x: 0.56, y: 0.55, score: 0.85 }, // right hip
    { x: 0.42, y: 0.75, score: 0.75 }, // left knee
    { x: 0.58, y: 0.75, score: 0.75 }, // right knee
    { x: 0.4, y: 0.9, score: 0.7 },   // left ankle
    { x: 0.6, y: 0.9, score: 0.7 }    // right ankle
  ];
};

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cprPoint, setCprPoint] = useState(null);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [keypoints, setKeypoints] = useState([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [cameraDimensions, setCameraDimensions] = useState({ width: 375, height: 667 });
  
  // Simulate detection for demo
  useEffect(() => {
    if (permission?.granted) {
      console.log('Starting mock detection...');
      
      // Set initial CPR point immediately
      const initialKeypoints = generateMockKeypoints();
      setKeypoints(initialKeypoints);
      const initialCpr = calculateCPRPoint(initialKeypoints);
      setCprPoint(initialCpr);
      setIsDetecting(true);
      console.log('Initial CPR point:', initialCpr);
      
      // Simulate pose detection every 500ms
      const interval = setInterval(() => {
        const mockKeypoints = generateMockKeypoints();
        setKeypoints(mockKeypoints);
        
        // Calculate CPR point from mock keypoints
        const cpr = calculateCPRPoint(mockKeypoints);
        setCprPoint(cpr);
        setIsDetecting(true);
        console.log('CPR point updated:', cpr);
      }, 500);

      return () => {
        console.log('Stopping mock detection');
        clearInterval(interval);
      };
    }
  }, [permission]);

  // Camera not ready states
  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#00ff00" />
        <Text style={styles.loadingText}>Checking camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>📷 Camera Permission Required</Text>
        <Text style={styles.helpText}>We need camera access to detect CPR point</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera View */}
      <CameraView
        style={styles.camera}
        facing="front"
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          setCameraDimensions({ width, height });
          console.log('Camera dimensions:', width, height);
        }}
      >
        {/* CPR Point Overlay */}
        <CPROverlay
          cprPoint={cprPoint}
          dimensions={cameraDimensions}
          showSkeleton={showSkeleton}
          keypoints={keypoints}
        />

        {/* Top Info Bar */}
        <View style={styles.topBar}>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>🤖 Demo Mode (Mock Detection)</Text>
            {cprPoint ? (
              <View style={styles.statusContainer}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>CPR DETECTED</Text>
              </View>
            ) : (
              <Text style={styles.waitingText}>⚠ Starting...</Text>
            )}
          </View>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowSkeleton(!showSkeleton)}
          >
            <Text style={styles.buttonText}>
              {showSkeleton ? '👁 Hide Skeleton' : '👁 Show Skeleton'}
            </Text>
          </TouchableOpacity>

          {cprPoint && (
            <View style={styles.confidenceBox}>
              <Text style={styles.confidenceText}>
                Confidence: {(cprPoint.confidence * 100).toFixed(0)}%
              </Text>
            </View>
          )}
        </View>

        {/* Instructions Overlay */}
        <View style={styles.instructionsBox}>
          <Text style={styles.instructionTitle}>📱 DEMO MODE - UI Preview</Text>
          <Text style={styles.instructionText}>✓ Camera: Active</Text>
          <Text style={styles.instructionText}>✓ CPR Calculation: Working</Text>
          <Text style={styles.instructionText}>⚠ Detection: Simulated (Mock Data)</Text>
          <Text style={styles.instructionNote}>
            ⚠️ This is a UI demo with mock pose detection.
          </Text>
          <Text style={styles.instructionNote}>
            For real detection, use native TFLite model (4.tflite).
          </Text>
          <Text style={styles.instructionNote}>
            TensorFlow.js pose-detection tidak kompatibel dengan Expo.
          </Text>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  camera: {
    flex: 1,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
    fontWeight: 'bold',
  },
  helpText: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  permissionButton: {
    backgroundColor: '#00ff00',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  permissionButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoText: {
    color: '#00ff00',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00ff00',
    marginRight: 8,
  },
  statusText: {
    color: '#00ff00',
    fontSize: 14,
    fontWeight: 'bold',
  },
  waitingText: {
    color: '#ff9900',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  confidenceBox: {
    backgroundColor: 'rgba(0, 255, 0, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#00ff00',
  },
  confidenceText: {
    color: '#00ff00',
    fontSize: 14,
    fontWeight: 'bold',
  },
  instructionsBox: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#00ff00',
  },
  instructionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  instructionText: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 4,
  },
  instructionNote: {
    color: '#ff9900',
    fontSize: 10,
    marginTop: 8,
    fontStyle: 'italic',
  },
});
