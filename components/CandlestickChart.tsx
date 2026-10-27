import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';

interface CandleData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CandlestickChartProps {
  data: CandleData[];
  width: number;
  height: number;
}

export default function CandlestickChart({ data, width, height }: CandlestickChartProps) {
  if (!data || data.length === 0) {
    // Generate sample candlestick data
    const sampleData: CandleData[] = Array.from({ length: 30 }, (_, i) => {
      const basePrice = 150 + Math.sin(i * 0.1) * 20;
      const open = basePrice + (Math.random() - 0.5) * 10;
      const close = open + (Math.random() - 0.5) * 15;
      const high = Math.max(open, close) + Math.random() * 8;
      const low = Math.min(open, close) - Math.random() * 8;
      return {
        date: `day-${i}`,
        open,
        high,
        low,
        close,
        volume: Math.random() * 1000000
      };
    });
    data = sampleData;
  }

  // Filter out invalid data
  const validData = data.filter(d => 
    d && 
    typeof d.high === 'number' && !isNaN(d.high) &&
    typeof d.low === 'number' && !isNaN(d.low) &&
    typeof d.open === 'number' && !isNaN(d.open) &&
    typeof d.close === 'number' && !isNaN(d.close)
  );
  
  if (validData.length === 0) {
    // If no valid data, use sample data
    const sampleData: CandleData[] = Array.from({ length: 30 }, (_, i) => {
      const basePrice = 150 + Math.sin(i * 0.1) * 20;
      const open = basePrice + (Math.random() - 0.5) * 10;
      const close = open + (Math.random() - 0.5) * 15;
      const high = Math.max(open, close) + Math.random() * 8;
      const low = Math.min(open, close) - Math.random() * 8;
      return {
        date: `day-${i}`,
        open,
        high,
        low,
        close,
        volume: Math.random() * 1000000
      };
    });
    data = sampleData;
  } else {
    data = validData;
  }
  
  const maxPrice = Math.max(...data.map(d => d.high));
  const minPrice = Math.min(...data.map(d => d.low));
  const priceRange = maxPrice - minPrice || 1;
  
  const candleWidth = (width - 40) / data.length;
  const maxCandleWidth = Math.min(candleWidth * 0.8, 12);

  const getY = (price: number) => {
    const y = height - 20 - ((price - minPrice) / priceRange) * (height - 40);
    // Ensure no NaN values
    return isNaN(y) ? height / 2 : y;
  };

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        {data.map((candle, index) => {
          const x = 20 + (index * candleWidth) + (candleWidth - maxCandleWidth) / 2;
          const openY = getY(candle.open);
          const closeY = getY(candle.close);
          const highY = getY(candle.high);
          const lowY = getY(candle.low);
          
          // Ensure all coordinates are valid numbers
          const safeX = isNaN(x) ? 20 : x;
          const safeOpenY = isNaN(openY) ? height / 2 : openY;
          const safeCloseY = isNaN(closeY) ? height / 2 : closeY;
          const safeHighY = isNaN(highY) ? height / 2 : highY;
          const safeLowY = isNaN(lowY) ? height / 2 : lowY;
          
          const isGreen = candle.close > candle.open;
          const bodyTop = Math.min(safeOpenY, safeCloseY);
          const bodyHeight = Math.abs(safeCloseY - safeOpenY) || 1;
          
          return (
            <React.Fragment key={index}>
              {/* High-Low line */}
              <Line
                x1={safeX + maxCandleWidth / 2}
                y1={safeHighY}
                x2={safeX + maxCandleWidth / 2}
                y2={safeLowY}
                stroke={isGreen ? '#00C896' : '#FF3B30'}
                strokeWidth={1}
              />
              
              {/* Candle body */}
              <Rect
                x={safeX}
                y={bodyTop}
                width={maxCandleWidth}
                height={bodyHeight}
                fill={isGreen ? '#00C896' : '#FF3B30'}
                stroke={isGreen ? '#00C896' : '#FF3B30'}
                strokeWidth={1}
              />
            </React.Fragment>
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