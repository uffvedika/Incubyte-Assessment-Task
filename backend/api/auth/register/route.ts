import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password required" }, { status: 400 })
    }

    // In a real app, you'd save to database and hash password
    const token = Buffer.from(`new_user:${email}`).toString("base64")

    return NextResponse.json(
      {
        token,
        user: { id: Date.now(), email, role: "user" },
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
