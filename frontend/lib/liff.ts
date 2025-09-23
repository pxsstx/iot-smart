// LIFF SDK integration and authentication utilities
declare global {
  interface Window {
    liff: any
  }
}

export interface LiffProfile {
  userId: string
  displayName: string
  pictureUrl?: string
  statusMessage?: string
}

export class LiffAuth {
  private static instance: LiffAuth
  private initialized = false

  static getInstance(): LiffAuth {
    if (!LiffAuth.instance) {
      LiffAuth.instance = new LiffAuth()
    }
    return LiffAuth.instance
  }

  async init(liffId: string): Promise<void> {
    if (this.initialized) return

    // Load LIFF SDK if not already loaded
    if (!window.liff) {
      await this.loadLiffSDK()
    }

    try {
      await window.liff.init({ liffId })
      this.initialized = true
    } catch (error) {
      console.error("LIFF initialization failed:", error)
      throw error
    }
  }

  private loadLiffSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.liff) {
        resolve()
        return
      }

      const script = document.createElement("script")
      script.src = "https://static.line-scdn.net/liff/edge/2/sdk.js"
      script.onload = () => resolve()
      script.onerror = () => reject(new Error("Failed to load LIFF SDK"))
      document.head.appendChild(script)
    })
  }

  isLoggedIn(): boolean {
    return this.initialized && window.liff?.isLoggedIn()
  }

  async login(): Promise<void> {
    if (!this.initialized) {
      throw new Error("LIFF not initialized")
    }

    if (!this.isLoggedIn()) {
      window.liff.login()
    }
  }

  logout(): void {
    if (this.initialized && window.liff) {
      window.liff.logout()
    }
  }

  async getProfile(): Promise<LiffProfile | null> {
    if (!this.isLoggedIn()) {
      return null
    }

    try {
      const profile = await window.liff.getProfile()
      return {
        userId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
        statusMessage: profile.statusMessage,
      }
    } catch (error) {
      console.error("Failed to get profile:", error)
      return null
    }
  }

  getAccessToken(): string | null {
    if (!this.isLoggedIn()) {
      return null
    }
    return window.liff.getAccessToken()
  }

  isInClient(): boolean {
    return this.initialized && window.liff?.isInClient()
  }

  closeWindow(): void {
    if (this.initialized && window.liff) {
      window.liff.closeWindow()
    }
  }
}

export const liffAuth = LiffAuth.getInstance()
