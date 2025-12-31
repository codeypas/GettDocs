import { Injectable } from "@angular/core"

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private baseUrl = "http://localhost:5000/api"

  async getDocuments() {
    const response = await fetch(`${this.baseUrl}/docs`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    return response.json()
  }

  async login(credentials: any) {
    const res = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })
    const data = await res.json()
    if (data.token) localStorage.setItem("token", data.token)
    return data
  }

  async uploadDocument(docData: any) {
    const res = await fetch(`${this.baseUrl}/docs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(docData),
    })
    return res.json()
  }

  // ... existing logic ...
}
