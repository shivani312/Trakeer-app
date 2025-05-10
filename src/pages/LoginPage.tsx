import React, { useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Wallet, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthService from '../services/AuthService';
import { ApiError } from '../interface';

const LoginPage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const carouselData = [
    {
      image: "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg",
      title: "Track Together, Save Together",
      description: "From chai bills to mutual funds – stay on top of your finances without spreadsheets"
    },
    {
      image: "https://images.pexels.com/photos/7654579/pexels-photo-7654579.jpeg",
      title: "Family Finances Made Simple",
      description: "Track your paisa like a pro — with an app so easy, even Dad will use it"
    },
    {
      image: "https://images.pexels.com/photos/4475523/pexels-photo-4475523.jpeg",
      title: "Smart Money Management",
      description: "When 'thoda adjust kar lenge' needs actual planning"
    },
    {
      image: "https://images.pexels.com/photos/6289065/pexels-photo-6289065.jpeg",
      title: "Crystal Clear Expenses",
      description: "No more 'where did all the money go?' — now it's all in the app"
    }
  ];

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);


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
            <Wallet className="h-10 w-10 text-[#4C7F7F] mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">FinBuddy</h1>
              <p className="text-sm text-gray-600">Money made simple for everyone</p>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Welcome to FinBuddy</h2>
          <p className="text-gray-600 mb-8">
            From college students to grandparents — manage money together, effortlessly.
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
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                We'll send you a verification code via WhatsApp
              </p>
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !phoneNumber}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-[#4C7F7F] hover:bg-[#3d6666] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4C7F7F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending OTP...
                </div>
              ) : (
                <div className="flex items-center">
                  <Send className="h-4 w-4 mr-2" />
                  Continue with WhatsApp
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
      
      {/* Carousel Section */}
      <div className="hidden md:flex md:flex-1 bg-gradient-to-br from-[#4C7F7F] to-[#3d6666] relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        <div className="relative w-full h-full flex items-center justify-center p-12">
          <div className="max-w-lg w-full">
            {carouselData.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
                  currentSlide === index ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-white mb-4">{slide.title}</h2>
                  <p className="text-xl text-blue-100 mb-8">{slide.description}</p>
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="rounded-lg shadow-2xl max-w-md mx-auto transition-transform duration-1000 hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
          {carouselData.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'bg-white w-8' : 'bg-white/50'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;