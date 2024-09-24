//import { useEffect } from 'react';
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const EmailVerification = () => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);
    const { error, isLoading, verifyEmail } = useAuthStore();
    const navigate = useNavigate();


    const handleChange = (index, value) => {
        const newCode = [...code];

        // Ensure only numeric input
        const filteredValue = value.replace(/\D/g, '');  // Only keep numeric characters

        if (filteredValue.length === 1) {
            // Regular input handling for a single character
            newCode[index] = filteredValue;
            setCode(newCode);

            // Move focus to the next input field if a value is entered
            if (filteredValue && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handlePaste = (e) => {
        // Get the pasted data and ensure only digits are pasted
        const pasteData = e.clipboardData.getData('text').replace(/\D/g, '');

        if (pasteData.length > 0) {
            const newCode = [...code];
            // Split the pasted data into individual digits and fill inputs
            for (let i = 0; i < pasteData.length && i < 6; i++) {
                newCode[i] = pasteData[i];
            }
            setCode(newCode);

            // Focus on the next empty input or the last input
            const nextIndex = pasteData.length < 6 ? pasteData.length : 5;
            inputRefs.current[nextIndex].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            e.preventDefault();  // Prevent the default backspace behavior
            const newCode = [...code];

            if (newCode[index]) {
                // Clear the current field
                newCode[index] = '';
            } else if (index > 0) {
                // Move focus to the previous input and clear it
                newCode[index - 1] = '';
                inputRefs.current[index - 1].focus();
            }
            setCode(newCode);
        }
    };

	const handleSubmit = async (e) => {
		e.preventDefault();
		const verificationCode = code.join("");
		try {
			await verifyEmail(verificationCode);
			navigate("/");
		} catch (error) {
			console.log(error);
		}
	};

    // Auto-submit the form if all inputs are filled
    /*useEffect(() => {
        if (code.every(digit => digit !== '')) {
            handleSubmit(new Event('submit'));
        }
    });*/  // Adding code as a dependency for useEffect

    return (
        <div className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md'
            >
                <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
                    Verify Your Email
                </h2>
                <p className='text-center text-gray-300 mb-6'>Enter the 6-digit code sent to your email address.</p>
                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div className='flex justify-between'>
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type='text'
                                maxLength='1'  // Limit input to a single character
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}  // Listen for paste events
                                inputMode='numeric'  // Show numeric keyboard on mobile
                                pattern='[0-9]*'  // Only accept numeric input
                                className='w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-cyan-500 focus:outline-none'
                            />
                        ))}
                    </div>
                    {error && <p className='text-red-500 font-semibold mt-2 text-sm'>{error}</p>}

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type='submit'
                        disabled={isLoading || code.some((digit) => !digit)}
                        className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-sky-600 text-white 
                            font-bold rounded-lg shadow-lg hover:from-blue-600
                            hover:to-sky-800 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2
                            focus:ring-offset-gray-900 transition-duration-100'
                    >
                        {isLoading ? "Verifying..." : "Verify Email"}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default EmailVerification;
