import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const center = { lat: 37.7749, lng: -122.4194 }; // Default center (e.g., San Francisco)

const Dashboard = () => {
  const [drivers, setDrivers] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [tripStatistics, setTripStatistics] = useState({});
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

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
    const ws = new WebSocket('ws://localhost:8000/ws/driver-location/'); 
    const socket = new WebSocket('ws://localhost:8000/ws/driver-location/');
    socket.onopen = () => console.log('Connection opened');
    socket.onclose = () => console.log('Connection closed');
    socket.onerror = (error) => console.error('WebSocket error:', error);

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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>

      {/* Driver Status Counts */}
      <div className="flex justify-around mb-6 gap-2">
        <button
          onClick={() => setSelectedStatus('ALL')}
          className={`px-4 py-2 rounded-md font-semibold transition ${
            selectedStatus === 'ALL' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          All
        </button>
        {Object.keys(statusCounts).map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              selectedStatus === status ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {status} ({statusCounts[status]})
          </button>
        ))}
      </div>

      {/* Google Map */}
      <LoadScript googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap mapContainerClassName="w-full h-[600px] rounded-md overflow-hidden" center={center} zoom={12}>
          {filteredDrivers.map((driver) => (
            <Marker
              key={driver.id}
              position={{ lat: parseFloat(driver.latitude), lng: parseFloat(driver.longitude) }}
              title={`Driver: ${driver.name}`}
            />
          ))}
        </GoogleMap>
      </LoadScript>

    </div>
  );
};

export default Dashboard;
