import React, { useRef, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import type { OtpFormData } from '../../schemas/authSchemas';

interface OtpInputProps {
  control: Control<OtpFormData>;
  error?: string | undefined;
  disabled?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({ control, error, disabled = false }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (
    value: string,
    index: number,
    onChange: (value: string) => void,
    currentValue: string
  ) => {
    // Only allow digits and limit to 1 character
    if (!/^\d*$/.test(value) || value.length > 1) return;

    // Update the OTP string
    const otpArray = currentValue.split('');
    otpArray[index] = value;
    const newOtp = otpArray.join('');
    onChange(newOtp);

    // Auto-focus next input
    if (value && index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    onChange: (value: string) => void,
    currentValue: string
  ) => {
    if (e.key === 'Backspace') {
      const otpArray = currentValue.split('');
      
      if (otpArray[index]) {
        // Clear current input
        otpArray[index] = '';
        onChange(otpArray.join(''));
      } else if (index > 0) {
        // Move to previous input and clear it
        otpArray[index - 1] = '';
        onChange(otpArray.join(''));
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    
    if (/^\d{1,4}$/.test(pastedData)) {
      onChange(pastedData.padEnd(4, ''));
      
      // Focus the next empty input or the last input
      const nextIndex = Math.min(pastedData.length, 3);
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex]?.focus();
      }
    }
  };

  return (
    <div>
      <Controller
        name="otp"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <div className="flex justify-center space-x-2">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={value[index] || ''}
                onChange={(e) => handleInputChange(e.target.value, index, onChange, value)}
                onKeyDown={(e) => handleKeyDown(e, index, onChange, value)}
                onPaste={(e) => handlePaste(e, onChange)}
                disabled={disabled}
                className={`w-12 h-12 text-center text-2xl border-none rounded-2xl bg-[var(--secondary-hover-color)] text-[var(--text-color)] focus:outline-none focus:bg-[var(--primary-color)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  error
                    ? 'ring-2 ring-red-500'
                    : ''
                }`}
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
          </div>
        )}
      />
      {error && (
        <p className="text-red-500 text-xs text-center mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default OtpInput;
