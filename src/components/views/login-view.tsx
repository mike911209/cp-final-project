import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Smartphone, Chrome, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface LoginViewProps {
  onLogin: (email: string, password: string) => void;
  onRegister: (data: {
    email: string;
    password: string;
    serialNumber: string;
    googleToken: string;
  }) => void;
  onGoogleAuth: () => Promise<string>;
  isLoading: boolean;
  error?: string | null;
  success?: string | null;
  googleConnected?: boolean;
}

export function LoginView({
  onLogin,
  onRegister,
  onGoogleAuth,
  isLoading,
  error,
  success,
  googleConnected,
}: LoginViewProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    serialNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [googleToken, setGoogleToken] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    if (!isLoginMode && !formData.serialNumber) {
      newErrors.serialNumber = 'Device serial number is required';
    }

    if (!isLoginMode && !googleToken) {
      newErrors.google = 'Google authentication is required for registration';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (isLoginMode) {
      onLogin(formData.email, formData.password);
    } else {
      onRegister({
        email: formData.email,
        password: formData.password,
        serialNumber: formData.serialNumber,
        googleToken,
      });
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const token = await onGoogleAuth();
      setGoogleToken(token);
    } catch (err) {
      console.error('Google auth failed:', err);
    }
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
                  isLoginMode
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onClick={() => setIsLoginMode(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign In
              </motion.button>
              <motion.button
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  !isLoginMode
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onClick={() => setIsLoginMode(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Register
              </motion.button>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={isLoginMode ? 'login' : 'register'}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CardTitle className="text-center text-2xl">
                  {isLoginMode ? 'Welcome Back' : 'Create Account'}
                </CardTitle>
                <CardDescription className="text-center">
                  {isLoginMode 
                    ? 'Sign in to your alarm system'
                    : 'Set up your smart alarm system'
                  }
                </CardDescription>
              </motion.div>
            </AnimatePresence>
          </CardHeader>

          <CardContent>
            <AnimatePresence>
              {(error || success) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4"
                >
                  {error && (
                    <motion.div 
                      className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                    >
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{error}</span>
                    </motion.div>
                  )}
                  {success && (
                    <motion.div 
                      className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">{success}</span>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                {!isLoginMode && (
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

                    {/* Google Auth Button */}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 bg-white/70 border-gray-200 hover:bg-white/90"
                      onClick={handleGoogleAuth}
                      disabled={isLoading}
                    >
                      <Chrome className="h-4 w-4 mr-2" />
                      {googleToken ? (
                        <span className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          Google Connected
                        </span>
                      ) : (
                        'Connect Google Calendar & Gmail'
                      )}
                    </Button>
                    {errors.google && (
                      <motion.p 
                        className="text-sm text-red-600 mt-1 ml-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {errors.google}
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
                  disabled={isLoading}
                >
                  {isLoading ? (
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