"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Edit2, Trash2, LogOut, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface Sweet {
  id: number
  name: string
  price: number
  category: string
  inStock: number
  ingredients: string[]
}

interface AdminStats {
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  totalCustomers: number
}

interface ActivityLog {
  id: number
  action: string
  user: string
  timestamp: string
  status: string
}

interface Promotion {
  id: number
  name: string
  discount: number
  type: "percentage" | "fixed"
  startDate: string
  endDate: string
  status: "active" | "upcoming" | "ended"
}

const CATEGORIES = ["Indian", "Chocolate", "Pastry", "Hard Candy"]

export default function AdminPage() {
  const router = useRouter()
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null)
  const [isRestockOpen, setIsRestockOpen] = useState(false)
  const [restockSweet, setRestockSweet] = useState<Sweet | null>(null)
  const [restockAmount, setRestockAmount] = useState("")
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    inStock: "",
    ingredients: "",
  })
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    totalCustomers: 0,
  })
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [isPromotionDialogOpen, setIsPromotionDialogOpen] = useState(false)
  const [promotionForm, setPromotionForm] = useState({
    name: "",
    discount: "",
    type: "percentage" as const,
    startDate: "",
    endDate: "",
  })

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/auth/login")
      return
    }

    const parsedUser = JSON.parse(storedUser)
    if (parsedUser.role !== "admin") {
      router.push("/shop")
      return
    }

    setUser(parsedUser)
    fetchSweets()
    fetchAdminStats()
    fetchActivityLogs()
    fetchPromotions()
  }, [router])

  const fetchSweets = async () => {
    try {
      const response = await fetch("/api/sweets")
      const data = await response.json()
      setSweets(data)
    } catch (err) {
      console.error("Failed to fetch sweets:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAdminStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      if (response.ok) {
        const data = await response.json()
        setAdminStats(data)
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err)
    }
  }

  const fetchActivityLogs = async () => {
    try {
      const response = await fetch("/api/admin/activity-logs")
      if (response.ok) {
        const data = await response.json()
        setActivityLogs(data)
      }
    } catch (err) {
      console.error("Failed to fetch activity logs:", err)
    }
  }

  const fetchPromotions = async () => {
    try {
      const response = await fetch("/api/promotions")
      if (response.ok) {
        const data = await response.json()
        setPromotions(data)
      }
    } catch (err) {
      console.error("Failed to fetch promotions:", err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/auth/login")
  }

  const handleOpenDialog = (sweet?: Sweet) => {
    if (sweet) {
      setEditingSweet(sweet)
      setFormData({
        name: sweet.name,
        price: sweet.price.toString(),
        category: sweet.category,
        inStock: sweet.inStock.toString(),
        ingredients: sweet.ingredients.join(", "),
      })
    } else {
      setEditingSweet(null)
      setFormData({ name: "", price: "", category: "", inStock: "", ingredients: "" })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingSweet(null)
    setFormData({ name: "", price: "", category: "", inStock: "", ingredients: "" })
  }

  const handleSaveSweet = async () => {
    if (!formData.name || !formData.price || !formData.category || !formData.inStock) {
      alert("Please fill in all fields")
      return
    }

    const sweetData = {
      name: formData.name,
      price: Number.parseInt(formData.price),
      category: formData.category,
      inStock: Number.parseInt(formData.inStock),
      ingredients: formData.ingredients.split(",").map((i) => i.trim()),
    }

    try {
      const url = editingSweet ? `/api/sweets/${editingSweet.id}` : "/api/sweets"
      const method = editingSweet ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sweetData),
      })

      if (!response.ok) {
        alert("Failed to save sweet")
        return
      }

      await fetchSweets()
      handleCloseDialog()
    } catch (err) {
      console.error("Error saving sweet:", err)
      alert("An error occurred")
    }
  }

  const handleDeleteSweet = async (id: number) => {
    if (!confirm("Are you sure you want to delete this sweet?")) return

    try {
      const response = await fetch(`/api/sweets/${id}`, { method: "DELETE" })

      if (!response.ok) {
        alert("Failed to delete sweet")
        return
      }

      await fetchSweets()
    } catch (err) {
      console.error("Error deleting sweet:", err)
      alert("An error occurred")
    }
  }

  const handleRestock = async () => {
    if (!restockSweet || !restockAmount) {
      alert("Please enter restock amount")
      return
    }

    try {
      const response = await fetch(`/api/sweets/${restockSweet.id}/restock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: Number.parseInt(restockAmount) }),
      })

      if (!response.ok) {
        alert("Failed to restock sweet")
        return
      }

      await fetchSweets()
      setIsRestockOpen(false)
      setRestockSweet(null)
      setRestockAmount("")
    } catch (err) {
      console.error("Error restocking sweet:", err)
      alert("An error occurred")
    }
  }

  const handleCreatePromotion = async () => {
    if (!promotionForm.name || !promotionForm.discount || !promotionForm.startDate || !promotionForm.endDate) {
      alert("Please fill in all fields")
      return
    }

    try {
      const response = await fetch("/api/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promotionForm),
      })

      if (response.ok) {
        await fetchPromotions()
        setIsPromotionDialogOpen(false)
        setPromotionForm({ name: "", discount: "", type: "percentage", startDate: "", endDate: "" })
      }
    } catch (err) {
      console.error("Error creating promotion:", err)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const outOfStockCount = sweets.filter((s) => s.inStock === 0).length
  const totalInventoryValue = sweets.reduce((sum, s) => sum + s.price * s.inStock, 0)

  const chartData = [
    { month: "Jan", sales: 4000, orders: 240 },
    { month: "Feb", sales: 3000, orders: 221 },
    { month: "Mar", sales: 2000, orders: 229 },
    { month: "Apr", sales: 2780, orders: 200 },
    { month: "May", sales: 1890, orders: 229 },
    { month: "Jun", sales: 2390, orders: 200 },
  ]

  const categoryData = [
    { name: "Indian", value: 35 },
    { name: "Chocolate", value: 25 },
    { name: "Pastry", value: 20 },
    { name: "Hard Candy", value: 20 },
  ]

  const COLORS = ["#D97706", "#F59E0B", "#FBBF24", "#FCD34D"]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage your sweet shop</p>
          </div>
          <Button variant="outline" className="gap-2 bg-transparent" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="sweets">Sweets</TabsTrigger>
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{adminStats.totalOrders}</div>
                  <p className="text-xs text-muted-foreground mt-1">All time</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">₹{adminStats.totalRevenue.toLocaleString("en-IN")}</div>
                  <p className="text-xs text-muted-foreground mt-1">All time</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg Order Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">₹{adminStats.averageOrderValue.toLocaleString("en-IN")}</div>
                  <p className="text-xs text-muted-foreground mt-1">Per order</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{adminStats.totalCustomers}</div>
                  <p className="text-xs text-muted-foreground mt-1">Registered</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="sales" stroke="#D97706" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sweets">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Sweets Inventory</CardTitle>
                    <CardDescription>Manage your sweet products</CardDescription>
                  </div>
                  <Button className="gap-2" onClick={() => handleOpenDialog()}>
                    <Plus className="w-4 h-4" />
                    Add Sweet
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold">Name</th>
                        <th className="text-left py-3 px-4 font-semibold">Category</th>
                        <th className="text-left py-3 px-4 font-semibold">Price</th>
                        <th className="text-left py-3 px-4 font-semibold">Stock</th>
                        <th className="text-left py-3 px-4 font-semibold">Value</th>
                        <th className="text-left py-3 px-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sweets.map((sweet) => (
                        <tr key={sweet.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{sweet.name}</td>
                          <td className="py-3 px-4 text-muted-foreground">{sweet.category}</td>
                          <td className="py-3 px-4 font-semibold text-primary">₹{sweet.price}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                sweet.inStock > 30
                                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                                  : sweet.inStock > 10
                                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100"
                                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100"
                              }`}
                            >
                              {sweet.inStock} units
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium">
                            ₹{(sweet.price * sweet.inStock).toLocaleString("en-IN")}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                onClick={() => {
                                  setRestockSweet(sweet)
                                  setIsRestockOpen(true)
                                }}
                              >
                                <RefreshCw className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-primary hover:bg-primary/10"
                                onClick={() => handleOpenDialog(sweet)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteSweet(sweet.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="promotions">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Promotions & Discounts</CardTitle>
                    <CardDescription>Manage active and upcoming promotions</CardDescription>
                  </div>
                  <Button className="gap-2" onClick={() => setIsPromotionDialogOpen(true)}>
                    <Plus className="w-4 h-4" />
                    Add Promotion
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {promotions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No promotions yet</p>
                  ) : (
                    promotions.map((promo) => (
                      <div key={promo.id} className="p-4 border rounded-lg space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{promo.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {promo.type === "percentage" ? `${promo.discount}% off` : `₹${promo.discount} off`}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              promo.status === "active"
                                ? "bg-green-100 text-green-700"
                                : promo.status === "upcoming"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {promo.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(promo.startDate).toLocaleDateString()} -{" "}
                          {new Date(promo.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Sales Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="#D97706" />
                    <Bar dataKey="orders" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Activity Logs</CardTitle>
                <CardDescription>Recent system activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityLogs.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No activity yet</p>
                  ) : (
                    activityLogs.map((log) => (
                      <div key={log.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                        <div className="flex-1">
                          <p className="font-medium">{log.action}</p>
                          <p className="text-sm text-muted-foreground">{log.user}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                          <span
                            className={`text-xs font-medium ${
                              log.status === "success" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {log.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSweet ? "Edit Sweet" : "Add New Sweet"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Sweet Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Gulab Jamun"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="150"
                />
              </div>
              <div>
                <Label htmlFor="inStock">In Stock (units)</Label>
                <Input
                  id="inStock"
                  type="number"
                  value={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.value })}
                  placeholder="50"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="ingredients">Ingredients (comma-separated)</Label>
              <Input
                id="ingredients"
                value={formData.ingredients}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                placeholder="Milk Solids, Sugar Syrup, Cardamom"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveSweet}>{editingSweet ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRestockOpen} onOpenChange={setIsRestockOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restock {restockSweet?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Current Stock: <span className="font-semibold">{restockSweet?.inStock} units</span>
            </p>
            <div>
              <Label htmlFor="restockAmount">Add Quantity (units)</Label>
              <Input
                id="restockAmount"
                type="number"
                min="1"
                value={restockAmount}
                onChange={(e) => setRestockAmount(e.target.value)}
                placeholder="50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRestockOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRestock}>Restock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPromotionDialogOpen} onOpenChange={setIsPromotionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Promotion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="promo-name">Promotion Name</Label>
              <Input
                id="promo-name"
                value={promotionForm.name}
                onChange={(e) => setPromotionForm({ ...promotionForm, name: e.target.value })}
                placeholder="e.g., Summer Sale"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discount">Discount Amount</Label>
                <Input
                  id="discount"
                  type="number"
                  value={promotionForm.discount}
                  onChange={(e) => setPromotionForm({ ...promotionForm, discount: e.target.value })}
                  placeholder="50"
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={promotionForm.type}
                  onValueChange={(value) =>
                    setPromotionForm({ ...promotionForm, type: value as "percentage" | "fixed" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={promotionForm.startDate}
                  onChange={(e) => setPromotionForm({ ...promotionForm, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={promotionForm.endDate}
                  onChange={(e) => setPromotionForm({ ...promotionForm, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPromotionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePromotion}>Create Promotion</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
