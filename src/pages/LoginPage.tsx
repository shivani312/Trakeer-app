import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Wallet, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthService from '../services/AuthService';
import { ApiError } from '../interface';

const LoginPage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and limit to 10 digits
    if (/^\d*$/.test(value) && value.length <= 10) {
      setPhoneNumber(value);
      setError('');
    }
  };

  const validatePhoneNumber = (number: string): boolean => {
    if (number.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    return true;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number before making API call
    if (!validatePhoneNumber(phoneNumber)) {
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await AuthService.login(phoneNumber);
      navigate('/verify-otp', { 
        state: { 
          phoneNumber,
          from: location.state?.from?.pathname || '/dashboard'
        } 
      });
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Login Form Section */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="flex items-center mb-8">
            <Wallet className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">ExpenseShare</h1>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-600 mb-8">
            Enter your WhatsApp number to continue managing expenses with your groups.
          </p>
          
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="Enter 10 digit mobile number"
                  className={`block w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  required
                />
                {error && (
                  <p className="mt-1 text-sm text-red-500">{error}</p>
                )}
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !phoneNumber || phoneNumber.length < 10}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending OTP...
                </div>
              ) : (
                <div className="flex items-center">
                  <Send className="h-4 w-4 mr-2" />
                  Send OTP
                </div>
              )}
            </button>
          </form>
          
          {/* <p className="mt-6 text-center text-sm text-gray-600">
            By continuing, you agree to our{' '}
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Privacy Policy
            </a>
          </p> */}
        </div>
      </div>
      
      {/* Image Section */}
      <div className="hidden md:flex md:flex-1 bg-gradient-to-br from-blue-500 to-blue-600 items-center justify-center p-8">
        <div className="max-w-md text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Track Expenses Together</h2>
          <p className="text-lg text-blue-100">
            Split bills, manage group expenses, and stay on top of your finances with family and friends.
          </p>
          <img
            src="https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg"
            alt="Family managing expenses"
            className="mt-8 rounded-lg shadow-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;