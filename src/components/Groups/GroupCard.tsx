import React from 'react';
import { Users, DollarSign, Calendar } from 'lucide-react';
import { Group } from '../../types';
import { Link } from 'react-router-dom';

interface GroupCardProps {
  group: Group;
}

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  const totalExpenses = group.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  return (
    <Link 
      to={`/groups/${group.id}`}
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
    >
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{group.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{group.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex items-center">
            <Users className="h-4 w-4 text-blue-500 mr-2" />
            <span className="text-sm text-gray-600">{group.members.length} members</span>
          </div>
          
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-sm text-gray-600">${totalExpenses.toFixed(2)}</span>
          </div>
          
          <div className="flex items-center col-span-2">
            <Calendar className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">
              Created {new Date(group.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-5 py-3 rounded-b-lg border-t border-gray-200">
        <span className="text-sm font-medium text-blue-600">View Details</span>
      </div>
    </Link>
  );
};

export default GroupCard;