import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const PrivacyPolicy = () => {
  const { darkMode } = useContext(AppContext);

  return (
    <div className={`pt-10 ${darkMode ? 'text-white' : 'text-gray-900'} min-h-screen`}>
      <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>
      <div className={`max-w-4xl mx-auto rounded-xl p-8 shadow-sm border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} text-sm leading-6`}>
        <p className="mb-4 text-center text-gray-400"><strong>Last updated:</strong> March 2026</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">1. Information We Collect</h2>
        <p className="mb-4">DocSpot collects information when you sign up, book an appointment, or use our platform. This may include your name, contact details, medical history (if provided), and device information for analytics purposes.</p>

        <h2 className="text-xl font-semibold mt-6 mb-3">2. How We Use Your Information</h2>
        <p className="mb-4">We use this information to provide our hospital discovery and appointment services, communicate with you regarding your bookings, improve our platform's functionality, and maintain your account security.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">3. Data Security</h2>
        <p className="mb-4">We implement a variety of security measures to maintain the safety of your personal information. Your personal data is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems.</p>

        <h2 className="text-xl font-semibold mt-6 mb-3">4. Contacting Us</h2>
        <p className="mb-6">If there are any questions regarding this privacy policy, you may contact us using the information in the Footer.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
