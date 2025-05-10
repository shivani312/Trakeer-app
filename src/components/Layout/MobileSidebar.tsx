import React from 'react';
import { X, Home, Users, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface MobileSidebarProps {
  onClose: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose}></div>
      
      <div className="relative flex flex-col w-full max-w-xs h-full bg-white">
        <div className="px-4 pt-5 pb-4 flex items-center justify-between">
          <span className="text-xl font-bold text-[#4c7f7f]">
            Trakeer
          </span>
          <button
            className="rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-1 pt-2 pb-4 overflow-y-auto">
          <nav className="px-2 space-y-1">
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#4c7f7f] text-white' 
                    : 'text-[#4c7f7f] hover:bg-gray-100'
                }`
              }
              onClick={onClose}
            >
              <Home className="mr-3 h-5 w-5" />
              Dashboard
            </NavLink>
            
            <NavLink 
              to="/groups" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#4c7f7f] text-white' 
                    : 'text-[#4c7f7f] hover:bg-gray-100'
                }`
              }
              onClick={onClose}
            >
              <Users className="mr-3 h-5 w-5" />
              Members
            </NavLink>
          </nav>
        </div>
        
        <div className="px-4 py-4 border-t border-gray-200">
          <button 
            className="flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-all duration-200 w-full"
            onClick={onClose}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;