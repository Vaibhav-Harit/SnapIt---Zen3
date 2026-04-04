import React from 'react';
import ParticleBackground from '../components/ParticleBackground';
import RobotSection from '../components/RobotSection';
import LoginSection from '../components/LoginSection';
import Decorations from '../components/Decorations';

/**
 * LandingPage
 * The premium, interactive entry point for snap.it.
 * High-fidelity 3D robot, particle background, and login card.
 */
const LandingPage = ({ onLogin }) => {
  return (
    <div className="relative min-h-screen bg-bg-primary text-text-primary font-body overflow-hidden">
      {/* Background Animated Layers */}
      <ParticleBackground />
      <Decorations />

      {/* Main Layout Container (Responsive Column-to-Row) */}
      <main className="flex flex-col lg:flex-row items-center justify-center min-h-screen w-full relative z-[1]">
        {/* Left Side: Interactive 3D Robot Viewer */}
        <RobotSection />
        
        {/* Right Side: Global State/Authentication Section */}
        <LoginSection onLogin={onLogin} />
      </main>
    </div>
  );
};

export default LandingPage;
