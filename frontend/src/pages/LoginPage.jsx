import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, User, Mail, Lock } from 'lucide-react';
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsAnimating(true);
    // Simulate form submission
    setTimeout(() => {
      setIsAnimating(false);
      console.log('Login data:', formData);
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        {/* Card with animation */}
        <div className={`bg-white rounded-lg shadow-xl overflow-hidden transform transition-all duration-500 ${isAnimating ? 'scale-95 opacity-80' : 'scale-100'}`}>
          {/* Header */}
          <div className="bg-smart-green p-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-smart-yellow rounded-full p-3 shadow-lg">
                <User size={30} className="text-smart-green" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-smart-yellow">Welcome Back</h2>
            <p className="text-gray-200 mt-1">Login to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-smart-yellow focus:border-transparent transition-all duration-300"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-smart-yellow focus:border-transparent transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <a href="#forgot-password" className="text-sm text-smart-green hover:text-smart-yellow transition-colors duration-300">
                Forgot your password?
              </a>
            </div>

            {/* Submit Button */}
            <Link to="/">
  <button
    type="submit"
    className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white font-medium bg-smart-green hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-smart-yellow transition-all duration-300 ${isAnimating ? 'animate-pulse' : ''}`}
    disabled={isAnimating}
  >
    {isAnimating ? (
      <span className="flex items-center">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Logging in...
      </span>
    ) : (
      <span className="flex items-center">
        <LogIn size={18} className="mr-2" />
        Login
      </span>
    )}
  </button>
</Link>

            {/* Register Option */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <a href="#register" className="text-smart-green font-medium hover:text-smart-yellow transition-colors duration-300">
                  Register now
                </a>
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-500">
            &copy; 2025 Smart Solution. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;