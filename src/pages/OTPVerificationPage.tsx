import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthService from '../services/AuthService';
import { ApiError } from '../interface';

const OTPVerificationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const phoneNumber = location.state?.phoneNumber || '';
  const redirectPath =  '/dashboard';

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input if value is entered
      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    const digits = pastedData.split('').filter(char => /^\d$/.test(char));
    
    const newOtp = [...otp];
    digits.forEach((digit, index) => {
      if (index < 4) newOtp[index] = digit;
    });
    setOtp(newOtp);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Verify OTP with the backend
      const response = await AuthService.verifyOTP(phoneNumber, otp.join(''));
      if (response.token) {
        await login(phoneNumber);
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await AuthService.login(phoneNumber);
      setResendTimer(30);
      setError('');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/login')}
            className="text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <Shield className="h-8 w-8 text-[#4C7F7F]" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your number</h2>
        <p className="text-gray-600 mb-8">
          We've sent a 4-digit verification code to{' '}
          <span className="font-medium text-gray-900">{phoneNumber}</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex gap-2 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.some(digit => !digit)}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-[#4C7F7F] hover:bg-[#3d6666] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4C7F7F] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Verifying...
              </div>
            ) : (
              'Verify OTP'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleResendOTP}
            disabled={resendTimer > 0}
            className="text-sm text-[#4C7F7F] hover:text-[#3d6666] disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {resendTimer > 0 ? (
              `Resend code in ${resendTimer}s`
            ) : (
              'Resend code'
            )}
          </button>
        </div>

        {error && (
          <div className="mt-6 text-center text-red-500">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default OTPVerificationPage;