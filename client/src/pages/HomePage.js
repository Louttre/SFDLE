// HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate('/main');
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      className="home-page"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="home-page__header">
        <motion.h1 className="home-page__title" variants={itemVariants}>
          SFDLE
        </motion.h1>

        <motion.img
          className="home-page__character"
          src={'/img/ryu.png'}
          alt="Character"
          variants={itemVariants}
        />
      </div>
      <div
        className="dta"
        style={{ backgroundColor: 'red' }}
        variants={itemVariants}
        onClick={handlePlayClick}
      >
      <span>Play</span>
    </div>
    </motion.div>
  );
};

export default HomePage;
