"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Promotion {
  id: number
  name: string
  discount: number
  type: "percentage" | "fixed"
  startDate: string
  endDate: string
  status: "active" | "upcoming" | "ended"
  applicableTo: string[]
  minPurchase: number
  maxUses: number | null
  usesCount: number
  description: string
}

const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 1,
    name: "Summer Sale",
    discount: 20,
    type: "percentage",
    startDate: "2025-06-01",
    endDate: "2025-08-31",
    status: "upcoming",
    applicableTo: ["Chocolate", "Gummy"],
    minPurchase: 0,
    maxUses: null,
    usesCount: 0,
    description: "20% off on chocolate and gummy sweets",
  },
  {
    id: 2,
    name: "Buy 2 Get 1",
    discount: 50,
    type: "percentage",
    startDate: "2025-02-15",
    endDate: "2025-02-28",
    status: "active",
    applicableTo: ["Pastry"],
    minPurchase: 10,
    maxUses: 100,
    usesCount: 45,
    description: "50% off on third pastry item",
  },
]

const CATEGORIES = ["Chocolate", "Pastry", "Gummy", "Hard Candy", "Caramel", "Licorice"]

export default function PromotionsOverview() {
  const [promotions, setPromotions] = useState<Promotion[]>(INITIAL_PROMOTIONS)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: "",
    discount: "",
    type: "percentage" as "percentage" | "fixed",
    startDate: "",
    endDate: "",
    description: "",
    minPurchase: "0",
    maxUses: "",
  })

  const getPromotionStatus = (startDate: string, endDate: string): "active" | "upcoming" | "ended" => {
    const today = new Date().toISOString().split("T")[0]
    if (today < startDate) return "upcoming"
    if (today > endDate) return "ended"
    return "active"
  }

  const handleOpenDialog = (promotion?: Promotion) => {
    if (promotion) {
      setEditingPromotion(promotion)
      setFormData({
        name: promotion.name,
        discount: promotion.discount.toString(),
        type: promotion.type,
        startDate: promotion.startDate,
        endDate: promotion.endDate,
        description: promotion.description,
        minPurchase: promotion.minPurchase.toString(),
        maxUses: promotion.maxUses?.toString() || "",
      })
      setSelectedCategories(promotion.applicableTo)
    } else {
      setEditingPromotion(null)
      setFormData({
        name: "",
        discount: "",
        type: "percentage",
        startDate: "",
        endDate: "",
        description: "",
        minPurchase: "0",
        maxUses: "",
      })
      setSelectedCategories([])
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingPromotion(null)
    setFormData({
      name: "",
      discount: "",
      type: "percentage",
      startDate: "",
      endDate: "",
      description: "",
      minPurchase: "0",
      maxUses: "",
    })
    setSelectedCategories([])
  }

  const handleToggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleSavePromotion = () => {
    if (
      !formData.name ||
      !formData.discount ||
      !formData.startDate ||
      !formData.endDate ||
      selectedCategories.length === 0
    ) {
      alert("Please fill in all required fields and select at least one category")
      return
    }

    if (formData.startDate >= formData.endDate) {
      alert("End date must be after start date")
      return
    }

    const status = getPromotionStatus(formData.startDate, formData.endDate)

    const newPromotion = {
      name: formData.name,
      discount: Number.parseFloat(formData.discount),
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status,
      applicableTo: selectedCategories,
      minPurchase: Number.parseFloat(formData.minPurchase) || 0,
      maxUses: formData.maxUses ? Number.parseInt(formData.maxUses) : null,
      usesCount: editingPromotion?.usesCount || 0,
      description: formData.description,
    }

    if (editingPromotion) {
      setPromotions(promotions.map((p) => (p.id === editingPromotion.id ? { ...newPromotion, id: p.id } : p)))
    } else {
      const maxId = promotions.length > 0 ? Math.max(...promotions.map((p) => p.id)) : 0
      setPromotions([...promotions, { ...newPromotion, id: maxId + 1 }])
    }

    handleCloseDialog()
  }

  const handleDeletePromotion = (id: number) => {
    if (confirm("Are you sure you want to delete this promotion?")) {
      setPromotions(promotions.filter((p) => p.id !== id))
    }
  }

  const statusColors = {
    active: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100",
    upcoming: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100",
    ended: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-100",
  }

  const isAlmostExpired = (promotion: Promotion) => {
    return promotion.maxUses && promotion.usesCount >= promotion.maxUses * 0.9
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Promotions & Discounts</CardTitle>
            <CardDescription>Create and manage promotional campaigns</CardDescription>
          </div>
          <Button className="gap-2" onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4" />
            New Promotion
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className={`border rounded-lg p-4 hover:bg-muted/50 transition-colors ${
                isAlmostExpired(promo) ? "border-yellow-300 bg-yellow-50 dark:bg-yellow-900/10" : ""
              }`}
            >
              {isAlmostExpired(promo) && (
                <Alert className="mb-3 border-yellow-200 bg-transparent">
                  <AlertDescription className="text-yellow-700 dark:text-yellow-400 text-sm">
                    Approaching usage limit ({promo.usesCount}/{promo.maxUses})
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-foreground">{promo.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[promo.status]}`}>
                      {promo.status.charAt(0).toUpperCase() + promo.status.slice(1)}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{promo.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Discount:</span>
                      <p className="font-semibold text-accent">
                        {promo.discount}
                        {promo.type === "percentage" ? "%" : "$"} off
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Min Purchase:</span>
                      <p className="font-semibold text-foreground">${promo.minPurchase.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Duration:</span>
                      <p className="font-semibold text-foreground text-xs">
                        {promo.startDate} to {promo.endDate}
                      </p>
                    </div>
                    {promo.maxUses && (
                      <div>
                        <span className="text-muted-foreground">Usage:</span>
                        <p className="font-semibold text-foreground">
                          {promo.usesCount}/{promo.maxUses}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {promo.applicableTo.map((category) => (
                      <span key={category} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:bg-primary/10"
                    onClick={() => handleOpenDialog(promo)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeletePromotion(promo.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPromotion ? "Edit Promotion" : "Create New Promotion"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            <div>
              <Label htmlFor="name">Promotion Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Summer Sale"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the promotion"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discount">Discount Amount *</Label>
                <Input
                  id="discount"
                  type="number"
                  step="0.01"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  placeholder="20"
                />
              </div>
              <div>
                <Label htmlFor="type">Discount Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as "percentage" | "fixed" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minPurchase">Min Purchase Amount ($)</Label>
                <Input
                  id="minPurchase"
                  type="number"
                  step="0.01"
                  value={formData.minPurchase}
                  onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="maxUses">Max Uses (leave empty for unlimited)</Label>
                <Input
                  id="maxUses"
                  type="number"
                  value={formData.maxUses}
                  onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                  placeholder="100"
                />
              </div>
            </div>

            <div>
              <Label>Applicable Categories *</Label>
              <div className="space-y-2 mt-3 border rounded-lg p-3">
                {CATEGORIES.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleToggleCategory(category)}
                    />
                    <label
                      htmlFor={category}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSavePromotion}>{editingPromotion ? "Update Promotion" : "Create Promotion"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
