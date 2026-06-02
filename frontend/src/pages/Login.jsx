import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import { ArrowRight, Lock, Mail, User as UserIcon } from 'lucide-react';

const AmbientBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Soft Gold/Beige glow 1 */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] bg-threadly-gold/10 rounded-full blur-[100px]"
      />
      {/* Soft Gold/Beige glow 2 */}
      <motion.div
        animate={{
          x: [0, -50, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
          rotate: [0, -5, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[30%] -right-[10%] w-[70vw] h-[70vw] bg-[#E8DCC4]/40 rounded-full blur-[130px]"
      />
      {/* Delicate light sweep */}
      <motion.div
        animate={{
          x: ['-100vw', '100vw'],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute top-[20%] left-0 w-[50vw] h-[100vh] bg-gradient-to-r from-transparent via-white/30 to-transparent blur-3xl opacity-50 transform -skew-x-12"
      />
    </div>
  );
};

const MinimalNavbar = ({ navigate }) => (
  <motion.nav 
    initial={{ y: -50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className="absolute top-0 left-0 w-full p-6 sm:p-10 flex justify-between items-center z-50 mix-blend-multiply"
  >
    <div className="cursor-pointer" onClick={() => navigate('/')}>
       <img src={assets.logo} className="h-8 w-auto hover:opacity-80 transition-opacity" alt="Threadly Logo" />
    </div>
    <div className="hidden md:flex gap-8 text-sm font-medium text-apple-text/70 tracking-wide">
       <span className="text-apple-text border-b border-apple-text cursor-default">LOGIN</span>
    </div>
  </motion.nav>
);

const InputField = ({ icon: Icon, type, placeholder, value, onChange }) => {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-apple-textMuted group-focus-within:text-threadly-gold transition-colors">
        <Icon size={18} strokeWidth={1.5} />
      </div>
      <input 
        type={type} 
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full pl-10 pr-4 py-3 bg-white/50 border-b border-apple-border/50 focus:border-threadly-gold focus:bg-white/80 transition-all outline-none text-apple-text placeholder:text-apple-textMuted/60 font-sans"
      />
    </div>
  );
};

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const onSubmitHandler = async (event) => {
      event.preventDefault();
      try {
        if (currentState === 'Sign Up') {
          const response = await axios.post(backendUrl + '/api/user/register',{name,email,password});
          if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem('token',response.data.token);
          } else {
            toast.error(response.data.message);
          }
        } else {
          const response = await axios.post(backendUrl + '/api/user/login', {email,password});
          if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem('token',response.data.token);
          } else {
            toast.error(response.data.message);
          }
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  const variants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="relative min-h-screen w-full bg-apple-background text-apple-text overflow-hidden flex flex-col font-sans">
      <AmbientBackground />
      <MinimalNavbar navigate={navigate} />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto flex-grow flex flex-col lg:flex-row items-center px-6 sm:px-12 lg:px-20 pt-28 lg:pt-0 pb-12 lg:pb-0">
        
        {/* Left Side: Cinematic Typography */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center mb-16 lg:mb-0 relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <h1 className="font-playfair text-6xl sm:text-7xl lg:text-8xl leading-[1.05] tracking-tight text-apple-text mb-6">
              Wear Confidence.<br/>
              <span className="text-threadly-gold italic font-medium">Define Elegance.</span>
            </h1>
            <p className="font-sans text-apple-textMuted text-lg sm:text-xl max-w-md leading-relaxed">
              Discover premium fashion crafted for modern expression and timeless identity.
            </p>
          </motion.div>
        </div>

        {/* Right Side: Glassmorphism Auth Panel */}
        <div className="w-full lg:w-[45%] flex justify-center lg:justify-end relative">
          
          {/* Subtle logo integration floating behind the card */}
          <motion.img 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.03, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
            src={assets.logo} 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 mix-blend-multiply pointer-events-none z-0" 
            alt="Decorative" 
          />

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="w-full max-w-[420px] bg-white/40 backdrop-blur-2xl border border-white/60 shadow-apple-lg rounded-[2rem] p-8 sm:p-10 relative z-10"
          >
            <form onSubmit={onSubmitHandler} className="flex flex-col gap-6">
              
              <div className="mb-2">
                <AnimatePresence mode="wait">
                  <motion.h2 
                    key={currentState}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="font-playfair text-3xl font-medium text-apple-text"
                  >
                    {currentState === 'Login' ? 'Welcome Back' : 'Join Threadly'}
                  </motion.h2>
                </AnimatePresence>
                <p className="text-apple-textMuted text-sm mt-2">
                  {currentState === 'Login' ? 'Enter your details to access your account.' : 'Create an account to start your journey.'}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <AnimatePresence mode="popLayout">
                  {currentState === 'Sign Up' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <InputField 
                        icon={UserIcon} 
                        type="text" 
                        placeholder="Full Name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <InputField 
                  icon={Mail} 
                  type="email" 
                  placeholder="Email Address" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
                
                <InputField 
                  icon={Lock} 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>

              <div className="flex justify-between items-center text-sm font-medium mt-1">
                {currentState === 'Login' && (
                  <span className="text-apple-textMuted hover:text-threadly-gold cursor-pointer transition-colors">
                    Forgot password?
                  </span>
                )}
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-apple-text text-white py-4 rounded-full font-medium mt-2 flex items-center justify-center gap-2 hover:bg-black transition-colors hover:shadow-apple-md group"
              >
                {currentState === 'Login' ? 'Enter Store' : 'Create Account'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <div className="text-center mt-2 text-sm text-apple-textMuted">
                {currentState === 'Login' ? (
                  <p>Don't have an account? <span onClick={() => setCurrentState('Sign Up')} className="text-threadly-gold font-medium cursor-pointer hover:underline">Sign up</span></p>
                ) : (
                  <p>Already have an account? <span onClick={() => setCurrentState('Login')} className="text-threadly-gold font-medium cursor-pointer hover:underline">Log in</span></p>
                )}
              </div>

            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Login;
