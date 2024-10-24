import React from 'react';
import './Input.css'; // Import the updated CSS

const Input = ({ icon: Icon, ...props }) => {
    return (
        <div className='input-wrapper'>
            {/* Icon container */}
            <div className='input-icon'>
                <Icon className='text-red-300' /> {/* White icon with margin-right */}
            </div>
            
            {/* Input field */}
            <input
                {...props}
                className='custom-input' /* Updated input class */
            />
        </div>
    );
};

export default Input;
