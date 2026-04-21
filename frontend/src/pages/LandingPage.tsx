import React, { useState } from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import LandingHero from '../components/landing/LandingHero';
import LandingFeatures from '../components/landing/LandingFeatures';
import LandingAbout from '../components/landing/LandingAbout';
import AuthModal from '../components/auth/AuthModal';

const LandingPage: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="bg-campus-dark min-h-screen text-white font-sans selection:bg-campus-electric selection:text-white">
      <LandingNavbar 
        onLoginClick={() => openAuth('login')} 
        onSignUpClick={() => openAuth('signup')} 
      />
      
      <main>
        <div id="home">
          <LandingHero 
          onGetStarted={() => openAuth('signup')} 
          onEnterDashboard={() => openAuth('login')} 
          />
        </div>
        
        <LandingFeatures />
        <LandingAbout />
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authMode} 
      />
      
      <footer className="bg-campus-navy/50 py-8 border-t border-white/5 text-center">
        <p className="text-campus-lavender/60 text-sm">
          &copy; {new Date().getFullYear()} Smart Campus Operations Hub. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
