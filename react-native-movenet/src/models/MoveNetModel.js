/**
 * MoveNet Model Handler
 * Handles loading dan inference dari MoveNet TFLite model
 */

import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';
import { MODEL_CONFIG, KEYPOINT_NAMES } from '../utils/constants';

class MoveNetModel {
  constructor() {
    this.model = null;
    this.isModelLoaded = false;
  }

  /**
   * Load model dari assets atau file system
   * @param {string} modelPath - Path ke model file (4.tflite)
   * @returns {Promise<boolean>} Success status
   */
  async loadModel(modelPath) {
    try {
      console.log('Loading MoveNet model...');
      
      // Tunggu TensorFlow.js ready
      await tf.ready();
      
      console.log('TensorFlow.js backend:', tf.getBackend());
      
      // Load TFLite model
      // Note: Untuk TFLite di React Native, kita perlu convert ke format yang compatible
      // atau gunakan tfjs-tflite-node
      this.model = await tf.loadGraphModel(modelPath);
      
      this.isModelLoaded = true;
      console.log('✓ Model loaded successfully!');
      
      // Print model info
      console.log('Model inputs:', this.model.inputs);
      console.log('Model outputs:', this.model.outputs);
      
      return true;
    } catch (error) {
      console.error('Error loading model:', error);
      this.isModelLoaded = false;
      return false;
    }
  }

  /**
   * Load model dari bundled assets
   * @returns {Promise<boolean>} Success status
   */
  async loadModelFromAssets() {
    try {
      console.log('Loading model from assets...');
      await tf.ready();
      
      // Load dari assets (model harus sudah di-convert ke tfjs format)
      const modelJson = require('../../assets/models/model.json');
      const modelWeights = require('../../assets/models/group1-shard.bin');
      
      this.model = await tf.loadGraphModel(
        bundleResourceIO(modelJson, modelWeights)
      );
      
      this.isModelLoaded = true;
      console.log('✓ Model loaded from assets!');
      return true;
    } catch (error) {
      console.error('Error loading model from assets:', error);
      return false;
    }
  }

  /**
   * Run inference pada input image
   * @param {tf.Tensor4D} inputTensor - Preprocessed image tensor [1, 192, 192, 3]
   * @returns {Promise<Array>} Keypoints dengan scores [17, 3]
   */
  async predict(inputTensor) {
    if (!this.isModelLoaded) {
      throw new Error('Model belum di-load! Panggil loadModel() terlebih dahulu.');
    }

    try {
      // Run inference
      const outputTensor = await this.model.predict(inputTensor);
      
      // Convert tensor to array
      // Output shape: [1, 1, 17, 3]
      const outputData = await outputTensor.array();
      
      // Extract keypoints [17, 3]
      const keypoints = outputData[0][0];
      
      // Cleanup tensors
      outputTensor.dispose();
      
      return keypoints;
    } catch (error) {
      console.error('Error during prediction:', error);
      throw error;
    }
  }

  /**
   * Process keypoints menjadi format yang lebih readable
   * @param {Array} keypoints - Raw keypoints [17, 3]
   * @param {number} confidenceThreshold - Minimum confidence
   * @returns {Object} Processed keypoints dengan metadata
   */
  processKeypoints(keypoints, confidenceThreshold = MODEL_CONFIG.confidenceThreshold) {
    const processedKeypoints = keypoints.map((kp, index) => {
      const [y, x, confidence] = kp;
      return {
        name: KEYPOINT_NAMES[index],
        index: index,
        position: { x, y }, // Normalized coordinates (0-1)
        confidence: confidence,
        visible: confidence > confidenceThreshold
      };
    });

    // Calculate statistics
    const visibleCount = processedKeypoints.filter(kp => kp.visible).length;
    const avgConfidence = keypoints.reduce((sum, kp) => sum + kp[2], 0) / keypoints.length;

    return {
      keypoints: processedKeypoints,
      stats: {
        totalKeypoints: keypoints.length,
        visibleKeypoints: visibleCount,
        averageConfidence: avgConfidence,
        detectionQuality: this.getDetectionQuality(avgConfidence)
      }
    };
  }

  /**
   * Determine kualitas deteksi berdasarkan average confidence
   * @param {number} avgConfidence - Average confidence score
   * @returns {string} Quality level
   */
  getDetectionQuality(avgConfidence) {
    if (avgConfidence >= 0.7) return 'excellent';
    if (avgConfidence >= 0.5) return 'good';
    if (avgConfidence >= 0.3) return 'fair';
    return 'poor';
  }

  /**
   * Dispose model dan free memory
   */
  dispose() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
      this.isModelLoaded = false;
      console.log('Model disposed');
    }
  }
}

// Export singleton instance
export default new MoveNetModel();
