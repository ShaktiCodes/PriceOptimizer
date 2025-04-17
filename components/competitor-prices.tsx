"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface CompetitorData {
  name: string
  price: number
  comparison: "higher" | "lower" | "similar"
  percentDiff: number
}

interface ProductData {
  name: string
  category: string
  optimalPrice: number
}

export default function CompetitorPrices() {
  const [competitorData, setCompetitorData] = useState<CompetitorData[]>([])
  const [productData, setProductData] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For demo purposes, we'll generate mock data
    const storedData = window.localStorage.getItem("lastProduct")

    if (storedData) {
      const parsedData = JSON.parse(storedData)
      setProductData(parsedData)

      // Generate mock competitor data based on the optimal price
      const optimalPrice = parsedData.optimalPrice
      const mockCompetitors = generateMockCompetitorData(optimalPrice)
      setCompetitorData(mockCompetitors)
    }

    setLoading(false)

    // Set up a listener for changes
    const interval = setInterval(() => {
      const updatedData = window.localStorage.getItem("lastProduct")
      if (updatedData) {
        const parsed = JSON.parse(updatedData)
        if (!productData || parsed.timestamp !== productData.timestamp) {
          setProductData(parsed)
          const optimalPrice = parsed.optimalPrice
          const mockCompetitors = generateMockCompetitorData(optimalPrice)
          setCompetitorData(mockCompetitors)
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const generateMockCompetitorData = (optimalPrice: number): CompetitorData[] => {
    // Generate 3-5 mock competitors with prices around the optimal price
    const numCompetitors = Math.floor(Math.random() * 3) + 3
    const competitors = []

    const competitorNames = [
      "Amazon Basics",
      "Best Buy",
      "Walmart",
      "Target",
      "Costco",
      "eBay Seller",
      "Newegg",
      "AliExpress",
    ]

    const usedNames = new Set()

    for (let i = 0; i < numCompetitors; i++) {
      // Generate a price that's within ±30% of the optimal price
      const priceDiff = Math.random() * 0.6 - 0.3 // -0.3 to 0.3
      const price = optimalPrice * (1 + priceDiff)

      // Determine if the competitor price is higher, lower, or similar
      let comparison: "higher" | "lower" | "similar"
      if (price > optimalPrice * 1.05) {
        comparison = "higher"
      } else if (price < optimalPrice * 0.95) {
        comparison = "lower"
      } else {
        comparison = "similar"
      }

      // Calculate percentage difference
      const percentDiff = Math.abs((price - optimalPrice) / optimalPrice) * 100

      // Select a random competitor name that hasn't been used yet
      let name
      do {
        name = competitorNames[Math.floor(Math.random() * competitorNames.length)]
      } while (usedNames.has(name))

      usedNames.add(name)

      competitors.push({
        name,
        price,
        comparison,
        percentDiff,
      })
    }

    // Sort by price
    return competitors.sort((a, b) => a.price - b.price)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-[200px]">Loading competitor data...</div>
  }

  if (!productData || competitorData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] text-center">
        <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No competitor data available</p>
        <p className="text-sm text-muted-foreground mt-1">Add a product to see competitor analysis</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Market Position</h3>
        <Badge variant="outline">{competitorData.length} Competitors</Badge>
      </div>

      <div className="space-y-3">
        {competitorData.map((competitor, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{competitor.name}</span>
                <div className="flex items-center">
                  <DollarSign className="h-3 w-3 mr-0.5" />
                  <span className="font-bold">{competitor.price.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center">
                  {competitor.comparison === "higher" ? (
                    <>
                      <TrendingUp className="h-3 w-3 mr-1 text-red-500" />
                      <span className="text-red-500">{competitor.percentDiff.toFixed(1)}% higher</span>
                    </>
                  ) : competitor.comparison === "lower" ? (
                    <>
                      <TrendingDown className="h-3 w-3 mr-1 text-emerald-500" />
                      <span className="text-emerald-500">{competitor.percentDiff.toFixed(1)}% lower</span>
                    </>
                  ) : (
                    <span>Similar price (±5%)</span>
                  )}
                </div>
              </div>

              <div className="mt-2">
                <Progress
                  value={competitor.price}
                  max={competitorData[competitorData.length - 1].price * 1.1}
                  className={
                    competitor.comparison === "higher"
                      ? "bg-red-100 dark:bg-red-950"
                      : competitor.comparison === "lower"
                        ? "bg-emerald-100 dark:bg-emerald-950"
                        : "bg-gray-100 dark:bg-gray-800"
                  }
                  indicatorClassName={
                    competitor.comparison === "higher"
                      ? "bg-red-500"
                      : competitor.comparison === "lower"
                        ? "bg-emerald-500"
                        : "bg-gray-500"
                  }
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-center mt-2">
        <Badge className="bg-emerald-600">Your optimal price: ${productData.optimalPrice.toFixed(2)}</Badge>
      </div>
    </div>
  )
}
