/**
 * CPR Point Calculation Utility
 * 
 * Menghitung titik kompresi CPR dari pose keypoints
 * Menggunakan formula: CPR = shoulder_midpoint + α × (hip_midpoint - shoulder_midpoint)
 * dengan α = 0.42 (42% dari shoulders ke hips)
 */

// MoveNet keypoint indices
export const KEYPOINT_INDICES = {
  LEFT_SHOULDER: 5,
  RIGHT_SHOULDER: 6,
  LEFT_HIP: 11,
  RIGHT_HIP: 12
};

// Confidence threshold untuk deteksi yang reliable
const CONFIDENCE_THRESHOLD = 0.3;

/**
 * Menghitung titik tengah antara dua keypoint
 */
function getMidpoint(point1, point2) {
  return {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2
  };
}

/**
 * Menghitung CPR point dari pose keypoints
 * 
 * @param {Array} keypoints - Array of keypoints dari MoveNet [17 keypoints]
 *                            Format: [{x, y, score}, ...]
 * @returns {Object|null} - {x, y, confidence} atau null jika tidak terdeteksi
 */
export function calculateCPRPoint(keypoints) {
  if (!keypoints || keypoints.length < 17) {
    return null;
  }

  // Ambil keypoints yang diperlukan
  const leftShoulder = keypoints[KEYPOINT_INDICES.LEFT_SHOULDER];
  const rightShoulder = keypoints[KEYPOINT_INDICES.RIGHT_SHOULDER];
  const leftHip = keypoints[KEYPOINT_INDICES.LEFT_HIP];
  const rightHip = keypoints[KEYPOINT_INDICES.RIGHT_HIP];

  // Validasi confidence
  const requiredKeypoints = [leftShoulder, rightShoulder, leftHip, rightHip];
  const allConfident = requiredKeypoints.every(kp => kp.score >= CONFIDENCE_THRESHOLD);

  if (!allConfident) {
    return null;
  }

  // Hitung midpoint shoulders
  const shoulderMidpoint = getMidpoint(leftShoulder, rightShoulder);

  // Hitung midpoint hips
  const hipMidpoint = getMidpoint(leftHip, rightHip);

  // Alpha coefficient (42% dari shoulders ke hips)
  const ALPHA = 0.42;

  // Hitung CPR point
  // CPR = shoulder_mid + α × (hip_mid - shoulder_mid)
  const cprPoint = {
    x: shoulderMidpoint.x + ALPHA * (hipMidpoint.x - shoulderMidpoint.x),
    y: shoulderMidpoint.y + ALPHA * (hipMidpoint.y - shoulderMidpoint.y)
  };

  // Average confidence dari keypoints yang digunakan
  const avgConfidence = requiredKeypoints.reduce((sum, kp) => sum + kp.score, 0) / 4;

  return {
    x: cprPoint.x,
    y: cprPoint.y,
    confidence: avgConfidence
  };
}

/**
 * Convert normalized coordinates (0-1) ke pixel coordinates
 */
export function normalizedToPixel(point, width, height) {
  return {
    x: point.x * width,
    y: point.y * height,
    confidence: point.confidence
  };
}

/**
 * Get confidence level text dan color
 */
export function getConfidenceLevel(confidence) {
  if (confidence >= 0.7) {
    return { level: 'EXCELLENT', color: '#00FF00' };
  } else if (confidence >= 0.5) {
    return { level: 'GOOD', color: '#FFFF00' };
  } else if (confidence >= 0.3) {
    return { level: 'FAIR', color: '#FFA500' };
  } else {
    return { level: 'POOR', color: '#FF0000' };
  }
}
