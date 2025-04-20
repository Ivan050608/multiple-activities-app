'use client'

import { useEffect, useState } from 'react'
import { supabase, uploadPhoto, getPhotos, getPublicUrl, deletePhoto } from '@/lib/supabaseClient'

export default function DrivePage() {
  const [user, setUser] = useState(null)
  const [photos, setPhotos] = useState([])
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Error fetching user:', error.message)
        return
      }
      setUser(data.user)
    }
    getUser()
  }, [])

  useEffect(() => {
    if (user) fetchPhotos()
  }, [user])

  const fetchPhotos = async () => {
    try {
      const items = await getPhotos(user.id)
      const urls = items.map(item => ({
        name: item.name,
        fullPath: `${user.id}/${item.name}`,
        url: getPublicUrl(`${user.id}/${item.name}`)
      }))
      setPhotos(urls)
    } catch (err) {
      console.error('Error fetching photos:', err)
      setError('Failed to load photos')
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    setError(null)
    setUploadSuccess(false)

    if (!file) {
      setError('Please select a file to upload.')
      return
    }

    if (!user) {
      setError('User not authenticated.')
      return
    }

    setLoading(true)
    setUploadProgress(0)

    try {
      const { data, error: uploadError } = await uploadPhoto(file, user.id, (progress) => {
        setUploadProgress(progress)
      })
      if (uploadError) throw uploadError

      await fetchPhotos()
      setFile(null)
      setUploadSuccess(true)
    } catch (err) {
      console.error('Upload failed:', err)
      setError('Upload failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (path) => {
    try {
      await deletePhoto(path)
      await fetchPhotos()
    } catch (err) {
      console.error('Delete failed:', err)
      setError('Delete failed. Try again.')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Drive Lite</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {uploadSuccess && !error && <p className="text-green-500 mb-2">Upload successful!</p>}

      <form onSubmit={handleUpload} className="mb-6">
        <input
          key={file?.name || ''}
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="mr-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {file && (
        <div className="mb-4">
          <h2 className="text-lg">Selected File:</h2>
          <p>{file.name}</p>
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="w-24 h-24 object-cover mt-2"
          />
        </div>
      )}

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mb-4">
          <p>Uploading: {Math.round(uploadProgress)}%</p>
          <div className="h-2 bg-gray-300 rounded">
            <div
              style={{ width: `${uploadProgress}%` }}
              className="h-2 bg-blue-600 rounded"
            ></div>
          </div>
        </div>
      )}

      {photos.length === 0 ? (
        <p>No photos uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {photos.map(photo => (
            <div key={photo.name} className="relative group">
              <img
                src={photo.url}
                alt={photo.name}
                className="w-full h-auto rounded shadow"
              />
              <button
                onClick={() => handleDelete(photo.fullPath)}
                className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded hidden group-hover:block"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
