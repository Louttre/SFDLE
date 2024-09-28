import React from 'react';
import PasswordStrengthMeter from '../components/passwordStrengthMeter';
import { User, Mail, LockKeyhole, Loader } from 'lucide-react';
import { useState } from 'react';
import Input from '../components/input';
import { motion } from "framer-motion";
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
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
            navigate("/verify-email");
        } catch (error) {
            console.log(error);
        }
    }
    return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
			overflow-hidden'
            >
                {/* Blue Light Gradient */}
                <div className='absolute top-0 left-3 right-3 h-0.5 bg-gradient-to-r from-blue-900 via-sky-500 to-blue-900'></div>
                <div className='p-8'>
                    <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-sky-400 to-blue-500 text-transparent bg-clip-text'>
                        Create Account
                    </h2>
                    <form onSubmit={handleSignup}>
                        <Input
                            icon={User}
                            type='text'
                            placeholder='Username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Input
                            icon={Mail}
                            type='text'
                            placeholder='Email Adress'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            icon={LockKeyhole}
                            type='text'
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && <p className='text-red-500 font-semibold mt-2 text-sm'>{error}</p>}
                        {/* Password strength indicator */}
                        <PasswordStrengthMeter password={password} />
                        <motion.button
                            className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-sky-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-blue-600
						hover:to-sky-800 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition-duration-100'
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type='submit'
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader className='animate-spin mx-auto' size={24}/> : "Sign Up"}
                        </motion.button>
                    </form>
                </div>
                <div className='px-8 py-4 bg-neutral-800 bg-opacity-50 flex justify-center'>
                    <p className='text-sm text-gray-400'>
                        Already have an account?{" "}
                        <Link to={"/login"} className='text-cyan-400 hover:underline'>
                            Login
                        </Link>
                    </p>
                </div>
            </motion.div>
    );
};

export default Register;