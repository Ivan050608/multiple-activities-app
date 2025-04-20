'use client'

import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true); // Safe to access browser-specific APIs now
  }, [])

  if (!isClient) {
    return null; // Avoid rendering until we're sure it's the client
  }

  const handleLogout = async () => {
    await logout()
    router.push('/auth/login')
  }

  return (
    <nav className="p-4 bg-blue-500 text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Multiple Activities App</h1>
        <ul className="flex space-x-4">
          {user ? (
            <>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/activity/todo">To-Do</Link></li>
              <li><Link href="/activity/drive">Drive Lite</Link></li>
              <li><Link href="/activity/food">Food Review</Link></li>
              <li><Link href="/activity/pokemon">Pokémon Review</Link></li>
              <li><Link href="/activity/markdown">Markdown Notes</Link></li>
              <li><button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">Logout</button></li>
            </>
          ) : (
            <>
              <li><Link href="/auth/login">Login</Link></li>
              <li><Link href="/auth/register">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}
