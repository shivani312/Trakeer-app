import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="ml-4 text-xl font-bold text-[#4c7f7f]">Trakeer</h1>
      </div>
    </header>
  );
};

export default Header;