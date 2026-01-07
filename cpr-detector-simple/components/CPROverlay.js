import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import { normalizedToPixel, getConfidenceLevel } from '../utils/cprCalculation';

/**
 * Komponen untuk menampilkan CPR point overlay di atas kamera
 */
export default function CPROverlay({ cprPoint, dimensions, showSkeleton = false, keypoints = [] }) {
  const { width, height } = dimensions;

  console.log('CPROverlay render:', { cprPoint, width, height });

  if (!cprPoint) {
    console.log('No CPR point - not rendering');
    return null;
  }

  // Convert ke pixel coordinates
  const pixelPoint = normalizedToPixel(cprPoint, width, height);
  const { level, color } = getConfidenceLevel(cprPoint.confidence);
  
  console.log('Rendering CPR point at:', pixelPoint, 'with color:', color);

  // Skeleton connections (optional)
  const SKELETON_CONNECTIONS = [
    [5, 6],   // shoulders
    [5, 11],  // left shoulder to left hip
    [6, 12],  // right shoulder to right hip
    [11, 12]  // hips
  ];

  return (
    <Svg style={StyleSheet.absoluteFill} width={width} height={height}>
      {/* Skeleton lines (if enabled) */}
      {showSkeleton && keypoints.length > 0 && (
        <>
          {SKELETON_CONNECTIONS.map(([startIdx, endIdx], index) => {
            const start = keypoints[startIdx];
            const end = keypoints[endIdx];
            
            if (start.score > 0.3 && end.score > 0.3) {
              return (
                <Line
                  key={`line-${index}`}
                  x1={start.x * width}
                  y1={start.y * height}
                  x2={end.x * width}
                  y2={end.y * height}
                  stroke="rgba(255, 255, 255, 0.5)"
                  strokeWidth="2"
                />
              );
            }
            return null;
          })}
        </>
      )}

      {/* CPR Point Marker - Outer glow */}
      <Circle
        cx={pixelPoint.x}
        cy={pixelPoint.y}
        r="30"
        fill={color}
        opacity="0.3"
      />

      {/* CPR Point Marker - Middle ring */}
      <Circle
        cx={pixelPoint.x}
        cy={pixelPoint.y}
        r="20"
        fill="none"
        stroke={color}
        strokeWidth="3"
        opacity="0.8"
      />

      {/* CPR Point Marker - Center dot */}
      <Circle
        cx={pixelPoint.x}
        cy={pixelPoint.y}
        r="8"
        fill={color}
        opacity="1"
      />

      {/* Crosshair */}
      <Line
        x1={pixelPoint.x - 25}
        y1={pixelPoint.y}
        x2={pixelPoint.x - 10}
        y2={pixelPoint.y}
        stroke={color}
        strokeWidth="2"
      />
      <Line
        x1={pixelPoint.x + 10}
        y1={pixelPoint.y}
        x2={pixelPoint.x + 25}
        y2={pixelPoint.y}
        stroke={color}
        strokeWidth="2"
      />
      <Line
        x1={pixelPoint.x}
        y1={pixelPoint.y - 25}
        x2={pixelPoint.x}
        y2={pixelPoint.y - 10}
        stroke={color}
        strokeWidth="2"
      />
      <Line
        x1={pixelPoint.x}
        y1={pixelPoint.y + 10}
        x2={pixelPoint.x}
        y2={pixelPoint.y + 25}
        stroke={color}
        strokeWidth="2"
      />

      {/* Label */}
      <SvgText
        x={pixelPoint.x}
        y={pixelPoint.y + 50}
        fontSize="16"
        fontWeight="bold"
        fill={color}
        textAnchor="middle"
        stroke="black"
        strokeWidth="3"
        paintOrder="stroke"
      >
        CPR POINT
      </SvgText>
      
      {/* Confidence indicator */}
      <SvgText
        x={pixelPoint.x}
        y={pixelPoint.y + 70}
        fontSize="12"
        fill="white"
        textAnchor="middle"
        stroke="black"
        strokeWidth="2"
        paintOrder="stroke"
      >
        {level} ({(cprPoint.confidence * 100).toFixed(0)}%)
      </SvgText>
    </Svg>
  );
}
