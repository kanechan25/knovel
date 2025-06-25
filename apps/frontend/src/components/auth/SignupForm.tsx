import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAuthStore } from "../../stores/authStore";
import { authAPI } from "../../services/api";
import type { SignupRequest } from "../../types";

interface SignupFormProps {
  onToggleForm: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onToggleForm }) => {
  const [formData, setFormData] = useState<SignupRequest>({
    username: "",
    password: "",
    role: "EMPLOYEE",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.signup(formData);
      setAuth(response.user, response.token);
      toast.success(`Welcome to Task Manager, ${response.user.username}!`);
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="card max-w-md mx-auto">
      <div className="card-header">
        <h2 className="text-2xl font-bold text-center text-secondary-900">
          Create Account
        </h2>
        <p className="text-center text-secondary-600 mt-2">
          Join Task Manager today
        </p>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="role" className="form-label">
              I am a...
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-input"
              disabled={loading}
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="EMPLOYER">Employer</option>
            </select>
            <p className="text-xs text-secondary-500 mt-1">
              {formData.role === "EMPLOYER"
                ? "Employers can create and assign tasks to employees"
                : "Employees can view and update their assigned tasks"}
            </p>
          </div>

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
              placeholder="Choose a username"
              disabled={loading}
              minLength={3}
              maxLength={30}
              pattern="[a-zA-Z0-9_]+"
              title="Username can only contain letters, numbers, and underscores"
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
              placeholder="Choose a password"
              disabled={loading}
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              placeholder="Confirm your password"
              disabled={loading}
              minLength={6}
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
                Creating account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>

          <div className="text-center">
            <p className="text-sm text-secondary-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onToggleForm}
                className="font-medium text-primary-600 hover:text-primary-500"
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
