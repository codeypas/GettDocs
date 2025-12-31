import express from "express"
import jwt from "jsonwebtoken"
import User from "../models/User"

const router = express.Router()

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    }

    const user = new User({ email, password, name })
    await user.save()

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "7d",
    })

    res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name } })
  } catch (error) {
    console.error("[v0] Registration error:", error)
    res.status(500).json({ error: "Registration failed" })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const isValidPassword = await user.comparePassword(password)
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "7d",
    })

    res.json({ token, user: { id: user._id, email: user.email, name: user.name } })
  } catch (error) {
    console.error("[v0] Login error:", error)
    res.status(500).json({ error: "Login failed" })
  }
})

export default router
