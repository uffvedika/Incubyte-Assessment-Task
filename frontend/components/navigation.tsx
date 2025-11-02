"use client"

import { Candy } from "lucide-react"

export default function Navigation() {
  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <Candy className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Sweet Shop</h1>
            <p className="text-xs text-muted-foreground">Management System</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Admin Dashboard</span>
        </div>
      </div>
    </nav>
  )
}
