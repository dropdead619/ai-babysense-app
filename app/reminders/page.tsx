import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SmartReminders } from "@/components/smart-reminders"

export default async function RemindersPage() {
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

  // Fetch reminders
  const { data: reminders, error: remindersError } = await supabase
    .from("reminders")
    .select(`
      *,
      babies (
        name
      )
    `)
    .eq("user_id", data.user.id)
    .order("scheduled_for", { ascending: true })

  if (remindersError) {
    console.error("Error fetching reminders:", remindersError)
  }

  // Fetch recent care activities for smart suggestions
  const { data: recentActivities, error: activitiesError } = await supabase
    .from("care_activities")
    .select("*")
    .eq("user_id", data.user.id)
    .order("start_time", { ascending: false })
    .limit(50)

  if (activitiesError) {
    console.error("Error fetching activities:", activitiesError)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Reminders</h1>
          <p className="text-gray-600">Stay on top of your baby's care with intelligent reminders and tips</p>
        </div>

        <SmartReminders babies={babies || []} reminders={reminders || []} recentActivities={recentActivities || []} />
      </div>
    </div>
  )
}
