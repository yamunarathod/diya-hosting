import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './supabaseClient';
import { io } from 'socket.io-client';
import NameInput from './NameInput';
import LightTheLamp from './LightTheLamp';
import ThankYou from './ThankYou';
import './LampForm.css';

function LampForm() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // socketRef.current = io('https://coral-app-6iasr.ondigitalocean.app/');
    socketRef.current = io('https://coral-app-6iasr.ondigitalocean.app/');
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        setIsSubmitted(false);
        setName('');
        setStep(1);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  const handleNameSubmit = (name) => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setName(name);
    setError('');
    setStep(2);
  };

  const handleLampClick = async () => {
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      const { error: supabaseError } = await supabase
        .from('submissions')
        .insert([{ name: name.trim() }]);

      if (supabaseError) throw supabaseError;

      if (socketRef.current) {
        socketRef.current.emit('submission', { name: name.trim() });
        console.log('Emitted submission:', name.trim());
      }

      setIsSubmitted(true);
      setStep(3);
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to submit form. Please try again.');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lampform-bg">
      {/* Logos in a vertical column */}
      <div className="logo-column">
        <img
          src="/inflow.png"
          alt="Inflow Logo"
          className="inflow-logo"
        />
        <img
          src="/galaxy.png"
          alt="Galaxy Gladiators Logo"
          className="galaxy-logo"
        />

      {/* Steps with animation */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="name-input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <NameInput
              name={name}
              setName={setName}
              error={error}
              onSubmit={handleNameSubmit}
            />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="light-lamp"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <LightTheLamp
              name={name}
              loading={loading}
              error={error}
              onLightLamp={handleLampClick}
              onBack={() => setStep(1)}
            />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="thank-you"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <ThankYou name={name} />
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}

export default LampForm;
