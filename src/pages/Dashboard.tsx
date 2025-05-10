import React from 'react';
import { useAppState } from '../context/AppStateContext';
import { PieChart, DollarSign, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { groups, currentUser } = useAppState();
  
  // Calculate summary data
  const totalGroups = groups.length;
  const totalExpenses = groups.reduce(
    (sum, group) => sum + group.expenses.reduce((s, e) => s + e.amount, 0), 
    0
  );
  const totalMembers = new Set(groups.flatMap(group => group.members.map(m => m.id))).size;
  
  // Get recent expenses across all groups
  const recentExpenses = groups
    .flatMap(group => group.expenses.map(expense => ({ 
      ...expense, 
      groupName: group.name,
      createdByName: group.members.find(m => m.id === expense.createdBy)?.name || 'Unknown'
    })))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700">Total Expenses</h3>
            <div className="p-2 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">${totalExpenses.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-2">Across all groups</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700">Active Groups</h3>
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalGroups}</p>
          <p className="text-sm text-gray-500 mt-2">Manage your expenses</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700">Members</h3>
            <div className="p-2 bg-purple-100 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalMembers}</p>
          <p className="text-sm text-gray-500 mt-2">Connected via WhatsApp</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700">Categories</h3>
            <div className="p-2 bg-orange-100 rounded-full">
              <PieChart className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">7</p>
          <p className="text-sm text-gray-500 mt-2">Expense categories</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Expenses</h3>
            <Link to="/expenses" className="text-sm text-blue-600 hover:text-blue-800">View All</Link>
          </div>
          
          {recentExpenses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No expenses yet</p>
              <Link to="/groups" className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800">
                Go to a group to add expenses
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentExpenses.map(expense => (
                <div key={expense.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">{expense.description}</p>
                    <div className="flex text-xs text-gray-500 space-x-2">
                      <span>{expense.groupName}</span>
                      <span>•</span>
                      <span>{new Date(expense.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{expense.createdByName}</span>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">${expense.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Your Groups</h3>
            <Link to="/groups" className="text-sm text-blue-600 hover:text-blue-800">Manage</Link>
          </div>
          
          {groups.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No groups yet</p>
              <Link 
                to="/groups/new" 
                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Create First Group
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {groups.slice(0, 5).map(group => (
                <Link 
                  key={group.id} 
                  to={`/groups/${group.id}`}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-900">{group.name}</p>
                    <p className="text-xs text-gray-500">{group.members.length} members</p>
                  </div>
                  <div className="flex items-center text-sm font-semibold text-gray-900">
                    <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                    {group.expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {groups.length > 0 && (
            <Link 
              to="/groups/new" 
              className="mt-4 flex items-center justify-center w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50"
            >
              Create New Group
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;