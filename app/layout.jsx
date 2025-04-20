// /app/layout.jsx
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'Multiple Activities App',
  description: 'Powered by Next.js & Supabase',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar /> {/* Navbar is here, applied globally */}
          <main>{children}</main> {/* This renders the page content */}
        </AuthProvider>
      </body>
    </html>
  )
}
