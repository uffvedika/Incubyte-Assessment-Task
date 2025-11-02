import { type NextRequest, NextResponse } from "next/server"
import { getSweet, updateSweet, deleteSweet } from "@/lib/sweets-data"

// GET - Fetch sweet
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const sweet = getSweet(id)
    if (!sweet) {
      return NextResponse.json({ message: "Sweet not found" }, { status: 404 })
    }
    return NextResponse.json(sweet)
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch sweet" }, { status: 400 })
  }
}

// PUT - Update sweet
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    const updated = updateSweet(id, body)
    if (!updated) {
      return NextResponse.json({ message: "Sweet not found" }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ message: "Failed to update sweet" }, { status: 400 })
  }
}

// DELETE - Remove sweet
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const deleted = deleteSweet(id)
    if (!deleted) {
      return NextResponse.json({ message: "Sweet not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Sweet deleted" })
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete sweet" }, { status: 400 })
  }
}
