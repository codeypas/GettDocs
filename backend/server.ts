import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth"
import documentRoutes from "./routes/documents"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// ----------------------
// CORS Configuration
// ----------------------
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}

app.use(cors(corsOptions))

// Handle preflight requests for all routes
app.options("*", cors(corsOptions))

// ----------------------
// Body Parsers
// ----------------------
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ----------------------
// Database Connection
// ----------------------
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/getdoc"

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("[v0] ✅ Connected to MongoDB successfully")
  })
  .catch((err) => {
    console.error("[v0] ❌ MongoDB connection error:", err.message)
  })

// ----------------------
// Routes
// ----------------------
app.use("/api/auth", authRoutes)
app.use("/api/docs", documentRoutes)

// Root route
app.get("/", (req, res) => res.send("GetDoc API is Running"))

// Health check
app.get("/health", (req, res) => res.json({ status: "OK", message: "GetDoc API is running" }))

// ----------------------
// Start Server
// ----------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`🔗 Frontend should connect to: http://localhost:${PORT}`)
})
