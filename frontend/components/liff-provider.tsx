"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useLiff } from "@/hooks/use-liff"

interface LiffContextType {
  isInitialized: boolean
  isLoggedIn: boolean
  profile: any
  isLoading: boolean
  error: string | null
  login: () => Promise<void>
  logout: () => void
  isInClient: boolean
  closeWindow: () => void
  getAccessToken: () => string | null
}

const LiffContext = createContext<LiffContextType | undefined>(undefined)

export function LiffProvider({ children }: { children: ReactNode }) {
  const liff = useLiff()

  return <LiffContext.Provider value={liff}>{children}</LiffContext.Provider>
}

export function useLiffContext() {
  const context = useContext(LiffContext)
  if (context === undefined) {
    throw new Error("useLiffContext must be used within a LiffProvider")
  }
  return context
}
