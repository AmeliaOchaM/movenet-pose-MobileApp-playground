/**
 * Image preprocessing utilities untuk MoveNet
 * Resize dan padding image untuk maintain aspect ratio
 */

import * as tf from '@tensorflow/tfjs';

/**
 * Resize image dengan padding untuk maintain aspect ratio
 * @param {tf.Tensor3D} imageTensor - Input image tensor
 * @param {number} targetHeight - Target height (192)
 * @param {number} targetWidth - Target width (192)
 * @returns {tf.Tensor4D} Resized and padded image tensor
 */
export const resizeWithPad = (imageTensor, targetHeight = 192, targetWidth = 192) => {
  return tf.tidy(() => {
    const [height, width] = imageTensor.shape;
    
    // Calculate scaling factor
    const scale = Math.min(targetHeight / height, targetWidth / width);
    const newHeight = Math.round(height * scale);
    const newWidth = Math.round(width * scale);
    
    // Resize image
    const resized = tf.image.resizeBilinear(imageTensor, [newHeight, newWidth]);
    
    // Calculate padding
    const padTop = Math.floor((targetHeight - newHeight) / 2);
    const padBottom = targetHeight - newHeight - padTop;
    const padLeft = Math.floor((targetWidth - newWidth) / 2);
    const padRight = targetWidth - newWidth - padLeft;
    
    // Pad image
    const padded = tf.pad(resized, [
      [padTop, padBottom],
      [padLeft, padRight],
      [0, 0]
    ]);
    
    // Expand dimensions untuk batch [1, 192, 192, 3]
    return padded.expandDims(0);
  });
};

/**
 * Preprocess image dari URI
 * @param {string} imageUri - URI dari image
 * @returns {Promise<tf.Tensor4D>} Preprocessed image tensor
 */
export const preprocessImage = async (imageUri) => {
  return tf.tidy(() => {
    // Decode image from URI
    const imageTensor = decodeImageFromUri(imageUri);
    
    // Resize dengan padding
    const resized = resizeWithPad(imageTensor, 192, 192);
    
    // Convert to uint8 (0-255 range)
    // Model expects uint8 input
    const uint8Image = resized.toInt();
    
    return uint8Image;
  });
};

/**
 * Decode image dari URI menggunakan TensorFlow.js
 * @param {string} imageUri - URI dari image
 * @returns {tf.Tensor3D} Image tensor
 */
const decodeImageFromUri = (imageUri) => {
  // Implementation tergantung dari source image
  // Akan diimplementasikan dengan expo-image-picker atau camera
  throw new Error('decodeImageFromUri needs to be implemented based on image source');
};

/**
 * Convert keypoints dari normalized coordinates ke pixel coordinates
 * @param {Array} keypoints - Array of keypoints [17, 3]
 * @param {number} imageHeight - Original image height
 * @param {number} imageWidth - Original image width
 * @returns {Array} Keypoints dengan pixel coordinates
 */
export const keypointsToPixels = (keypoints, imageHeight, imageWidth) => {
  return keypoints.map(([y, x, confidence]) => ({
    y: y * imageHeight,
    x: x * imageWidth,
    confidence: confidence
  }));
};

/**
 * Filter keypoints berdasarkan confidence threshold
 * @param {Array} keypoints - Array of keypoints
 * @param {number} threshold - Minimum confidence (default: 0.3)
 * @returns {Array} Filtered keypoints
 */
export const filterKeypointsByConfidence = (keypoints, threshold = 0.3) => {
  return keypoints.map((kp, index) => ({
    index,
    ...kp,
    visible: kp.confidence > threshold
  }));
};
