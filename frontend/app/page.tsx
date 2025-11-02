"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    const user = typeof window !== "undefined" ? localStorage.getItem("user") : null
    if (user) {
      router.push("/shop")
    } else {
      router.push("/auth/login")
    }
  }, [router])

  return <div className="flex items-center justify-center min-h-screen">Redirecting...</div>

  // Rest of the code here
  // const [activeTab, setActiveTab] = useState("dashboard")

  // return (
  //   <div className="min-h-screen bg-background">
  //     <Navigation />

  //     <main className="container mx-auto px-4 py-8">
  //       <div className="mb-8">
  //         <h1 className="text-4xl font-bold text-balance text-foreground mb-2">Sweet Shop Management System</h1>
  //         <p className="text-muted-foreground">Manage your inventory, pricing, and promotions in one place</p>
  //       </div>

  //       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
  //         <TabsList className="grid w-full grid-cols-4 mb-6">
  //           <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
  //           <TabsTrigger value="sweets">Sweets</TabsTrigger>
  //           <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
  //           <TabsTrigger value="admin">Admin</TabsTrigger>
  //         </TabsList>

  //         <TabsContent value="dashboard" className="space-y-6">
  //           <div className="grid gap-6 md:grid-cols-3">
  //             <Card>
  //               <CardHeader className="pb-3">
  //                 <CardTitle className="text-sm font-medium text-muted-foreground">Total Sweets</CardTitle>
  //               </CardHeader>
  //               <CardContent>
  //                 <div className="text-3xl font-bold">12</div>
  //                 <p className="text-xs text-muted-foreground mt-1">Active products</p>
  //               </CardContent>
  //             </Card>

  //             <Card>
  //               <CardHeader className="pb-3">
  //                 <CardTitle className="text-sm font-medium text-muted-foreground">Ingredients</CardTitle>
  //               </CardHeader>
  //               <CardContent>
  //                 <div className="text-3xl font-bold">24</div>
  //                 <p className="text-xs text-muted-foreground mt-1">In stock</p>
  //               </CardContent>
  //             </Card>

  //             <Card>
  //               <CardHeader className="pb-3">
  //                 <CardTitle className="text-sm font-medium text-muted-foreground">Active Promotions</CardTitle>
  //               </CardHeader>
  //               <CardContent>
  //                 <div className="text-3xl font-bold">3</div>
  //                 <p className="text-xs text-muted-foreground mt-1">Running campaigns</p>
  //               </CardContent>
  //             </Card>
  //           </div>

  //           <SweetsOverview />
  //           <IngredientsOverview />
  //           <PromotionsOverview />
  //         </TabsContent>

  //         <TabsContent value="sweets">
  //           <SweetsOverview expanded={true} />
  //         </TabsContent>

  //         <TabsContent value="ingredients">
  //           <IngredientsOverview expanded={true} />
  //         </TabsContent>

  //         <TabsContent value="admin">
  //           <AdminPanel />
  //         </TabsContent>
  //       </Tabs>
  //     </main>
  //   </div>
  // )
}
