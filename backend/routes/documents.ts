import express from "express"
import { authenticateToken, AuthRequest } from "../middleware/auth"
import Document from "../models/Document"

const router = express.Router()

// Get all documents for authenticated user
router.get("/", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const documents = await Document.find({
      $or: [{ owner: req.userId }, { "permissions.user": req.userId }],
    }).populate("owner", "name email")

    res.json(documents)
  } catch (error) {
    console.error("[v0] Fetch documents error:", error)
    res.status(500).json({ error: "Failed to fetch documents" })
  }
})

// Create document
router.post("/", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { title, content, tags } = req.body

    const document = new Document({
      title,
      content,
      tags,
      owner: req.userId,
      version: 1,
    })

    await document.save()
    res.status(201).json(document)
  } catch (error) {
    console.error("[v0] Create document error:", error)
    res.status(500).json({ error: "Failed to create document" })
  }
})

// Update document (creates new version)
router.put("/:id", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const { title, content, tags } = req.body

    const document = await Document.findOne({ _id: id, owner: req.userId })

    if (!document) {
      return res.status(404).json({ error: "Document not found" })
    }

    document.title = title
    document.content = content
    document.tags = tags
    document.version += 1
    document.updatedAt = new Date()

    await document.save()
    res.json(document)
  } catch (error) {
    console.error("[v0] Update document error:", error)
    res.status(500).json({ error: "Failed to update document" })
  }
})

// Delete document
router.delete("/:id", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const document = await Document.findOneAndDelete({ _id: id, owner: req.userId })

    if (!document) {
      return res.status(404).json({ error: "Document not found" })
    }

    res.json({ message: "Document deleted successfully" })
  } catch (error) {
    console.error("[v0] Delete document error:", error)
    res.status(500).json({ error: "Failed to delete document" })
  }
})

// Update permissions
router.post("/:id/permissions", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const { userId, role } = req.body

    const document = await Document.findOne({ _id: id, owner: req.userId })

    if (!document) {
      return res.status(404).json({ error: "Document not found or unauthorized" })
    }

    document.permissions.push({ user: userId, role })
    await document.save()

    res.json(document)
  } catch (error) {
    console.error("[v0] Update permissions error:", error)
    res.status(500).json({ error: "Failed to update permissions" })
  }
})

export default router
