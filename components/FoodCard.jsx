import Link from 'next/link'

export default function FoodCard({ food }) {
  return (
    <div className="border rounded shadow p-4 bg-white">
      <img
        src={`https://jjksuxyuuxwnpuqegkgt.supabase.co/storage/v1/object/public/images/food/1744964826532.jpg`}
        alt={food.name}
        className="w-full h-48 object-cover rounded"
      />
      
      <h3 className="mt-2 font-semibold text-lg">{food.name}</h3>
      <p className="text-sm text-gray-500">Uploaded: {new Date(food.created_at).toLocaleDateString()}</p>
      <Link href={`/activity/food/${food.id}`}>
        <button className="mt-2 text-blue-600 underline">View Reviews</button>
      </Link>
    </div>
  )
}
