// 'use client'
// import { useAuth } from '@/context/AuthContext'
// import { supabase } from '@/lib/supabaseClient'

// export default function PokemonReviewCard({ review, onDelete }) {
//   const { user } = useAuth()

//   const handleDelete = async () => {
//     const confirm = window.confirm('Are you sure you want to delete this review?')
//     if (!confirm) return

//     const { error } = await supabase
//       .from('pokemon_reviews')
//       .delete()
//       .eq('id', review.id)

//     if (error) {
//       console.error('Delete error:', error)
//       alert('Failed to delete review.')
//     } else {
//       onDelete(review.id)
//     }
//   }

//   return (
//     <div className="border p-4 rounded-xl relative">
//       <img
//         src={review.image_url}
//         alt={review.photo_name}
//         className="w-24 h-24 object-cover mb-2 rounded"
//       />
//       <h3 className="font-semibold">{review.photo_name}</h3>
//       <p className="text-sm text-gray-700">{review.comment}</p>
//       <p className="text-xs text-gray-500 mt-1">By: {review.user_id}</p>

//       {user?.id === review.user_id && (
//         <button
//           onClick={handleDelete}
//           className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
//         >
//           Delete
//         </button>
//       )}
//     </div>
//   )
// }

'use client'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'

export default function PokemonReviewCard({ review, onDelete }) {
  const { user } = useAuth()

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete this review?')
    if (!confirm) return

    const { error } = await supabase
      .from('pokemon_reviews')
      .delete()
      .eq('id', review.id)

    if (error) {
      console.error('Delete error:', error)
      alert('Failed to delete review.')
    } else {
      // Calling onDelete to update the parent component state
      onDelete(review.id)  // Make sure this function is passed down properly
    }
  }

  return (
    <div className="border p-4 rounded-xl relative">
      <img
        src={review.image_url}
        alt={review.photo_name}
        className="w-24 h-24 object-cover mb-2 rounded"
      />
      <h3 className="font-semibold">{review.photo_name}</h3>
      <p className="text-sm text-gray-700">{review.comment}</p>
      <p className="text-xs text-gray-500 mt-1">By: {review.user_id}</p>

      {user?.id === review.user_id && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
        >
          Delete
        </button>
      )}
    </div>
  )
}
