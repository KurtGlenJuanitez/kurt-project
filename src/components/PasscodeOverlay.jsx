import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function PasscodeOverlay() {
  const { verifyPasscode, setShowPasscodeOverlay, showNotification } = useApp();
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    // Format: MM-DD-YYYY
    const code = `${month.padStart(2, '0')}-${day.padStart(2, '0')}-${year}`;

    if (verifyPasscode(code)) {
      showNotification('💕 Memories unlocked! Welcome to our journey...', 3000);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setError(false);
      }, 600);
    }
  }, [month, day, year, verifyPasscode, showNotification]);

  const handleClose = useCallback(() => {
    setShowPasscodeOverlay(false);
  }, [setShowPasscodeOverlay]);

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-charcoal/90 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`glass-strong rounded-3xl p-8 max-w-sm w-full mx-4 ${shake ? 'animate-shake' : ''}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={{
          animation: shake ? 'shake 0.5s ease-in-out' : 'none',
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-rose-gold-light/50 hover:text-rose-gold-light transition-colors"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="text-5xl mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🔐
          </motion.div>
          <h2 className="text-2xl font-bold text-gradient mb-2">
            Unlock Our Memories
          </h2>
          <p className="text-rose-gold-light/60 text-sm">
            Enter our special date to access locked content
          </p>
        </div>

        {/* Passcode Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-center gap-2">
            {/* Month Input */}
            <input
              type="text"
              maxLength={2}
              placeholder="MM"
              value={month}
              onChange={(e) => setMonth(e.target.value.replace(/\D/g, ''))}
              className={`w-16 h-14 text-center text-2xl font-bold rounded-xl bg-charcoal-lighter border-2 ${
                error ? 'border-crimson' : 'border-rose-gold/30 focus:border-rose-gold'
              } text-rose-gold-light outline-none transition-colors`}
            />
            <span className="text-rose-gold-light/50 text-2xl">-</span>

            {/* Day Input */}
            <input
              type="text"
              maxLength={2}
              placeholder="DD"
              value={day}
              onChange={(e) => setDay(e.target.value.replace(/\D/g, ''))}
              className={`w-16 h-14 text-center text-2xl font-bold rounded-xl bg-charcoal-lighter border-2 ${
                error ? 'border-crimson' : 'border-rose-gold/30 focus:border-rose-gold'
              } text-rose-gold-light outline-none transition-colors`}
            />
            <span className="text-rose-gold-light/50 text-2xl">-</span>

            {/* Year Input */}
            <input
              type="text"
              maxLength={4}
              placeholder="YYYY"
              value={year}
              onChange={(e) => setYear(e.target.value.replace(/\D/g, ''))}
              className={`w-20 h-14 text-center text-2xl font-bold rounded-xl bg-charcoal-lighter border-2 ${
                error ? 'border-crimson' : 'border-rose-gold/30 focus:border-rose-gold'
              } text-rose-gold-light outline-none transition-colors`}
            />
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.p
                className="text-crimson text-center text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                That's not our special date... try again! 💔
              </motion.p>
            )}
          </AnimatePresence>

          {/* Hint */}
          <p className="text-amethyst-light/40 text-xs text-center italic">
            Hint: When did our journey begin?
          </p>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-crimson to-rose-gold text-white glow-crimson"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Unlock 💕
          </motion.button>
        </form>
      </motion.div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}</style>
    </motion.div>
  );
}
