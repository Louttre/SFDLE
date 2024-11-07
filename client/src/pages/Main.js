// Main.js
import React from 'react';
import './main.css';
import { Link } from 'react-router-dom';
import ArrowButton from '../components/arrowButton';

const Main = () => {
    return (
        <div className='button-container'>
            <Link to="/main-game">
                <ArrowButton name='Main Game' color='red' />
            </Link>
            <Link to="/willitkill">
                <ArrowButton name='Will It Kill' color='red' />
            </Link>
            <Link to="/emoji">
                <ArrowButton name='Emoji Game' color='red' />
            </Link>
            <Link to="/blind-test">
                <ArrowButton name='Blind Test' color='red' />
            </Link>
        </div>
    );
};

export default Main;
