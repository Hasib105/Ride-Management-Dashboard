// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Registration from './pages/Registration';
import Signin from './pages/Signin';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import TripStatistics from './pages/TripPage';
import EarningStatistics from './pages/EarningPage';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Registration />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trip-statistics" element={<TripStatistics />} />
          <Route path="/earning-statistics" element={<EarningStatistics />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;