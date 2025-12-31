import mongoose from "mongoose"

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String }, // For simplicity, storing text or URL
  tags: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  version: { type: Number, default: 1 },
  permissions: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      role: { type: String, enum: ["viewer", "editor"] },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.model("Document", documentSchema)
