'use client'

import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function ReviewCard({ review }) {
  const { user } = useAuth()
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Delete this review?')) return
    await supabase.from('food_reviews').delete().eq('id', review.id)
    router.refresh()
  }

  return (
    <div className="bg-white border rounded p-4 shadow">
      <p className="text-gray-800">{review.review}</p>
      <p className="text-xs text-gray-500 mt-1">
        {new Date(review.created_at).toLocaleString()}
      </p>
      {user?.id === review.user_id && (
        <button onClick={handleDelete} className="text-red-600 text-sm mt-2">
          Delete
        </button>
      )}
    </div>
  )
}