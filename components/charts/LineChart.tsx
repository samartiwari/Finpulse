import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Svg, {
  Path,
  Circle,
  Line,
  Text as SvgText,
  G,
} from 'react-native-svg';
import colors from '@/constants/colors';

interface DataPoint {
  x: number;
  y: number;
  date?: string;
  value?: number;
}

interface LineChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
  fillColor?: string;
  showDots?: boolean;
  showGrid?: boolean;
  animated?: boolean;
  style?: any;
}

const { width: screenWidth } = Dimensions.get('window');

export default function LineChart({
  data,
  width = screenWidth - 32,
  height = 200,
  strokeColor = colors.primary,
  strokeWidth = 2,
  fillColor,
  showDots = false,
  showGrid = true,
  animated = false,
  style,
}: LineChartProps) {
  if (!data || data.length === 0) {
    return <View style={[styles.container, { width, height }, style]} />;
  }

  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Find min and max values
  const minX = Math.min(...data.map(d => d.x));
  const maxX = Math.max(...data.map(d => d.x));
  const minY = Math.min(...data.map(d => d.y));
  const maxY = Math.max(...data.map(d => d.y));

  // Scale functions
  const scaleX = (x: number) => ((x - minX) / (maxX - minX)) * chartWidth + padding;
  const scaleY = (y: number) => chartHeight - ((y - minY) / (maxY - minY)) * chartHeight + padding;

  // Create path
  const pathData = data.reduce((path, point, index) => {
    const x = scaleX(point.x);
    const y = scaleY(point.y);
    
    if (index === 0) {
      return `M${x},${y}`;
    }
    return `${path} L${x},${y}`;
  }, '');

  // Create fill path if fillColor is provided
  const fillPath = fillColor ? `${pathData} L${scaleX(maxX)},${scaleY(minY)} L${scaleX(minX)},${scaleY(minY)} Z` : '';

  return (
    <View style={[styles.container, { width, height }, style]}>
      <Svg width={width} height={height}>
        {/* Grid lines */}
        {showGrid && (
          <G>
            {/* Horizontal grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
              const y = padding + ratio * chartHeight;
              return (
                <Line
                  key={`h-${index}`}
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke={colors.border}
                  strokeWidth={0.5}
                  opacity={0.5}
                />
              );
            })}
            
            {/* Vertical grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
              const x = padding + ratio * chartWidth;
              return (
                <Line
                  key={`v-${index}`}
                  x1={x}
                  y1={padding}
                  x2={x}
                  y2={height - padding}
                  stroke={colors.border}
                  strokeWidth={0.5}
                  opacity={0.5}
                />
              );
            })}
          </G>
        )}

        {/* Fill area */}
        {fillColor && (
          <Path
            d={fillPath}
            fill={fillColor}
            opacity={0.3}
          />
        )}

        {/* Line */}
        <Path
          d={pathData}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots */}
        {showDots && data.map((point, index) => (
          <Circle
            key={index}
            cx={scaleX(point.x)}
            cy={scaleY(point.y)}
            r={3}
            fill={strokeColor}
            stroke="white"
            strokeWidth={2}
          />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
});
