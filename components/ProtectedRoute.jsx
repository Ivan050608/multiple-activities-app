// /components/ProtectedRoute.jsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'  // Use your custom hook

export default function ProtectedRoute({ children }) {
  const { user } = useAuth()  // Access user state via useAuth
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    }
  }, [user, router])  // Ensure router is included in dependencies

  // While checking, don't render anything until we're sure
  if (!user) return null

  return children  // Render children only if user is authenticated
}
