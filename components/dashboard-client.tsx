"use client"

import { useState } from "react"
import { Plus, Search, File, MoreVertical, User, LogOut, Clock, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export function DashboardClient({ initialDocs }: { initialDocs: any[] }) {
  const [docs, setDocs] = useState(initialDocs)
  const [search, setSearch] = useState("")

  const filteredDocs = docs.filter(
    (doc) =>
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.tags?.some((t: string) => t.toLowerCase().includes(search.toLowerCase())),
  )

  return (
    <div className="max-w-7xl mx-auto p-6">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <File className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold">GetDoc Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <UploadDialog onUpload={(newDoc) => setDocs([newDoc, ...docs])} />
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => (window.location.href = "/")}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search documents or tags..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => (
          <DocCard key={doc._id} doc={doc} />
        ))}
      </div>
    </div>
  )
}

function UploadDialog({ onUpload }: { onUpload: (doc: any) => void }) {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [tags, setTags] = useState("")

  const handleUpload = async () => {
    setLoading(true)
    const res = await fetch("/api/docs", {
      method: "POST",
      body: JSON.stringify({
        name,
        type: "PDF",
        tags: tags.split(",").map((t) => t.trim()),
        content: "Draft content...",
      }),
      headers: { "Content-Type": "application/json" },
    })

    if (res.ok) {
      window.location.reload()
    }
    setLoading(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> New Document
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Document Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Marketing_Plan.pdf" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tags (comma separated)</label>
            <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="finance, 2024, internal" />
          </div>
          <Button className="w-full" onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading..." : "Confirm Upload"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function DocCard({ doc }: { doc: any }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <File className="h-6 w-6 text-blue-600" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="gap-2">
              <Clock className="h-4 w-4" /> History
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Shield className="h-4 w-4" /> Permissions
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <h3 className="font-semibold text-slate-900 mb-2 truncate">{doc.name}</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {doc.tags?.map((tag: string) => (
          <Badge key={tag} variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
            {tag}
          </Badge>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100">
        <span className="flex items-center gap-1">
          <History className="h-3 w-3" /> v{doc.versions?.length || 1}
        </span>
        <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
      </div>
    </div>
  )
}
