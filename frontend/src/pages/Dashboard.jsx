import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";

const center = { lat: 40.7128, lng: -74.006 }; // Default center New York

const Dashboard = () => {
  const [drivers, setDrivers] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useLoadScript({
    googleMapsApiKey,
  });

  useEffect(() => {
    const address = "ws://localhost:8000/ws/driver-location/";
    const socket = new WebSocket(address);

    socket.onopen = () => {
      console.log("WebSocket connection opened");
      socket.send(JSON.stringify({ status: selectedStatus }));
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("Received message:", message);

        if (message.type === "drivers" && Array.isArray(message.data)) {
          // Update driver data
          setDrivers(message.data);
        } else if (message.type === "status_counts") {
          // Update status counts
          setStatusCounts(message.data);
        } else if (
          message.type === "driver_location_update" &&
          Array.isArray(message.data)
        ) {
          // Handle driver location updates
          setDrivers(message.data);
        } else {
          console.error("Unexpected data format:", message);
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

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [selectedStatus]);

  const filteredDrivers =
    selectedStatus === "ALL"
      ? drivers
      : drivers.filter((driver) => driver.status === selectedStatus);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Drivers Dashboard</h1>
      <div className="flex justify-around mb-6 gap-2 flex-wrap">
        <button
          onClick={() => setSelectedStatus("ALL")}
          className={`px-4 py-2 rounded-md font-semibold transition ${
            selectedStatus === "ALL"
              ? "bg-rose-700 text-white"
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
                ? "bg-rose-700 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {status} ({statusCounts[status]})
          </button>
        ))}
      </div>
      {isLoaded ? (
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
      ) : (
        <div>Loading Map...</div>
      )}
    </div>
  );
};

export default Dashboard;
