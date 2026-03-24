import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, Card, CardContent, Typography, TextField, Button, 
  Avatar, Paper, IconButton, AppBar, Toolbar, Container,
  Chip, Divider, CircularProgress
} from '@mui/material';
import { Send, ArrowBack, AccountCircle, Person } from '@mui/icons-material';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import API from '../services/api';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [connected, setConnected] = useState(false);
  const [user, setUser] = useState(null);
  const [chatPartner, setChatPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const stompClientRef = useRef(null);
  const joinedRef = useRef(false);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.get('/profile/view');
        setUser(response.data);
      } catch (err) {
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  // Fetch chat partner details
  useEffect(() => {
    if (userId && user) {
      const fetchPartner = async () => {
        try {
          const response = await API.get(`/user/${userId}`);
          setChatPartner(response.data);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching chat partner:', err);
          setLoading(false);
        }
      };
      fetchPartner();
    } else if (user) {
      setLoading(false);
    }
  }, [userId, user]);

  // WebSocket connection
  useEffect(() => {
    if (!user) return;

    const socket = new SockJS('http://localhost:8081/ws');
    const client = Stomp.over(socket);
    
    client.connect({}, () => {
      setConnected(true);
      console.log('Connected to WebSocket');
      
      client.subscribe('/topic/messages', (message) => {
        const newMessage = JSON.parse(message.body);
        setMessages(prev => [...prev, newMessage]);
      });
      
      if (!joinedRef.current) {
        joinedRef.current = true;
        client.send('/app/chat.join', {}, JSON.stringify({
          senderId: user.id,
          senderName: user.name,
          type: 'JOIN',
          content: `${user.name} joined the chat`
        }));
      }
    });
    
    stompClientRef.current = client;
    
    return () => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.disconnect();
      }
    };
  }, [user]);

  const sendMessage = () => {
    if (messageInput.trim() && stompClientRef.current && connected) {
      stompClientRef.current.send('/app/chat.send', {}, JSON.stringify({
        senderId: user?.id,
        senderName: user?.name,
        receiverId: userId ? parseInt(userId) : null,
        content: messageInput,
        type: 'CHAT',
        timestamp: new Date().toISOString()
      }));
      setMessageInput('');
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading || !user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: '#1976d2', boxShadow: 2 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/connections')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Avatar sx={{ mr: 2, bgcolor: 'white' }}>
            <Person sx={{ color: '#1976d2' }} />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              {chatPartner?.name || 'Chat'}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {connected ? '● Online' : '○ Connecting...'}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Messages Area */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        <Container maxWidth="md" sx={{ height: '100%' }}>
          {messages.length === 0 ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <Card sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  No messages yet
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Send a message to start the conversation!
                </Typography>
              </Card>
            </Box>
          ) : (
            messages.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  justifyContent: msg.senderId === user?.id ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                {msg.senderId !== user?.id && (
                  <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: '#e0e0e0' }}>
                    <Person sx={{ fontSize: 18, color: '#666' }} />
                  </Avatar>
                )}
                <Paper
                  sx={{
                    maxWidth: '70%',
                    p: 1.5,
                    bgcolor: msg.senderId === user?.id ? '#1976d2' : 'white',
                    color: msg.senderId === user?.id ? 'white' : 'text.primary',
                    borderRadius: msg.senderId === user?.id ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                    boxShadow: 1
                  }}
                >
                  <Typography variant="caption" display="block" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {msg.senderName}
                  </Typography>
                  <Typography variant="body2">{msg.content}</Typography>
                  <Typography variant="caption" display="block" sx={{ fontSize: '0.65rem', mt: 0.5, opacity: 0.7 }}>
                    {formatTime(msg.timestamp)}
                  </Typography>
                </Paper>
              </Box>
            ))
          )}
          <div ref={messagesEndRef} />
        </Container>
      </Box>

      {/* Input Area */}
      <Box sx={{ p: 2, bgcolor: 'white', borderTop: 1, borderColor: 'divider' }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="medium"
              placeholder={connected ? "Type a message..." : "Connecting to chat..."}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={!connected}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                }
              }}
            />
            <Button
              variant="contained"
              onClick={sendMessage}
              disabled={!connected}
              sx={{
                minWidth: '60px',
                borderRadius: 3,
                bgcolor: '#1976d2',
                '&:hover': { bgcolor: '#1565c0' }
              }}
            >
              <Send />
            </Button>
          </Box>
          {!connected && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
              🔌 Connecting to chat server...
            </Typography>
          )}
        </Container>
      </Box>
    </Box>
  );
}

export default Chat;