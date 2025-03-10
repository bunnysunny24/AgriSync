import React, { useState } from 'react';
import { Eye, EyeOff, UserPlus, User, Mail, Lock, CheckCircle } from 'lucide-react';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const nextStep = (e) => {
    e.preventDefault();
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setStep(2);
    }, 500);
  };

  const prevStep = (e) => {
    e.preventDefault();
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setStep(1);
    }, 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsAnimating(true);
    // Simulate form submission
    setTimeout(() => {
      setIsAnimating(false);
      console.log('Registration data:', formData);
      // Show success - would typically redirect or show success message
      setStep(3);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12">
      <div className="w-full max-w-md">
        {/* Card with animation */}
        <div className={`bg-white rounded-lg shadow-xl overflow-hidden transform transition-all duration-500 ${isAnimating ? 'scale-95 opacity-80' : 'scale-100'}`}>
          {/* Header */}
          <div className="bg-smart-green p-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-smart-yellow rounded-full p-3 shadow-lg">
                <UserPlus size={30} className="text-smart-green" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-smart-yellow">Create Account</h2>
            <p className="text-gray-200 mt-1">Join our community today</p>
            
            {/* Progress Steps */}
            <div className="flex justify-center mt-4">
              <div className="flex items-center w-3/4">
                {/* Step 1 */}
                <div className={`flex flex-col items-center ${step >= 1 ? 'text-smart-yellow' : 'text-gray-400'}`}>
                  <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${step >= 1 ? 'border-smart-yellow bg-smart-yellow bg-opacity-20' : 'border-gray-400'}`}>
                    1
                  </div>
                  <div className="text-xs mt-1">Account</div>
                </div>
                
                {/* Line */}
                <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-smart-yellow' : 'bg-gray-300'}`}></div>
                
                {/* Step 2 */}
                <div className={`flex flex-col items-center ${step >= 2 ? 'text-smart-yellow' : 'text-gray-400'}`}>
                  <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${step >= 2 ? 'border-smart-yellow bg-smart-yellow bg-opacity-20' : 'border-gray-400'}`}>
                    2
                  </div>
                  <div className="text-xs mt-1">Security</div>
                </div>
                
                {/* Line */}
                <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-smart-yellow' : 'bg-gray-300'}`}></div>
                
                {/* Step 3 */}
                <div className={`flex flex-col items-center ${step >= 3 ? 'text-smart-yellow' : 'text-gray-400'}`}>
                  <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${step >= 3 ? 'border-smart-yellow bg-smart-yellow bg-opacity-20' : 'border-gray-400'}`}>
                    3
                  </div>
                  <div className="text-xs mt-1">Done</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className={`p-6 space-y-6 ${step === 3 ? 'text-center' : ''}`}>
            {step === 1 && (
              <form onSubmit={nextStep} className="space-y-6">
                {/* Full Name Field */}
                <div className="space-y-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-smart-yellow focus:border-transparent transition-all duration-300"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

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

                {/* Next Button */}
                <button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white font-medium bg-smart-green hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-smart-yellow transition-all duration-300"
                >
                  Continue
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-6">
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
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-smart-yellow focus:border-transparent transition-all duration-300"
                      placeholder="••••••••"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className="h-4 w-4 text-smart-green focus:ring-smart-yellow border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="agreeToTerms" className="text-gray-600">
                      I agree to the <a href="#terms" className="text-smart-green font-medium hover:text-smart-yellow">Terms of Service</a> and <a href="#privacy" className="text-smart-green font-medium hover:text-smart-yellow">Privacy Policy</a>
                    </label>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-smart-yellow transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white font-medium bg-smart-green hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-smart-yellow transition-all duration-300 ${isAnimating ? 'animate-pulse' : ''}`}
                    disabled={isAnimating}
                  >
                    {isAnimating ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating account...
                      </span>
                    ) : (
                      "Register"
                    )}
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="flex flex-col items-center py-8">
                <div className="bg-green-100 rounded-full p-4 mb-4">
                  <CheckCircle size={48} className="text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Registration Successful!</h3>
                <p className="text-gray-600 mb-6">Your account has been created successfully.</p>
                <p className="text-gray-500 mb-8">A confirmation email has been sent to <span className="font-medium">{formData.email}</span></p>
                <a
                  href="/LoginPage"
                  className="py-2 px-6 bg-smart-green text-white rounded-md shadow-sm hover:bg-opacity-90 transition-all duration-300"
                >
                  Proceed to Login
                </a>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-500">
            &copy; 2025 Smart Solution. All rights reserved.
          </div>
        </div>

        {/* Login Option */}
        {step !== 3 && (
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a href="/LoginPage" className="text-smart-green font-medium hover:text-smart-yellow transition-colors duration-300">
                Login here
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;