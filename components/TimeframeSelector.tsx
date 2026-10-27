import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import colors from "@/constants/colors"

interface TimeframeSelectorProps {
  timeframes: string[]
  selectedTimeframe: string
  onSelectTimeframe: (timeframe: string) => void
}

export default function TimeframeSelector({
  timeframes,
  selectedTimeframe,
  onSelectTimeframe,
}: TimeframeSelectorProps) {
  return (
    <View style={styles.container}>
      {timeframes.map((timeframe, index) => (
        <TouchableOpacity
          key={`timeframe-${timeframe}-${index}`}
          style={[styles.timeframeButton, selectedTimeframe === timeframe && styles.selectedTimeframe]}
          onPress={() => onSelectTimeframe(timeframe)}
        >
          <Text style={[styles.timeframeText, selectedTimeframe === timeframe && styles.selectedTimeframeText]}>
            {timeframe}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    marginTop: 16,
  },
  timeframeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 40,
    alignItems: "center",
  },
  selectedTimeframe: {
    backgroundColor: colors.primary,
  },
  timeframeText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.secondaryText,
  },
  selectedTimeframeText: {
    color: "white",
    fontWeight: "600",
  },
})
