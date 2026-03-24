import { AppBar, Toolbar, Typography, Button, Container, Box, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AccountCircle } from '@mui/icons-material';
import { useState } from 'react';

function Layout({ children }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [anchorEl, setAnchorEl] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    setAnchorEl(null);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: '#1976d2', boxShadow: 2 }}>
        <Toolbar>
          <Typography 
            variant="h6" 
            sx={{ 
              flexGrow: 1, 
              cursor: 'pointer', 
              fontWeight: 'bold',
              letterSpacing: 1
            }} 
            onClick={() => navigate('/feed')}
          >
            DevTinder
          </Typography>
          
          {token && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button color="inherit" onClick={() => navigate('/feed')}>Feed</Button>
              <Button color="inherit" onClick={() => navigate('/requests')}>Requests</Button>
              <Button color="inherit" onClick={() => navigate('/connections')}>Connections</Button>
              <Button color="inherit" onClick={() => navigate('/edit-profile')}>Profile</Button>
              
              <IconButton onClick={handleMenu} color="inherit">
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => { handleClose(); navigate('/edit-profile'); }}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, pb: 4, minHeight: 'calc(100vh - 64px)' }}>
        {children}
      </Container>
    </>
  );
}

export default Layout;