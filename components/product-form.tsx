"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { calculateOptimalPrice } from "@/lib/pricing-algorithm"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  category: z.string({
    required_error: "Please select a product category.",
  }),
  baseCost: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Base cost must be a positive number.",
  }),
  competitorUrls: z.string().optional(),
  description: z.string().optional(),
})

export default function ProductForm() {
  const [isCalculating, setIsCalculating] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      baseCost: "",
      competitorUrls: "",
      description: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsCalculating(true)

    try {
      // In a real app, this would call an API endpoint
      // For demo purposes, we'll use a local function with a timeout
      setTimeout(() => {
        const baseCost = Number.parseFloat(values.baseCost)
        const optimalPrice = calculateOptimalPrice(baseCost, values.category)

        // Update global state or context with the new product and price recommendation
        // This is simplified for the demo
        window.localStorage.setItem(
          "lastProduct",
          JSON.stringify({
            ...values,
            optimalPrice,
            timestamp: new Date().toISOString(),
          }),
        )

        toast({
          title: "Price calculation complete",
          description: `Optimal price for ${values.name}: $${optimalPrice.toFixed(2)}`,
        })

        setIsCalculating(false)
      }, 1500)
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "There was an error calculating the optimal price. Please try again.",
        variant: "destructive",
      })
      setIsCalculating(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Wireless Headphones" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="home">Home & Kitchen</SelectItem>
                    <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                    <SelectItem value="toys">Toys & Games</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="sports">Sports & Outdoors</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="baseCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Cost ($)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0.01" placeholder="19.99" {...field} />
              </FormControl>
              <FormDescription>Your manufacturing or wholesale cost per unit</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="competitorUrls"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Competitor URLs (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="https://competitor1.com/product
https://competitor2.com/product"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>Enter one URL per line for competitor products</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Brief description of your product" className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isCalculating}>
          {isCalculating ? "Calculating..." : "Calculate Optimal Price"}
        </Button>
      </form>
    </Form>
  )
}
