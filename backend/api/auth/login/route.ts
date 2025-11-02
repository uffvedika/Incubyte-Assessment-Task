import { type NextRequest, NextResponse } from "next/server"

// Mock user database
const users = [
  { id: 1, email: "admin@sweetshop.com", password: "password123", role: "admin" },
  { id: 2, email: "user@sweetshop.com", password: "password123", role: "user" },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // In a real app, you'd use JWT
    const token = Buffer.from(`${user.id}:${user.email}`).toString("base64")

    return NextResponse.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
