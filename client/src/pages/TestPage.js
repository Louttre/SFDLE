import React from 'react';
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import toastify styles
import AchievementToast from '../components/achievementToast'; // Import AchievementToast

const TestPage = () => {

  const triggerToast = () => {
    toast.success(<AchievementToast achievementName="Test Achievement" />, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true, // Enables onClick in toast
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <button
        style={{
          backgroundColor: 'blue',
          color: 'white',
          padding: '15px 30px',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'background-color 0.3s ease',
        }}
        onClick={triggerToast}
      >
        Trigger Toast
      </button>
    </div>
  );
};

export default TestPage;