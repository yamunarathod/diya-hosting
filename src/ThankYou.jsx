import React from 'react';
import { motion } from 'framer-motion';

function ThankYou({ name }) {
  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="p-8 text-center">
        <motion.h1 
          style={{ fontSize: '3rem', fontWeight: 'bold', color: '#fff', marginBottom: '1.5rem' }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          GREAT!
        </motion.h1>
        <motion.p
          style={{ color: '#fff',  fontSize: '1.55rem', display: 'inline-block' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Take a look at the <br /> larger screen!
        </motion.p>
      </div>
    </motion.div>
  );
}

export default ThankYou;