import { useState, useCallback, useRef, useMemo } from 'react';
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
      ♥
    </motion.div>
  );
}

export default function LandingPage() {
  const { acceptDate, showNotification } = useApp();
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [showAcceptedMessage, setShowAcceptedMessage] = useState(false);
  const [noButtonMoved, setNoButtonMoved] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef(null);

  const moveNoButton = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const buttonWidth = 150;
    const buttonHeight = 60;
    const padding = 20;

    // Calculate safe boundaries
    const maxX = (container.width / 2) - buttonWidth - padding;
    const maxY = (container.height / 2) - buttonHeight - padding;

    // Generate random position
    const newX = (Math.random() * 2 - 1) * maxX;
    const newY = (Math.random() * 2 - 1) * maxY;

    setNoButtonPosition({ x: newX, y: newY });
    setNoButtonMoved(true);
  }, []);

  const handleNoClick = useCallback(() => {
    moveNoButton();
  }, [moveNoButton]);

  const handleYesClick = useCallback(() => {
    setShowAcceptedMessage(true);
    showNotification("Well you can't really say no so... You're stuck with me now. 💕", 4000);

    setTimeout(() => {
      acceptDate();
    }, 4500);
  }, [acceptDate, showNotification]);

  // Generate floating hearts - memoized to prevent regeneration on re-render
  const hearts = useMemo(() => Array.from({ length: 15 }, (_, i) => ({
    id: i,
    delay: i * 1.5,
    x: (i * 7) % 100, // Deterministic positions
    size: `${20 + (i % 3) * 10}px`,
  })), []);

  return (
    <motion.div
      ref={containerRef}
      className="relative min-h-screen w-full bg-animated flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Floating Hearts Background */}
      {hearts.map((heart) => (
        <FloatingHeart key={heart.id} {...heart} />
      ))}

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center px-8"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        {/* Decorative Rose */}
        <motion.div
          className="text-6xl mb-6"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          🌹
        </motion.div>

        {/* Main Question */}
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-gradient"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Will you be my Valentine?
        </motion.h1>

        <motion.p
          className="text-rose-gold-light/70 text-lg md:text-xl mb-12 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Choose wisely... or don't. The answer is obvious anyway.
        </motion.p>

        {/* Buttons Container */}
        <div className="relative flex items-center justify-center gap-8 min-h-[200px]">
          {/* Yes Button */}
          <motion.button
            onClick={handleYesClick}
            className="px-12 py-4 text-xl font-semibold rounded-full bg-gradient-to-r from-crimson to-rose-gold text-white glow-crimson"
            whileHover={{ scale: 1.1, boxShadow: '0 0 40px rgba(220, 20, 60, 0.6)' }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            Yes! 💕
          </motion.button>

          {/* Moving No Button */}
          <motion.button
            onClick={handleNoClick}
            onMouseEnter={moveNoButton}
            onTouchStart={moveNoButton}
            className="px-12 py-4 text-xl font-semibold rounded-full glass border border-rose-gold/30 text-rose-gold-light/70 hover:border-rose-gold/50 cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              x: noButtonPosition.x,
              ...(noButtonMoved && { y: noButtonPosition.y }),
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 25,
            }}
            whileTap={{ scale: 0.9 }}
          >
            {noButtonMoved ? "Can't catch me! 🥱" : 'No'}
          </motion.button>
        </div>

        {/* Hint Text */}
        <AnimatePresence>
          {noButtonMoved && (
            <motion.p
              className="mt-8 text-amethyst-light/50 text-sm italic"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              The "No" button seems to have commitment issues... Just say yes!
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Accepted Message Overlay */}
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
              <motion.div
                className="text-6xl mb-6"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 0.6, repeat: 3 }}
              >
                💕
              </motion.div>
              <h2 className="text-3xl font-bold text-gradient mb-4">
                You said yes!
              </h2>
              <p className="text-rose-gold-light/80 text-lg">
                Well you can't really say no so... You're stuck with me now.
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

      {/* Bottom Decorative Line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-gold to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      />
    </motion.div>
  );
}
