import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import SummaryPage from './components/SummaryPage';
import InventoryAgingReport from './components/InventoryAgingReport';
import BackorderReport from './components/BackorderReport';

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <div className="p-8">
            <Routes>
              <Route path="/" element={<SummaryPage />} />
              <Route path="/aging-report" element={<InventoryAgingReport />} />
              <Route path="/backorder-report" element={<BackorderReport />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
