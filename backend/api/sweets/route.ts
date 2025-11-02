import { type NextRequest, NextResponse } from "next/server"
import { getAllSweets, addSweet } from "@/lib/sweets-data"

// GET - Fetch all sweets
export async function GET() {
  const sweets = getAllSweets()
  return NextResponse.json(sweets)
}

// POST - Add new sweet
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newSweet = addSweet(body)
    return NextResponse.json(newSweet, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to add sweet" }, { status: 400 })
  }
}
