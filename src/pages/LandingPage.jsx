import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

function FloatingHeart({ delay, x, size }) {
  return (
    <motion.div
      className="absolute text-rose-gold pointer-events-none"
      style={{ left: `${x}%`, fontSize: size }}
      initial={{ y: '100vh', opacity: 0 }}
      animate={{
        y: '-100vh',
        opacity: [0, 0.2, 0.2, 0],
        rotate: [0, 10, -10, 0],
      }}
      transition={{
        duration: 15,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      *
    </motion.div>
  );
}

export default function LandingPage() {
  const { acceptDate, showNotification, setActiveDock } = useApp();
  const [entryView, setEntryView] = useState('menu');
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [showAcceptedMessage, setShowAcceptedMessage] = useState(false);
  const [noButtonMoved, setNoButtonMoved] = useState(false);
  const containerRef = useRef(null);
  const acceptTimerRef = useRef(null);

  const clearAcceptTimer = useCallback(() => {
    if (acceptTimerRef.current) {
      clearTimeout(acceptTimerRef.current);
      acceptTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearAcceptTimer();
    };
  }, [clearAcceptTimer]);

  const resetValentineFlow = useCallback(() => {
    setNoButtonPosition({ x: 0, y: 0 });
    setShowAcceptedMessage(false);
    setNoButtonMoved(false);
  }, []);

  const moveNoButton = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const buttonWidth = 150;
    const buttonHeight = 60;
    const padding = 20;

    const maxX = container.width / 2 - buttonWidth - padding;
    const maxY = container.height / 2 - buttonHeight - padding;

    const newX = (Math.random() * 2 - 1) * maxX;
    const newY = (Math.random() * 2 - 1) * maxY;

    setNoButtonPosition({ x: newX, y: newY });
    setNoButtonMoved(true);
  }, []);

  const handleNoClick = useCallback(() => {
    moveNoButton();
  }, [moveNoButton]);

  const handleEnterValentine = useCallback(() => {
    clearAcceptTimer();
    resetValentineFlow();
    setEntryView('valentine');
  }, [clearAcceptTimer, resetValentineFlow]);

  const handleBackToMenu = useCallback(() => {
    clearAcceptTimer();
    resetValentineFlow();
    setEntryView('menu');
  }, [clearAcceptTimer, resetValentineFlow]);

  const handleHomeEntry = useCallback(() => {
    clearAcceptTimer();
    setActiveDock(1);
    acceptDate();
  }, [acceptDate, clearAcceptTimer, setActiveDock]);

  const handleYesClick = useCallback(() => {
    clearAcceptTimer();
    setShowAcceptedMessage(true);
    showNotification("Well you can't really say no so... You're stuck with me now.", 4000);

    acceptTimerRef.current = setTimeout(() => {
      setActiveDock(0);
      acceptDate();
    }, 4500);
  }, [acceptDate, clearAcceptTimer, setActiveDock, showNotification]);

  const hearts = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        delay: i * 1.5,
        x: (i * 7) % 100,
        size: `${20 + (i % 3) * 10}px`,
      })),
    [],
  );

  return (
    <motion.div
      ref={containerRef}
      className="relative min-h-screen w-full bg-animated flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {hearts.map((heart) => (
        <FloatingHeart key={heart.id} {...heart} />
      ))}

      <motion.div
        className="relative z-10 text-center px-8 w-full max-w-4xl"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <AnimatePresence mode="wait">
          {entryView === 'menu' && (
            <motion.div
              key="entry-menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-strong rounded-3xl p-8 md:p-10"
            >
              <p className="text-amethyst-light/70 text-xs uppercase tracking-[0.28em] mb-3">Navigation</p>
              <h1 className="text-3xl md:text-5xl font-bold text-gradient mb-4">Choose Experience</h1>
              <p className="text-rose-gold-light/70 text-base md:text-lg mb-8">
                Select a path below to continue.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  type="button"
                  onClick={handleEnterValentine}
                  className="text-left rounded-2xl p-5 glass border border-rose-gold/30 hover:border-rose-gold/55 transition-colors"
                  whileHover={{ y: -4, boxShadow: '0 14px 30px rgba(183, 110, 121, 0.22)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* <p className="text-xs uppercase tracking-[0.2em] text-amethyst-light/65">Option 01</p> */}
                  <p className="mt-2 text-xl font-semibold text-rose-gold-light">Will You Be My Valentine</p>
                  <p className="mt-2 text-sm text-rose-gold-light/60">
                    Continue to the yes/no experience, then proceed to the letter.
                  </p>
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleHomeEntry}
                  className="text-left rounded-2xl p-5 glass border border-rose-gold/30 hover:border-rose-gold/55 transition-colors"
                  whileHover={{ y: -4, boxShadow: '0 14px 30px rgba(183, 110, 121, 0.22)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/*   */}
                  <p className="mt-2 text-xl font-semibold text-rose-gold-light">Home</p>
                  <p className="mt-2 text-sm text-rose-gold-light/60">
                    Skip directly to the Memories module.
                  </p>
                </motion.button>
              </div>
            </motion.div>
          )}

          {entryView === 'valentine' && (
            <motion.div
              key="entry-valentine"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-6 gap-3">
                <button
                  type="button"
                  onClick={handleBackToMenu}
                  className="px-4 py-2 rounded-lg border border-rose-gold/35 text-rose-gold-light/80 hover:bg-rose-gold/10 transition-colors"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleHomeEntry}
                  className="px-4 py-2 rounded-lg border border-rose-gold/35 text-rose-gold-light/80 hover:bg-rose-gold/10 transition-colors"
                >
                  Go To Home
                </button>
              </div>

              <motion.h1
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-gradient"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                Will you be my Valentine?
              </motion.h1>

              <motion.p
                className="text-rose-gold-light/70 text-lg md:text-xl mb-12 max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Choose wisely... or do not. The answer is obvious anyway.
              </motion.p>

              <div className="relative flex items-center justify-center gap-8 min-h-[200px]">
                <motion.button
                  onClick={handleYesClick}
                  className="px-12 py-4 text-xl font-semibold rounded-full bg-gradient-to-r from-crimson to-rose-gold text-white glow-crimson"
                  whileHover={{ scale: 1.1, boxShadow: '0 0 40px rgba(220, 20, 60, 0.6)' }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                >
                  Yes
                </motion.button>

                <motion.button
                  onClick={handleNoClick}
                  onMouseEnter={moveNoButton}
                  onTouchStart={moveNoButton}
                  className="px-12 py-4 text-xl font-semibold rounded-full glass border border-rose-gold/30 text-rose-gold-light/70 hover:border-rose-gold/50 cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    x: noButtonPosition.x,
                    y: noButtonMoved ? noButtonPosition.y : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {noButtonMoved ? "Can't catch me" : 'No'}
                </motion.button>
              </div>

              <AnimatePresence>
                {noButtonMoved && (
                  <motion.p
                    className="mt-8 text-amethyst-light/50 text-sm italic"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    The "No" button seems to have commitment issues. Just say yes.
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showAcceptedMessage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-strong rounded-3xl p-12 text-center max-w-lg mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <h2 className="text-3xl font-bold text-gradient mb-4">You said yes!</h2>
              <p className="text-rose-gold-light/80 text-lg">
                Well you cannot really say no so... You are stuck with me now.
              </p>
              <motion.div
                className="mt-6 text-amethyst-light/60 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Preparing your special surprise...
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-gold to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      />
    </motion.div>
  );
}
