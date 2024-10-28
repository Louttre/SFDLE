import React from 'react';
import PasswordStrengthMeter from '../components/passwordStrengthMeter';
import { User, Mail, LockKeyhole, Loader } from 'lucide-react';
import { useState } from 'react';
import Input from '../components/input';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import './Register.css'; // Import the CSS file for styling

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { signup, error, isLoading } = useAuthStore();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await signup(email, password, username);
      navigate('/verify-email');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="register-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="register-form"
      >
        {/* Blue Light Gradient */}
        <div className="gradient-line"></div>
        <div className="form-content">
          <h2 className="form-title">Create Account</h2>
          <form onSubmit={handleSignup}>
            <Input
              icon={User}
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              icon={LockKeyhole}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <p className="error-message">{error}</p>
            )}
            {/* Password strength indicator */}
            <PasswordStrengthMeter password={password} />
            <motion.button
              className="submit-button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="loading-spinner" size={24} />
              ) : (
                'Sign Up'
              )}
            </motion.button>
          </form>
        </div>
        <div className="form-footer">
          <p className="footer-text">
            Already have an account?{' '}
            <Link to="/main" className="login-link">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
