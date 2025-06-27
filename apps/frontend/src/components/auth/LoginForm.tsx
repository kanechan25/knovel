import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../stores/authStore';
import { authAPI } from '../../services/api';
import PasswordInput from '../common/PasswordInput';
import type { SigninRequest } from '../../types';

interface LoginFormProps {
  onToggleForm: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm }) => {
  const [formData, setFormData] = useState<SigninRequest>({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.signin(formData);
      setAuth(response.user, response.token);
      toast.success(`Welcome back, ${response.user.username}!`);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className='card max-w-md mx-auto'>
      <div className='card-header'>
        <h2 className='text-2xl font-bold text-center text-secondary-900'>
          Sign In
        </h2>
        <p className='text-center text-secondary-600 mt-2'>
          Welcome back to Task Management
        </p>
      </div>
      <div className='card-body'>
        <form onSubmit={handleSubmit} className='space-y-6'>
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
              placeholder='Enter your username'
              disabled={loading}
              minLength={6}
              maxLength={30}
              pattern='[a-zA-Z0-9_]+'
            />
            <p className='text-xs text-secondary-500 mt-1'>
              6-30 characters: letters, numbers, and underscores only
            </p>
          </div>

          <div>
            <PasswordInput
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              label='Password'
              placeholder='Enter your password'
              disabled={loading}
              minLength={6}
            />
            <p className='text-xs text-secondary-500 mt-1'>
              Minimum 6 characters required
            </p>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='btn-primary w-full'
          >
            {loading ? (
              <div className='flex items-center justify-center'>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>

          <div className='text-center'>
            <p className='text-sm text-secondary-600'>
              Don't have an account?{' '}
              <button
                type='button'
                onClick={onToggleForm}
                className='font-medium text-primary-600 hover:text-primary-500 hover:font-bold'
              >
                Sign up here
              </button>
            </p>
          </div>
        </form>

        <div className='mt-6 p-4 bg-secondary-50 rounded-md'>
          <h4 className='text-sm font-medium text-secondary-900 mb-2'>
            Demo Credentials:
          </h4>
          <div className='text-xs text-secondary-600 space-y-1'>
            <p>
              <strong>Employer:</strong> employer1 / knovel123@
            </p>
            <p>
              <strong>Employee:</strong> employee1 / knovel123@
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
