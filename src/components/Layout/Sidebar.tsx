import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

const Sidebar: React.FC = () => {
  const { signOut } = useAppState();

  return (
    <div className="h-full bg-white border-r border-gray-200 w-64 flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-[#4c7f7f]">Trakeer</h2>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200 ${
              isActive
                ? 'bg-[#4c7f7f] text-white'
                : 'text-[#4c7f7f] hover:bg-gray-100'
            }`
          }
        >
          <LayoutDashboard className="h-5 w-5 mr-3" />
          Dashboard
        </NavLink>
        
        <NavLink
          to="/groups"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200 ${
              isActive
                ? 'bg-[#4c7f7f] text-white'
                : 'text-[#4c7f7f] hover:bg-gray-100'
            }`
          }
        >
          <Users className="h-5 w-5 mr-3" />
          Members
        </NavLink>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={signOut}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors duration-200"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;