import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';
import { ArrowLeft, UserPlus } from 'lucide-react';

const CreateGroupForm: React.FC = () => {
  const navigate = useNavigate();
  const { createGroup } = useAppState();
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phoneNumber.trim()) {
      setError('Please fill in all fields');
      return;
    }
    createGroup(formData.name, formData.phoneNumber);
    navigate('/groups');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/groups')}
          className="mr-4 p-2 rounded-md text-[#4c7f7f] hover:bg-gray-100 transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold text-[#4c7f7f]">Add New Member</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#4c7f7f] mb-1">
              Member Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4c7f7f] focus:border-transparent"
              placeholder="Enter member name"
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-[#4c7f7f] mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4c7f7f] focus:border-transparent"
              placeholder="Enter phone number"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center px-4 py-2 bg-[#4c7f7f] text-white rounded-md text-sm font-medium hover:bg-[#3d6666] transition-all duration-200 shadow-md"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGroupForm;