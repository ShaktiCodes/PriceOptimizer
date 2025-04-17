// This is a simplified pricing algorithm for demonstration purposes
// In a real application, this would be more sophisticated and likely server-side

// Calculate optimal price based on base cost and category
export function calculateOptimalPrice(baseCost: number, category: string): number {
  // Different categories have different markup strategies
  const markupFactors: Record<string, number> = {
    electronics: 1.4,
    clothing: 2.2,
    home: 1.8,
    beauty: 2.5,
    toys: 1.9,
    books: 1.5,
    sports: 1.7,
    // Default markup
    default: 1.6,
  }

  // Get the markup factor for the category, or use default
  const markupFactor = markupFactors[category] || markupFactors.default

  // Calculate the base optimal price
  let optimalPrice = baseCost * markupFactor

  // Add some randomness to make it look more realistic
  const randomFactor = 0.95 + Math.random() * 0.1 // Between 0.95 and 1.05
  optimalPrice *= randomFactor

  // Round to 2 decimal places
  return Math.round(optimalPrice * 100) / 100
}

// Generate revenue data for different price points
export function calculateRevenueData(baseCost: number, optimalPrice: number): any[] {
  const data = []

  // Generate 15 price points around the optimal price
  const minPrice = baseCost * 1.05 // Minimum price is slightly above cost
  const maxPrice = baseCost * 3 // Maximum price is 3x the cost

  // Calculate the elasticity coefficient (simplified)
  // In a real model, this would be derived from historical data
  const elasticityCoefficient = -1.2 // Typical value for most consumer goods

  // Reference point: optimal price and its expected quantity
  const referenceQuantity = 1000 // Arbitrary reference quantity

  for (let i = 0; i < 15; i++) {
    const price = minPrice + (maxPrice - minPrice) * (i / 14)

    // Calculate quantity based on price elasticity formula
    // Q2 = Q1 * (P2/P1)^elasticity
    const quantity = Math.round(referenceQuantity * Math.pow(price / optimalPrice, elasticityCoefficient))

    // Calculate revenue
    const revenue = price * quantity

    data.push({
      price: Number.parseFloat(price.toFixed(2)),
      revenue: Math.round(revenue),
      unitsSold: quantity,
    })
  }

  return data
}

// Generate price elasticity data
export function calculateElasticityData(baseCost: number, optimalPrice: number, category: string): any[] {
  const data = []

  // Generate 15 price points around the optimal price
  const minPrice = baseCost * 1.05 // Minimum price is slightly above cost
  const maxPrice = baseCost * 3 // Maximum price is 3x the cost

  // Different categories have different elasticity characteristics
  const elasticityFactors: Record<string, number> = {
    electronics: -1.5, // More elastic (price sensitive)
    clothing: -1.2,
    home: -1.0,
    beauty: -0.8,
    toys: -1.3,
    books: -0.7, // Less elastic (less price sensitive)
    sports: -1.1,
    // Default elasticity
    default: -1.0,
  }

  // Get the elasticity factor for the category, or use default
  const baseElasticity = elasticityFactors[category] || elasticityFactors.default

  // Reference point: optimal price and its expected quantity
  const referenceQuantity = 1000 // Arbitrary reference quantity

  for (let i = 0; i < 15; i++) {
    const price = minPrice + (maxPrice - minPrice) * (i / 14)

    // Add some variation to elasticity based on price point
    // Products tend to be more elastic at higher prices
    const priceRatio = price / optimalPrice
    const adjustedElasticity = baseElasticity * (0.8 + priceRatio * 0.4)

    // Calculate quantity based on price elasticity formula
    // Q2 = Q1 * (P2/P1)^elasticity
    const quantity = Math.round(referenceQuantity * Math.pow(price / optimalPrice, adjustedElasticity))

    data.push({
      price: Number.parseFloat(price.toFixed(2)),
      quantity: quantity,
      elasticity: adjustedElasticity,
    })
  }

  return data
}
