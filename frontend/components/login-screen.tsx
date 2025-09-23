"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLiffContext } from "@/components/liff-provider"
import { Loader2 } from "lucide-react"

export function LoginScreen() {
  const { login, isLoading, error } = useLiffContext()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Device Dashboard</CardTitle>
          <CardDescription>Sign in with LINE to access your device management dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>}

          <Button onClick={login} disabled={isLoading} className="w-full bg-green-500 hover:bg-green-600 text-white">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Sign in with LINE"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
