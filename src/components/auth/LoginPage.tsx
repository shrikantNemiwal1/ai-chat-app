// src/components/auth/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { loginSuccess } from '../../redux/authSlice';
import { setLoading, addToast } from '../../redux/uiSlice';
import { loginSchema, type LoginFormData } from '../../schemas/authSchemas';
import { authenticateUser } from '../../utils/userStorage';
import PhoneInput from '../ui/PhoneInput';
import type { Country } from '../../types';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState<boolean>(true);
  const [countryFetchError, setCountryFetchError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const isLoggingIn = useAppSelector(state => state.ui.loading.otp);

  // React Hook Form for login
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      countryCode: '',
      phoneNumber: '',
      password: ''
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
          loginForm.setValue('countryCode', processedCountries[0].dial_code);
        }
      } catch (error: unknown) {
        console.error("Error fetching country data:", error);
        setCountryFetchError("Failed to load country data. Please try again later.");
        dispatch(addToast({ message: 'Failed to load country data.', type: 'error' }));
        setCountries([
          { name: 'United States', dial_code: '+1' },
          { name: 'India', dial_code: '+91' },
        ]);
        loginForm.setValue('countryCode', '+1');
      } finally {
        dispatch(setLoading({ otp: false }));
        setIsLoadingCountries(false);
      }
    };

    fetchCountries();
  }, [dispatch, loginForm]);

  const handleLogin = async (data: LoginFormData) => {
    dispatch(setLoading({ otp: true }));
    dispatch(addToast({ message: 'Signing in...', type: 'info' }));

    await new Promise(resolve => setTimeout(resolve, 1500));

    const fullPhone = `${data.countryCode}${data.phoneNumber}`;
    const user = authenticateUser(fullPhone, data.password);

    if (user) {
      dispatch(loginSuccess({ user }));
      dispatch(addToast({ message: 'Login successful!', type: 'success' }));
      navigate('/dashboard');
    } else {
      dispatch(addToast({ message: 'Invalid phone number or password.', type: 'error' }));
    }
    
    dispatch(setLoading({ otp: false }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--primary-color)]">
      <div className="bg-[var(--secondary-color)] p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-[var(--text-color)] mb-6">Log In</h2>
        
        <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
          <PhoneInput
            control={loginForm.control}
            setValue={loginForm.setValue}
            watch={loginForm.watch}
            errors={loginForm.formState.errors}
            countries={countries}
            isLoadingCountries={isLoadingCountries}
            countryFetchError={countryFetchError}
            disabled={isLoggingIn}
          />

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--text-color)] mb-1">Password</label>
            <input
              type="password"
              id="password"
              {...loginForm.register('password')}
              className={`w-full px-6 py-4 border-none rounded-full bg-[var(--secondary-hover-color)] text-[var(--text-color)] placeholder-[var(--placeholder-color)] focus:outline-none focus:bg-[var(--primary-color)] transition-colors duration-200 ${
                loginForm.formState.errors.password
                  ? 'ring-2 ring-red-500'
                  : ''
              }`}
              placeholder="Enter your password"
            />
            {loginForm.formState.errors.password && (
              <p className="text-red-500 text-xs mt-1" role="alert">
                {loginForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoggingIn || isLoadingCountries || countryFetchError !== null}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoggingIn ? (
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-solid rounded-full border-r-transparent mr-2"></span>
            ) : ''}
            Log In
          </button>

          <div className="text-center mt-4">
            <p className="text-[var(--subheading-color)] text-sm">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Create One
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;