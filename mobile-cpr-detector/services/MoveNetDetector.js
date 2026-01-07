/**
 * MoveNet Pose Detection Service for React Native
 * Based on webcam_cpr_detection.py and test_movenet.py
 * 
 * Model: google/movenet/singlepose/lightning (4.tflite)
 * Input: 192x192x3 RGB image (uint8)
 * Output: [1, 1, 17, 3] keypoints with confidence scores
 * 
 * NOTE: This file is deprecated. Use MoveNetTFLiteDetector.js instead.
 */

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

// Skeleton connections untuk drawing
export const KEYPOINT_EDGES = [
  [0, 1], [0, 2], [1, 3], [2, 4],  // Face
  [0, 5], [0, 6],                   // Nose to shoulders
  [5, 7], [7, 9],                   // Left arm
  [6, 8], [8, 10],                  // Right arm
  [5, 6],                           // Shoulders
  [5, 11], [6, 12],                 // Shoulders to hips
  [11, 12],                         // Hips
  [11, 13], [13, 15],               // Left leg
  [12, 14], [14, 16]                // Right leg
];

class MoveNetDetector {
  constructor() {
    this.model = null;
    this.inputHeight = 192;
    this.inputWidth = 192;
    this.isReady = false;
  }

  /**
   * Initialize detector (mock mode only)
   * NOTE: Use MoveNetTFLiteDetector.js for real TFLite inference
   */
  async initialize() {
    try {
      console.log('[MoveNet] Initializing MOCK detector...');
      console.log('[MoveNet] Running in MOCK MODE - using demo keypoints');
      console.log('[MoveNet] To enable real detection, use MoveNetTFLiteDetector.js');
      
      this.isReady = true;
      console.log('[MoveNet] Mock detector initialized');
      
      return true;
    } catch (error) {
      console.error('[MoveNet] Error initializing:', error);
      throw error;
    }
  }

  /**
   * Detect pose from image data
   * @param {ImageData} imageData - Image data from camera
   * @returns {Array} Keypoints with scores [[y, x, score], ...]
   */
  async detectPose(imageData) {
    if (!this.isReady) {
      console.warn('[MoveNet] Detector not ready');
      return null;
    }

    try {
      // TODO: Implement actual TFLite inference
      // For now, return mock keypoints for demo
      return this.generateMockKeypoints();
      
    } catch (error) {
      console.error('[MoveNet] Detection error:', error);
      return null;
    }
  }

  /**
   * Generate mock keypoints for demo (until TFLite integration is complete)
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
      x: (leftShoulder[1] + rightShoulder[1]) / 2
    };

    const hipCenter = {
      y: (leftHip[0] + rightHip[0]) / 2,
      x: (leftHip[1] + rightHip[1]) / 2
    };

    // CPR point: slightly above midpoint between shoulder and hip
    // (lower sternum position)
    const cprY = shoulderCenter.y + (hipCenter.y - shoulderCenter.y) * 0.45;
    const cprX = (shoulderCenter.x + hipCenter.x) / 2;

    // Calculate average confidence
    const avgConfidence = (
      leftShoulder[2] + 
      rightShoulder[2] + 
      leftHip[2] + 
      rightHip[2]
    ) / 4;

    return {
      y: cprY,
      x: cprX,
      confidence: avgConfidence,
      position: [cprY, cprX]
    };
  }

  /**
   * Cleanup resources
   */
  dispose() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
    this.isReady = false;
    console.log('[MoveNet] Detector disposed');
  }
}

export default MoveNetDetector;
