 import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [backendData, setBackendData] = useState({});
  const [healthStatus, setHealthStatus] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkBackendHealth();
    fetchBackendData();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/health`);
      setHealthStatus(response.data);
    } catch (error) {
      setHealthStatus({ 
        status: 'Error', 
        error: 'Backend is not reachable',
        timestamp: new Date().toISOString()
      });
    }
  };

  const fetchBackendData = async () => {
    try {
      const response = await axios.get(`${API_URL}/`);
      setBackendData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setBackendData({ 
        message: 'Failed to connect to backend',
        error: error.message 
      });
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="App">
        <header className="App-header">
          <div>Loading MERN App...</div>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 MERN Deployment Project</h1>
        <p>Frontend Environment: <strong>{process.env.REACT_APP_ENV}</strong></p>
        
        <div className="status-section">
          <h2>Backend Status</h2>
          <div className={`status ${healthStatus.status === 'OK' ? 'healthy' : 'error'}`}>
            Status: {healthStatus.status || 'Unknown'}
          </div>
          <p>Database: {healthStatus.database || 'N/A'}</p>
          <p>Last Check: {new Date(healthStatus.timestamp).toLocaleString()}</p>
        </div>

        <div className="data-section">
          <h2>Backend Response</h2>
          <pre>{JSON.stringify(backendData, null, 2)}</pre>
        </div>

        <div className="info-section">
          <h3>API URL Being Used:</h3>
          <code>{API_URL}</code>
        </div>
      </header>
    </div>
  );
}

export default App;