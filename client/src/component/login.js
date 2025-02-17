import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signIn, signUp, toggleLoginModal, toggleAuthMode } from '../redux/slice/auth';
import { Mail, Lock, UserPlus, LogIn, X, User } from 'lucide-react';

export default function AuthModal() {
  const dispatch = useDispatch();
  const { isRegistering, loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  });
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(''); // Clear any previous validation errors
    console.log('Form Data:', formData);
  
    if (isRegistering) {
      // Check password match
      if (formData.password !== formData.confirmPassword) {
        setValidationError('Passwords do not match');
        return;
      }
      // Check if username is provided
      if (!formData.username) {
        setValidationError('Username is required');
        return;
      }
      // Check if username length is at least 3 characters
      if (formData.username.length < 3) {
        setValidationError('Username must be at least 3 characters long');
        return;
      }
  
      try {
        // Dispatch the signUp action
        await dispatch(
          signUp({
            email: formData.email,
            password: formData.password,
            username: formData.username,
          })
        );
      } catch (error) {
        // Catch any errors from the signUp action and display them
        if (error.response && error.response.data) {
          setValidationError(error.response.data.message || 'Error during signup');
        } else {
          setValidationError('Unexpected error during signup');
        }
      }
    } else {
      // Dispatch the signIn action for login
      try {
        await dispatch(
          signIn({
            email: formData.email,
            password: formData.password,
          })
        );
      } catch (error) {
        // Catch any errors from the signIn action and display them
        if (error.response && error.response.data) {
          setValidationError(error.response.data.message || 'Invalid email or password');
        } else {
          setValidationError('Unexpected error during login');
        }
      }
    }
  };
  

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full relative">
        <button
          onClick={() => dispatch(toggleLoginModal())}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold mb-2">
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-600 mb-6">
            {isRegistering ? 'Sign up to get started' : 'Sign in to access your account'}
          </p>

          {(error || validationError) && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error || validationError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="username"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleInputChange}
                    minLength={3}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {isRegistering && (
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>Please wait...</span>
              ) : isRegistering ? (
                <>
                  <UserPlus size={20} />
                  Create Account
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isRegistering ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={() => dispatch(toggleAuthMode())}
                className="ml-2 text-yellow-600 hover:text-yellow-700 font-medium"
              >
                {isRegistering ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
