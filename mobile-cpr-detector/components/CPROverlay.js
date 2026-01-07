import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { normalizedToPixel, getConfidenceLevel } from '../utils/cprCalculation';

/**
 * Komponen untuk menampilkan CPR point overlay di atas kamera
 * Using native Views instead of SVG for better compatibility
 */
export default function CPROverlay({ cprPoint, dimensions, showSkeleton = false, keypoints = [] }) {
  const { width, height } = dimensions;

  // Debug log
  React.useEffect(() => {
    if (cprPoint) {
      console.log('[CPROverlay] Rendering with:', {
        cprPoint,
        dimensions: { width, height },
        keypointsCount: keypoints.length
      });
    }
  }, [cprPoint]);

  if (!cprPoint) {
    return null;
  }

  // Convert ke pixel coordinates
  const pixelPoint = normalizedToPixel(cprPoint, width, height);
  const { level, color } = getConfidenceLevel(cprPoint.confidence);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Outer glow circle */}
      <View style={{
        position: 'absolute',
        left: pixelPoint.x - 30,
        top: pixelPoint.y - 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: color,
        opacity: 0.3,
      }} />

      {/* Middle ring */}
      <View style={{
        position: 'absolute',
        left: pixelPoint.x - 20,
        top: pixelPoint.y - 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: color,
        opacity: 0.8,
      }} />

      {/* Center dot */}
      <View style={{
        position: 'absolute',
        left: pixelPoint.x - 8,
        top: pixelPoint.y - 8,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: color,
      }} />

      {/* Crosshair - Horizontal */}
      <View style={{
        position: 'absolute',
        left: pixelPoint.x - 25,
        top: pixelPoint.y - 1,
        width: 15,
        height: 2,
        backgroundColor: color,
      }} />
      <View style={{
        position: 'absolute',
        left: pixelPoint.x + 10,
        top: pixelPoint.y - 1,
        width: 15,
        height: 2,
        backgroundColor: color,
      }} />

      {/* Crosshair - Vertical */}
      <View style={{
        position: 'absolute',
        left: pixelPoint.x - 1,
        top: pixelPoint.y - 25,
        width: 2,
        height: 15,
        backgroundColor: color,
      }} />
      <View style={{
        position: 'absolute',
        left: pixelPoint.x - 1,
        top: pixelPoint.y + 10,
        width: 2,
        height: 15,
        backgroundColor: color,
      }} />

      {/* Label */}
      <View style={{
        position: 'absolute',
        left: pixelPoint.x - 60,
        top: pixelPoint.y + 35,
        width: 120,
        alignItems: 'center',
      }}>
        <Text style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: color,
          textShadowColor: 'black',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 3,
        }}>
          CPR POINT
        </Text>
        <Text style={{
          fontSize: 12,
          color: 'white',
          textShadowColor: 'black',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 2,
          marginTop: 2,
        }}>
          {level} ({(cprPoint.confidence * 100).toFixed(0)}%)
        </Text>
      </View>

      {/* Skeleton keypoints (if enabled) */}
      {showSkeleton && keypoints.length > 0 && keypoints.map((kp, idx) => {
        if (kp[2] > 0.3) { // score threshold
          return (
            <View
              key={`kp-${idx}`}
              style={{
                position: 'absolute',
                left: kp[1] * width - 4, // x coordinate
                top: kp[0] * height - 4,  // y coordinate
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#00ff00',
                borderWidth: 1,
                borderColor: 'white',
              }}
            />
          );
        }
        return null;
      })}
    </View>
  );
}
