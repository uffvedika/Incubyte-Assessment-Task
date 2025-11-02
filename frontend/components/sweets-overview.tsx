"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Sweet {
  id: number
  name: string
  price: number
  category: string
  inStock: number
  ingredients: string[]
}

const INITIAL_SWEETS: Sweet[] = [
  {
    id: 1,
    name: "Gulab Jamun",
    price: 150,
    category: "Indian",
    inStock: 45,
    ingredients: ["Milk Solids", "Sugar Syrup", "Cardamom", "Rose Water"],
  },
  {
    id: 2,
    name: "Jalebi",
    price: 120,
    category: "Indian",
    inStock: 60,
    ingredients: ["Flour", "Sugar Syrup", "Turmeric", "Saffron"],
  },
  {
    id: 3,
    name: "Barfi",
    price: 200,
    category: "Indian",
    inStock: 35,
    ingredients: ["Milk Solids", "Ghee", "Nuts", "Cardamom"],
  },
  {
    id: 4,
    name: "Rasgulla",
    price: 180,
    category: "Indian",
    inStock: 50,
    ingredients: ["Cottage Cheese", "Sugar Syrup", "Cardamom"],
  },
  {
    id: 5,
    name: "Laddu",
    price: 160,
    category: "Indian",
    inStock: 75,
    ingredients: ["Gram Flour", "Ghee", "Sugar", "Dry Fruits"],
  },
  {
    id: 6,
    name: "Kheer",
    price: 140,
    category: "Indian",
    inStock: 40,
    ingredients: ["Rice", "Milk", "Sugar", "Cardamom", "Nuts"],
  },
]

const CATEGORIES = ["Indian", "Chocolate", "Pastry", "Hard Candy"]

export default function SweetsOverview({ expanded = false }: { expanded?: boolean }) {
  const [sweets, setSweets] = useState<Sweet[]>(INITIAL_SWEETS)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    inStock: "",
    ingredients: "",
  })

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

  const handleSaveSweet = () => {
    if (!formData.name || !formData.price || !formData.category || !formData.inStock) {
      alert("Please fill in all fields")
      return
    }

    const newSweet = {
      name: formData.name,
      price: Number.parseInt(formData.price),
      category: formData.category,
      inStock: Number.parseInt(formData.inStock),
      ingredients: formData.ingredients.split(",").map((i) => i.trim()),
    }

    if (editingSweet) {
      setSweets(sweets.map((s) => (s.id === editingSweet.id ? { ...newSweet, id: s.id } : s)))
    } else {
      const maxId = sweets.length > 0 ? Math.max(...sweets.map((s) => s.id)) : 0
      setSweets([...sweets, { ...newSweet, id: maxId + 1 }])
    }

    handleCloseDialog()
  }

  const handleDeleteSweet = (id: number) => {
    if (confirm("Are you sure you want to delete this sweet?")) {
      setSweets(sweets.filter((s) => s.id !== id))
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sweets Inventory</CardTitle>
            <CardDescription>Manage your sweet products and pricing</CardDescription>
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
                <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Price</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">In Stock</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sweets.map((sweet) => (
                <tr key={sweet.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-foreground">{sweet.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{sweet.category}</td>
                  <td className="py-3 px-4 font-semibold text-primary">₹{sweet.price.toLocaleString("en-IN")}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        sweet.inStock > 50
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100"
                      }`}
                    >
                      {sweet.inStock} units
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
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
            <Button onClick={handleSaveSweet}>{editingSweet ? "Update Sweet" : "Add Sweet"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
