import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAuthStore } from "../../stores/authStore";
import { authAPI } from "../../services/api";
import type { SigninRequest } from "../../types";

interface LoginFormProps {
  onToggleForm: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm }) => {
  const [formData, setFormData] = useState<SigninRequest>({
    username: "",
    password: "",
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
      console.error("Login error:", error);
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
    <div className="card max-w-md mx-auto">
      <div className="card-header">
        <h2 className="text-2xl font-bold text-center text-secondary-900">
          Sign In
        </h2>
        <p className="text-center text-secondary-600 mt-2">
          Welcome back to Task Manager
        </p>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your username"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="text-center">
            <p className="text-sm text-secondary-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onToggleForm}
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Sign up here
              </button>
            </p>
          </div>
        </form>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-secondary-50 rounded-md">
          <h4 className="text-sm font-medium text-secondary-900 mb-2">
            Demo Credentials:
          </h4>
          <div className="text-xs text-secondary-600 space-y-1">
            <p>
              <strong>Employer:</strong> employer1 / password123
            </p>
            <p>
              <strong>Employee:</strong> employee1 / password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
