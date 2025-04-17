"use client"

import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, TrendingUp, BarChart3, ShoppingCart } from "lucide-react"
import ProductForm from "@/components/product-form"
import PriceRecommendation from "@/components/price-recommendation"
import RevenueChart from "@/components/revenue-chart"
import CompetitorPrices from "@/components/competitor-prices"
import PriceElasticityChart from "@/components/price-elasticity-chart"
import DashboardSkeleton from "@/components/dashboard-skeleton"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { UserNav } from "@/components/user-nav"

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <DollarSign className="h-6 w-6 text-emerald-600" />
              <span className="font-bold">PriceOptimizer AI</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link href="/dashboard" className="transition-colors hover:text-foreground/80">
                Dashboard
              </Link>
              <Link href="/products" className="transition-colors hover:text-foreground/80">
                Products
              </Link>
              <Link href="/analytics" className="transition-colors hover:text-foreground/80">
                Analytics
              </Link>
              <Link href="/settings" className="transition-colors hover:text-foreground/80">
                Settings
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dynamic Pricing Dashboard</h2>
          <Link href="/store">
            <Button variant="outline" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Visit Store Preview
            </Button>
          </Link>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Price</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$32.50</div>
                  <p className="text-xs text-muted-foreground">+2.5% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Price Elasticity</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-1.2</div>
                  <p className="text-xs text-muted-foreground">Elastic demand</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">+2 new this month</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Add New Product</CardTitle>
                  <CardDescription>Enter product details to get pricing recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div>Loading form...</div>}>
                    <ProductForm />
                  </Suspense>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Price Recommendation</CardTitle>
                  <CardDescription>AI-generated optimal price point</CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div>Calculating optimal price...</div>}>
                    <PriceRecommendation />
                  </Suspense>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Revenue Projection</CardTitle>
                  <CardDescription>Estimated revenue at different price points</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <Suspense fallback={<DashboardSkeleton />}>
                    <RevenueChart />
                  </Suspense>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Competitor Prices</CardTitle>
                  <CardDescription>Market analysis of similar products</CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div>Loading competitor data...</div>}>
                    <CompetitorPrices />
                  </Suspense>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Price Elasticity of Demand</CardTitle>
                  <CardDescription>How demand changes with price variations</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <Suspense fallback={<DashboardSkeleton />}>
                    <PriceElasticityChart />
                  </Suspense>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
