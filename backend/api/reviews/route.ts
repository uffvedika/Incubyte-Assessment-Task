import { NextResponse } from "next/server"

const reviews = new Map()

export async function GET() {
  return NextResponse.json(Array.from(reviews.values()))
}

export async function POST(request: Request) {
  const { sweetId, userId, rating, comment } = await request.json()

  const review = {
    id: Date.now(),
    sweetId,
    userId,
    rating,
    comment,
    createdAt: new Date().toISOString(),
  }

  reviews.set(review.id, review)
  return NextResponse.json(review, { status: 201 })
}
