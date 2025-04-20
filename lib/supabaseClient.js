import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const createTodo = async (user_id, task) => {
  const { data, error } = await supabase
    .from('todos')
    .insert([
      { user_id, task }
    ])

  if (error) {
    throw error
  }
  return data
}

export const getTodos = async (user_id) => {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching todos:', error)  // Log the full error object
    throw error
  }
  return data
}

export const updateTodo = async (id, completed) => {
  const { data, error } = await supabase
    .from('todos')
    .update({ completed })
    .eq('id', id)

  if (error) {
    throw error
  }
  return data
}

export const deleteTodo = async (id) => {
  const { data, error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }
  return data
}

// This will be used to get the current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    console.error('Error fetching user:', error)
    return null
  }

  return user
}
// ----------- DRIVE HELPERS -----------

// Upload a photo to the "drive" bucket
export const uploadPhoto = async (file, userId) => {
  if (!file || !userId) {
    throw new Error('Missing file or userId')
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`
  const filePath = `${userId}/${fileName}`

  const { data, error } = await supabase.storage
    .from('drive')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Upload error:', error)
    throw new Error('Upload failed: ' + (error.message || JSON.stringify(error)))
  }

  return data
}


// Get all photos for a user from the "drive" bucket
export const getPhotos = async (userId) => {
  const { data, error } = await supabase.storage
    .from('drive')
    .list(userId, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' }
    })

  if (error) {
    console.error('Fetch error:', error)
    throw error
  }

  return data
}

// Get public URL of a photo
export const getPublicUrl = (path) => {
  return supabase.storage.from('drive').getPublicUrl(path).data.publicUrl
}

// Delete photo from the "drive" bucket
export const deletePhoto = async (path) => {
  const { error } = await supabase.storage
    .from('drive')
    .remove([path])

  if (error) {
    console.error('Delete error:', error)
    throw error
  }
}
