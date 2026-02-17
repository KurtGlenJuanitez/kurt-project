import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Controls transition from Landing Page to Main Hub
  const [hasAcceptedDate, setHasAcceptedDate] = useState(false);

  // Controls access to locked docks (Memories and Messages)
  const [isAnniversaryUnlocked, setIsAnniversaryUnlocked] = useState(true);

  // Current active dock (0: Home, 1: Memories, 2: Messages, 3: Settings)
  const [activeDock, setActiveDock] = useState(0);

  // Passcode overlay visibility
  const [showPasscodeOverlay, setShowPasscodeOverlay] = useState(false);

  // Notification state
  const [notification, setNotification] = useState(null);

  // Music state
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);

  // Video playing state — used to duck background music volume
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // The anniversary passcode: 02-18-2025
  const ANNIVERSARY_PASSCODE = '02-18-2025';

  const acceptDate = useCallback(() => {
    setHasAcceptedDate(true);
  }, []);

  const showNotification = useCallback((message, duration = 3000) => {
    setNotification(message);
    setTimeout(() => setNotification(null), duration);
  }, []);

  const verifyPasscode = useCallback((code) => {
    if (code === ANNIVERSARY_PASSCODE) {
      setIsAnniversaryUnlocked(true);
      setShowPasscodeOverlay(false);
      return true;
    }
    return false;
  }, []);

  const handleDockClick = useCallback((dockIndex) => {
    setActiveDock(dockIndex);
  }, []);

  const toggleMusic = useCallback(() => {
    setIsMusicPlaying(prev => !prev);
  }, []);

  const resetExperience = useCallback(() => {
    setHasAcceptedDate(false);
    setIsAnniversaryUnlocked(true);
    setActiveDock(0);
    setShowPasscodeOverlay(false);
    setNotification(null);
    setIsMusicPlaying(false);
    // Re-lock Memories and Messages modules
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('memories-module-unlocked');
      window.sessionStorage.removeItem('messages-module-unlocked');
    }
  }, []);

  const value = {
    // State
    hasAcceptedDate,
    isAnniversaryUnlocked,
    activeDock,
    showPasscodeOverlay,
    notification,
    isMusicPlaying,
    isVideoPlaying,

    // Actions
    acceptDate,
    showNotification,
    verifyPasscode,
    handleDockClick,
    setShowPasscodeOverlay,
    toggleMusic,
    setIsVideoPlaying,
    resetExperience,
    setActiveDock,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
