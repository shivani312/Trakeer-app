import React from 'react';
import { Expense } from '../../types';
import { Tag, Calendar } from 'lucide-react';

interface ExpenseItemProps {
  expense: Expense;
  createdByName: string;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, createdByName }) => {
  // Helper function to get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food': 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800',
      'Transportation': 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800',
      'Entertainment': 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800',
      'Utilities': 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800',
      'Shopping': 'bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800',
      'Health': 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800',
      'Other': 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800'
    };
    
    return colors[category] || colors['Other'];
  };
  
  return (
    <div className="card p-4 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-lg font-medium text-gray-900">{expense.description}</h4>
        <div className="flex items-center text-lg font-semibold text-green-600">
          {/* <DollarSign className="h-4 w-4 mr-1" /> */}
          {expense.amount.toFixed(2)} Rs
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {new Date(expense.date).toLocaleDateString()}
        </div>
        
        <div className="flex items-center">
          <span className="mr-1">by</span>
          {createdByName}
        </div>
        
        <div className="flex items-center ml-auto">
          <Tag className="h-4 w-4 mr-1" />
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
            {expense.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExpenseItem;