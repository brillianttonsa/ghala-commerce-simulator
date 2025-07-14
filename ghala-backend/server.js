import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import merchantRoutes from "./routes/merchantRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import pool from "./db/db.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Test DB connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to database:", err)
  } else {
    console.log("Connected to PostgreSQL database")
    release()
  }
})

// API Routes
app.use("/api/merchants", merchantRoutes)
app.use("/api/orders", orderRoutes)

app.get("/", (req, res) => {
  res.send("Welcome to the Ghala Backend API!")
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
