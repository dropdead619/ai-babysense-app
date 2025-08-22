"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { AddBabyModal } from "./add-baby-modal"

export function AddBabyButton() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Baby
      </Button>
      <AddBabyModal open={showModal} onOpenChange={setShowModal} />
    </>
  )
}
