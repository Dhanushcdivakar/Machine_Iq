import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AvailableJobs from './pages/AvailableJobs';
import OpenWorkloads from './pages/OpenWorkloads';
import ClosedWorkloads from './pages/ClosedWorkloads';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/available-jobs" element={<AvailableJobs />} />
        <Route path="/open-workloads" element={<OpenWorkloads />} />
        <Route path="/closed-workloads" element={<ClosedWorkloads />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
