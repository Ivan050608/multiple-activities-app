// components/FileList.jsx
'use client'
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const user = supabase.auth.user();
        if (!user) return;

        const { data, error } = await supabase.storage
          .from('your-bucket-name') // Replace with your bucket name
          .list(`${user.id}`, {
            limit: 100,
            offset: 0,
          });

        if (error) {
          setError('Failed to fetch files');
        } else {
          setFiles(data);
        }
      } catch (err) {
        console.error('Error fetching files:', err);
        setError('Error fetching files');
      }
    };

    fetchFiles();
  }, []);

  const handleDelete = async (fileName) => {
    try {
      const { error } = await supabase.storage
        .from('your-bucket-name') // Replace with your bucket name
        .remove([fileName]);

      if (error) {
        setError('Failed to delete file');
      } else {
        setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
        alert('File deleted successfully!');
      }
    } catch (err) {
      console.error('Error deleting file:', err);
      setError('Failed to delete file');
    }
  };

  return (
    <div>
      {error && <p className="error">{error}</p>}
      <ul>
        {files.length === 0 ? (
          <p>No files uploaded.</p>
        ) : (
          files.map((file) => (
            <li key={file.name}>
              <span>{file.name}</span>
              <button onClick={() => handleDelete(file.name)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default FileList;
