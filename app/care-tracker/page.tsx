import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CareTracker } from "@/components/care-tracker"

export default async function CareTrackerPage() {
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

  // Fetch recent care activities
  const { data: recentActivities, error: activitiesError } = await supabase
    .from("care_activities")
    .select(`
      *,
      babies (
        name
      )
    `)
    .eq("user_id", data.user.id)
    .order("start_time", { ascending: false })
    .limit(20)

  if (activitiesError) {
    console.error("Error fetching activities:", activitiesError)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Care Tracker</h1>
          <p className="text-gray-600">Log and track your baby's daily care activities</p>
        </div>

        <CareTracker babies={babies || []} recentActivities={recentActivities || []} />
      </div>
    </div>
  )
}
