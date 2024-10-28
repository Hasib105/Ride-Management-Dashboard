import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaSignInAlt, FaTachometerAlt, FaSignOutAlt, FaBars } from 'react-icons/fa';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  const links = [
    { path: '/', label: 'Register', icon: <FaUserPlus /> },
    { path: '/signin', label: 'Sign In', icon: <FaSignInAlt /> },
    { path: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/trip-statistics', label: 'Trip Statistics', icon: <FaTachometerAlt /> },
    { path: '/earning-statistics', label: 'Earning Statistics', icon: <FaTachometerAlt /> },
  ];

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Attach event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      // Cleanup event listener
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={sidebarRef}>
      {/* Toggle button for mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-4 text-white bg-gray-800 rounded focus:outline-none m-4"
      >
        <FaBars />
      </button>
      
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 w-64 h-full bg-gray-900 text-white flex flex-col shadow-lg transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <h2 className="text-2xl font-bold p-6 border-b border-gray-700">RMD</h2>
        <nav className="flex-grow">
          <ul>
            {links.map((link) => (
              <li key={link.path} className="flex items-center p-4 hover:bg-gray-700 transition duration-200 ease-in-out">
                <Link to={link.path} className="flex items-center w-full">
                  <span className="mr-3 text-lg">{link.icon}</span>
                  <span className="text-md">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <Link to="/logout" className="flex items-center text-red-500 hover:text-red-400">
            <FaSignOutAlt className="mr-3" />
            <span className="text-md">Logout</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;