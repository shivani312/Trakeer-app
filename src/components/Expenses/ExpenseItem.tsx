import React from 'react';
import { Expense } from '../../types';
import { Tag, Calendar, DollarSign } from 'lucide-react';

interface ExpenseItemProps {
  expense: Expense;
  createdByName: string;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, createdByName }) => {
  // Helper function to get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food': 'bg-orange-100 text-orange-800',
      'Transportation': 'bg-blue-100 text-blue-800',
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Utilities': 'bg-yellow-100 text-yellow-800',
      'Shopping': 'bg-pink-100 text-pink-800',
      'Health': 'bg-green-100 text-green-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    
    return colors[category] || colors['Other'];
  };
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-lg font-medium text-gray-900">{expense.description}</h4>
        <div className="flex items-center text-lg font-semibold text-gray-900">
          <DollarSign className="h-4 w-4 text-green-600 mr-1" />
          {expense.amount.toFixed(2)}
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
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
            {expense.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExpenseItem;