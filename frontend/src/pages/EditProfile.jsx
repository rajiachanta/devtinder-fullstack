import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function EditProfile() {
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    location: '',
    skills: [],
    githubUrl: '',
    linkedinUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get('/profile/view');
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        navigate('/login');
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put('/profile/edit', profile);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Error updating profile');
    }
  };

  const handleSkillChange = (e) => {
    const skillsArray = e.target.value.split(',').map(s => s.trim());
    setProfile({...profile, skills: skillsArray});
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Edit Profile</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({...profile, name: e.target.value})}
          />
        </div>
        <div>
          <label>Bio:</label>
          <textarea
            value={profile.bio || ''}
            onChange={(e) => setProfile({...profile, bio: e.target.value})}
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            value={profile.location || ''}
            onChange={(e) => setProfile({...profile, location: e.target.value})}
          />
        </div>
        <div>
          <label>Skills (comma separated):</label>
          <input
            type="text"
            value={profile.skills?.join(', ') || ''}
            onChange={handleSkillChange}
          />
        </div>
        <div>
          <label>GitHub URL:</label>
          <input
            type="url"
            value={profile.githubUrl || ''}
            onChange={(e) => setProfile({...profile, githubUrl: e.target.value})}
          />
        </div>
        <div>
          <label>LinkedIn URL:</label>
          <input
            type="url"
            value={profile.linkedinUrl || ''}
            onChange={(e) => setProfile({...profile, linkedinUrl: e.target.value})}
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditProfile;