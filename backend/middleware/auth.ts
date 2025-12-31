import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export interface AuthRequest extends Request {
  userId?: string
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Access denied" })
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "secret") as { userId: string }
    req.userId = verified.userId
    next()
  } catch (error) {
    res.status(403).json({ error: "Invalid token" })
  }
}
