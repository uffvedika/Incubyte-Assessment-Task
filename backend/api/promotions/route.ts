import { NextResponse } from "next/server"

const promotions = new Map([
  [
    1,
    {
      id: 1,
      name: "Summer Sale",
      discount: 20,
      type: "percentage",
      startDate: "2024-06-01",
      endDate: "2024-06-30",
      status: "active",
    },
  ],
  [
    2,
    {
      id: 2,
      name: "Festival Offer",
      discount: 50,
      type: "fixed",
      startDate: "2024-07-01",
      endDate: "2024-07-31",
      status: "upcoming",
    },
  ],
])

export async function GET() {
  return NextResponse.json(Array.from(promotions.values()))
}

export async function POST(request: Request) {
  const { name, discount, type, startDate, endDate } = await request.json()

  const promo = {
    id: Date.now(),
    name,
    discount: Number.parseInt(discount),
    type,
    startDate,
    endDate,
    status: "upcoming",
  }

  promotions.set(promo.id, promo)
  return NextResponse.json(promo, { status: 201 })
}
