import React from 'react';
import { motion } from 'framer-motion';
import campusBg from '../../assets/stunning_campus_bg.png';

interface HeroProps {
  onGetStarted: () => void;
  onEnterDashboard: () => void;
}

const LandingHero: React.FC<HeroProps> = ({ onGetStarted, onEnterDashboard }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image & Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${campusBg}')` }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-campus-navy/80 via-campus-purple/40 to-campus-dark/95 backdrop-blur-[1px]"></div>

      {/* Hero Content Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center text-center mt-20">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 mb-8 inline-flex items-center shadow-2xl"
        >
          <span className="text-campus-electric font-semibold uppercase tracking-widest text-sm">Welcome to the future</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-2xl"
        >
          Smart Campus <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-campus-electric to-campus-lavender">
            Operations Hub
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-4 text-xl md:text-2xl text-campus-lavender max-w-3xl mx-auto font-light leading-relaxed mb-12 shadow-black drop-shadow-md"
        >
          Manage campus resources, streamline bookings, and track maintenance operations with an intelligent centralized platform.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          <button 
            onClick={onGetStarted}
            className="px-8 py-4 rounded-full bg-white text-campus-navy font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-105 transition-all duration-300"
          >
            Get Started
          </button>
          
          <button 
            onClick={onEnterDashboard}
            className="px-8 py-4 rounded-full bg-transparent border-2 border-campus-electric text-white font-bold text-lg hover:bg-campus-electric/20 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Enter Dashboard
          </button>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
      >
        <span className="text-campus-lavender text-sm mb-2 opacity-70">Scroll Discover</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-campus-electric to-transparent"></div>
      </motion.div>
    </div>
  );
};

export default LandingHero;
