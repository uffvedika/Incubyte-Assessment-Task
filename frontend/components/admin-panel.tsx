"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, Package, DollarSign } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SystemLog {
  id: number
  action: string
  user: string
  timestamp: string
  status: "success" | "warning" | "error"
  details: string
}

interface UserAccount {
  id: number
  username: string
  email: string
  role: "admin" | "manager" | "viewer"
  createdDate: string
  lastLogin: string
  isActive: boolean
}

const salesData = [
  { month: "Jan", sales: 4000, revenue: 240000, orders: 240 },
  { month: "Feb", sales: 3000, revenue: 139800, orders: 221 },
  { month: "Mar", sales: 2000, revenue: 980000, orders: 229 },
  { month: "Apr", sales: 2780, revenue: 390800, orders: 200 },
  { month: "May", sales: 1890, revenue: 480000, orders: 221 },
  { month: "Jun", sales: 2390, revenue: 380000, orders: 250 },
]

const categoryData = [
  { name: "Gulab Jamun", value: 35, revenue: 525000 },
  { name: "Jalebi", value: 25, revenue: 375000 },
  { name: "Barfi", value: 20, revenue: 180000 },
  { name: "Rasgulla", value: 12, revenue: 180000 },
  { name: "Others", value: 8, revenue: 40000 },
]

const COLORS = ["#f59e0b", "#ec4899", "#3b82f6", "#10b981", "#8b5cf6"]

const INITIAL_LOGS: SystemLog[] = [
  {
    id: 1,
    action: "Sweet Added",
    user: "admin@shop.com",
    timestamp: "2025-02-01 14:23",
    status: "success",
    details: "Added new product: Gulab Jamun",
  },
  {
    id: 2,
    action: "Promotion Ended",
    user: "system",
    timestamp: "2025-01-31 23:59",
    status: "success",
    details: "Promotion 'Holi Sale' ended",
  },
  {
    id: 3,
    action: "Inventory Alert",
    user: "system",
    timestamp: "2025-01-31 08:15",
    status: "warning",
    details: "Milk Solids inventory below reorder level",
  },
  {
    id: 4,
    action: "Database Backup",
    user: "system",
    timestamp: "2025-01-30 02:00",
    status: "success",
    details: "Daily backup completed successfully",
  },
]

const INITIAL_USERS: UserAccount[] = [
  {
    id: 1,
    username: "admin_user",
    email: "admin@shop.com",
    role: "admin",
    createdDate: "2025-01-01",
    lastLogin: "2025-02-01 09:30",
    isActive: true,
  },
  {
    id: 2,
    username: "manager_1",
    email: "manager@shop.com",
    role: "manager",
    createdDate: "2025-01-15",
    lastLogin: "2025-02-01 08:15",
    isActive: true,
  },
  {
    id: 3,
    username: "viewer_1",
    email: "viewer@shop.com",
    role: "viewer",
    createdDate: "2025-01-20",
    lastLogin: "2025-01-28 16:45",
    isActive: true,
  },
]

export default function AdminPanel() {
  const [logs, setLogs] = useState<SystemLog[]>(INITIAL_LOGS)
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null)
  const [userFormData, setUserFormData] = useState({
    username: "",
    email: "",
    role: "viewer" as "admin" | "manager" | "viewer",
  })

  const handleOpenUserDialog = (user?: UserAccount) => {
    if (user) {
      setEditingUser(user)
      setUserFormData({
        username: user.username,
        email: user.email,
        role: user.role,
      })
    } else {
      setEditingUser(null)
      setUserFormData({
        username: "",
        email: "",
        role: "viewer",
      })
    }
    setIsUserDialogOpen(true)
  }

  const handleCloseUserDialog = () => {
    setIsUserDialogOpen(false)
    setEditingUser(null)
    setUserFormData({ username: "", email: "", role: "viewer" })
  }

  const handleSaveUser = () => {
    if (!userFormData.username || !userFormData.email) {
      alert("Please fill in all fields")
      return
    }

    if (editingUser) {
      setUsers(
        users.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                username: userFormData.username,
                email: userFormData.email,
                role: userFormData.role,
              }
            : u,
        ),
      )
    } else {
      const maxId = users.length > 0 ? Math.max(...users.map((u) => u.id)) : 0
      const newUser: UserAccount = {
        id: maxId + 1,
        username: userFormData.username,
        email: userFormData.email,
        role: userFormData.role,
        createdDate: new Date().toISOString().split("T")[0],
        lastLogin: "Never",
        isActive: true,
      }
      setUsers([...users, newUser])
    }

    handleCloseUserDialog()
  }

  const handleToggleUserStatus = (id: number) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)))
  }

  const handleDeleteUser = (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u) => u.id !== id))
    }
  }

  const totalRevenue = salesData.reduce((sum, d) => sum + d.revenue, 0)
  const totalOrders = salesData.reduce((sum, d) => sum + d.orders, 0)
  const avgOrderValue = Math.round(totalRevenue / totalOrders)
  const activeUsers = users.filter((u) => u.isActive).length

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100"
      case "manager":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
      case "warning":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100"
      case "error":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₹{(totalRevenue / 100000).toFixed(1)}L</div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +12% vs last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Total Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalOrders}</div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +8% vs last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Avg Order Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₹{avgOrderValue.toLocaleString("en-IN")}</div>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" /> -2% vs last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{activeUsers}</div>
                <p className="text-xs text-muted-foreground mt-1">System users</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Database Status</span>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100">Healthy</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">API Status</span>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100">Online</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Last Backup</span>
                <Badge variant="outline">2025-02-01 02:00 UTC</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales & Revenue Trends</CardTitle>
              <CardDescription>Monthly sales and revenue performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="hsl(var(--color-primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--color-accent))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Indian Sweet</CardTitle>
                <CardDescription>Distribution of revenue across sweet categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} ${value}%`}
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

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Sweet (List)</CardTitle>
                <CardDescription>Detailed revenue breakdown in INR</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {categoryData.map((cat, index) => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm font-medium">{cat.name}</span>
                    </div>
                    <span className="text-sm font-semibold">₹{cat.revenue.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Orders by Month</CardTitle>
              <CardDescription>Monthly order volume</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="hsl(var(--color-primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">User Accounts</h3>
            <Button onClick={() => handleOpenUserDialog()}>Add User</Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold">Username</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Role</th>
                  <th className="text-left py-3 px-4 font-semibold">Created</th>
                  <th className="text-left py-3 px-4 font-semibold">Last Login</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-medium">{user.username}</td>
                    <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                    <td className="py-3 px-4">
                      <Badge className={getRoleColor(user.role)}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{user.createdDate}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{user.lastLogin}</td>
                    <td className="py-3 px-4">
                      <Badge
                        className={
                          user.isActive
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-100"
                        }
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenUserDialog(user)}>
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleToggleUserStatus(user.id)}>
                          {user.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-foreground">{log.action}</h4>
                      <Badge className={getStatusColor(log.status)}>
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{log.details}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>By: {log.user}</span>
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={userFormData.username}
                onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                placeholder="Enter username"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userFormData.email}
                onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                placeholder="user@example.com"
              />
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                value={userFormData.role}
                onValueChange={(value) =>
                  setUserFormData({ ...userFormData, role: value as "admin" | "manager" | "viewer" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseUserDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>{editingUser ? "Update User" : "Add User"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
