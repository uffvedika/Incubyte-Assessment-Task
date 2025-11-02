import { NextResponse, type NextRequest } from "next/server"
import { getSweet, updateSweet } from "@/lib/sweets-data"

const sweetStore = new Map([
  [
    1,
    {
      id: 1,
      name: "Gulab Jamun",
      price: 150,
      category: "Indian",
      inStock: 50,
      ingredients: ["Milk Solids", "Sugar", "Cardamom"],
    },
  ],
  [
    2,
    {
      id: 2,
      name: "Jalebi",
      price: 120,
      category: "Indian",
      inStock: 40,
      ingredients: ["Flour", "Sugar Syrup", "Saffron"],
    },
  ],
  [
    3,
    {
      id: 3,
      name: "Barfi",
      price: 180,
      category: "Indian",
      inStock: 30,
      ingredients: ["Coconut", "Condensed Milk", "Nuts"],
    },
  ],
  [
    4,
    { id: 4, name: "Rasgulla", price: 140, category: "Indian", inStock: 45, ingredients: ["Paneer", "Sugar", "Milk"] },
  ],
  [
    5,
    {
      id: 5,
      name: "Laddu",
      price: 160,
      category: "Indian",
      inStock: 35,
      ingredients: ["Chickpea Flour", "Ghee", "Sugar"],
    },
  ],
  [
    6,
    {
      id: 6,
      name: "Kheer",
      price: 200,
      category: "Indian",
      inStock: 25,
      ingredients: ["Rice", "Milk", "Cardamom", "Dry Fruits"],
    },
  ],
])

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { quantity } = await request.json()
    const sweetId = Number.parseInt(params.id)

    const sweet = getSweet(sweetId)
    if (!sweet) {
      return NextResponse.json({ error: "Sweet not found" }, { status: 404 })
    }

    const newStock = Math.max(0, sweet.inStock - quantity)
    const updated = updateSweet(sweetId, { inStock: newStock })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: "Failed to process purchase" }, { status: 400 })
  }
}
