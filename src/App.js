import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Import Link
import TriggerLogo from './TriggerLogo';
import DisplayComponent from './DisplayComponent';
import './App.css';
import NameInput from './NameInput';
import LightTheLamp from './LightTheLamp';
import LampForm from './LampForm';
import ThankYou from './ThankYou';

function App() {
  return (
    // Wrap everything with NameProvider
      <Router>
        <div className="App">
     
          <Routes>
            <Route path="/" element={<LampForm />} />
            <Route path="/display" element={<DisplayComponent />} />
            <Route path="/trigger" element={<TriggerLogo />} />
            <Route path="/name" element={<NameInput />} />
        <Route path="/light" element={<LightTheLamp />} />
        <Route path="/thankyou" element={<ThankYou />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;