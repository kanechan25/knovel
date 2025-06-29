import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../stores/auth.store';
import { authAPI } from '../../services/api';
import PasswordInput from '../common/PasswordInput';
import type { FormProps, SignupRequest } from '../../types';

const SignupForm: React.FC<FormProps> = ({ onToggleForm }) => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState<SignupRequest>({
    username: '',
    password: '',
    role: 'EMPLOYEE',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const doPasswordsMatch =
    confirmPassword && formData.password === confirmPassword;

  const validateForm = () => {
    const isUsernameValid =
      formData.username.length >= 6 &&
      /^[a-zA-Z0-9_]+$/.test(formData.username);
    const isPasswordValid = formData.password.length >= 6;
    if (!isUsernameValid || !isPasswordValid || !doPasswordsMatch) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const response = await authAPI.signup(formData);
      setAuth(response.user);
      toast.success(`Welcome to Task Management, ${response.user.username}!`);
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className='card max-w-md mx-auto'>
      <div className='card-header'>
        <h2 className='text-2xl font-bold text-center text-secondary-900'>
          Create Account
        </h2>
        <p className='text-center text-secondary-600 mt-2'>
          Join Task Management today
        </p>
      </div>
      <div className='card-body'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label htmlFor='role' className='form-label'>
              I am a...
            </label>
            <select
              id='role'
              name='role'
              value={formData.role}
              onChange={handleChange}
              className='form-input'
              disabled={loading}
            >
              <option value='EMPLOYEE'>Employee</option>
              <option value='EMPLOYER'>Employer</option>
            </select>
            <p className='text-xs text-secondary-500 mt-1'>
              {formData.role === 'EMPLOYER'
                ? 'Employers can create and assign tasks to employees'
                : 'Employees can view and update their assigned tasks'}
            </p>
          </div>

          <div>
            <label htmlFor='username' className='form-label'>
              Username
            </label>
            <input
              id='username'
              name='username'
              type='text'
              required
              value={formData.username}
              onChange={handleChange}
              className='form-input'
              placeholder='Choose a username'
              disabled={loading}
              minLength={6}
              maxLength={30}
              pattern='[a-zA-Z0-9_]+'
            />

            <div className='text-xs text-secondary-500 mt-1'>
              <ul className='list-disc list-inside space-y-0.5 ml-2'>
                <li
                  className={`${formData.username.length >= 6 ? 'text-green-700' : 'text-red-500'}`}
                >
                  6-30 characters long
                </li>
                <li
                  className={`mt-1 ${/^[a-zA-Z0-9_]*$/.test(formData.username) ? 'text-green-700' : 'text-red-500'}`}
                >
                  Only letters, numbers, and underscores
                </li>
              </ul>
            </div>
          </div>
          <div>
            <PasswordInput
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              label='Password'
              placeholder='Choose a password'
              disabled={loading}
              minLength={6}
            />
            <li
              className={`text-xs mt-1 ${formData.password.length >= 6 ? 'text-green-700' : 'text-red-500'}`}
            >
              At least 6 characters long
            </li>
          </div>

          <div>
            <PasswordInput
              id='confirmPassword'
              name='confirmPassword'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              label='Confirm Password'
              placeholder='Confirm your password'
              disabled={loading}
              minLength={6}
            />
            {confirmPassword && !doPasswordsMatch && (
              <p className='text-red-500 text-xs mt-1'>
                ❌ Passwords do not match
              </p>
            )}
            {doPasswordsMatch && (
              <p className='text-green-700 text-xs mt-1'>Passwords match!</p>
            )}
          </div>

          <button
            type='submit'
            disabled={loading}
            className='btn-primary w-full'
          >
            {loading ? (
              <div className='flex items-center justify-center'>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                Creating account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>

          <div className='text-center'>
            <p className='text-sm text-secondary-600'>
              Already have an account?{' '}
              <button
                type='button'
                onClick={onToggleForm}
                className='font-medium text-primary-600 hover:text-primary-500 hover:font-bold'
              >
                Sign in here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
