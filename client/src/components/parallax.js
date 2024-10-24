import React, { useEffect } from 'react';
import './ParallaxButton.css'; // Assuming you have the CSS in this file

const ParallaxButton = () => {
  useEffect(() => {
    const buttons = document.querySelectorAll(".parallax-button");
    const range = 40;

    const calcValue = (a, b) => (a / b * range - range / 2).toFixed(1);

    let timeout;
    const handleMouseMove = ({ x, y }) => {
      if (timeout) {
        window.cancelAnimationFrame(timeout);
      }

      timeout = window.requestAnimationFrame(() => {
        const yValue = calcValue(y, window.innerHeight);
        const xValue = calcValue(x, window.innerWidth);

        buttons.forEach(button => {




          // Parallax for background layer
          const buttonBg = button.querySelector(".button-bg");
          buttonBg.style.backgroundPosition = `${xValue * 0.45}px ${-yValue * 0.45}px`;
        });
      });
    };

    document.addEventListener('mousemove', handleMouseMove, false);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="button-container">
      <button className="parallax-button">
        <span className="button-text">Button 1</span>
        <span className="button-bg"></span> {/* Background layer */}
      </button>
    </div>
  );
};

export default ParallaxButton;
