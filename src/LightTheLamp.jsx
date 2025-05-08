import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import './styles/LightTheLamp.css';


function LightTheLamp({ 
  name, 
  loading, 
  error, 
  onLightLamp, 
  onBack 
}) {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <motion.div 
      className="lightthelamp-container"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      whileHover={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
    >
      <div className="lightthelamp-inner">
        <h1 className="lightthelamp-title">
        Awesome!
        <br />
        Let's Light it Up!
        </h1>
        <p className="lightthelamp-desc">
        Tap the Button
        </p>
        
        <div className="lightthelamp-flex-col">
          <motion.button
            onClick={onLightLamp}
            disabled={loading}
            className="lightthelamp-lamp-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
          >
            <div className="lightthelamp-absolute-bg"></div>
            
            {/* Animated border on hover */}
            {isHovering && (
              <motion.div 
                className="lightthelamp-flame-border"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.7 }}
                transition={{ duration: 0.3 }}
              ></motion.div>
            )}

            {/* Add the button text here */}
            <span className="lightthelamp-btn-text">LIGHT <br /> THE LAMP</span>

            {loading && (
              <div className="lightthelamp-loader-wrap">
                <div className="loader"></div>
              </div>
            )}
          </motion.button>
    
        </div>
        
        {error && (
          <motion.div 
            className="lightthelamp-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}
        
        <motion.button
          onClick={onBack}
          className="lightthelamp-back-btn"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          disabled={loading}
        >
           Back 
        </motion.button>
      </div>
    </motion.div>
  );
}

export default LightTheLamp;