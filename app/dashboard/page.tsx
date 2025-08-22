import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BabyProfileGrid } from "@/components/baby-profile-grid"
import { AddBabyButton } from "@/components/add-baby-button"
import { Button } from "@/components/ui/button"
import { Mic, Activity, Bell } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch user's babies
  const { data: babies, error: babiesError } = await supabase
    .from("babies")
    .select("*")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

  if (babiesError) {
    console.error("Error fetching babies:", babiesError)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-10 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Babies</h1>
            <p className="text-gray-600">Manage your baby profiles and track their care</p>
          </div>
          <AddBabyButton />
        </div>

        {babies && babies.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                asChild
                className="h-16 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                <Link href="/cry-analyzer" className="flex items-center justify-start gap-3">
                  <Mic className="h-6 w-6" />
                  <div className="text-left">
                    <p className="font-semibold">Cry Analyzer</p>
                    <p className="text-sm opacity-90">Understand baby's needs</p>
                  </div>
                </Link>
              </Button>
              <Button
                asChild
                className="h-16 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <Link href="/care-tracker" className="flex items-center justify-start gap-3">
                  <Activity className="h-6 w-6" />
                  <div className="text-left">
                    <p className="font-semibold">Care Tracker</p>
                    <p className="text-sm opacity-90">Log daily activities</p>
                  </div>
                </Link>
              </Button>
              <Button
                asChild
                className="h-16 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              >
                <Link href="/reminders" className="flex items-center justify-start gap-3">
                  <Bell className="h-6 w-6" />
                  <div className="text-left">
                    <p className="font-semibold">Smart Reminders</p>
                    <p className="text-sm opacity-90">Stay on top of care</p>
                  </div>
                </Link>
              </Button>
            </div>
          </div>
        )}

        {babies && babies.length > 0 ? (
          <BabyProfileGrid babies={babies} />
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-6">
              <span className="text-4xl text-white">👶</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Welcome to BabySense!</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start by adding your first baby profile to begin tracking their care and analyzing their needs.
            </p>
            <AddBabyButton />
          </div>
        )}
      </div>
    </div>
  )
}
