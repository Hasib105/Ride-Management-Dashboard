// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import TripStatistics from "./pages/TripPage";
import EarningStatistics from "./pages/EarningPage";
import Signin from "./pages/Signin"; 
import Registration from "./pages/Registration"; 
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/register" element={<Registration />} />
          <Route
            path="/"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/trip-statistics"
            element={
              <Layout>
                <TripStatistics />
              </Layout>
            }
          />
          <Route
            path="/earning-statistics"
            element={
              <Layout>
                <EarningStatistics />
              </Layout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
