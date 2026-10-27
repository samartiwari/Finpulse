export interface Stock {
  id: string
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  logo:string
  color:any
  marketCap: number
  chartData?: ChartData[]
}

export interface PortfolioStock extends Stock {
  shares: number
  averageCost: number
}

export interface StockDetail extends Stock {
  open: number
  high: number
  low: number
  avgVolume: number
  peRatio: number
  eps: number
  dividend: number
  dividendYield: number
  beta: number
  week52High: number
  week52Low: number
  sharesOutstanding: number
  bookValue: number
  priceToBook: number
  revenue: number
  grossMargin: number
  operatingMargin: number
  netMargin: number
  returnOnEquity: number
  returnOnAssets: number
  debtToEquity: number
  currentRatio: number
  quickRatio: number
  chart: ChartData[]
  description: string
  sector: string
  industry: string
  employees: number
  founded: string
  headquarters: string
  website: string
}

export interface ChartData {
  date: string
  value: number
}

export interface WatchlistItem {
  id: string
  stockId: string
  addedAt: string
}

export interface PriceAlert {
  id: string
  stockId: string
  symbol: string
  targetPrice: number
  condition: "above" | "below"
  isActive: boolean
  createdAt: string
}

export interface MarketNews {
  id: string
  title: string
  summary: string
  source: string
  publishedAt: string
  imageUrl?: string
  url: string
  relatedStocks?: string[]
}

export interface SIPPlan {
  id: string
  stockId: string
  symbol: string
  name: string
  amount: number
  frequency: "weekly" | "monthly" | "quarterly"
  startDate: string
  endDate?: string
  isActive: boolean
  totalInvested: number
  currentValue: number
  returns: number
  returnsPercent: number
}

export interface IPOListing {
  id: string
  companyName: string
  symbol: string
  priceRange: {
    min: number
    max: number
  }
  lotSize: number
  openDate: string
  closeDate: string
  listingDate: string
  status: "upcoming" | "open" | "closed" | "listed"
  description: string
  sector: string
  leadManager: string
  issueSize: number
  minInvestment: number
}
