import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function Notification() {
  const { notification } = useApp();

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          className="fixed top-8 left-1/2 z-[100] -translate-x-1/2"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div className="glass-strong rounded-2xl px-8 py-4 glow-rose max-w-md text-center">
            <p className="text-rose-gold-light text-lg font-medium">
              {notification}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
