import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './layouts/DashboardLayout';

/**
 * Main Application Component for snap.it
 * Manages high-level routing/state between the Landing Page and Dashboard.
 */
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Toggle between landing page and dashboard shell
  return isLoggedIn ? (
    <DashboardLayout onLogout={() => setIsLoggedIn(false)}>
      {/* Empty dashboard content as requested by user previously */}
    </DashboardLayout>
  ) : (
    <LandingPage onLogin={() => setIsLoggedIn(true)} />
  );
}

export default App;
