import React, { useState } from 'react';
import Loginsfdle from '../pages/Loginsfdle'; // Import the Loginsfdle component
import './SideMenu.css'; // Import CSS for the sidebar
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';


const SideMenu = () => {
    const [isOpen, setIsOpen] = useState(false); // Sidebar toggle state
    const { isAuth, logout } = useAuthStore(); // Get the authentication state


    const navigate = useNavigate();
    const toggleMenu = () => {
        setIsOpen(!isOpen); // Toggle the side menu open/close state
    };
    const handleLogout = () => {
        logout();
    }
    const handleTrophyClick = () => {
        navigate('/achievements');
    };
    return (
        <div>
            {/* Sidebar */}
            <div className={`side-menu ${isOpen ? 'open' : ''}`}>
                {/* Hamburger button to open/close the sidebar */}
                <svg
                    className={`ham hamRotate ham8 ${isOpen ? 'active' : ''}`}
                    viewBox="0 0 100 100"
                    width="80"
                    onClick={toggleMenu}  // React onClick handler
                    style={{ position: 'fixed', top: '20px', right: '-10px', zIndex: '1100' }}  // Stay fixed in the top-right
                >
                    <path
                        className="line top"
                        d="m 30,33 h 40 c 3.722839,0 7.5,3.126468 7.5,8.578427 0,5.451959 -2.727029,8.421573 -7.5,8.421573 h -20"
                    />
                    <path
                        className="line middle"
                        d="m 30,50 h 40"
                    />
                    <path
                        className="line bottom"
                        d="m 70,67 h -40 c 0,0 -7.5,-0.802118 -7.5,-8.365747 0,-7.563629 7.5,-8.634253 7.5,-8.634253 h 20"
                    />
                </svg>

                {/* Render the Loginsfdle component inside the sidebar */}
                {isAuth && (
                    <div className={`trophy-container ${isOpen ? 'trophy-open' : 'trophy-closed'}`}>
                        <div className='achievement-items'
                            onClick={handleTrophyClick}>
                            <img
                                className='trophy'
                                src={`${process.env.PUBLIC_URL}/img/icon/trophy.svg`}
                                alt="Trophy"
                            />
                            <div className='achievement-items-title'>Achievements</div>
                        </div>
                        <div className='logout-items'>
                            <img
                                className='logout'
                                src={`${process.env.PUBLIC_URL}/img/icon/logout.png`}
                                alt="Logout"
                                onClick={() => { handleLogout() }}
                            />
                            <div className='logout-items-title'>Log out</div>

                        </div>


                    </div>
                )}
                {/* Render the Loginsfdle component inside the sidebar */}
                {isOpen && !isAuth && <Loginsfdle />}

            </div>

            {/* Overlay that appears when sidebar is open */}
            {isOpen && <div className="overlay" onClick={toggleMenu}></div>}
        </div>
    );
};

export default SideMenu;
