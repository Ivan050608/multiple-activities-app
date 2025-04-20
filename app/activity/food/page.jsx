// /app/activity/food/page.jsx


import FoodUploadForm from '@/components/FoodUploadForm'
import FoodCard from '@/components/FoodCard'
import { supabase } from '@/lib/supabaseClient'

export const dynamic = 'force-dynamic'

export default async function FoodPage() {
  const { data: foods } = await supabase
    .from('food_photos')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 space-y-6">
      <FoodUploadForm />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {foods?.map((food) => (
          <FoodCard key={food.id} food={food} />
        ))}
      </div>
    </div>
  )
}
