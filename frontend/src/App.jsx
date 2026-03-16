import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Feed from './pages/Feed';
import EditProfile from './pages/EditProfile'; 
import Requests from './pages/Requests';
 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/" element={<Login />} />
        <Route path="/requests" element={<Requests />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;