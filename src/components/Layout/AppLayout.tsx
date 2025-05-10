import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { X } from 'lucide-react';

const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="h-screen flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 h-full">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" onClick={closeSidebar}></div>
          {/* Drawer */}
          <div className="relative w-4/5 max-w-xs h-full bg-white shadow-xl">
            <button
              className="absolute top-4 right-4 text-[#4c7f7f] hover:text-gray-700"
              onClick={closeSidebar}
            >
              <X className="h-7 w-7" />
            </button>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;