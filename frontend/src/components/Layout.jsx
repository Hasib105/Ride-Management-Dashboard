import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="ml-0 md:ml-64 p-6 flex-grow overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default Layout;