import React, { useState } from 'react';
import EyeIcon from '../../assets/icons/EyeIcon';

interface PasswordInputProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  minLength?: number;
  className?: string;
  label?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  name,
  value,
  onChange,
  placeholder = 'Enter password',
  disabled = false,
  required = true,
  minLength = 6,
  className = 'form-input pr-10',
  label,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      {label && (
        <label htmlFor={id} className='form-label'>
          {label}
        </label>
      )}
      <div className='relative'>
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          required={required}
          value={value}
          onChange={onChange}
          className={className}
          placeholder={placeholder}
          disabled={disabled}
          minLength={minLength}
        />
        <button
          type='button'
          className='absolute inset-y-0 right-0 flex items-center pr-3 text-secondary-500 hover:text-secondary-700 transition-colors'
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
        >
          <EyeIcon isVisible={showPassword} />
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
