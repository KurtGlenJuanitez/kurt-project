import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function SettingsContent() {
  const { isMusicPlaying, toggleMusic, resetExperience, isAnniversaryUnlocked } = useApp();

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-6 pt-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="glass-strong rounded-3xl p-8 max-w-md w-full"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-center mb-8">
          <motion.div
            className="text-5xl mb-4"
            animate={{ rotate: [0, 180, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            ⚙️
          </motion.div>
          <h2 className="text-2xl font-bold text-gradient">Settings</h2>
        </div>

        <div className="space-y-4">
          {/* Music Toggle */}
          <motion.button
            onClick={toggleMusic}
            className="w-full flex items-center justify-between p-4 rounded-xl glass hover:bg-charcoal-lighter/50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">{isMusicPlaying ? '🎵' : '🔇'}</span>
              <span className="text-rose-gold-light">Background Music</span>
            </div>
            <div
              className={`w-12 h-6 rounded-full transition-colors ${
                isMusicPlaying ? 'bg-rose-gold' : 'bg-charcoal-lighter'
              } relative`}
            >
              <motion.div
                className="absolute top-1 w-4 h-4 bg-white rounded-full"
                animate={{ left: isMusicPlaying ? '1.5rem' : '0.25rem' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </div>
          </motion.button>

          {/* Status */}
          <div className="p-4 rounded-xl glass">
            <div className="flex items-center justify-between">
              <span className="text-rose-gold-light/70">Anniversary Access</span>
              <span className={`text-sm ${isAnniversaryUnlocked ? 'text-green-400' : 'text-amethyst-light/50'}`}>
                {isAnniversaryUnlocked ? '🔓 Unlocked' : '🔒 Locked'}
              </span>
            </div>
          </div>

          {/* Reset Experience */}
          <motion.button
            onClick={resetExperience}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-xl border border-crimson/30 text-crimson hover:bg-crimson/10 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-xl">🔄</span>
            <span>Reset Experience</span>
          </motion.button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-rose-gold/20 text-center">
          <p className="text-rose-gold-light/40 text-sm">
            Made with 💕 for my Valentine
          </p>
          <p className="text-amethyst-light/30 text-xs mt-2">
            Kurt Juanitez • 2025
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
