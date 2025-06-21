import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/router"

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const logout = async () => {
    await signOut({ redirect: false })
    router.push("/login")
  }

  return {
    session,
    status,
    isAuthenticated: !!session,
    isLoading: status === "loading",
    logout,
  }
} 