import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    totalOrders: 156,
    totalRevenue: 45600,
    averageOrderValue: 292,
    totalCustomers: 89,
  })
}
