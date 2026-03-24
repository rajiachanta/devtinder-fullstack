import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Avatar, Box, CircularProgress, Grid, Chip, Container, Paper } from '@mui/material';
import { Chat, ArrowBack, Person } from '@mui/icons-material';
import Layout from '../components/Layout';
import API from '../services/api';

function Connections() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await API.get('/user/connections');
        setConnections(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching connections:', err);
        navigate('/login');
      }
    };
    fetchConnections();
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
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button 
              startIcon={<ArrowBack />} 
              onClick={() => navigate('/feed')} 
              variant="outlined"
              sx={{ textTransform: 'none' }}
            >
              Back to Feed
            </Button>
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#1976d2' }}>
              My Connections
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {connections.length} {connections.length === 1 ? 'connection' : 'connections'}
          </Typography>
        </Box>

        {connections.length === 0 ? (
          <Paper sx={{ textAlign: 'center', py: 8, borderRadius: 3 }}>
            <Person sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No connections yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Send some requests to connect with other developers!
            </Typography>
            <Button variant="contained" onClick={() => navigate('/feed')}>
              Go to Feed
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {connections.map(conn => (
              <Grid item xs={12} sm={6} md={4} key={conn.id}>
                <Card sx={{ 
                  borderRadius: 3, 
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    {/* Avatar and Name */}
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Avatar 
                        sx={{ 
                          width: 56, 
                          height: 56, 
                          bgcolor: '#1976d2',
                          fontSize: 24,
                          fontWeight: 'bold'
                        }}
                      >
                        {conn.name?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {conn.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {conn.email}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Skills */}
                    <Box sx={{ mt: 2, mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Skills:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {conn.skills?.length > 0 ? (
                          conn.skills.slice(0, 3).map((skill, i) => (
                            <Chip 
                              key={i} 
                              label={skill} 
                              size="small" 
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            No skills added
                          </Typography>
                        )}
                        {conn.skills?.length > 3 && (
                          <Chip 
                            label={`+${conn.skills.length - 3} more`} 
                            size="small" 
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                    </Box>
                    
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Chat />}
                      onClick={() => navigate(`/chat/${conn.id}`)}
                      sx={{ 
                        mt: 2,
                        py: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'bold'
                      }}
                    >
                      Chat with {conn.name?.split(' ')[0]}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Layout>
  );
}

export default Connections;