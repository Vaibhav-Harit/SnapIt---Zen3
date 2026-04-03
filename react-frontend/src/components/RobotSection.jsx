import { useEffect, useState } from 'react';

/**
 * RobotSection component integrates the Spline 3D viewer.
 * Includes a premium radial glow effect that pulses beneath the robot.
 */
const RobotSection = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure the web component is only loaded on the client side
    setIsClient(true);
    
    // Dynamically load the Spline viewer script to avoid hydration mismatches
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js';
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <section className="flex-1 flex items-center justify-center relative min-h-[50vh] lg:min-h-screen max-w-full lg:max-w-[60%] w-full bg-bg-primary/20">
      {/* 
        Spline 3D Scene Wrapper - Increased size with transform scale 
        Added a bit of negative margin-top to better center the larger model
      */}
      <div className="w-full h-full relative z-[2] transform scale-[1.15] lg:scale-[1.25] -mt-10">
        {isClient && (
          <spline-viewer
            url="https://prod.spline.design/QFQX1Iefud27gDpT/scene.splinecode"
            loading-anim-type="spinner-big-dark"
            className="w-full h-full"
          />
        )}
      </div>

      {/* 
        Premium Glow Ring beneath robot (matches vanilla radial-gradient ellipse) 
        Increased width from 300px to 420px to match the larger robot.
      */}
      <div 
        className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[350px] lg:w-[420px] h-[60px] rounded-[50%] blur-[30px] z-[1] animate-glow-pulse bg-[radial-gradient(ellipse,rgba(139,92,246,0.4),transparent_70%)]" 
      />
    </section>
  );
};

export default RobotSection;
