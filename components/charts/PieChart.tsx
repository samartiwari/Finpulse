import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Svg, {
  Circle,
  Path,
  Text as SvgText,
  G,
} from 'react-native-svg';
import colors from '@/constants/colors';

interface DataPoint {
  value: number;
  label: string;
  color?: string;
}

interface PieChartProps {
  data: DataPoint[];
  size?: number;
  innerRadius?: number;
  showLabels?: boolean;
  showPercentages?: boolean;
  style?: any;
}

const defaultColors = [
  colors.primary,
  colors.secondary,
  colors.warning,
  colors.error,
  colors.success,
  '#9C27B0',
  '#FF9800',
  '#607D8B',
];

export default function PieChart({
  data,
  size = 200,
  innerRadius = 0,
  showLabels = false,
  showPercentages = false,
  style,
}: PieChartProps) {
  if (!data || data.length === 0) {
    return <View style={[styles.container, { width: size, height: size }, style]} />;
  }

  const radius = size / 2 - 10;
  const center = size / 2;
  const total = data.reduce((sum, item) => sum + item.value, 0);

  let currentAngle = -Math.PI / 2; // Start from top

  const createPath = (startAngle: number, endAngle: number, outerRadius: number, innerRadius: number) => {
    const x1 = center + outerRadius * Math.cos(startAngle);
    const y1 = center + outerRadius * Math.sin(startAngle);
    const x2 = center + outerRadius * Math.cos(endAngle);
    const y2 = center + outerRadius * Math.sin(endAngle);

    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

    if (innerRadius === 0) {
      // Pie chart
      return [
        `M ${center} ${center}`,
        `L ${x1} ${y1}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z',
      ].join(' ');
    } else {
      // Donut chart
      const x3 = center + innerRadius * Math.cos(endAngle);
      const y3 = center + innerRadius * Math.sin(endAngle);
      const x4 = center + innerRadius * Math.cos(startAngle);
      const y4 = center + innerRadius * Math.sin(startAngle);

      return [
        `M ${x1} ${y1}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
        'Z',
      ].join(' ');
    }
  };

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const angle = (item.value / total) * 2 * Math.PI;
          const endAngle = currentAngle + angle;
          
          const path = createPath(currentAngle, endAngle, radius, innerRadius);
          const color = item.color || defaultColors[index % defaultColors.length];

          // Calculate label position
          const labelAngle = currentAngle + angle / 2;
          const labelRadius = innerRadius + (radius - innerRadius) / 2;
          const labelX = center + labelRadius * Math.cos(labelAngle);
          const labelY = center + labelRadius * Math.sin(labelAngle);

          currentAngle = endAngle;

          return (
            <G key={index}>
              <Path
                d={path}
                fill={color}
                stroke="white"
                strokeWidth={2}
              />
              
              {/* Labels */}
              {showLabels && (
                <SvgText
                  x={labelX}
                  y={labelY}
                  fontSize={12}
                  fill="white"
                  textAnchor="middle"
                  fontWeight="600"
                >
                  {showPercentages ? `${percentage.toFixed(1)}%` : item.label}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
});
