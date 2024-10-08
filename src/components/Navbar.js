import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEnvelope, faBell, faUser } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
       
        <div className="relative">
          <input
            type="text"
            className="border border-gray-300 rounded-lg py-2 px-4 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search..."
          />
          <span className="absolute right-3 top-3 text-gray-500">
            <FontAwesomeIcon icon={faSearch} />
          </span>
        </div>

        <div className="flex space-x-4 items-center">
        
          <div className="relative">
            <FontAwesomeIcon icon={faEnvelope} className="text-gray-600 text-xl" />
            <span className="absolute top-0 right-0 block h-2.5 w-2.5 bg-red-600 rounded-full"></span>
          </div>

          
          <div className="relative">
            <FontAwesomeIcon icon={faBell} className="text-gray-600 text-xl" />
            <span className="absolute top-0 right-0 block h-2.5 w-2.5 bg-red-600 rounded-full"></span>
          </div>

          
          <div className="relative">
            <FontAwesomeIcon icon={faUser} className="text-gray-600 text-xl" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;