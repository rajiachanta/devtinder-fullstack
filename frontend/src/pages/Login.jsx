import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, TextField, Button, Typography, Box, Alert, Container } from '@mui/material';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/api/auth/login', {
        email,
        password
      });
      localStorage.setItem('token', response.data.token);
      navigate('/feed');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ bgcolor: '#f5f5f5' }}>
      <Card sx={{ maxWidth: 400, width: '100%', borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom fontWeight="bold" color="primary">
            DevTinder
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Connect with developers
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              Login
            </Button>
          </form>
          
          <Typography variant="body2" align="center">
            New here?{' '}
            <Button color="primary" onClick={() => navigate('/register')} sx={{ textTransform: 'none' }}>
              Sign up
            </Button>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;