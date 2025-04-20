// components/FileUpload.jsx
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setLoading(true);

    try {
      const user = supabase.auth.user();
      if (!user) {
        setError('You must be logged in to upload a file.');
        return;
      }

      const { data, error: uploadError } = await supabase.storage
        .from('your-bucket-name')  // Replace with your bucket name
        .upload(`${user.id}/${file.name}`, file);

      if (uploadError) {
        setError('Upload failed. Please try again.');
      } else {
        setFile(null);
        alert('File uploaded successfully!');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default FileUpload;
