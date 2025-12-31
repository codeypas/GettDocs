import type React from "react"
import { AuthForm } from "@/components/auth-form"
import { FileText, Shield, Search, History } from "lucide-react"
import { Suspense } from "react"

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <FileText className="text-white h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">GetDoc</h1>
          </div>
          <p className="text-lg text-slate-600">
            Professional Document Management System built for modern teams. Secure, fast, and organized.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Feature icon={<Shield className="h-5 w-5" />} title="Permissions" text="Granular access control" />
            <Feature icon={<Search className="h-5 w-5" />} title="Smart Search" text="Find docs by tags" />
            <Feature icon={<History className="h-5 w-5" />} title="Versioning" text="Track every change" />
            <Feature icon={<FileText className="h-5 w-5" />} title="Storage" text="Supports PDF, Images" />
          </div>
        </div>
        <Suspense fallback={null}>
          <AuthForm />
        </Suspense>
      </div>
    </main>
  )
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-3">
      <div className="text-blue-600">{icon}</div>
      <div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500">{text}</p>
      </div>
    </div>
  )
}
