import React from 'react';
import './HoverButton.css';
const HoverButton = ({title}) => {
    return (
        <button class="HoverButton">{title}</button>
    );
};

export default HoverButton;