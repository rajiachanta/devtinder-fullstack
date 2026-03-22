import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>My Connections</h2>
      {connections.length === 0 ? (
        <p>No connections yet. Send some requests!</p>
      ) : (
        connections.map(conn => (
          <div key={conn.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <p><strong>{conn.name}</strong></p>
            <p>Email: {conn.email}</p>
            <p>Skills: {conn.skills?.join(', ') || 'No skills'}</p>
            <button>Chat</button>
          </div>
        ))
      )}
      <button onClick={() => navigate('/feed')}>Back to Feed</button>
    </div>
  );
}

export default Connections;