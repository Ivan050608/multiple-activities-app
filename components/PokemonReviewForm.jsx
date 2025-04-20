'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/context/AuthContext'

export default function PokemonReviewForm({ pokemonName, onReviewAdded }) {
  const { user } = useAuth()
  const [photoName, setPhotoName] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!photoName || !imageUrl || !comment) return alert('Please fill in all fields.')
    setLoading(true)

    const { data, error } = await supabase.from('pokemon_reviews').insert([
      {
        user_id: user.id,
        pokemon_name: pokemonName,
        photo_name: photoName,
        image_url: imageUrl,
        comment: comment,
      },
    ]).select().single()

    setLoading(false)

    if (error) {
      console.error('Error adding review:', error)
      alert('Failed to add review.')
    } else {
      onReviewAdded(data)
      setPhotoName('')
      setImageUrl('')
      setComment('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-xl mb-6">
      <h2 className="text-xl font-bold">Add a Review</h2>

      <input
        type="text"
        placeholder="Photo Name"
        value={photoName}
        onChange={(e) => setPhotoName(e.target.value)}
        className="w-full border px-4 py-2"
      />

      <input
        type="text"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="w-full border px-4 py-2"
      />

      <textarea
        placeholder="Comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border px-4 py-2"
      ></textarea>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}
