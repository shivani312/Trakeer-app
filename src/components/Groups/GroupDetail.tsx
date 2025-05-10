import React, { useState } from 'react';
import { Group,  Expense } from '../../types';
import {  Send, X } from 'lucide-react';
import ExpenseList from '../Expenses/ExpenseList';
// import AddExpenseForm from '../Expenses/AddExpenseForm';

interface GroupDetailProps {
  group: Group;
  onAddMember: (phoneNumber: string) => void;
  onRemoveMember: (userId: string) => void;
  onAddExpense: (expense: Omit<Expense, 'id' | 'groupId' | 'createdBy'>) => void;
}

const GroupDetail: React.FC<GroupDetailProps> = ({ 
  group, 
  onAddMember,  
}) => {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const totalExpenses = group.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const handleAddMember = () => {
    onAddMember(phoneNumber);
    setPhoneNumber('');
    setShowAddMember(false);
  };
  
  // const handleAddExpense = (expense: Omit<Expense, 'id' | 'groupId' | 'createdBy'>) => {
  //   onAddExpense(expense);
  //   setShowAddExpense(false);
  // };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{group.name}</h2>
          <p className="text-gray-600 mb-6">{group.description}</p>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center">
              {/* <DollarSign className="h-5 w-5 text-green-500 mr-2" /> */}
              <span className="text-gray-900 font-medium">Total:  {totalExpenses.toFixed(2)} Rs</span>
            </div>
            
            {/* <div className="flex space-x-2">
              <button
                onClick={() => setShowAddExpense(true)}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Expense
              </button>
              <button
                onClick={() => setShowAddMember(true)}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Add Member
              </button>
            </div> */}
          </div>
          
          {showAddExpense && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add New Expense</h3>
                <button onClick={() => setShowAddExpense(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {/* <AddExpenseForm onAddExpense={handleAddExpense} /> */}
            </div>
          )}
          
          {showAddMember && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add New Member</h3>
                <button onClick={() => setShowAddMember(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="WhatsApp number (with country code)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleAddMember}
                  disabled={!phoneNumber}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4 mr-1" />
                  Invite
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                An invite will be sent via WhatsApp to this number
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Members ({group.members.length})</h3>
          </div>
          
          <div className="space-y-3">
            {group.members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.phoneNumber}</p>
                  </div>
                </div>
                
                {/* <button
                  onClick={() => onRemoveMember(member.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-5 w-5" />
                </button> */}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Expenses</h3>
          <ExpenseList expenses={group.expenses} members={group.members} />
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;