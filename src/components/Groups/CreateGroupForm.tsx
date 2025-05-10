import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';
import HttpService from '../../services/httpService';
import { ApiError } from '../../interface';

interface AddMemberResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    name: string;
    phoneNumber: string;
  };
}

const CreateGroupForm: React.FC = () => {
  const navigate = useNavigate();
  // const { createGroup } = useAppState();
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phoneNumber.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Call the API to add member
      const response = await HttpService.post<AddMemberResponse>(
        '/family/invite',
        { 
          name: formData.name,
          phone: '+91' + formData.phoneNumber 
        },
        {},
        { isAccessTokenRequire: true }
      );

      if (response.success) {
        // Create group with the new member
        // createGroup(formData.name, '');
        navigate('/groups');
      } else {
        setError(response.message || 'Failed to add member');
      }
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message || 'Failed to add member. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-2 bg-[#4c7f7f] text-white rounded-md text-sm font-medium hover:bg-[#3d6666] transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Adding Member...
              </div>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGroupForm;