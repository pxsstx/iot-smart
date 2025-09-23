"use client";

import { useState, useEffect } from "react";
import { liffAuth, type LiffProfile } from "@/lib/liff";

export function useLiff(liffId?: string) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<LiffProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initLiff = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Use environment variable or provided liffId
        const id = liffId || process.env.NEXT_PUBLIC_LIFF_ID;
        if (!id) {
          throw new Error("LIFF ID is required");
        }

        await liffAuth.init(id);
        setIsInitialized(true);

        const loggedIn = liffAuth.isLoggedIn();
        setIsLoggedIn(loggedIn);

        if (loggedIn) {
          const userProfile = await liffAuth.getProfile();
          setProfile(userProfile);

          const response = await fetch("http://localhost:4000/api/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userProfile), // ถ้าอยากส่งเป็น object ตรงๆ
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("✅ User created:", data);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to initialize LIFF"
        );
      } finally {
        setIsLoading(false);
      }
    };

    initLiff();
  }, [liffId]);

  const login = async () => {
    try {
      await liffAuth.login();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  const logout = () => {
    liffAuth.logout();
    setIsLoggedIn(false);
    setProfile(null);
  };

  return {
    isInitialized,
    isLoggedIn,
    profile,
    isLoading,
    error,
    login,
    logout,
    isInClient: isInitialized ? liffAuth.isInClient() : false,
    closeWindow: liffAuth.closeWindow,
    getAccessToken: liffAuth.getAccessToken,
  };
}
