// src/components/ui/PhoneInput.tsx
import { useState, useEffect } from 'react';
import type { Country } from '../../types';

interface PhoneInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
  countries: Country[];
  isLoadingCountries: boolean;
  countryFetchError: string | null;
  disabled?: boolean;
}

const PhoneInput = ({
  control,
  setValue,
  watch,
  errors,
  countries,
  isLoadingCountries,
  countryFetchError,
  disabled = false
}: PhoneInputProps) => {
  const [showCountryDropdown, setShowCountryDropdown] = useState<boolean>(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.country-dropdown')) {
        setShowCountryDropdown(false);
      }
    };

    if (showCountryDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCountryDropdown]);

  return (
    <div>
      <label htmlFor="phoneNumber" className="block text-sm font-medium text-[var(--text-color)] mb-1">
        Phone Number
      </label>
      <div className="flex">
        {isLoadingCountries ? (
          <div className="inline-flex items-center px-6 rounded-l-full border-none bg-[var(--secondary-hover-color)] text-[var(--text-color)] text-sm">
            Loading...
          </div>
        ) : countryFetchError ? (
          <div className="inline-flex items-center px-6 rounded-l-full border-none bg-red-500/20 text-red-500 text-sm">
            Error
          </div>
        ) : (
          <div className="relative country-dropdown">
            <button
              type="button"
              onClick={() => !disabled && setShowCountryDropdown(!showCountryDropdown)}
              disabled={disabled}
              className={`px-4 py-4 h-full border-none rounded-l-full bg-[var(--secondary-hover-color)] text-[var(--text-color)] focus:outline-none focus:bg-[var(--primary-color)] transition-colors duration-200 text-sm min-w-0 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.countryCode ? 'ring-2 ring-red-500' : ''
              }`}
            >
              <span>{watch('countryCode') || '+1'}</span>
              <span className="material-symbols-rounded text-[16px]">
                {showCountryDropdown ? 'expand_less' : 'expand_more'}
              </span>
            </button>
            
            {showCountryDropdown && !disabled && (
              <div className="absolute w-90 overflow-x-hidden top-full left-0 z-50 bg-[var(--secondary-color)] border border-[var(--secondary-hover-color)] rounded-lg shadow-lg max-h-60 overflow-y-auto mt-1">
                {countries.map((country: Country, index: number) => (
                  <button
                    key={`${country.dial_code}-${country.name}-${index}`}
                    type="button"
                    onClick={() => {
                      setValue('countryCode', country.dial_code);
                      setShowCountryDropdown(false);
                    }}
                    className="w-full pl-4 py-3 text-left hover:bg-[var(--secondary-hover-color)] text-[var(--text-color)] text-sm border-none bg-transparent focus:outline-none focus:bg-[var(--secondary-hover-color)] transition-colors duration-200 whitespace-nowrap"
                  >
                    {country.name} ({country.dial_code})
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <input
          type="tel"
          id="phoneNumber"
          {...control.register('phoneNumber')}
          disabled={disabled}
          className={`flex-1 py-4 pl-4 pr-6 border-none rounded-r-full bg-[var(--secondary-hover-color)] text-[var(--text-color)] placeholder-[var(--placeholder-color)] focus:outline-none focus:bg-[var(--primary-color)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            errors.phoneNumber ? 'ring-2 ring-red-500' : ''
          }`}
          placeholder="e.g., 9876543210"
        />
      </div>
      {(errors.countryCode || errors.phoneNumber) && (
        <p className="text-red-500 text-xs mt-1" role="alert">
          {(errors.countryCode?.message || errors.phoneNumber?.message) as string}
        </p>
      )}
    </div>
  );
};

export default PhoneInput;
