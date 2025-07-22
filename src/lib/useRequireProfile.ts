"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function useRequireProfile() {
  const router = useRouter()
  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("currentUser")
      if (!user) {
        router.replace("/")
      }
    }
  }, [router])
} 