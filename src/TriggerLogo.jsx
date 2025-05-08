
import React, { useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

function TriggerLogo() {
  // const socket = io('https://coral-app-6iasr.ondigitalocean.app/');
  const socket = io('https://coral-app-6iasr.ondigitalocean.app/');

  const handleRevealClick = async () => {
    try {
      socket.emit('reveal');
      console.log('Reveal triggered');
    } catch (error) {
      console.error('Error triggering reveal:', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <button
        onClick={handleRevealClick}
        style={{
          fontSize: '2rem',
          padding: '1em 2em',
          borderRadius: '1em',
          background: '#1a237e',
          color: '#ffe066',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 24px rgba(26,35,126,0.2)'
        }}
      >
        Reveal
      </button>
    </div>
  );
}

export default TriggerLogo;