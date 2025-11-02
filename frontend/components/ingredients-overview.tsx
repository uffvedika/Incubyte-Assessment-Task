"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit2, Trash2, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Ingredient {
  id: number
  name: string
  unit: string
  pricePerUnit: number
  quantity: number
  supplier: string
  reorderLevel: number
  lastUpdated: string
}

const INITIAL_INGREDIENTS: Ingredient[] = [
  {
    id: 1,
    name: "Cocoa Powder",
    unit: "kg",
    pricePerUnit: 12.5,
    quantity: 5,
    supplier: "Premium Imports",
    reorderLevel: 3,
    lastUpdated: "2025-01-15",
  },
  {
    id: 2,
    name: "Sugar",
    unit: "kg",
    pricePerUnit: 0.8,
    quantity: 25,
    supplier: "Local Mills",
    reorderLevel: 10,
    lastUpdated: "2025-01-10",
  },
  {
    id: 3,
    name: "Butter",
    unit: "kg",
    pricePerUnit: 8.5,
    quantity: 10,
    supplier: "Dairy Co",
    reorderLevel: 5,
    lastUpdated: "2025-01-12",
  },
]

const UNITS = ["kg", "g", "liter", "ml", "unit", "box"]

export default function IngredientsOverview({ expanded = false }: { expanded?: boolean }) {
  const [ingredients, setIngredients] = useState<Ingredient[]>(INITIAL_INGREDIENTS)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    unit: "",
    pricePerUnit: "",
    quantity: "",
    supplier: "",
    reorderLevel: "",
  })

  const handleOpenDialog = (ingredient?: Ingredient) => {
    if (ingredient) {
      setEditingIngredient(ingredient)
      setFormData({
        name: ingredient.name,
        unit: ingredient.unit,
        pricePerUnit: ingredient.pricePerUnit.toString(),
        quantity: ingredient.quantity.toString(),
        supplier: ingredient.supplier,
        reorderLevel: ingredient.reorderLevel.toString(),
      })
    } else {
      setEditingIngredient(null)
      setFormData({
        name: "",
        unit: "",
        pricePerUnit: "",
        quantity: "",
        supplier: "",
        reorderLevel: "",
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingIngredient(null)
    setFormData({
      name: "",
      unit: "",
      pricePerUnit: "",
      quantity: "",
      supplier: "",
      reorderLevel: "",
    })
  }

  const handleSaveIngredient = () => {
    if (
      !formData.name ||
      !formData.unit ||
      !formData.pricePerUnit ||
      !formData.quantity ||
      !formData.supplier ||
      !formData.reorderLevel
    ) {
      alert("Please fill in all fields")
      return
    }

    const newIngredient = {
      name: formData.name,
      unit: formData.unit,
      pricePerUnit: Number.parseFloat(formData.pricePerUnit),
      quantity: Number.parseInt(formData.quantity),
      supplier: formData.supplier,
      reorderLevel: Number.parseInt(formData.reorderLevel),
      lastUpdated: new Date().toISOString().split("T")[0],
    }

    if (editingIngredient) {
      setIngredients(ingredients.map((i) => (i.id === editingIngredient.id ? { ...newIngredient, id: i.id } : i)))
    } else {
      const maxId = ingredients.length > 0 ? Math.max(...ingredients.map((i) => i.id)) : 0
      setIngredients([...ingredients, { ...newIngredient, id: maxId + 1 }])
    }

    handleCloseDialog()
  }

  const handleDeleteIngredient = (id: number) => {
    if (confirm("Are you sure you want to delete this ingredient?")) {
      setIngredients(ingredients.filter((i) => i.id !== id))
    }
  }

  const getLowStockIngredients = () => {
    return ingredients.filter((i) => i.quantity <= i.reorderLevel)
  }

  const lowStockItems = getLowStockIngredients()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Ingredient Management</CardTitle>
            <CardDescription>Track ingredient inventory and pricing</CardDescription>
          </div>
          <Button className="gap-2" onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4" />
            Add Ingredient
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {lowStockItems.length > 0 && (
          <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
            <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
            <AlertDescription className="text-yellow-800 dark:text-yellow-200">
              {lowStockItems.length} ingredient{lowStockItems.length !== 1 ? "s" : ""} below reorder level:{" "}
              {lowStockItems.map((i) => i.name).join(", ")}
            </AlertDescription>
          </Alert>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Unit</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Price/Unit</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Quantity</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Total Value</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Supplier</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ingredient) => {
                const totalValue = ingredient.quantity * ingredient.pricePerUnit
                const isLowStock = ingredient.quantity <= ingredient.reorderLevel
                return (
                  <tr
                    key={ingredient.id}
                    className={`border-b hover:bg-muted/50 transition-colors ${
                      isLowStock ? "bg-yellow-50 dark:bg-yellow-900/10" : ""
                    }`}
                  >
                    <td className="py-3 px-4 font-medium text-foreground">{ingredient.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{ingredient.unit}</td>
                    <td className="py-3 px-4 font-semibold text-primary">${ingredient.pricePerUnit.toFixed(2)}</td>
                    <td className="py-3 px-4 text-foreground">
                      <span className={isLowStock ? "font-bold text-yellow-700 dark:text-yellow-400" : ""}>
                        {ingredient.quantity}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-accent">${totalValue.toFixed(2)}</td>
                    <td className="py-3 px-4 text-muted-foreground">{ingredient.supplier}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:bg-primary/10"
                          onClick={() => handleOpenDialog(ingredient)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteIngredient(ingredient.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingIngredient ? "Edit Ingredient" : "Add New Ingredient"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Ingredient Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Cocoa Powder"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="pricePerUnit">Price per Unit ($)</Label>
                <Input
                  id="pricePerUnit"
                  type="number"
                  step="0.01"
                  value={formData.pricePerUnit}
                  onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                  placeholder="12.50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Current Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="5"
                />
              </div>
              <div>
                <Label htmlFor="reorderLevel">Reorder Level</Label>
                <Input
                  id="reorderLevel"
                  type="number"
                  value={formData.reorderLevel}
                  onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                  placeholder="3"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="e.g., Premium Imports"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveIngredient}>{editingIngredient ? "Update Ingredient" : "Add Ingredient"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
