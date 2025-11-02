"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShoppingCart, LogOut, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface Sweet {
  id: number
  name: string
  price: number
  category: string
  inStock: number
  ingredients: string[]
}

interface CartItem extends Sweet {
  quantity: number
}

interface Review {
  id: number
  sweetId: number
  userId: string
  rating: number
  comment: string
  createdAt: string
}

interface SweetWithReviews extends Sweet {
  reviews?: Review[]
  averageRating?: number
}

export default function ShopPage() {
  const router = useRouter()
  const [sweets, setSweets] = useState<SweetWithReviews[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [maxPrice, setMaxPrice] = useState("500")
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [selectedSweetForReview, setSelectedSweetForReview] = useState<SweetWithReviews | null>(null)
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" })
  const [orders, setOrders] = useState<any[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false) // added state for cart drawer

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/auth/login")
      return
    }
    setUser(JSON.parse(storedUser))
    fetchSweets()
    fetchReviews()
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

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/reviews")
      const data = await response.json()

      setSweets(
        sweets.map((sweet) => {
          const sweetReviews = data.filter((r: Review) => r.sweetId === sweet.id)
          const averageRating =
            sweetReviews.length > 0
              ? sweetReviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / sweetReviews.length
              : 0

          return {
            ...sweet,
            reviews: sweetReviews,
            averageRating,
          }
        }),
      )
    } catch (err) {
      console.error("Failed to fetch reviews:", err)
    }
  }

  const handleSubmitReview = async () => {
    if (!selectedSweetForReview || !reviewData.comment.trim()) {
      alert("Please provide a comment")
      return
    }

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sweetId: selectedSweetForReview.id,
          userId: user.email,
          rating: reviewData.rating,
          comment: reviewData.comment,
        }),
      })

      if (response.ok) {
        await fetchReviews()
        setShowReviewDialog(false)
        setReviewData({ rating: 5, comment: "" })
        setSelectedSweetForReview(null)
      }
    } catch (err) {
      console.error("Error submitting review:", err)
    }
  }

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Cart is empty")
      return
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.email,
          items: cart,
          totalAmount: totalPrice,
        }),
      })

      if (response.ok) {
        alert("Order placed successfully!")
        setCart([])
        setIsCheckoutOpen(false)
        // Update sweet quantities
        for (const item of cart) {
          await fetch(`/api/sweets/${item.id}/purchase`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: item.quantity }),
          })
        }
        await fetchSweets()
      }
    } catch (err) {
      console.error("Error during checkout:", err)
      alert("Failed to place order")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/auth/login")
  }

  const filteredSweets = sweets.filter((sweet) => {
    const matchesSearch =
      sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sweet.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPrice = sweet.price <= Number.parseInt(maxPrice)
    return matchesSearch && matchesPrice
  })

  const handleAddToCart = (sweet: Sweet) => {
    const existingItem = cart.find((item) => item.id === sweet.id)
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === sweet.id && item.quantity < sweet.inStock ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      )
    } else {
      setCart([...cart, { ...sweet, quantity: 1 }])
    }
  }

  const handleRemoveFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(id)
    } else {
      const sweet = sweets.find((s) => s.id === id)
      if (sweet && quantity <= sweet.inStock) {
        setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)))
      }
    }
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Sweet Shop</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-muted rounded-lg transition-colors"
              title="Open cart"
            >
              <ShoppingCart className="w-6 h-6 text-primary" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-destructive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <Button variant="outline" className="gap-2 bg-transparent" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Search & Filter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search sweets</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name or category..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Max Price: ₹{maxPrice}</Label>
                  <input
                    id="price"
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold">Available Sweets ({filteredSweets.length})</h2>
              </div>

              {filteredSweets.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No sweets match your search criteria
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredSweets.map((sweet) => (
                    <Card key={sweet.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{sweet.name}</CardTitle>
                            <CardDescription>{sweet.category}</CardDescription>
                          </div>
                          {sweet.averageRating && sweet.averageRating > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-400">★</span>
                              <span className="text-sm font-semibold">{sweet.averageRating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-2xl font-bold text-primary">₹{sweet.price}</p>
                            <p className="text-sm text-muted-foreground">
                              {sweet.inStock > 0 ? `${sweet.inStock} in stock` : "Out of stock"}
                            </p>
                          </div>
                        </div>

                        {sweet.ingredients.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-muted-foreground">Ingredients:</p>
                            <p className="text-xs">{sweet.ingredients.join(", ")}</p>
                          </div>
                        )}

                        {sweet.reviews && sweet.reviews.length > 0 && (
                          <div className="space-y-2 pt-2 border-t">
                            <p className="text-xs font-semibold text-muted-foreground">Recent Reviews:</p>
                            {sweet.reviews.slice(0, 2).map((review) => (
                              <div key={review.id} className="text-xs">
                                <div className="flex gap-1">
                                  {Array(review.rating)
                                    .fill("★")
                                    .map((_, i) => (
                                      <span key={i} className="text-yellow-400">
                                        ★
                                      </span>
                                    ))}
                                </div>
                                <p className="text-muted-foreground italic">{review.comment}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleAddToCart(sweet)}
                            disabled={sweet.inStock === 0}
                            className="flex-1 gap-2"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            {sweet.inStock === 0 ? "Out of Stock" : "Add to Cart"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedSweetForReview(sweet)
                              setShowReviewDialog(true)
                            }}
                          >
                            Review
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Cart ({totalItems})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <p className="text-center text-muted-foreground text-sm py-4">Your cart is empty</p>
                ) : (
                  <>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.id} className="p-3 border rounded-md space-y-2">
                          <div className="flex justify-between items-start">
                            <p className="font-semibold text-sm">{item.name}</p>
                            <button
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="text-xs text-destructive hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 border rounded hover:bg-muted"
                            >
                              −
                            </button>
                            <span className="flex-1 text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 border rounded hover:bg-muted"
                            >
                              +
                            </button>
                          </div>
                          <p className="text-sm font-semibold">
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="font-semibold">Total:</span>
                        <span className="text-lg font-bold text-primary">₹{totalPrice.toLocaleString("en-IN")}</span>
                      </div>
                      <Button className="w-full" onClick={() => setIsCheckoutOpen(true)}>
                        Proceed to Checkout
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Shopping Cart ({totalItems})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {cart.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-4">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="p-3 border rounded-md space-y-2">
                      <div className="flex justify-between items-start">
                        <p className="font-semibold text-sm">{item.name}</p>
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="text-xs text-destructive hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 border rounded hover:bg-muted"
                        >
                          −
                        </button>
                        <span className="flex-1 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 border rounded hover:bg-muted"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm font-semibold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total:</span>
                    <span className="text-lg font-bold text-primary">₹{totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setIsCartOpen(false)
                      setIsCheckoutOpen(true)
                    }}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order Summary</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between font-semibold">
                <span>Subtotal:</span>
                <span>₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Delivery:</span>
                <span>₹50</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">₹{(totalPrice + 50).toLocaleString("en-IN")}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Delivery Address</Label>
              <Input placeholder="Enter your address" />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input placeholder="+91" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCheckoutOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCheckout} className="gap-2">
              Place Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review {selectedSweetForReview?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Rating</Label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                    className={`text-2xl transition-colors ${
                      star <= reviewData.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="comment">Your Review</Label>
              <textarea
                id="comment"
                className="w-full p-2 border rounded-md"
                rows={4}
                placeholder="Share your experience with this sweet..."
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitReview}>Submit Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
