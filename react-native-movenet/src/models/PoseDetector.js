/**
 * Pose Detector Service
 * High-level API untuk pose detection
 */

import * as tf from '@tensorflow/tfjs';
import MoveNetModel from './MoveNetModel';
import { resizeWithPad } from '../utils/imagePreprocessing';
import { MODEL_CONFIG } from '../utils/constants';

class PoseDetector {
  constructor() {
    this.model = MoveNetModel;
    this.isInitialized = false;
  }

  /**
   * Initialize pose detector
   * @param {string} modelPath - Optional custom model path
   * @returns {Promise<boolean>} Success status
   */
  async initialize(modelPath = null) {
    try {
      console.log('Initializing Pose Detector...');
      
      // Initialize TensorFlow.js
      await tf.ready();
      
      // Load model
      const success = modelPath 
        ? await this.model.loadModel(modelPath)
        : await this.model.loadModelFromAssets();
      
      this.isInitialized = success;
      
      if (success) {
        console.log('✓ Pose Detector initialized successfully!');
      }
      
      return success;
    } catch (error) {
      console.error('Error initializing pose detector:', error);
      return false;
    }
  }

  /**
   * Detect pose dari image tensor
   * @param {tf.Tensor3D} imageTensor - Input image tensor
   * @param {Object} options - Detection options
   * @returns {Promise<Object>} Detection results
   */
  async detectPose(imageTensor, options = {}) {
    if (!this.isInitialized) {
      throw new Error('Pose detector belum diinisialisasi!');
    }

    const {
      confidenceThreshold = MODEL_CONFIG.confidenceThreshold,
      returnTensor = false
    } = options;

    try {
      // Preprocess image
      const preprocessed = tf.tidy(() => {
        // Normalize jika perlu
        let normalized = imageTensor;
        
        // Resize dengan padding
        const resized = resizeWithPad(
          normalized,
          MODEL_CONFIG.inputHeight,
          MODEL_CONFIG.inputWidth
        );
        
        return resized;
      });

      // Run inference
      const keypoints = await this.model.predict(preprocessed);
      
      // Process keypoints
      const result = this.model.processKeypoints(keypoints, confidenceThreshold);
      
      // Cleanup
      if (!returnTensor) {
        preprocessed.dispose();
      }

      return {
        ...result,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error detecting pose:', error);
      throw error;
    }
  }

  /**
   * Detect pose dari image URI
   * @param {string} imageUri - URI ke image file
   * @param {Object} options - Detection options
   * @returns {Promise<Object>} Detection results
   */
  async detectPoseFromUri(imageUri, options = {}) {
    // Implementation tergantung dari image loading strategy
    // Bisa menggunakan expo-image-picker atau expo-camera
    throw new Error('detectPoseFromUri will be implemented with image picker');
  }

  /**
   * Check apakah detector sudah ready
   * @returns {boolean} Ready status
   */
  isReady() {
    return this.isInitialized && this.model.isModelLoaded;
  }

  /**
   * Cleanup dan free memory
   */
  dispose() {
    this.model.dispose();
    this.isInitialized = false;
  }
}

// Export singleton instance
export default new PoseDetector();
