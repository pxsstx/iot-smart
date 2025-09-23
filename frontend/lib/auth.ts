// Authentication utilities for API routes
export async function verifyLiffToken(token: string): Promise<{ userId: string } | null> {
  try {
    // Verify LINE access token with LINE API
    const response = await fetch("https://api.line.me/v2/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return null
    }

    const profile = await response.json()
    return { userId: profile.userId }
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

export function getAuthHeader(request: Request): string | null {
  const authHeader = request.headers.get("Authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }
  return authHeader.substring(7)
}
