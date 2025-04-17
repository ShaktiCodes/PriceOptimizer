"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ShoppingCart, Star, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/auth-provider"
import { UserNav } from "@/components/user-nav"

interface ProductData {
  name: string
  category: string
  baseCost: string
  optimalPrice: number
  description?: string
  timestamp: string
}

export default function StorePage() {
  const { isAuthenticated, isLoading } = useAuth()
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
  }, [])

  if (isLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!productData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">No Product Found</h1>
        <p className="text-muted-foreground mb-6">Please add a product in the dashboard first.</p>
        <Link href="/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    )
  }

  // Generate a placeholder description if none exists
  const description =
    productData.description ||
    `This premium ${productData.category} product offers exceptional quality and value. Designed with the modern consumer in mind, it combines functionality with elegant design. Perfect for everyday use and built to last.`

  // Generate random ratings
  const rating = (4 + Math.random()).toFixed(1)
  const reviewCount = Math.floor(Math.random() * 500) + 50

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <span className="font-semibold">My Store</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <UserNav />
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign up</Button>
                </Link>
              </>
            )}
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg p-8">
            <div className="aspect-square w-full max-w-md rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center p-8">
              {/* Placeholder image based on category */}
              <img
                src={`/placeholder.svg?height=400&width=400&text=${encodeURIComponent(productData.name)}`}
                alt={productData.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-6">
            <div>
              <Badge className="mb-2">{productData.category}</Badge>
              <h1 className="text-3xl font-bold">{productData.name}</h1>
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(Number(rating)) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm font-medium">
                  {rating} ({reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-emerald-600">${productData.optimalPrice.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground">
                <Badge variant="outline" className="font-normal">
                  AI Optimized Price
                </Badge>
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-300">{description}</p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button className="bg-emerald-600 hover:bg-emerald-700 flex-1">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button variant="outline" className="flex-1">
                <Heart className="mr-2 h-4 w-4" />
                Add to Wishlist
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <Separator />

            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-1">Category</h3>
                      <p className="text-sm text-muted-foreground capitalize">{productData.category}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-1">Availability</h3>
                      <p className="text-sm text-emerald-600">In Stock</p>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-1">Product Description</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="shipping" className="pt-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Shipping Information</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>Free shipping on orders over $50</li>
                      <li>Standard delivery: 3-5 business days</li>
                      <li>Express delivery: 1-2 business days (additional fee)</li>
                      <li>International shipping available to select countries</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="reviews" className="pt-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Customer Reviews</h3>
                      <Badge variant="outline">{reviewCount} reviews</Badge>
                    </div>
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="border-b pb-4 last:border-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-medium">Customer {i + 1}</div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, j) => (
                                <Star
                                  key={j}
                                  className={`h-3 w-3 ${j < 4 + (i % 2) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {
                              [
                                "Great product, exactly as described. Would definitely buy again!",
                                "The quality exceeded my expectations. Fast shipping too.",
                                "Good value for the price. Recommended for anyone looking for this type of product.",
                              ][i]
                            }
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => {
              const relatedPrice = (productData.optimalPrice * (0.8 + Math.random() * 0.4)).toFixed(2)
              return (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-4">
                    <img
                      src={`/placeholder.svg?height=200&width=200&text=Related+${i + 1}`}
                      alt={`Related Product ${i + 1}`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium truncate">
                      Related {productData.category} Product {i + 1}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold">${relatedPrice}</span>
                      <Button variant="ghost" size="sm">
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2024 My Store. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
