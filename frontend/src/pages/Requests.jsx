import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Avatar, Box, CircularProgress, Grid, Chip } from '@mui/material';
import { Check, Close, ArrowBack } from '@mui/icons-material';
import Layout from '../components/Layout';
import API from '../services/api';

function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await API.get('/user/requests');
        setRequests(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching requests:', err);
        navigate('/login');
      }
    };
    fetchRequests();
  }, [navigate]);

  const handleRequest = async (requestId, status) => {
    try {
      await API.post(`/requests/review/${status}/${requestId}`);
      setRequests(requests.filter(req => req.id !== requestId));
    } catch (err) {
      console.error('Error updating request:', err);
    }
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
        <Typography variant="h4" fontWeight="bold">Pending Requests</Typography>
      </Box>

      {requests.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">No pending requests</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            When someone sends you a connection request, it will appear here.
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {requests.map(req => (
            <Grid item xs={12} md={6} key={req.id}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>{req.fromUser.name?.charAt(0)}</Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">{req.fromUser.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        wants to connect with you
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">Skills:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5, mb: 2 }}>
                    {req.fromUser.skills?.length > 0 ? (
                      req.fromUser.skills.map((skill, i) => (
                        <Chip key={i} label={skill} size="small" variant="outlined" />
                      ))
                    ) : (
                      <Typography variant="caption">No skills listed</Typography>
                    )}
                  </Box>
                  <Box display="flex" gap={2}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<Check />}
                      onClick={() => handleRequest(req.id, 'ACCEPTED')}
                      fullWidth
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Close />}
                      onClick={() => handleRequest(req.id, 'REJECTED')}
                      fullWidth
                    >
                      Reject
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Layout>
  );
}

export default Requests;