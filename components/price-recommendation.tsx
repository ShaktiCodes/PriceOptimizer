"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, TrendingDown, Percent, Eye } from "lucide-react"
import Link from "next/link"

interface ProductData {
  name: string
  category: string
  baseCost: string
  optimalPrice: number
  timestamp: string
}

import { Button } from "@/components/ui/button"

export default function PriceRecommendation() {
  const [productData, setProductData] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch from an API or context
    // For demo purposes, we'll use localStorage
    const storedData = window.localStorage.getItem("lastProduct")

    if (storedData) {
      setProductData(JSON.parse(storedData))
    }

    setLoading(false)

    // Set up a listener for changes
    const handleStorageChange = () => {
      const updatedData = window.localStorage.getItem("lastProduct")
      if (updatedData) {
        setProductData(JSON.parse(updatedData))
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // For demo purposes, check for changes every second
    const interval = setInterval(() => {
      const updatedData = window.localStorage.getItem("lastProduct")
      if (updatedData) {
        const parsed = JSON.parse(updatedData)
        if (!productData || parsed.timestamp !== productData.timestamp) {
          setProductData(parsed)
        }
      }
    }, 1000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-[200px]">Loading recommendation...</div>
  }

  if (!productData) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] text-center">
        <p className="text-muted-foreground mb-2">No product data available</p>
        <p className="text-sm text-muted-foreground">Add a product using the form to see pricing recommendations</p>
      </div>
    )
  }

  const baseCost = Number.parseFloat(productData.baseCost)
  const markup = ((productData.optimalPrice - baseCost) / baseCost) * 100
  const profit = productData.optimalPrice - baseCost
  const profitMargin = (profit / productData.optimalPrice) * 100

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center p-6 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
        <h3 className="text-lg font-medium text-muted-foreground mb-1">Recommended Price</h3>
        <div className="flex items-center">
          <DollarSign className="h-6 w-6 text-emerald-600 mr-1" />
          <span className="text-4xl font-bold text-emerald-600">{productData.optimalPrice.toFixed(2)}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">for {productData.name}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center">
              <p className="text-sm text-muted-foreground mb-1">Markup</p>
              <div className="flex items-center">
                <Percent className="h-4 w-4 mr-1 text-emerald-600" />
                <span className="text-xl font-bold">{markup.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center">
              <p className="text-sm text-muted-foreground mb-1">Profit Margin</p>
              <div className="flex items-center">
                <Percent className="h-4 w-4 mr-1 text-emerald-600" />
                <span className="text-xl font-bold">{profitMargin.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Link href="/store" className="mt-4 w-full">
        <Button variant="outline" className="w-full">
          <Eye className="mr-2 h-4 w-4" />
          Visit Store Preview
        </Button>
      </Link>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Badge variant="outline" className="mr-2">
            Base Cost: ${baseCost.toFixed(2)}
          </Badge>
          <Badge variant="outline">Profit: ${profit.toFixed(2)}</Badge>
        </div>
        <div>
          {markup > 50 ? (
            <Badge className="bg-emerald-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              High Margin
            </Badge>
          ) : markup < 20 ? (
            <Badge variant="destructive">
              <TrendingDown className="h-3 w-3 mr-1" />
              Low Margin
            </Badge>
          ) : (
            <Badge variant="secondary">Average Margin</Badge>
          )}
        </div>
      </div>
    </div>
  )
}
