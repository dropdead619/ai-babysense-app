import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function WelcomePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Redirect to dashboard after successful email confirmation
  redirect("/dashboard")
}
