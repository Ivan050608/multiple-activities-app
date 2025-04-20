'use client'

import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

export default function Home() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="p-4">
        <h1>Welcome to the Multiple Activities App</h1>
        <p><Link href="/auth/login">Login</Link> or <Link href="/auth/register">Register</Link> to continue</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1>Hello, {user.email}!</h1>
      <ul className="list-disc pl-5 mt-2">
        <li><Link href="/activity/todo">To-Do List</Link></li>
        <li><Link href="/activity/drive">Drive Lite</Link></li>
        <li><Link href="/activity/food">Food Review</Link></li>
        <li><Link href="/activity/pokemon">Pokémon Review</Link></li>
        <li><Link href="/activity/markdown">Markdown Notes</Link></li>
      </ul>
    </div>
  )
}
