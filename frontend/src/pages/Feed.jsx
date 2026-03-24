import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Avatar, Box, Chip, CircularProgress, Grid } from '@mui/material';
import { AccountCircle, Edit, People, PersonAdd } from '@mui/icons-material';
import Layout from '../components/Layout';
import API from '../services/api';

function Feed() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await API.get('/profile/view');
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

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
      <Card sx={{ maxWidth: 800, mx: 'auto', borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={3} mb={4}>
            <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main' }}>
              <AccountCircle sx={{ fontSize: 70 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold">Welcome, {user.name}!</Typography>
              <Typography variant="body1" color="text.secondary">{user.email}</Typography>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1"><strong>Bio:</strong> {user.bio || 'No bio added'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1"><strong>Location:</strong> {user.location || 'No location'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1"><strong>Skills:</strong></Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {user.skills?.length > 0 ? (
                  user.skills.map((skill, i) => (
                    <Chip key={i} label={skill} color="primary" variant="outlined" />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">No skills added</Typography>
                )}
              </Box>
            </Grid>
          </Grid>

          <Box display="flex" gap={2} flexWrap="wrap">
            <Button variant="contained" startIcon={<Edit />} onClick={() => navigate('/edit-profile')}>
              Edit Profile
            </Button>
            <Button variant="outlined" startIcon={<People />} onClick={() => navigate('/requests')}>
              View Requests
            </Button>
            <Button variant="outlined" startIcon={<PersonAdd />} onClick={() => navigate('/connections')}>
              My Connections ({user.connections?.length || 0})
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Layout>
  );
}

export default Feed;