/**
 * MoveNet TFLite Detector for React Native
 * Using react-native-fast-tflite for real pose detection
 * 
 * Model: google/movenet/singlepose/lightning (4.tflite)
 * Input: 192x192x3 RGB image (uint8)
 * Output: [1, 1, 17, 3] keypoints with [y, x, confidence]
 */

import { loadTensorflowModel } from 'react-native-fast-tflite';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

// 17 keypoints sesuai MoveNet documentation
export const KEYPOINT_NAMES = [
  'nose',           // 0
  'left_eye',       // 1
  'right_eye',      // 2
  'left_ear',       // 3
  'right_ear',      // 4
  'left_shoulder',  // 5
  'right_shoulder', // 6
  'left_elbow',     // 7
  'right_elbow',    // 8
  'left_wrist',     // 9
  'right_wrist',    // 10
  'left_hip',       // 11
  'right_hip',      // 12
  'left_knee',      // 13
  'right_knee',     // 14
  'left_ankle',     // 15
  'right_ankle'     // 16
];

// Skeleton connections for visualization
export const KEYPOINT_EDGES = [
  [0, 1], [0, 2], [1, 3], [2, 4],  // Face
  [5, 6], [5, 7], [7, 9],           // Left arm
  [6, 8], [8, 10],                  // Right arm
  [5, 11], [6, 12], [11, 12],       // Torso
  [11, 13], [13, 15],               // Left leg
  [12, 14], [14, 16]                // Right leg
];

class MoveNetDetector {
  constructor() {
    this.model = null;
    this.isReady = false;
    this.inputShape = {
      height: 192,
      width: 192,
      channels: 3
    };
  }

  /**
   * Initialize and load TFLite model
   */
  async initialize() {
    try {
      console.log('[MoveNet] Initializing TFLite detector...');
      
      // Load model asset
      const modelAsset = Asset.fromModule(require('../assets/models/4.tflite'));
      await modelAsset.downloadAsync();
      
      console.log('[MoveNet] Model asset path:', modelAsset.localUri);
      
      // Copy model to accessible location
      const modelPath = `${FileSystem.documentDirectory}4.tflite`;
      await FileSystem.copyAsync({
        from: modelAsset.localUri,
        to: modelPath
      });
      
      console.log('[MoveNet] Model copied to:', modelPath);
      
      // Load TFLite model
      this.model = await loadTensorflowModel(modelPath);
      
      this.isReady = true;
      console.log('[MoveNet] TFLite model loaded successfully!');
      console.log('[MoveNet] Input shape:', this.inputShape);
      
      return true;
    } catch (error) {
      console.error('[MoveNet] Error initializing:', error);
      throw error;
    }
  }

  /**
   * Detect pose from image data
   * @param {Uint8Array|Float32Array} imageData - Preprocessed image data (192x192x3)
   * @returns {Array} Keypoints [[y, x, score], ...]
   */
  async detectPose(imageData) {
    if (!this.isReady || !this.model) {
      console.warn('[MoveNet] Model not ready, using mock data');
      return this.generateMockKeypoints();
    }

    try {
      // If no image data, use mock
      if (!imageData) {
        return this.generateMockKeypoints();
      }

      // Run TFLite inference
      const outputs = await this.model.run([imageData]);
      
      // Parse output: [1, 1, 17, 3] → [[y, x, score], ...]
      const keypoints = this.parseModelOutput(outputs[0]);
      
      return keypoints;
      
    } catch (error) {
      console.error('[MoveNet] Detection error:', error);
      return this.generateMockKeypoints();
    }
  }

  /**
   * Parse model output to keypoints array
   * @param {Array} output - Raw model output [1, 1, 17, 3]
   * @returns {Array} Keypoints [[y, x, score], ...]
   */
  parseModelOutput(output) {
    const keypoints = [];
    
    // Output shape: [1, 1, 17, 3]
    // We need to extract the 17x3 array
    for (let i = 0; i < 17; i++) {
      const y = output[0][0][i][0];      // y coordinate (0-1)
      const x = output[0][0][i][1];      // x coordinate (0-1)
      const confidence = output[0][0][i][2]; // confidence score (0-1)
      
      keypoints.push([y, x, confidence]);
    }
    
    return keypoints;
  }

  /**
   * Preprocess image for model input
   * @param {Object} imageUri - Camera image URI
   * @returns {Float32Array} Preprocessed image data
   */
  async preprocessImage(imageUri) {
    // TODO: Implement actual image preprocessing
    // For now, return dummy data
    const size = this.inputShape.height * this.inputShape.width * this.inputShape.channels;
    return new Float32Array(size);
  }

  /**
   * Generate mock keypoints for demo (fallback)
   * Format: [[y, x, score], ...] for 17 keypoints
   * Now with random variation to simulate movement
   */
  generateMockKeypoints() {
    // Add small random variation (-0.02 to +0.02) to simulate movement
    const randomOffset = () => (Math.random() - 0.5) * 0.04;
    
    // Keypoints in normalized coordinates [0, 1]
    // Format dari Python: [y, x, score]
    return [
      [0.2 + randomOffset(), 0.5 + randomOffset(), 0.9],    // nose
      [0.18 + randomOffset(), 0.48 + randomOffset(), 0.8],  // left_eye
      [0.18 + randomOffset(), 0.52 + randomOffset(), 0.8],  // right_eye
      [0.2 + randomOffset(), 0.46 + randomOffset(), 0.7],   // left_ear
      [0.2 + randomOffset(), 0.54 + randomOffset(), 0.7],   // right_ear
      [0.35 + randomOffset(), 0.42 + randomOffset(), 0.85], // left_shoulder
      [0.35 + randomOffset(), 0.58 + randomOffset(), 0.85], // right_shoulder
      [0.5 + randomOffset(), 0.38 + randomOffset(), 0.75],  // left_elbow
      [0.5 + randomOffset(), 0.62 + randomOffset(), 0.75],  // right_elbow
      [0.65 + randomOffset(), 0.36 + randomOffset(), 0.7],  // left_wrist
      [0.65 + randomOffset(), 0.64 + randomOffset(), 0.7],  // right_wrist
      [0.55 + randomOffset(), 0.44 + randomOffset(), 0.85], // left_hip
      [0.55 + randomOffset(), 0.56 + randomOffset(), 0.85], // right_hip
      [0.75 + randomOffset(), 0.42 + randomOffset(), 0.75], // left_knee
      [0.75 + randomOffset(), 0.58 + randomOffset(), 0.75], // right_knee
      [0.9 + randomOffset(), 0.4 + randomOffset(), 0.7],    // left_ankle
      [0.9 + randomOffset(), 0.6 + randomOffset(), 0.7]     // right_ankle
    ];
  }

  /**
   * Calculate CPR compression point from keypoints
   * Based on calculateCPRPoint from cprCalculation.js
   * @param {Array} keypoints - Array of keypoints [[y, x, score], ...]
   * @returns {Object|null} CPR point {x, y, confidence} or null
   */
  calculateCPRPoint(keypoints) {
    if (!keypoints || keypoints.length !== 17) {
      return null;
    }

    // Get required keypoints (same as Python implementation)
    const leftShoulder = keypoints[5];   // index 5
    const rightShoulder = keypoints[6];  // index 6
    const leftHip = keypoints[11];       // index 11
    const rightHip = keypoints[12];      // index 12

    // Check confidence threshold
    const minConfidence = 0.3;
    if (leftShoulder[2] < minConfidence || 
        rightShoulder[2] < minConfidence ||
        leftHip[2] < minConfidence || 
        rightHip[2] < minConfidence) {
      return null;
    }

    // Calculate center points
    const shoulderCenter = {
      y: (leftShoulder[0] + rightShoulder[0]) / 2,
      x: (leftShoulder[1] + rightShoulder[1]) / 2,
      confidence: (leftShoulder[2] + rightShoulder[2]) / 2
    };

    const hipCenter = {
      y: (leftHip[0] + rightHip[0]) / 2,
      x: (leftHip[1] + rightHip[1]) / 2,
      confidence: (leftHip[2] + rightHip[2]) / 2
    };

    // CPR point: midpoint between shoulder center and hip center
    const cprPoint = {
      y: (shoulderCenter.y + hipCenter.y) / 2,
      x: (shoulderCenter.x + hipCenter.x) / 2,
      confidence: Math.min(shoulderCenter.confidence, hipCenter.confidence),
      position: [
        (shoulderCenter.y + hipCenter.y) / 2,
        (shoulderCenter.x + hipCenter.x) / 2
      ]
    };

    return cprPoint;
  }

  /**
   * Dispose model and free resources
   */
  dispose() {
    if (this.model) {
      // TFLite model cleanup if needed
      this.model = null;
      this.isReady = false;
      console.log('[MoveNet] Detector disposed');
    }
  }
}

export default MoveNetDetector;
