import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface StockChartProps {
  data: { date: string; value: number }[];
  width: number;
  height: number;
  color: string;
  showGradient?: boolean;
}

export default function StockChart({ data, width, height, color, showGradient = false }: StockChartProps) {
  if (!data || data.length === 0) {
    // Generate sample data for demo
    const sampleData = Array.from({ length: 20 }, (_, i) => ({
      date: `day-${i}`,
      value: Math.sin(i * 0.3) * 20 + 100 + Math.random() * 10
    }));
    data = sampleData;
  }

  // Filter out invalid values and ensure we have valid numbers
  const validData = data.filter(d => d && typeof d.value === 'number' && !isNaN(d.value));
  
  if (validData.length === 0) {
    // If no valid data, use sample data
    const sampleData = Array.from({ length: 20 }, (_, i) => ({
      date: `day-${i}`,
      value: Math.sin(i * 0.3) * 20 + 100 + Math.random() * 10
    }));
    data = sampleData;
  } else {
    data = validData;
  }
  
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((point.value - minValue) / range) * height;
    // Ensure no NaN values
    const safeX = isNaN(x) ? 0 : x;
    const safeY = isNaN(y) ? height / 2 : y;
    return `${safeX},${safeY}`;
  }).join(' ');

  const pathData = `M ${points.split(' ').join(' L ')}`;
  
  // Create area path for gradient fill
  const areaPath = showGradient ? 
    `${pathData} L ${width},${height} L 0,${height} Z` : 
    pathData;

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </LinearGradient>
        </Defs>
        {showGradient && (
          <Path
            d={areaPath}
            fill="url(#gradient)"
          />
        )}
        <Path
          d={pathData}
          stroke={color}
          strokeWidth={showGradient ? 3 : 2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
});