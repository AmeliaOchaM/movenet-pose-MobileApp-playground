/**
 * Konstanta untuk MoveNet pose detection
 */

// Nama 17 keypoints sesuai urutan output model
export const KEYPOINT_NAMES = [
  'nose',
  'left_eye',
  'right_eye',
  'left_ear',
  'right_ear',
  'left_shoulder',
  'right_shoulder',
  'left_elbow',
  'right_elbow',
  'left_wrist',
  'right_wrist',
  'left_hip',
  'right_hip',
  'left_knee',
  'right_knee',
  'left_ankle',
  'right_ankle'
];

// Koneksi antar keypoints untuk drawing skeleton
export const KEYPOINT_EDGES = [
  [0, 1],   // nose - left_eye
  [0, 2],   // nose - right_eye
  [1, 3],   // left_eye - left_ear
  [2, 4],   // right_eye - right_ear
  [0, 5],   // nose - left_shoulder
  [0, 6],   // nose - right_shoulder
  [5, 7],   // left_shoulder - left_elbow
  [7, 9],   // left_elbow - left_wrist
  [6, 8],   // right_shoulder - right_elbow
  [8, 10],  // right_elbow - right_wrist
  [5, 6],   // left_shoulder - right_shoulder
  [5, 11],  // left_shoulder - left_hip
  [6, 12],  // right_shoulder - right_hip
  [11, 12], // left_hip - right_hip
  [11, 13], // left_hip - left_knee
  [13, 15], // left_knee - left_ankle
  [12, 14], // right_hip - right_knee
  [14, 16]  // right_knee - right_ankle
];

// Warna untuk berbagai bagian tubuh
export const KEYPOINT_COLORS = {
  face: '#FF6B6B',      // Merah untuk wajah
  leftArm: '#4ECDC4',   // Cyan untuk lengan kiri
  rightArm: '#45B7D1',  // Biru untuk lengan kanan
  torso: '#FFA07A',     // Orange untuk torso
  leftLeg: '#98D8C8',   // Hijau muda untuk kaki kiri
  rightLeg: '#6BCF7F'   // Hijau untuk kaki kanan
};

// Mapping keypoint index ke warna
export const getKeypointColor = (index) => {
  if (index <= 4) return KEYPOINT_COLORS.face;
  if (index === 5 || index === 7 || index === 9) return KEYPOINT_COLORS.leftArm;
  if (index === 6 || index === 8 || index === 10) return KEYPOINT_COLORS.rightArm;
  if (index === 11 || index === 13 || index === 15) return KEYPOINT_COLORS.leftLeg;
  if (index === 12 || index === 14 || index === 16) return KEYPOINT_COLORS.rightLeg;
  return KEYPOINT_COLORS.torso;
};

// Model configuration
export const MODEL_CONFIG = {
  inputHeight: 192,
  inputWidth: 192,
  inputChannels: 3,
  outputShape: [1, 1, 17, 3],
  confidenceThreshold: 0.3
};
