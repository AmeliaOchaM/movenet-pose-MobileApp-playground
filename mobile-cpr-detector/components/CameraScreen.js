import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Platform, Alert, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import CPROverlay from './CPROverlay';
import { calculateCPRPoint } from '../utils/cprCalculation';
import MoveNetDetector from '../services/MoveNetTFLiteDetector';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [tfReady, setTfReady] = useState(false);
  const [detector, setDetector] = useState(null);
  const [cprPoint, setCprPoint] = useState(null);
  const [fps, setFps] = useState(0);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [keypoints, setKeypoints] = useState([]);
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  });
  const [facing, setFacing] = useState('front');
  
  const frameCount = useRef(0);
  const lastTime = useRef(Date.now());
  const cameraRef = useRef(null);
  const processingRef = useRef(false);
  const detectorRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  
  // Update dimensions on orientation change
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height
      });
      console.log('[CameraScreen] Dimensions updated:', window.width, 'x', window.height);
    });

    return () => subscription?.remove();
  }, []);
  
  // Initialize MoveNet detector
  useEffect(() => {
    (async () => {
      try {
        console.log('[CameraScreen] Initializing MoveNet detector...');
        
        const detector = new MoveNetDetector();
        await detector.initialize();
        
        detectorRef.current = detector;
        setTfReady(true);
        
        console.log('[CameraScreen] MoveNet detector ready!');
        
        // Start detection loop
        startDetectionLoop();
        
      } catch (error) {
        console.error('[CameraScreen] Error initializing detector:', error);
        Alert.alert(
          'Initialization Error',
          'Failed to load pose detection model. Using demo mode.',
          [{ text: 'OK' }]
        );
        // Still set ready for camera to work
        setTfReady(true);
      }
    })();

    return () => {
      // Cleanup
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
      if (detectorRef.current) {
        detectorRef.current.dispose();
      }
    };
  }, []);

  // Detection loop - runs every 200ms (5 FPS)
  const startDetectionLoop = () => {
    // Clear existing interval if any
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }

    console.log('[CameraScreen] Starting detection loop...');
    
    detectionIntervalRef.current = setInterval(async () => {
      if (!detectorRef.current || processingRef.current) {
        return;
      }

      try {
        processingRef.current = true;

        // Detect pose (currently using mock keypoints)
        const keypoints = await detectorRef.current.detectPose(null);

        if (keypoints) {
          setKeypoints(keypoints);
          
          // Calculate CPR point
          const cpr = detectorRef.current.calculateCPRPoint(keypoints);
          setCprPoint(cpr);
          
          // Log first detection for debugging
          if (frameCount.current === 0) {
            console.log('[CameraScreen] First detection:', {
              keypointsCount: keypoints.length,
              cprPoint: cpr
            });
          }
        } else {
          setCprPoint(null);
          setKeypoints([]);
        }

        // Update FPS
        frameCount.current += 1;
        const now = Date.now();
        const elapsed = (now - lastTime.current) / 1000;
        
        if (elapsed >= 1.0) {
          const currentFps = Math.round(frameCount.current / elapsed);
          setFps(currentFps);
          console.log('[CameraScreen] FPS:', currentFps);
          frameCount.current = 0;
          lastTime.current = now;
        }
      } catch (error) {
        console.error('[CameraScreen] Detection error:', error);
      } finally {
        processingRef.current = false;
      }
    }, 200); // 5 FPS
  };

  // Camera not ready states
  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#00ff00" />
        <Text style={styles.loadingText}>Checking permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>❌ Camera permission required</Text>
        <Text style={styles.helpText}>This app needs camera access to detect CPR points</Text>
        <TouchableOpacity 
          style={styles.permissionButton} 
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!tfReady) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#00ff00" />
        <Text style={styles.loadingText}>Loading AI Model...</Text>
        <Text style={styles.helpText}>Initializing MoveNet Pose Detection</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera View - NO CHILDREN ALLOWED! */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
      />

      {/* ALL OVERLAYS MOVED OUTSIDE - Using absolute positioning */}
      
      {/* CPR Point Overlay */}
      <CPROverlay
        cprPoint={cprPoint}
        dimensions={dimensions}
        showSkeleton={showSkeleton}
        keypoints={keypoints}
      />

      {/* Top Info Bar */}
      <View style={styles.topBar}>
        <View style={styles.infoContainer}>
          <Text style={styles.fpsText}>FPS: {fps}</Text>
          {cprPoint ? (
            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>CPR DETECTED</Text>
            </View>
          ) : (
            <Text style={styles.waitingText}>⚠ Waiting for pose...</Text>
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
        <Text style={styles.instructionTitle}>📱 POSITIONING TIPS:</Text>
        <Text style={styles.instructionText}>• Face the camera (frontal view)</Text>
        <Text style={styles.instructionText}>• Show upper body (head to waist)</Text>
        <Text style={styles.instructionText}>• Ensure good lighting</Text>
      </View>
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
    marginTop: 20,
    backgroundColor: '#00ff00',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
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
  fpsText: {
    color: '#00ff00',
    fontSize: 16,
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
});
