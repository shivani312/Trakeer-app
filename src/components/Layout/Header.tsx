import React, { useState } from 'react';
import { Bell, Menu, X, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileSidebar from './MobileSidebar';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            className="md:hidden mr-2 text-gray-600 hover:text-gray-900"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/" className="flex items-center">
            <span className="text-xl font-semibold text-blue-600">ExpenseShare</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-1 rounded-full text-gray-500 hover:bg-gray-100 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          <Link to="/profile" className="flex items-center text-sm text-gray-700 hover:text-gray-900">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <User className="h-4 w-4" />
            </div>
          </Link>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <MobileSidebar onClose={() => setIsMobileMenuOpen(false)} />
      )}
    </header>
  );
};

export default Header;