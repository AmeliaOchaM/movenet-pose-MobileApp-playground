/**
 * PoseOverlay Component
 * Menampilkan keypoints dan skeleton overlay pada image/camera
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import { KEYPOINT_EDGES, getKeypointColor } from '../utils/constants';

const PoseOverlay = ({ 
  keypoints, 
  imageWidth, 
  imageHeight, 
  showLabels = false,
  confidenceThreshold = 0.3 
}) => {
  if (!keypoints || keypoints.length === 0) {
    return null;
  }

  // Convert normalized coordinates to pixel coordinates
  const pixelKeypoints = keypoints.map(kp => ({
    ...kp,
    x: kp.position.x * imageWidth,
    y: kp.position.y * imageHeight
  }));

  return (
    <Svg 
      width={imageWidth} 
      height={imageHeight} 
      style={styles.svg}
    >
      {/* Draw skeleton lines */}
      {KEYPOINT_EDGES.map((edge, index) => {
        const kp1 = pixelKeypoints[edge[0]];
        const kp2 = pixelKeypoints[edge[1]];

        if (kp1.visible && kp2.visible) {
          return (
            <Line
              key={`edge-${index}`}
              x1={kp1.x}
              y1={kp1.y}
              x2={kp2.x}
              y2={kp2.y}
              stroke="#00FF00"
              strokeWidth="3"
              strokeOpacity="0.8"
            />
          );
        }
        return null;
      })}

      {/* Draw keypoints */}
      {pixelKeypoints.map((kp, index) => {
        if (kp.visible) {
          const color = getKeypointColor(index);
          
          return (
            <React.Fragment key={`kp-${index}`}>
              {/* Outer circle */}
              <Circle
                cx={kp.x}
                cy={kp.y}
                r="8"
                fill={color}
                fillOpacity="0.8"
              />
              
              {/* Inner circle */}
              <Circle
                cx={kp.x}
                cy={kp.y}
                r="4"
                fill="#FFFFFF"
                fillOpacity="1"
              />

              {/* Label */}
              {showLabels && (
                <SvgText
                  x={kp.x + 12}
                  y={kp.y}
                  fill="#FFFFFF"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {kp.name} ({(kp.confidence * 100).toFixed(0)}%)
                </SvgText>
              )}
            </React.Fragment>
          );
        }
        return null;
      })}
    </Svg>
  );
};

const styles = StyleSheet.create({
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  }
});

export default PoseOverlay;
