import { type NextRequest, NextResponse } from "next/server"
import { getSweet, updateSweet } from "@/lib/sweets-data"

// POST - Restock sweet
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const { quantity } = await request.json()

    const sweet = getSweet(id)
    if (!sweet) {
      return NextResponse.json({ message: "Sweet not found" }, { status: 404 })
    }

    const updated = updateSweet(id, { inStock: sweet.inStock + quantity })
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ message: "Failed to restock sweet" }, { status: 400 })
  }
}
