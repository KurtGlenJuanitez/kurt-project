import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import NavigationDock from '../components/NavigationDock';
import PasscodeOverlay from '../components/PasscodeOverlay';
import HomeContent from '../components/HomeContent';
import MemoriesContent from '../components/MemoriesContent';
import MessagesContent from '../components/MessagesContent';
import SettingsContent from '../components/SettingsContent';

export default function MainHub() {
  const { activeDock, showPasscodeOverlay } = useApp();

  const renderContent = () => {
    switch (activeDock) {
      case 0:
        return <HomeContent />;
      case 1:
        return <MemoriesContent />;
      case 2:
        return <MessagesContent />;
      case 3:
        return <SettingsContent />;
      default:
        return <HomeContent />;
    }
  };

  return (
    <motion.div
      className="min-h-screen w-full bg-animated flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto pb-32">
        {renderContent()}
      </div>

      {/* Navigation Dock */}
      <NavigationDock />

      {/* Passcode Overlay */}
      {showPasscodeOverlay && <PasscodeOverlay />}
    </motion.div>
  );
}
