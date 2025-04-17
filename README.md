```
# 🧠 AI-Driven Dynamic Pricing Engine

An intelligent MERN stack application that leverages AI and mathematical models to calculate the optimal selling price for products. It helps e-commerce businesses dynamically adjust their pricing based on demand, competition, and market trends to maximize revenue.

---

## 🚀 Features

- 📊 Predict optimal price using machine learning
- 📈 Visualize revenue vs. price graphs
- 🛒 Input base cost, competitor data, and demand estimates
- 🧠 AI-powered demand prediction and elasticity modeling
- 💡 Real-time pricing recommendations

---

## 🧠 Mathematical Concepts

- Price Elasticity of Demand (PED):
  ```
  PED = (% Change in Quantity Demanded) / (% Change in Price)
  ```

- Revenue Calculation:
  ```
  Revenue = Price × Quantity
  ```

- Demand Curve Estimation:
  - Linear or Polynomial Regression models (using TensorFlow or scikit-learn)
  - Monte Carlo Simulation for uncertainty modeling (optional)

---

## 🛠 Tech Stack

| Layer        | Technology                 |
|--------------|----------------------------|
| Frontend     | React + Vite + Tailwind CSS|
| Backend      | Node.js + Express.js       |
| Database     | MongoDB                    |      | 
| Visualization| Recharts / Chart.js        |

---

## 📂 Folder Structure

```
/client       → React frontend with Vite
/server       → Express backend with API routes
/database     → MongoDB schema and connection logic
```

---

## 📦 Installation & Setup

```bash
# Clone the repository
git clone  https://github.com/ShaktiCodes/PriceOptimizer.git
cd PriceOptimizer

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

# Start backend
cd ../server
npm run dev

# Start frontend
cd ../client
npm run dev
```

## 🧪 Future Enhancements

- 🔍 Web scraping competitors’ prices
- 📦 Integration with Shopify / Amazon APIs
- 🧮 More advanced AI models (Random Forest, XGBoost)
- 📊 A/B testing simulator for pricing strategies

---

## ✨ Author

Shakti Singh Rathaur 

```
