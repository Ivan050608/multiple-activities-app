'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

const LogoutPage = () => {
  const router = useRouter()

  useEffect(() => {
    const logout = async () => {
      try {
        // Log the user out
        await supabase.auth.signOut()

        // Redirect to the login page
        router.push('/auth/login')
      } catch (error) {
        console.error('Error logging out:', error)
      }
    }

    logout()
  }, [router])

  return <div>Logging out...</div>
}

export default LogoutPage
