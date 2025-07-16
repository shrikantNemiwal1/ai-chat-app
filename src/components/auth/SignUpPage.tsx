// src/components/auth/SignUpPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { signUpSuccess, setOtp, clearOtp } from '../../redux/authSlice';
import { setLoading, addToast } from '../../redux/uiSlice';
import { signUpSchema, otpSchema, type SignUpFormData, type OtpFormData } from '../../schemas/authSchemas';
import { saveUserToStorage, userExists } from '../../utils/userStorage';
import OtpInput from '../ui/OtpInput';
import PhoneInput from '../ui/PhoneInput';
import type { Country } from '../../types';

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [showOtpInput, setShowOtpInput] = useState<boolean>(false);
  const [otpTimer, setOtpTimer] = useState<number>(0);
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState<boolean>(true);
  const [countryFetchError, setCountryFetchError] = useState<string | null>(null);
  const [signUpData, setSignUpData] = useState<SignUpFormData | null>(null);

  const dispatch = useAppDispatch();
  const auth = useAppSelector(state => state.auth);
  const isSendingOtp = useAppSelector(state => state.ui.loading.otp);
  const isVerifyingOtp = useAppSelector(state => state.ui.loading.otp);

  // React Hook Form for sign up
  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      countryCode: '',
      phoneNumber: '',
      password: '',
      confirmPassword: ''
    }
  });

  // React Hook Form for OTP
  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: ''
    }
  });

  useEffect(() => {
    const fetchCountries = async () => {
      dispatch(setLoading({ otp: true }));
      setCountryFetchError(null);
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,idd');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        interface RestCountryResponse {
          name: { common: string };
          idd?: {
            root?: string;
            suffixes?: string[];
          };
        }
        
        const data: RestCountryResponse[] = await response.json();
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
        if (processedCountries.length > 0 && processedCountries[0]) {
          signUpForm.setValue('countryCode', processedCountries[0].dial_code);
        }
      } catch (error: unknown) {
        console.error("Error fetching country data:", error);
        setCountryFetchError("Failed to load country data. Please try again later.");
        dispatch(addToast({ message: 'Failed to load country data.', type: 'error' }));
        setCountries([
          { name: 'United States', dial_code: '+1' },
          { name: 'India', dial_code: '+91' },
        ]);
        signUpForm.setValue('countryCode', '+1');
      } finally {
        dispatch(setLoading({ otp: false }));
        setIsLoadingCountries(false);
      }
    };

    fetchCountries();
  }, [dispatch, signUpForm]);

  const handleSignUp = async (data: SignUpFormData) => {
    dispatch(setLoading({ otp: true }));
    
    const fullPhone = `${data.countryCode}${data.phoneNumber}`;
    
    // Check if user already exists
    if (userExists(fullPhone)) {
      dispatch(addToast({ message: 'Account with this phone number already exists. Please login instead.', type: 'error' }));
      dispatch(setLoading({ otp: false }));
      return;
    }

    dispatch(addToast({ message: 'Sending OTP...', type: 'info' }));

    await new Promise(resolve => setTimeout(resolve, 1500));

    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setOtpTimer(60);

    dispatch(setOtp({ otp: generatedOtp, otpExpiry: Date.now() + 60000 }));
    dispatch(addToast({ message: `OTP sent: ${generatedOtp} (for testing)`, type: 'success' }));

    setSignUpData(data);
    setShowOtpInput(true);
    dispatch(setLoading({ otp: false }));
  };

  useEffect(() => {
    let timerInterval: number;
    if (showOtpInput && otpTimer > 0) {
      timerInterval = window.setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    } else if (otpTimer === 0 && showOtpInput) {
      dispatch(addToast({ message: 'OTP expired!', type: 'error' }));
      dispatch(clearOtp());
    }
    return () => clearInterval(timerInterval);
  }, [showOtpInput, otpTimer, dispatch]);

  const handleVerifyOtp = async (data: OtpFormData) => {
    if (!signUpData) return;

    dispatch(setLoading({ otp: true }));
    dispatch(addToast({ message: 'Verifying OTP...', type: 'info' }));

    await new Promise(resolve => setTimeout(resolve, 1500));

    const storedOtp = auth.otp;
    const storedOtpExpiry = auth.otpExpiry;

    if (data.otp === storedOtp && Date.now() < (storedOtpExpiry || 0)) {
      try {
        const fullPhone = `${signUpData.countryCode}${signUpData.phoneNumber}`;
        const newUser = saveUserToStorage({
          phone: fullPhone,
          password: signUpData.password
        });

        dispatch(signUpSuccess({ user: newUser }));
        dispatch(addToast({ message: 'Account created successfully!', type: 'success' }));
        navigate('/dashboard');
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create account.';
        dispatch(addToast({ message: errorMessage, type: 'error' }));
      }
    } else {
      dispatch(addToast({ message: 'Invalid or expired OTP.', type: 'error' }));
    }
    dispatch(setLoading({ otp: false }));
  };

  const handleBackToSignUp = () => {
    setShowOtpInput(false);
    setOtpTimer(0);
    setSignUpData(null);
    otpForm.reset();
    dispatch(clearOtp());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--primary-color)]">
      <div className="bg-[var(--secondary-color)] p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-[var(--text-color)] mb-6">Sign Up</h2>
        
        {!showOtpInput ? (
          <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
            <PhoneInput
              control={signUpForm.control}
              setValue={signUpForm.setValue}
              watch={signUpForm.watch}
              errors={signUpForm.formState.errors}
              countries={countries}
              isLoadingCountries={isLoadingCountries}
              countryFetchError={countryFetchError}
              disabled={isSendingOtp}
            />

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--text-color)] mb-1">Password</label>
              <input
                type="password"
                id="password"
                {...signUpForm.register('password')}
                className={`w-full px-6 py-4 border-none rounded-full bg-[var(--secondary-hover-color)] text-[var(--text-color)] placeholder-[var(--placeholder-color)] focus:outline-none focus:bg-[var(--primary-color)] transition-colors duration-200 ${
                  signUpForm.formState.errors.password
                    ? 'ring-2 ring-red-500'
                    : ''
                }`}
                placeholder="Enter your password"
              />
              {signUpForm.formState.errors.password && (
                <p className="text-red-500 text-xs mt-1" role="alert">
                  {signUpForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--text-color)] mb-1">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                {...signUpForm.register('confirmPassword')}
                className={`w-full px-6 py-4 border-none rounded-full bg-[var(--secondary-hover-color)] text-[var(--text-color)] placeholder-[var(--placeholder-color)] focus:outline-none focus:bg-[var(--primary-color)] transition-colors duration-200 ${
                  signUpForm.formState.errors.confirmPassword
                    ? 'ring-2 ring-red-500'
                    : ''
                }`}
                placeholder="Confirm your password"
              />
              {signUpForm.formState.errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1" role="alert">
                  {signUpForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSendingOtp || isLoadingCountries || countryFetchError !== null}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSendingOtp ? (
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-solid rounded-full border-r-transparent mr-2"></span>
              ) : ''}
              Sign Up
            </button>

            <div className="text-center mt-4">
              <p className="text-[var(--subheading-color)] text-sm">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  Log In
                </Link>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-4">
            <p className="text-center text-[var(--subheading-color)]">Enter the 4-digit OTP sent to your number.</p>
            <OtpInput 
              control={otpForm.control}
              error={otpForm.formState.errors.otp?.message}
              disabled={isVerifyingOtp || otpTimer === 0}
            />
            <p className="text-center text-sm text-[var(--subheading-color)]">OTP expires in {otpTimer} seconds</p>
            <button
              type="submit"
              disabled={isVerifyingOtp || otpTimer === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isVerifyingOtp ? (
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-solid rounded-full border-r-transparent mr-2"></span>
              ) : ''}
              Verify & Create Account
            </button>
            <button
              type="button"
              onClick={handleBackToSignUp}
              className="w-full mt-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              Back to Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
