// src/components/auth/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { useGlobalDispatch, useGlobalState } from '../../App';
import type { Country } from '../../types';

interface LoginPageProps {
  onLoginSuccess: (userId: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('');
  const [showOtpInput, setShowOtpInput] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<string>('');
  const [userOtp, setUserOtp] = useState<string[]>(['', '', '', '']);
  const [otpTimer, setOtpTimer] = useState<number>(0);
  const [formErrors, setFormErrors] = useState<{ phoneNumber?: string; otp?: string }>({});
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState<boolean>(true);
  const [countryFetchError, setCountryFetchError] = useState<string | null>(null);

  const dispatch = useGlobalDispatch();
  const { auth, ui } = useGlobalState();
  const isSendingOtp = ui.loading.otp;
  const isVerifyingOtp = ui.loading.otp;

  useEffect(() => {
    const fetchCountries = async () => {
      dispatch({ type: 'ui/setLoading', payload: { otp: true } });
      setCountryFetchError(null);
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,idd');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: any[] = await response.json();
        const processedCountries: Country[] = data.map(country => {
          const dialCode = country.idd && country.idd.root
            ? `${country.idd.root}${country.idd.suffixes && country.idd.suffixes.length > 0 ? country.idd.suffixes[0] : ''}`
            : '';
          return {
            name: country.name.common,
            dial_code: dialCode,
          };
        }).filter(country => country.dial_code);

        processedCountries.sort((a, b) => a.name.localeCompare(b.name));

        setCountries(processedCountries);
        if (processedCountries.length > 0) {
          setSelectedCountryCode(processedCountries[0].dial_code);
        }
      } catch (error: any) {
        console.error("Error fetching country data:", error);
        setCountryFetchError("Failed to load country data. Please try again later.");
        dispatch({ type: 'ui/addToast', payload: { message: 'Failed to load country data.', type: 'error' } });
        setCountries([
          { name: 'United States', dial_code: '+1' },
          { name: 'India', dial_code: '+91' },
        ]);
        setSelectedCountryCode('+1');
      } finally {
        dispatch({ type: 'ui/setLoading', payload: { otp: false } });
        setIsLoadingCountries(false);
      }
    };

    fetchCountries();
  }, [dispatch]);

  const validatePhone = (phone: string): string => {
    if (!phone) return 'Phone number is required.';
    return '';
  };

  const validateOtp = (otp: string[]): string => {
    if (otp.join('').length !== 4) return 'OTP must be 4 digits.';
    return '';
  };

  const handleSendOtp = async () => {
    setFormErrors({});
    const phoneError = validatePhone(phoneNumber);
    if (phoneError) {
      setFormErrors({ phoneNumber: phoneError });
      return;
    }

    dispatch({ type: 'ui/setLoading', payload: { otp: true } });
    dispatch({ type: 'ui/addToast', payload: { message: 'Sending OTP...', type: 'info' } });

    await new Promise(resolve => setTimeout(resolve, 1500));

    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setOtpSent(generatedOtp);
    setOtpTimer(60);

    dispatch({ type: 'auth/setOtp', payload: { otp: generatedOtp, otpExpiry: Date.now() + 60000 } });
    dispatch({ type: 'ui/addToast', payload: { message: `OTP sent: ${generatedOtp} (for testing)`, type: 'success' } });

    setShowOtpInput(true);
    dispatch({ type: 'ui/setLoading', payload: { otp: false } });
  };

  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    if (showOtpInput && otpTimer > 0) {
      timerInterval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    } else if (otpTimer === 0 && showOtpInput) {
      dispatch({ type: 'ui/addToast', payload: { message: 'OTP expired!', type: 'error' } });
      dispatch({ type: 'auth/clearOtp' });
    }
    return () => clearInterval(timerInterval);
  }, [showOtpInput, otpTimer, dispatch]);

  const handleOtpInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...userOtp];
      newOtp[index] = value;
      setUserOtp(newOtp);

      if (value && index < 3) {
        document.getElementById(`otp-input-${index + 1}`)?.focus();
      }
    }
  };

  const handleOtpInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !userOtp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    setFormErrors({});
    const otpError = validateOtp(userOtp);
    if (otpError) {
      setFormErrors({ otp: otpError });
      return;
    }

    dispatch({ type: 'ui/setLoading', payload: { otp: true } });
    dispatch({ type: 'ui/addToast', payload: { message: 'Verifying OTP...', type: 'info' } });

    await new Promise(resolve => setTimeout(resolve, 1500));

    const storedOtp = auth.otp;
    const storedOtpExpiry = auth.otpExpiry;

    if (userOtp.join('') === storedOtp && Date.now() < (storedOtpExpiry || 0)) {
      const userId = `${selectedCountryCode}${phoneNumber}`;
      onLoginSuccess(userId);
      dispatch({ type: 'ui/addToast', payload: { message: 'Login successful!', type: 'success' } });
    } else {
      dispatch({ type: 'ui/addToast', payload: { message: 'Invalid or expired OTP.', type: 'error' } });
    }
    dispatch({ type: 'ui/setLoading', payload: { otp: false } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-6">Login / Sign Up</h2>
        
        {!showOtpInput ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="countryCode" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Country</label>
              {isLoadingCountries ? (
                <div className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-200">
                  Loading countries...
                </div>
              ) : countryFetchError ? (
                <div className="w-full p-2 border border-red-400 rounded-md bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300">
                  {countryFetchError}
                </div>
              ) : (
                <select
                  id="countryCode"
                  value={selectedCountryCode}
                  onChange={(e) => setSelectedCountryCode(e.target.value)}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-200 focus:ring-blue-500 focus:border-blue-500"
                >
                  {countries.map((country, index) => (
                    <option key={`${country.dial_code}-${country.name}-${index}`} value={country.dial_code}>
                      {country.name} ({country.dial_code})
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 dark:border-slate-600 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-200 text-sm">
                  {selectedCountryCode}
                </span>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 p-2 border border-slate-300 dark:border-slate-600 rounded-r-md bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-200 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 9876543210"
                />
              </div>
              {formErrors.phoneNumber && <p className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</p>}
            </div>
            <button
              onClick={handleSendOtp}
              disabled={isSendingOtp || isLoadingCountries || countryFetchError !== null}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSendingOtp ? (
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-solid rounded-full border-r-transparent mr-2"></span>
              ) : ''}
              Send OTP
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-slate-600 dark:text-slate-400">Enter the 4-digit OTP sent to your number.</p>
            <div className="flex justify-center space-x-2">
              {userOtp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpInputChange(e, index)}
                  onKeyDown={(e) => handleOtpInputKeyDown(e, index)}
                  className="w-12 h-12 text-center text-2xl border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-200 focus:ring-blue-500 focus:border-blue-500"
                />
              ))}
            </div>
            {formErrors.otp && <p className="text-red-500 text-xs text-center mt-1">{formErrors.otp}</p>}
            <p className="text-center text-sm text-slate-500 dark:text-slate-400">OTP expires in {otpTimer} seconds</p>
            <button
              onClick={handleVerifyOtp}
              disabled={isVerifyingOtp || otpTimer === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isVerifyingOtp ? (
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-solid rounded-full border-r-transparent mr-2"></span>
              ) : ''}
              Verify OTP
            </button>
            <button
              onClick={() => {
                setShowOtpInput(false);
                setOtpTimer(0);
                setUserOtp(['', '', '', '']);
                dispatch({ type: 'auth/clearOtp' });
              }}
              className="w-full mt-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              Back to Phone Number
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;