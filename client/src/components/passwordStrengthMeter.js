import React from 'react';
import { Check, X } from 'lucide-react';

const PasswordCriteria = ({ password }) => {
    const criteria = [
        { label: "At least 6 characters long", passed: password.length >= 6 },
        { label: "Must contain 1 lowercase letter", passed: /[a-z]/.test(password) },
        { label: "Must contain 1 uppercase letter", passed: /[A-Z]/.test(password) },
        { label: "Must contain 1 number", passed: /\d/.test(password) },
        { label: "Must contain 1 special character", passed: /[^A-Za-z0-9]/.test(password) }
    ]

    return (
        <div className='mt-2 space-y-1'>
            {criteria.map((item) => (
                <div key={item.label} className='flex items-center text-xs'>
                    {item.passed ? (
                        <Check className='size-4 text-red-300 mr-2'></Check>
                    ) : (
                        <X className='size-4 text-gray-500 mr-2'></X>
                    )}
                    <div className={item.passed ? 'text-white' : 'text-gray-500'}>{item.label}</div>
                </div>
            ))}
        </div>
    );
};

const PasswordStrengthMeter = ({ password }) => {
	const getStrength = (pass) => {
		let strength = 0;
		if (pass.length >= 6) strength++;
		if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
		if (pass.match(/\d/)) strength++;
		if (pass.match(/[^a-zA-Z\d]/)) strength++;
		return strength;
	};

    const strength = getStrength(password);

    const getColor = (strength) => {
        if (strength === 0) return 'bg-red-500';
        if (strength === 1) return 'bg-red-500';
        if (strength === 2) return 'bg-yellow-500';
        if (strength === 3) return 'bg-yellow-500';
        return 'bg-cyan-500';
    }

    const getStrengthText = (strength) => {
        if (strength === 0) return 'Very Weak';
        if (strength === 1) return 'Weak';
        if (strength === 2) return 'Fair';
        if (strength === 3) return 'Good';
        return 'Strong';
    }

    return (
        <div className='mt-2'>
            <div className='flex justify-between items-center mb-1'>
                <div className='text-xs text-gray-400'>Password Strength</div>
                <div className='text-xs text-gray-400'>{getStrengthText(strength)}</div>
            </div>
            <div className='flex space-x-1'>
                {[...Array(4)].map((_, index) => (
                    <div
                        key={index}
                        className={`h-2 w-1/4 rounded-full transition-colors duration-300
                                ${index < strength ? getColor(strength) : 'bg-gray-500'}`}>
                    </div>
                ))}
            </div>
            <PasswordCriteria password={password} />
        </div>
    )
}

export default PasswordStrengthMeter;