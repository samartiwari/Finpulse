import { View, Text, StyleSheet } from "react-native"
import type { StockDetail } from "@/types/stock"
import colors from "@/constants/colors"
import { useCurrencyStore } from "@/store/currencyStore"

interface StockStatisticsProps {
  stock: StockDetail
}

export default function StockStatistics({ stock }: StockStatisticsProps) {
  const { formatAmount } = useCurrencyStore()

  const StatItem = ({ label, value, isPositive }: { label: string; value: string; isPositive?: boolean }) => (
    <View style={styles.statItem}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text
        style={[styles.statValue, isPositive !== undefined && { color: isPositive ? colors.success : colors.error }]}
      >
        {value}
      </Text>
    </View>
  )

  const formatNumber = (num: number | undefined, suffix = "", prefix = "") => {
    if (num === undefined || num === null) return "N/A"
    if (num >= 1000000000) return `${prefix}${(num / 1000000000).toFixed(2)}B${suffix}`
    if (num >= 1000000) return `${prefix}${(num / 1000000).toFixed(2)}M${suffix}`
    if (num >= 1000) return `${prefix}${(num / 1000).toFixed(2)}K${suffix}`
    return `${prefix}${num.toFixed(2)}${suffix}`
  }

  const formatPercentage = (num: number | undefined) => {
    if (num === undefined || num === null) return "N/A"
    return `${num.toFixed(2)}%`
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Key Statistics</Text>

      <View style={styles.statsGrid}>
        <StatItem label="Open" value={formatAmount(stock.open)} />
        <StatItem label="High" value={formatAmount(stock.high)} />
        <StatItem label="Low" value={formatAmount(stock.low)} />
        <StatItem label="Volume" value={formatNumber(stock.volume)} />
        <StatItem label="Avg Volume" value={formatNumber(stock.avgVolume)} />
        <StatItem label="Market Cap" value={formatNumber(stock.marketCap, "", "$")} />

        {stock.peRatio && <StatItem label="P/E Ratio" value={stock.peRatio.toFixed(2)} />}
        {stock.eps && <StatItem label="EPS" value={formatAmount(stock.eps)} />}
        {stock.dividend && <StatItem label="Dividend" value={formatAmount(stock.dividend)} />}
        {stock.dividendYield && <StatItem label="Dividend Yield" value={formatPercentage(stock.dividendYield)} />}
        {stock.beta && <StatItem label="Beta" value={stock.beta.toFixed(2)} />}
        {stock.week52High && <StatItem label="52W High" value={formatAmount(stock.week52High)} />}
        {stock.week52Low && <StatItem label="52W Low" value={formatAmount(stock.week52Low)} />}
        {stock.sharesOutstanding && (
          <StatItem label="Shares Outstanding" value={formatNumber(stock.sharesOutstanding, "B")} />
        )}
      </View>

      {(stock.revenue || stock.grossMargin || stock.operatingMargin || stock.netMargin) && (
        <>
          <Text style={styles.sectionTitle}>Financial Metrics</Text>
          <View style={styles.statsGrid}>
            {stock.revenue && <StatItem label="Revenue" value={formatNumber(stock.revenue, "B", "$")} />}
            {stock.grossMargin && <StatItem label="Gross Margin" value={formatPercentage(stock.grossMargin)} />}
            {stock.operatingMargin && (
              <StatItem
                label="Operating Margin"
                value={formatPercentage(stock.operatingMargin)}
                isPositive={stock.operatingMargin > 0}
              />
            )}
            {stock.netMargin && (
              <StatItem label="Net Margin" value={formatPercentage(stock.netMargin)} isPositive={stock.netMargin > 0} />
            )}
            {stock.returnOnEquity && (
              <StatItem
                label="ROE"
                value={formatPercentage(stock.returnOnEquity)}
                isPositive={stock.returnOnEquity > 0}
              />
            )}
            {stock.returnOnAssets && (
              <StatItem
                label="ROA"
                value={formatPercentage(stock.returnOnAssets)}
                isPositive={stock.returnOnAssets > 0}
              />
            )}
          </View>
        </>
      )}

      {(stock.sector || stock.industry || stock.employees) && (
        <>
          <Text style={styles.sectionTitle}>Company Info</Text>
          <View style={styles.companyInfo}>
            {stock.sector && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Sector:</Text>
                <Text style={styles.infoValue}>{stock.sector}</Text>
              </View>
            )}
            {stock.industry && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Industry:</Text>
                <Text style={styles.infoValue}>{stock.industry}</Text>
              </View>
            )}
            {stock.employees && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Employees:</Text>
                <Text style={styles.infoValue}>{stock.employees.toLocaleString()}</Text>
              </View>
            )}
            {stock.founded && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Founded:</Text>
                <Text style={styles.infoValue}>{stock.founded}</Text>
              </View>
            )}
            {stock.headquarters && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Headquarters:</Text>
                <Text style={styles.infoValue}>{stock.headquarters}</Text>
              </View>
            )}
          </View>
        </>
      )}

      {stock.description && (
        <>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{stock.description}</Text>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 16,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  statItem: {
    width: "50%",
    paddingVertical: 8,
    paddingRight: 16,
  },
  statLabel: {
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  companyInfo: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  infoLabel: {
    fontSize: 14,
    color: colors.secondaryText,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
    flex: 2,
    textAlign: "right",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.secondaryText,
    marginBottom: 16,
  },
})
