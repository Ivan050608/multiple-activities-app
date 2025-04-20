// /app/activity/food/[food_id]/page.jsx
import { supabase } from '@/lib/supabaseClient'
import ReviewForm from '@/components/ReviewForm'
// import ReviewCard from '@/components/ReviewCard'

export default async function FoodDetailPage({ params }) {
  const { food_id } = params

  // Fetch food item data and reviews on the server
  const { data: food, error: foodError } = await supabase
    .from('food_photos')
    .select('*')
    .eq('id', food_id)
    .single()

  const { data: reviews, error: reviewsError } = await supabase
    .from('food_reviews')
    .select('*')
    .eq('food_id', food_id)
    .order('created_at', { ascending: false })

  if (foodError) {
    console.error('Error fetching food:', foodError)
    return <div className="p-4">Error fetching food.</div>
  }

  if (reviewsError) {
    console.error('Error fetching reviews:', reviewsError)
    return <div className="p-4">Error fetching reviews.</div>
  }

  if (!food) return <div className="p-4">Food not found.</div>

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white border p-4 rounded shadow">
        <img
          src={`https://jjksuxyuuxwnpuqegkgt.supabase.co/storage/v1/object/public/images/food/${food.image_url}`}
          alt={food.name}
          className="w-full h-64 object-cover rounded mb-2"
        />
        <h2 className="text-2xl font-semibold mt-4">{food.name}</h2>
        <p className="text-sm text-gray-500">Uploaded on: {new Date(food.created_at).toLocaleDateString()}</p>
      </div>

      {/* Client component for adding a review */}
      <ReviewForm food_id={food.id} />

      {/* <div className="space-y-4">
        {reviews?.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div> */}
    </div>
  )
}
