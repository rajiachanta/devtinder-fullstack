import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, TextField, Button, Typography, Box, CircularProgress, Alert, Chip, Stack } from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import Layout from '../components/Layout';
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
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
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
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await API.put('/profile/edit', profile);
      setMessage('Profile updated successfully!');
      setTimeout(() => navigate('/feed'), 1500);
    } catch (err) {
      setError('Error updating profile');
      setSaving(false);
    }
  };

  const handleSkillChange = (e) => {
    const skillsArray = e.target.value.split(',').map(s => s.trim()).filter(s => s);
    setProfile({...profile, skills: skillsArray});
  };

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/feed')} variant="outlined">
          Back to Feed
        </Button>
        <Typography variant="h4" fontWeight="bold">Edit Profile</Typography>
      </Box>

      <Card sx={{ maxWidth: 800, mx: 'auto', borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              value={profile.name || ''}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Bio"
              value={profile.bio || ''}
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Location"
              value={profile.location || ''}
              onChange={(e) => setProfile({...profile, location: e.target.value})}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Skills (comma separated)"
              value={profile.skills?.join(', ') || ''}
              onChange={handleSkillChange}
              margin="normal"
              helperText="e.g., Java, Spring Boot, React, MySQL"
            />
            <TextField
              fullWidth
              label="GitHub URL"
              value={profile.githubUrl || ''}
              onChange={(e) => setProfile({...profile, githubUrl: e.target.value})}
              margin="normal"
            />
            <TextField
              fullWidth
              label="LinkedIn URL"
              value={profile.linkedinUrl || ''}
              onChange={(e) => setProfile({...profile, linkedinUrl: e.target.value})}
              margin="normal"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              startIcon={<Save />}
              disabled={saving}
              sx={{ mt: 3, py: 1.5 }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
}

export default EditProfile;