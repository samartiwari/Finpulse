import { View, Text, StyleSheet, Dimensions } from "react-native"
import { LineChart } from "react-native-chart-kit"
import TimeframeSelector from "./TimeframeSelector"
import colors from "@/constants/colors"

interface ChartData {
  date: string
  value: number
}

interface AdvancedChartProps {
  data: ChartData[]
  width?: number
  height?: number
  color?: string
  timeframe?: string
  onTimeframeChange?: (timeframe: string) => void
}

const screenWidth = Dimensions.get("window").width

export default function AdvancedChart({
  data,
  width = screenWidth - 40,
  height = 200,
  color = colors.primary,
  timeframe = "1D",
  onTimeframeChange,
}: AdvancedChartProps) {
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyChart}>
          <Text style={styles.emptyText}>No chart data available</Text>
        </View>
        {onTimeframeChange && (
          <TimeframeSelector
            timeframes={["1D", "1W", "1M", "3M", "6M", "1Y"]}
            selectedTimeframe={timeframe}
            onSelectTimeframe={onTimeframeChange}
          />
        )}
      </View>
    )
  }

  // Prepare data for the chart
  const chartData = {
    labels: data.map((_, index) => {
      if (data.length <= 7) return "" // Don't show labels for small datasets
      if (index % Math.ceil(data.length / 6) === 0) {
        const date = new Date(data[index].date)
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      }
      return ""
    }),
    datasets: [
      {
        data: data.map((item) => item.value),
        color: (opacity = 1) => color,
        strokeWidth: 2,
      },
    ],
  }

  const chartConfig = {
    backgroundColor: "transparent",
    backgroundGradientFrom: "white",
    backgroundGradientTo: "white",
    decimalPlaces: 2,
    color: (opacity = 1) => color,
    labelColor: (opacity = 1) => colors.secondaryText,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "0",
    },
    propsForBackgroundLines: {
      strokeDasharray: "",
      stroke: "#E5E5E5",
      strokeWidth: 1,
    },
    propsForLabels: {
      fontSize: 12,
    },
  }

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={width}
        height={height}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withDots={false}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        fromZero={false}
      />

      {onTimeframeChange && (
        <TimeframeSelector
          timeframes={["1D", "1W", "1M", "3M", "6M", "1Y"]}
          selectedTimeframe={timeframe}
          onSelectTimeframe={onTimeframeChange}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  emptyChart: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    marginVertical: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.secondaryText,
  },
})
