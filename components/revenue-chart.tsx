"use client"

import { useEffect, useState } from "react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { calculateRevenueData } from "@/lib/pricing-algorithm"

interface ProductData {
  name: string
  category: string
  baseCost: string
  optimalPrice: number
}

export default function RevenueChart() {
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [productData, setProductData] = useState<ProductData | null>(null)

  useEffect(() => {
    // In a real app, this would fetch from an API or context
    // For demo purposes, we'll use localStorage
    const storedData = window.localStorage.getItem("lastProduct")

    if (storedData) {
      const parsedData = JSON.parse(storedData)
      setProductData(parsedData)

      // Generate revenue projection data
      const baseCost = Number.parseFloat(parsedData.baseCost)
      const optimalPrice = parsedData.optimalPrice
      const data = calculateRevenueData(baseCost, optimalPrice)
      setRevenueData(data)
    }

    // Set up a listener for changes
    const interval = setInterval(() => {
      const updatedData = window.localStorage.getItem("lastProduct")
      if (updatedData) {
        const parsed = JSON.parse(updatedData)
        if (!productData || parsed.timestamp !== productData.timestamp) {
          setProductData(parsed)
          const baseCost = Number.parseFloat(parsed.baseCost)
          const optimalPrice = parsed.optimalPrice
          const data = calculateRevenueData(baseCost, optimalPrice)
          setRevenueData(data)
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!productData || revenueData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-muted-foreground">Add a product to see revenue projections</p>
      </div>
    )
  }

  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={revenueData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="price" label={{ value: "Price ($)", position: "insideBottomRight", offset: -5 }} />
          <YAxis label={{ value: "Revenue ($)", angle: -90, position: "insideLeft" }} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <ChartTooltip>
                    <ChartTooltipContent>
                      <div className="font-medium">Price: ${payload[0].payload.price}</div>
                      <div className="text-sm text-muted-foreground">Revenue: ${payload[0].payload.revenue}</div>
                      <div className="text-sm text-muted-foreground">Units Sold: {payload[0].payload.unitsSold}</div>
                    </ChartTooltipContent>
                  </ChartTooltip>
                )
              }
              return null
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#10b981" activeDot={{ r: 8 }} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
