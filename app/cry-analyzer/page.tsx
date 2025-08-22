import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CryAnalyzer } from "@/components/cry-analyzer"

export default async function CryAnalyzerPage() {
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

  // Fetch recent cry analyses
  const { data: recentAnalyses, error: analysesError } = await supabase
    .from("cry_analyses")
    .select(`
      *,
      babies (
        name
      )
    `)
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  if (analysesError) {
    console.error("Error fetching analyses:", analysesError)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cry Analyzer</h1>
          <p className="text-gray-600">Record your baby's cry to understand their needs</p>
        </div>

        <CryAnalyzer babies={babies || []} recentAnalyses={recentAnalyses || []} />
      </div>
    </div>
  )
}
