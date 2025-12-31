"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)

    const backendUrl = "http://localhost:5000"
    const endpoint = isLogin ? `${backendUrl}/api/auth/login` : `${backendUrl}/api/auth/register`

    console.log("[v0] Attempting to connect to:", endpoint)

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      console.log("[v0] Response status:", res.status)

      const result = await res.json()
      if (res.ok) {
        if (isLogin) {
          router.push("/dashboard")
          router.refresh()
        } else {
          setIsLogin(true)
        }
      } else {
        setError(result.error || "Something went wrong")
      }
    } catch (err: any) {
      console.error("[v0] Connection error details:", err)
      setError(`Connection error: ${err.message}. Check if backend is running on port 5000.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
        <CardDescription>
          {isLogin ? "Enter your credentials to access GetDoc" : "Join us to start managing your documents"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input name="name" placeholder="John Doe" required />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input name="email" type="email" placeholder="email@example.com" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input name="password" type="password" required />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : isLogin ? "Sign In" : "Register"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-blue-600 hover:underline">
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
