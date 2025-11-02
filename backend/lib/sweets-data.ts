// Mock database store for sweets
const sweetsDatabase = [
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
  {
    id: 7,
    name: "Kaju Katli",
    price: 250,
    category: "Indian",
    inStock: 30,
    ingredients: ["Cashew", "Sugar", "Ghee"],
  },
  {
    id: 8,
    name: "Motichoor Ke Laddu",
    price: 170,
    category: "Indian",
    inStock: 55,
    ingredients: ["Gram Flour", "Ghee", "Milk Solids", "Sugar"],
  },
]

export function getAllSweets() {
  return sweetsDatabase
}

export function addSweet(sweet: any) {
  const newSweet = {
    id: Math.max(...sweetsDatabase.map((s) => s.id), 0) + 1,
    ...sweet,
  }
  sweetsDatabase.push(newSweet)
  return newSweet
}

export function updateSweet(id: number, updates: any) {
  const index = sweetsDatabase.findIndex((s) => s.id === id)
  if (index === -1) return null
  sweetsDatabase[index] = { ...sweetsDatabase[index], ...updates }
  return sweetsDatabase[index]
}

export function deleteSweet(id: number) {
  const index = sweetsDatabase.findIndex((s) => s.id === id)
  if (index === -1) return false
  sweetsDatabase.splice(index, 1)
  return true
}

export function getSweet(id: number) {
  return sweetsDatabase.find((s) => s.id === id)
}
