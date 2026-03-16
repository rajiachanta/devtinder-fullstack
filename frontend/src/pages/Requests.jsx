import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      // Remove from list
      setRequests(requests.filter(req => req.id !== requestId));
    } catch (err) {
      console.error('Error updating request:', err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Pending Connection Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        requests.map(req => (
          <div key={req.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <p><strong>{req.fromUser.name}</strong> wants to connect</p>
            <p>Skills: {req.fromUser.skills?.join(', ') || 'No skills'}</p>
            <button onClick={() => handleRequest(req.id, 'ACCEPTED')}>Accept</button>
            <button onClick={() => handleRequest(req.id, 'REJECTED')}>Reject</button>
          </div>
        ))
      )}
      <button onClick={() => navigate('/feed')}>Back to Feed</button>
    </div>
  );
}

export default Requests;