"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useLiffContext } from "@/components/liff-provider"
import { LogOut, Settings } from "lucide-react"

export function DashboardHeader() {
  const { profile, logout, isInClient, closeWindow } = useLiffContext()

  const handleLogout = () => {
    logout()
    if (isInClient) {
      closeWindow()
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">Device Dashboard</h1>
        </div>

        <div className="flex items-center space-x-4">
          {profile && (
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile.pictureUrl || "/placeholder.svg"} alt={profile.displayName} />
                <AvatarFallback>{profile.displayName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700">{profile.displayName}</span>
            </div>
          )}

          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
