import React, { useEffect, useState } from "react";
import axios from "axios";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

const center = { lat: 37.7749, lng: -122.4194 }; // Default center

const Dashboard = () => {
  const [drivers, setDrivers] = useState([]); // Ensure initial state is an array
  const [statusCounts, setStatusCounts] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const fetchStatusCounts = async () => {
    try {
      const response = await axios.get("/api/driver-status-count/");
      const counts = response.data.reduce((acc, item) => {
        acc[item.status] = item.count;
        return acc;
      }, {});
      setStatusCounts(counts);
    } catch (error) {
      console.error("Error fetching driver status counts:", error);
    }
  };

  useEffect(() => {
    const address = "ws://localhost:8000/ws/driver-location/";
    const socket = new WebSocket(address);

    socket.onopen = () => {
      console.log("WebSocket connection opened");
      socket.send(JSON.stringify({ status: selectedStatus }));
    };

    socket.onmessage = (event) => {
      console.log("Message from server:", event.data);
      try {
        const updatedDrivers = JSON.parse(event.data);
        if (Array.isArray(updatedDrivers)) {
          // Ensure the data is an array
          setDrivers(updatedDrivers);
        } else {
          console.error("Received data is not an array:", updatedDrivers);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    fetchStatusCounts();

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [selectedStatus]); // Add selectedStatus as a dependency to send status updates

  const filteredDrivers =
    selectedStatus === "ALL"
      ? drivers
      : drivers.filter((driver) => driver.status === selectedStatus);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>
      <div className="flex justify-around mb-6 gap-2">
        <button
          onClick={() => setSelectedStatus("ALL")}
          className={`px-4 py-2 rounded-md font-semibold transition ${
            selectedStatus === "ALL"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          All
        </button>
        {Object.keys(statusCounts).map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              selectedStatus === status
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {status} ({statusCounts[status]})
          </button>
        ))}
      </div>
      <LoadScript googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap
          mapContainerClassName="w-full h-[600px] rounded-md overflow-hidden"
          center={center}
          zoom={12}
        >
          {filteredDrivers.map((driver) => (
            <Marker
              key={driver.id}
              position={{
                lat: parseFloat(driver.latitude),
                lng: parseFloat(driver.longitude),
              }}
              title={`Driver: ${driver.name}`}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Dashboard;
