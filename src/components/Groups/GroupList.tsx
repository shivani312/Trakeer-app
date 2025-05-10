import React from 'react';
import { Plus, DollarSign, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Group } from '../../types';

interface GroupListProps {
  groups: Group[];
}

const GroupList: React.FC<GroupListProps> = ({ groups }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Members</h2>
        <Link 
          to="/groups/new" 
          className="flex items-center px-4 py-2 bg-[#4c7f7f] text-white rounded-md text-sm font-medium hover:bg-[#3d6666] transition-all duration-200 shadow-md"
        >
          <Plus className="h-4 w-4 mr-1" />
          New Member
        </Link>
      </div>
      
      {groups.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No members yet</h3>
          <p className="text-gray-600 mb-6">Add your first member to start tracking expenses</p>
          <Link 
            to="/groups/new" 
            className="inline-flex items-center px-4 py-2 bg-[#4c7f7f] text-white rounded-md text-sm font-medium hover:bg-[#3d6666] transition-all duration-200 shadow-md"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Member
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(group => (
            <div key={group.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="space-y-4">
                {group.members.map(member => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.phoneNumber}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                    <span>Total Expense: ₹{group.expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <TrendingUp className="h-4 w-4 mr-1 text-blue-600" />
                    <span>Total Income: ₹{group.expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
                
                <Link 
                  to={`/groups/${group.id}`}
                  className="mt-4 flex items-center justify-center w-full px-4 py-2 bg-[#4c7f7f] text-white rounded-md text-sm font-medium hover:bg-[#3d6666] transition-all duration-200 shadow-md"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupList;