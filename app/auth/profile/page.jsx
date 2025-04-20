// /app/auth/profile.jsx
'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/router';

const Profile = () => {
  const { user, setUser } = useAuthContext();  // Assuming user and setUser are part of the context
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setEmail(user.email);
    } else {
      router.push('/auth/login');  // Redirect to login if not authenticated
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data, error } = await supabase.auth.updateUser({
        email,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setUser(data.user);  // Update the context with the new user info
      alert('Profile updated successfully!');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      {user ? (
        <form onSubmit={handleUpdateProfile}>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit">Update Profile</button>
        </form>
      ) : (
        <p>Loading...</p>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};

export default Profile;
