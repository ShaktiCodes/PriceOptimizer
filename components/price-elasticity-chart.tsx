"use client"

import { useEffect, useState } from "react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { calculateElasticityData } from "@/lib/pricing-algorithm"

interface ProductData {
  name: string
  category: string
  baseCost: string
  optimalPrice: number
}

export default function PriceElasticityChart() {
  const [elasticityData, setElasticityData] = useState<any[]>([])
  const [productData, setProductData] = useState<ProductData | null>(null)

  useEffect(() => {
    // In a real app, this would fetch from an API or context
    // For demo purposes, we'll use localStorage
    const storedData = window.localStorage.getItem("lastProduct")

    if (storedData) {
      const parsedData = JSON.parse(storedData)
      setProductData(parsedData)

      // Generate elasticity data
      const baseCost = Number.parseFloat(parsedData.baseCost)
      const optimalPrice = parsedData.optimalPrice
      const category = parsedData.category
      const data = calculateElasticityData(baseCost, optimalPrice, category)
      setElasticityData(data)
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
          const category = parsed.category
          const data = calculateElasticityData(baseCost, optimalPrice, category)
          setElasticityData(data)
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!productData || elasticityData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-muted-foreground">Add a product to see price elasticity data</p>
      </div>
    )
  }

  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={elasticityData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="price" label={{ value: "Price ($)", position: "insideBottomRight", offset: -5 }} />
          <YAxis label={{ value: "Quantity Demanded", angle: -90, position: "insideLeft" }} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const elasticity = payload[0].payload.elasticity
                let elasticityType = "Unitary"
                if (elasticity < -1) elasticityType = "Elastic"
                if (elasticity > -1) elasticityType = "Inelastic"

                return (
                  <ChartTooltip>
                    <ChartTooltipContent>
                      <div className="font-medium">Price: ${payload[0].payload.price}</div>
                      <div className="text-sm text-muted-foreground">Quantity: {payload[0].payload.quantity}</div>
                      <div className="text-sm text-muted-foreground">Elasticity: {elasticity.toFixed(2)}</div>
                      <div className="text-sm font-medium mt-1">{elasticityType} Demand</div>
                    </ChartTooltipContent>
                  </ChartTooltip>
                )
              }
              return null
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="quantity" stroke="#10b981" activeDot={{ r: 8 }} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
