import React, { useState } from 'react';
import { Expense } from '../../types';

interface AddExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  groupId: string;
}

const categories = [
  'Food',
  'Transportation',
  'Entertainment',
  'Utilities',
  'Shopping',
  'Health',
  'Other'
];

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ onAddExpense, groupId }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: categories[0],
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddExpense({
      ...formData,
      amount: parseFloat(formData.amount),
      createdBy: 'current-user-id', // This should come from auth context
      groupId
    });
    setFormData({
      amount: '',
      category: categories[0],
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount ($)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            step="0.01"
            min="0.01"
            value={formData.amount}
            onChange={handleChange}
            className="input-field"
            placeholder="0.00"
            required
          />
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-field"
            required
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input-field"
            placeholder="Grocery shopping"
            required
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="btn-secondary"
        >
          Add Expense
        </button>
      </div>
    </form>
  );
};

export default AddExpenseForm;