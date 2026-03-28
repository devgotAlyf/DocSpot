import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import BrandMark from './BrandMark';

const Footer = () => {
  const navigate = useNavigate();
  const { darkMode } = useContext(AppContext);

  return (
    <div className={`px-6 md:px-10 transition-colors duration-300 ${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>
      <div className="grid md:grid-cols-[3fr_1fr_1fr] gap-12 my-10 mt-24 text-sm items-start">
        <div className="flex items-start gap-4">
          <BrandMark darkMode={darkMode} showTagline className="shrink-0" />
          <p className={`leading-6 md:max-w-[75%] ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            <strong>DocSpot - Hospital Discovery Made Simpler</strong>
            <br />
            DocSpot helps people discover nearby hospitals, compare specialties, and reach the right facility faster. With a hospital-first flow, cleaner directions access, and saved contacts for later, the experience stays practical instead of cluttered.
          </p>
        </div>

        <div>
          <p className="text-lg font-semibold mb-4">COMPANY</p>
          <ul className={`flex flex-col gap-2 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            <li onClick={() => { navigate('/'); window.scrollTo(0,0); }} className="cursor-pointer hover:text-primary transition-colors">Home</li>
            <li onClick={() => { navigate('/about'); window.scrollTo(0,0); }} className="cursor-pointer hover:text-primary transition-colors">About Us</li>
            <li onClick={() => { navigate('/contact'); window.scrollTo(0,0); }} className="cursor-pointer hover:text-primary transition-colors">Contact Us</li>
            <li onClick={() => { navigate('/privacy-policy'); window.scrollTo(0,0); }} className="cursor-pointer hover:text-primary transition-colors">Privacy Policy</li>
          </ul>
        </div>

        <div>
          <p className="text-lg font-semibold mb-4">GET IN TOUCH</p>
          <ul className={`flex flex-col gap-2 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            <li>+91 123 456 7890</li>
            <li>srivastavadev626@gmail.com</li>
          </ul>
        </div>
      </div>

      <hr className={darkMode ? 'border-slate-800' : 'border-gray-300'} />
      <p className={`py-4 text-sm text-center ${darkMode ? 'text-slate-500' : 'text-gray-600'}`}>
        Copyright 2025 docspot.in - All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
