import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, LockKeyhole, Loader } from "lucide-react";
import Input from "../components/input";
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, isLoading, error } = useAuthStore();

    const handleLogin = async (e) => {
        e.preventDefault();
        await login(email, password);
    };


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
        >
            <div className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-sky-400 to-blue-500 text-transparent bg-clip-text">
                    Welcome Back
                </h2>

                <form
                    onSubmit={handleLogin}
                >
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
                    <div className='flex items-center mb-6'>
                        <Link to='/forgot-password' className='text-sm text-cyan-400 hover:underline'>
                            Forgot password?
                        </Link>
                    </div>
                    {error && <p className='text-red-500 font-semibold mt-2 text-sm'>{error}</p>}
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
                        {isLoading ? <Loader className='w-6 h-6 animate-spin mx-auto' /> : "Login"}
                    </motion.button>
                </form>

            </div>
            <div className='px-8 py-4 bg-neutral-800 bg-opacity-50 flex justify-center'>
                <p className='text-sm text-gray-400'>
                    Don't have an account?{" "}
                    <Link to={"/register"} className='text-cyan-400 hover:underline'>
                        Sign Up
                    </Link>
                </p>
            </div>
        </motion.div>

    )
}

export default Login;