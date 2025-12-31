"use client"

import { useState, useEffect } from "react"
import { Search, Upload, FileText, Tag, Shield, History, Trash2, Edit } from "lucide-react"
import { documentService, Document } from "../../../services/document.service"
import { authService } from "../../../services/auth.service"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // <CHANGE> Check authentication and fetch documents on mount
    if (!authService.isAuthenticated()) {
      router.push("/")
      return
    }

    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      const docs = await documentService.getDocuments()
      setDocuments(docs)
    } catch (error) {
      console.error("[v0] Failed to load documents:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await documentService.deleteDocument(id)
      setDocuments(documents.filter((doc) => doc._id !== id))
    } catch (error) {
      console.error("[v0] Failed to delete document:", error)
    }
  }

  const handleLogout = () => {
    authService.logout()
    router.push("/")
  }

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">GetDoc DMS</h1>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            <Upload size={18} />
            Upload Document
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="md:col-span-1 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Tag size={16} /> Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(documents.flatMap((doc) => doc.tags))).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition"
                onClick={() => setSearchQuery(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Document List */}
        <div className="md:col-span-3 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {filteredDocuments.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No documents found. Upload your first document!</div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-sm font-semibold text-slate-600">Name</th>
                    <th className="px-6 py-3 text-sm font-semibold text-slate-600">Tags</th>
                    <th className="px-6 py-3 text-sm font-semibold text-slate-600">Version</th>
                    <th className="px-6 py-3 text-sm font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc._id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <FileText className="text-blue-500" size={20} />
                        <span className="font-medium text-slate-700">{doc.title}</span>
                      </td>
                      <td className="px-6 py-4">
                        {doc.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs mr-1">
                            {tag}
                          </span>
                        ))}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">v{doc.version}.0</td>
                      <td className="px-6 py-4 flex gap-3">
                        <button className="text-slate-400 hover:text-blue-600 transition" title="Edit">
                          <Edit size={18} />
                        </button>
                        <button className="text-slate-400 hover:text-blue-600 transition" title="Permissions">
                          <Shield size={18} />
                        </button>
                        <button className="text-slate-400 hover:text-blue-600 transition" title="History">
                          <History size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(doc._id)}
                          className="text-slate-400 hover:text-red-600 transition"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
