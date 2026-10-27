import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { mockPortfolioStocks, portfolioValue } from "@/mocks/stocks"
import type { PortfolioStock } from "@/types/stock"

interface PortfolioState {
  stocks: PortfolioStock[]
  totalValue: number
  change: number
  changePercent: number
  dailyChange: number
  chartData: { date: string; value: number }[]
  addStock: (stock: PortfolioStock) => void
  removeStock: (stockId: string) => void
  updateStock: (stockId: string, shares: number) => void
}

// Default values in case portfolioValue is undefined
const defaultPortfolioValue = {
  total: 0,
  change: 0,
  changePercent: 0,
  dailyChange: 0,
  chart: [],
}

const safePortfolioValue = portfolioValue || defaultPortfolioValue

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set) => ({
      stocks: Array.isArray(mockPortfolioStocks) ? mockPortfolioStocks : [],
      totalValue: safePortfolioValue.total,
      change: safePortfolioValue.change,
      changePercent: safePortfolioValue.changePercent,
      dailyChange: safePortfolioValue.dailyChange,
      chartData: Array.isArray(safePortfolioValue.chart) ? safePortfolioValue.chart : [],

      addStock: (stock) =>
        set((state) => ({
          stocks: [...(state.stocks || []), stock],
          totalValue: state.totalValue + stock.price * stock.shares,
        })),

      removeStock: (stockId) =>
        set((state) => {
          const safeStocks = state.stocks || []
          const stockToRemove = safeStocks.find((s) => s.id === stockId)
          if (!stockToRemove) return state

          return {
            stocks: safeStocks.filter((s) => s.id !== stockId),
            totalValue: state.totalValue - stockToRemove.price * stockToRemove.shares,
          }
        }),

      updateStock: (stockId, shares) =>
        set((state) => {
          const safeStocks = state.stocks || []
          const updatedStocks = safeStocks.map((stock) => {
            if (stock.id === stockId) {
              const oldValue = stock.price * stock.shares
              const newValue = stock.price * shares
              return { ...stock, shares }
            }
            return stock
          })

          const newTotalValue = updatedStocks.reduce((total, stock) => total + stock.price * stock.shares, 0)

          return {
            stocks: updatedStocks,
            totalValue: newTotalValue,
          }
        }),
    }),
    {
      name: "portfolio-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
