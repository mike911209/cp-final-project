"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Smartphone, Chrome, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/contexts/UserContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const { 
    user, 
    isAuthenticated,
    isLoading: userLoading,
    error: userError,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    clearError,
    confirmSignUpCode
  } = useUser();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isConfirmMode, setIsConfirmMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    serialNumber: '',
    confirmationCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLoginMode && !formData.username) {
      newErrors.username = 'Username is required';
    }

    if (!isLoginMode && !formData.serialNumber) {
      newErrors.serialNumber = 'Device serial number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    clearError();
    setSuccess(null);

    try {
      if (isConfirmMode) {
        await confirmSignUpCode(formData.username, formData.confirmationCode);
        setSuccess('Email verified successfully! You can now sign in.');
        setIsConfirmMode(false);
        setIsLoginMode(true);
      } else if (isLoginMode) {
        await signInWithEmail(formData.email, formData.password);
        setSuccess('Successfully signed in!');
      } else {
        await signUpWithEmail(formData.username, formData.password, formData.email);
        setSuccess('Registration successful! Please check your email for verification code.');
        setIsConfirmMode(true);
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    clearError();
    setSuccess(null);
    signInWithGoogle();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/calendar');
    }
  }, [isAuthenticated, router]);

  // Display error from UserContext or local success message
  const displayError = userError;
  const displaySuccess = success;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gray-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.1, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo and Header */}
        <motion.div 
          className="text-center mb-8"
          variants={itemVariants}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-900 to-black rounded-2xl shadow-lg mb-4"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Immersive Alarm</h1>
          <p className="text-gray-600">Smart wake-up system with IoT integration</p>
        </motion.div>

        <Card className="glass-morphism border-gray-200/50 shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-center space-x-1 mb-4">
              <motion.button
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isLoginMode && !isConfirmMode
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onClick={() => {
                  setIsLoginMode(true);
                  setIsConfirmMode(false);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign In
              </motion.button>
              <motion.button
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  !isLoginMode && !isConfirmMode
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onClick={() => {
                  setIsLoginMode(false);
                  setIsConfirmMode(false);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Register
              </motion.button>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={isConfirmMode ? 'confirm' : (isLoginMode ? 'login' : 'register')}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CardTitle className="text-center text-2xl">
                  {isConfirmMode ? 'Confirm Email' : (isLoginMode ? 'Welcome Back' : 'Create Account')}
                </CardTitle>
                <CardDescription className="text-center">
                  {isConfirmMode 
                    ? 'Enter the verification code sent to your email'
                    : (isLoginMode 
                      ? 'Sign in to your alarm system'
                      : 'Set up your smart alarm system'
                    )
                  }
                </CardDescription>
              </motion.div>
            </AnimatePresence>
          </CardHeader>

          <CardContent>
            <AnimatePresence>
              {(displayError || displaySuccess) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4"
                >
                  {displayError && (
                    <motion.div 
                      className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                    >
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{displayError}</span>
                    </motion.div>
                  )}
                  {displaySuccess && (
                    <motion.div 
                      className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">{displaySuccess}</span>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Confirmation Code Input */}
              <AnimatePresence>
                {isConfirmMode && (
                  <motion.div 
                    variants={itemVariants}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Verification Code"
                        value={formData.confirmationCode}
                        onChange={(e) => handleInputChange('confirmationCode', e.target.value)}
                        className="pl-10 h-12 bg-white/70 border-gray-200 focus:border-primary/50 focus:ring-primary/20"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Username Input (for registration) */}
              <AnimatePresence>
                {!isLoginMode && !isConfirmMode && (
                  <motion.div 
                    variants={itemVariants}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Username"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        className="pl-10 h-12 bg-white/70 border-gray-200 focus:border-primary/50 focus:ring-primary/20"
                        error={!!errors.username}
                      />
                    </div>
                    {errors.username && (
                      <motion.p 
                        className="text-sm text-red-600 mt-1 ml-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {errors.username}
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Input */}
              <motion.div variants={itemVariants}>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10 h-12 bg-white/70 border-gray-200 focus:border-primary/50 focus:ring-primary/20"
                    error={!!errors.email}
                  />
                </div>
                {errors.email && (
                  <motion.p 
                    className="text-sm text-red-600 mt-1 ml-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.email}
                  </motion.p>
                )}
              </motion.div>

              {/* Password Input */}
              <motion.div variants={itemVariants}>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10 h-12 bg-white/70 border-gray-200 focus:border-primary/50 focus:ring-primary/20"
                    error={!!errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p 
                    className="text-sm text-red-600 mt-1 ml-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.password}
                  </motion.p>
                )}
              </motion.div>

              {/* Registration Fields */}
              <AnimatePresence>
                {!isLoginMode && !isConfirmMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    {/* Serial Number */}
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Device Serial Number"
                        value={formData.serialNumber}
                        onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                        className="pl-10 h-12 bg-white/70 border-gray-200 focus:border-primary/50 focus:ring-primary/20"
                        error={!!errors.serialNumber}
                      />
                    </div>
                    {errors.serialNumber && (
                      <motion.p 
                        className="text-sm text-red-600 mt-1 ml-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {errors.serialNumber}
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  variant="elegant"
                  className="w-full h-12 text-base font-semibold"
                  disabled={isLoading || userLoading}
                >
                  {(isLoading || userLoading) ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    isLoginMode ? 'Sign In' : 'Create Account'
                  )}
                </Button>
              </motion.div>

              {/* Google Sign In Button */}
              <motion.div variants={itemVariants}>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or</span>
                  </div>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 bg-white/70 border-gray-200 hover:bg-white/90"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading || userLoading}
                >
                  <Chrome className="h-4 w-4 mr-2" />
                  Sign in with Google
                </Button>
              </motion.div>
            </form>

            {/* Demo Credentials */}
            {isLoginMode && (
              <motion.div 
                className="mt-6 p-4 bg-gray-50/80 rounded-lg border border-gray-200"
                variants={itemVariants}
              >
                <p className="text-xs text-gray-600 mb-2 font-medium">Demo Credentials:</p>
                <p className="text-xs text-gray-500">Email: demo@example.com</p>
                <p className="text-xs text-gray-500">Password: password</p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 