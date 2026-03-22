import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function Feed() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch user profile
    const fetchProfile = async () => {
      try {
        const response = await API.get('/profile/view');
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome to DevTinder Feed!</h1>
      <p>Hello, {user.name}!</p>
      <p>Email: {user.email}</p>
      <p>Bio: {user.bio || 'No bio added'}</p>
      <p>Location: {user.location || 'No location'}</p>
      <p>Skills: {user.skills?.join(', ') || 'No skills added'}</p>

      <button onClick={() => navigate('/edit-profile')}>
        Edit Profile
      </button>

      <button onClick={() => {
        localStorage.removeItem('token');
        navigate('/login');
      }}>
        Logout
      </button>

      <button onClick={() => navigate('/requests')}>
        View Requests
      </button>

      <button onClick={() => navigate('/connections')}>
        My Connections ({user.connections?.length || 0})
      </button>
    </div>
  );
}

export default Feed;