import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen">
      <div className="py-4 px-6">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <ul className="mt-6 space-y-2">
          <li>
            <Link to="/" className="block px-4 py-2 rounded hover:bg-gray-700">
              Summary Report
            </Link>
          </li>
          <li>
            <Link to="/aging-report" className="block px-4 py-2 rounded hover:bg-gray-700">
              Inventory Aging Report
            </Link>
          </li>
          <li>
            <Link to="/backorder-report" className="block px-4 py-2 rounded hover:bg-gray-700">
              Backorder Report
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;