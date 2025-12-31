import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardClient } from "@/components/dashboard-client"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect("/")

  const client = await clientPromise
  const db = client.db("getdoc")

  // Fetch initial docs
  const docs = await db
    .collection("documents")
    .find({
      $or: [{ owner: new ObjectId(session.userId) }, { "permissions.userId": new ObjectId(session.userId) }],
    })
    .sort({ updatedAt: -1 })
    .toArray()

  // Convert ObjectIds to strings for the client
  const serializedDocs = docs.map((doc) => ({
    ...doc,
    _id: doc._id.toString(),
    owner: doc.owner.toString(),
  }))

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardClient initialDocs={serializedDocs} />
    </div>
  )
}
