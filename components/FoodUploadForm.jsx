'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function FoodUploadForm() {
  const [name, setName] = useState('')
  const [image, setImage] = useState(null)
  const router = useRouter()

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!image) return alert('Please select an image')

    const fileExt = image.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `food/${fileName}`

    // Upload to Supabase bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, image)

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return alert('Upload failed.')
    }

    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError) {
      console.error('User fetch error:', userError)
      return alert('Failed to fetch user data.')
    }

    if (!userData) return alert('You must be logged in to upload a photo.')

    // Insert into food_photos table
    const { error: insertError } = await supabase
      .from('food_photos')
      .insert({
        name,
        image_url: uploadData.path,
        user_id: userData.id, // Use the correct user ID here
      })

    if (insertError) {
      // Log detailed insert error
      console.error('Insert error:', insertError)
      return alert(`Failed to save to database: ${insertError.message}`)
    }

    setName('')
    setImage(null)
    router.refresh() // Refresh to show the new data
  }

  return (
    <form onSubmit={handleUpload} className="space-y-4 p-4 border rounded bg-white shadow">
      <h2 className="text-lg font-semibold">Upload Food Photo</h2>
      <input
        type="text"
        placeholder="Food Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full"
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="border p-2 w-full"
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Upload</button>
    </form>
  )
}
