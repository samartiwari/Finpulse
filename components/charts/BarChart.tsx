import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Svg, {
  Rect,
  Line,
  Text as SvgText,
  G,
} from 'react-native-svg';
import colors from '@/constants/colors';

interface DataPoint {
  x: number;
  y: number;
  label?: string;
  color?: string;
}

interface BarChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  barColor?: string;
  showGrid?: boolean;
  showLabels?: boolean;
  style?: any;
}

const { width: screenWidth } = Dimensions.get('window');

export default function BarChart({
  data,
  width = screenWidth - 32,
  height = 200,
  barColor = colors.primary,
  showGrid = true,
  showLabels = false,
  style,
}: BarChartProps) {
  if (!data || data.length === 0) {
    return <View style={[styles.container, { width, height }, style]} />;
  }

  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Find min and max values
  const minY = Math.min(0, Math.min(...data.map(d => d.y)));
  const maxY = Math.max(...data.map(d => d.y));

  // Calculate bar width
  const barWidth = chartWidth / data.length * 0.8;
  const barSpacing = chartWidth / data.length * 0.2;

  // Scale function
  const scaleY = (y: number) => {
    const range = maxY - minY;
    return chartHeight - ((y - minY) / range) * chartHeight;
  };

  const zeroY = scaleY(0);

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
          </G>
        )}

        {/* Zero line */}
        {minY < 0 && (
          <Line
            x1={padding}
            y1={padding + zeroY}
            x2={width - padding}
            y2={padding + zeroY}
            stroke={colors.text}
            strokeWidth={1}
            opacity={0.3}
          />
        )}

        {/* Bars */}
        {data.map((point, index) => {
          const x = padding + (index * chartWidth) / data.length + barSpacing / 2;
          const barHeight = Math.abs(scaleY(point.y) - zeroY);
          const y = padding + Math.min(scaleY(point.y), zeroY);
          const color = point.color || barColor;

          return (
            <G key={index}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={color}
                rx={2}
              />
              
              {/* Labels */}
              {showLabels && point.label && (
                <SvgText
                  x={x + barWidth / 2}
                  y={height - padding + 15}
                  fontSize={12}
                  fill={colors.secondaryText}
                  textAnchor="middle"
                >
                  {point.label}
                </SvgText>
              )}
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
});
