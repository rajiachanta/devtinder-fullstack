import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Login from './pages/Login';
import Feed from './pages/Feed';
import EditProfile from './pages/EditProfile';
import Requests from './pages/Requests';
import Connections from './pages/Connections';
import Chat from './pages/Chat';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
  shape: {
    borderRadius: 8,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/connections" element={<Connections />} />
          <Route path="/chat/:userId?" element={<Chat />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;