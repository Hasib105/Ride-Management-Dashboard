import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const TripStatistics = () => {
  const [type, setType] = useState('total'); // State to manage "total" or "daily"
  const [tripData, setTripData] = useState([]);
  const [totalTrips, setTotalTrips] = useState(0);
  const [inProcessTrips, setInProcessTrips] = useState(0);
  const [canceledTrips, setCanceledTrips] = useState(0);
  const [completedTrips, setCompletedTrips] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data whenever `type` changes
  useEffect(() => {
    const fetchTripStatistics = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch data based on selected type (total or daily)
        const response = await axios.get(`/api/trip-statistics/?type=${type}`);
        
        // Update state with received data
        setTotalTrips(response.data.total_trips || 0);
        setInProcessTrips(response.data.in_process_trips || 0);
        setCanceledTrips(response.data.canceled_trips || 0);
        setCompletedTrips(response.data.completed_trips || 0);

        // Set chart data
        setTripData([
          { status: 'In Process', count: response.data.in_process_trips || 0 },
          { status: 'Canceled', count: response.data.canceled_trips || 0 },
          { status: 'Completed', count: response.data.completed_trips || 0 },
        ]);
      } catch (error) {
        console.error("Error fetching trip statistics:", error);
        setError("Failed to fetch trip statistics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchTripStatistics();
  }, [type]);

  // Chart data configuration
  const chartData = {
    labels: tripData.map(entry => entry.status),
    datasets: [
      {
        label: `Trips (${type.charAt(0).toUpperCase() + type.slice(1)})`,
        data: tripData.map(entry => entry.count),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <div className="flex flex-col items-center p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Trip Statistics</h2>

      <div className="flex gap-4 mb-4">
        <button onClick={() => setType('total')} className={`px-4 py-2 ${type === 'total' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Total</button>
        <button onClick={() => setType('daily')} className={`px-4 py-2 ${type === 'daily' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Daily</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 w-full max-w-3xl">
        <div className="p-4 border rounded shadow text-center">
          <h3 className="text-lg font-semibold">Total Trips</h3>
          <p className="text-2xl">{totalTrips}</p>
        </div>
        <div className="p-4 border rounded shadow text-center">
          <h3 className="text-lg font-semibold">In-process Trips</h3>
          <p className="text-2xl">{inProcessTrips}</p>
        </div>
        <div className="p-4 border rounded shadow text-center">
          <h3 className="text-lg font-semibold">Canceled Trips</h3>
          <p className="text-2xl">{canceledTrips}</p>
        </div>
        <div className="p-4 border rounded shadow text-center">
          <h3 className="text-lg font-semibold">Completed Trips</h3>
          <p className="text-2xl">{completedTrips}</p>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="w-full max-w-lg mt-6">
        <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

export default TripStatistics;