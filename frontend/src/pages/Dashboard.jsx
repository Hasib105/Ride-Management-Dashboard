import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';


const containerStyle = {
  width: '100%',
  height: '600px'
};

const center = { lat: 37.7749, lng: -122.4194 }; // Default center (e.g., San Francisco)

const Dashboard = () => {
  const [drivers, setDrivers] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [tripStatistics, setTripStatistics] = useState({});
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const googleMapsApiKey = 'AIzaSyB1P7_q1m49KL6DOs8Ha9axgGp9RyqNx5g'; // Replace with your actual API key

  // Fetch initial driver status counts and trip statistics
  const fetchStatusCounts = async () => {
    try {
      const response = await axios.get('/api/driver-status-count/');
      const counts = response.data.reduce((acc, item) => {
        acc[item.status] = item.count;
        return acc;
      }, {});
      setStatusCounts(counts);
    } catch (error) {
      console.error('Error fetching driver status counts:', error);
    }
  };

  const fetchTripStatistics = async () => {
    try {
      const response = await axios.get('/api/trip-statistics/');
      setTripStatistics(response.data);
    } catch (error) {
      console.error('Error fetching trip statistics:', error);
    }
  };

  // WebSocket setup for real-time driver locations
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/driver-location/'); // Replace with your actual WebSocket URL

    ws.onmessage = (event) => {
      const updatedDrivers = JSON.parse(event.data);
      setDrivers(updatedDrivers);
    };

    fetchStatusCounts();
    fetchTripStatistics();

    return () => ws.close();
  }, []);

  // Filter drivers by selected status
  const filteredDrivers = selectedStatus === 'ALL'
    ? drivers
    : drivers.filter(driver => driver.status === selectedStatus);

  // Earnings data for bar chart
  const earningsData = {
    labels: ['January', 'February', 'March'], // Replace with actual data
    datasets: [
      {
        label: 'Earnings',
        data: [1200, 1900, 3000], // Replace with actual data
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>

      {/* Driver Status Counts */}
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
        <button onClick={() => setSelectedStatus('ALL')}>All</button>
        {Object.keys(statusCounts).map((status) => (
          <button key={status} onClick={() => setSelectedStatus(status)}>
            {status} ({statusCounts[status]})
          </button>
        ))}
      </div>

      {/* Google Map */}
      <LoadScript googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
          {filteredDrivers.map((driver) => (
            <Marker
              key={driver.id}
              position={{ lat: parseFloat(driver.latitude), lng: parseFloat(driver.longitude) }}
              title={`Driver: ${driver.name}`}
            />
          ))}
        </GoogleMap>
      </LoadScript>

      {/* Trip Statistics */}
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>Trip Statistics</h3>
        <p>Total Trips: {tripStatistics.total_trips}</p>
        <p>In-process Trips: {tripStatistics.in_process_trips}</p>
        <p>Canceled Trips: {tripStatistics.canceled_trips}</p>
        <p>Completed Trips: {tripStatistics.completed_trips}</p>
      </div>

      
    </div>
  );
};

export default Dashboard;
