import { NextResponse } from "next/server"

const orders = new Map()

export async function POST(request: Request) {
  const { userId, items, totalAmount } = await request.json()

  const order = {
    id: Date.now(),
    userId,
    items,
    totalAmount,
    status: "completed",
    createdAt: new Date().toISOString(),
  }

  orders.set(order.id, order)
  return NextResponse.json(order, { status: 201 })
}

export async function GET() {
  return NextResponse.json(Array.from(orders.values()))
}
