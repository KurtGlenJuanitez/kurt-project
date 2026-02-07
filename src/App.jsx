import { AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import MainHub from './pages/MainHub';
import Notification from './components/Notification';
import AudioPlayer from './components/AudioPlayer';

function AppContent() {
  const { hasAcceptedDate } = useApp();

  return (
    <>
      <Notification />
      <AudioPlayer />
      <AnimatePresence mode="wait">
        {!hasAcceptedDate ? (
          <LandingPage key="landing" />
        ) : (
          <MainHub key="main" />
        )}
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
