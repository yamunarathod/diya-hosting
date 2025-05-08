import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './styles/NameInput.css';

function NameInput({ name, setName, error, onSubmit }) {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(name);
  };

  return (
    <motion.div 
      className="nameinput-container"
      whileHover={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
    >
      <div className="nameinput-inner">
        <form onSubmit={handleSubmit}>
          <div className="nameinput-form-group">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="nameinput-input"
                placeholder="Enter your name"
                autoComplete="off"
              />
            </div>
            {error && (
              <motion.p 
                className="nameinput-error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}
          
          <motion.button
            type="submit"
            className="nameinput-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}

export default NameInput;