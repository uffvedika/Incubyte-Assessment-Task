import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json([
    { id: 1, action: "Order placed", user: "user@example.com", timestamp: "2 hours ago", status: "success" },
    { id: 2, action: "Sweet added", user: "admin@sweetshop.com", timestamp: "5 hours ago", status: "success" },
    { id: 3, action: "Stock updated", user: "admin@sweetshop.com", timestamp: "1 day ago", status: "success" },
    { id: 4, action: "Review submitted", user: "user2@example.com", timestamp: "1 day ago", status: "success" },
  ])
}
