import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

// ─── Configuration ───────────────────────────────────────────────
// Unlock code for the Messages module (anniversary date: Feb 18, 2025)
const MESSAGES_LOCK_CODE = '20250218';
const MESSAGES_UNLOCK_STORAGE_KEY = 'messages-module-unlocked';

// ─── Floating Heart Component ────────────────────────────────────
// Soft, drifting hearts that surround the envelope — varied sizes,
// speeds, and opacity to create an enchanting ambient effect.
function FloatingHeart({ delay, x, size, duration }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{
        left: `${x}%`,
        fontSize: size,
        color: 'rgba(183, 110, 121, 0.35)',
      }}
      initial={{ y: '110vh', opacity: 0 }}
      animate={{
        y: '-10vh',
        opacity: [0, 0.25, 0.3, 0.15, 0],
        x: [0, 15, -10, 8, 0],
        rotate: [0, 12, -8, 5, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      &#10084;
    </motion.div>
  );
}

// ─── Envelope SVG Component ──────────────────────────────────────
// A stylized envelope that visually opens with CSS 3D transforms.
// The flap rotates open, then the paper rises and unfolds.
function EnvelopeSVG({ isOpen }) {
  return (
    <div className="relative w-[260px] h-[180px] sm:w-[300px] sm:h-[200px] md:w-[340px] md:h-[220px]">
      {/* Envelope body */}
      <div
        className="absolute inset-0 rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #c9828c 0%, #a05a64 40%, #8b4a54 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
        }}
      >
        {/* Inner fold lines */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: '65%',
            background: 'linear-gradient(145deg, #d4959e 0%, #b76e79 60%, #a05a64 100%)',
            clipPath: 'polygon(0 30%, 50% 0%, 100% 30%, 100% 100%, 0 100%)',
            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.15)',
          }}
        />

        {/* Heart seal on the envelope body */}
        <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2 z-10">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle, #dc143c, #8b0a1a)',
              boxShadow: '0 2px 8px rgba(220, 20, 60, 0.5)',
            }}
          >
            <span className="text-white text-xs">&#10084;</span>
          </div>
        </div>
      </div>

      {/* Envelope flap — rotates open via 3D perspective */}
      <div
        className="absolute top-0 left-0 right-0 z-20"
        style={{
          height: '55%',
          perspective: '800px',
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className="w-full h-full origin-top rounded-t-xl"
          style={{
            background: 'linear-gradient(180deg, #c9828c 0%, #b76e79 100%)',
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            transform: isOpen ? 'rotateX(180deg)' : 'rotateX(0deg)',
            transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
            backfaceVisibility: 'hidden',
            boxShadow: isOpen ? 'none' : '0 4px 12px rgba(0,0,0,0.2)',
          }}
        />
      </div>
    </div>
  );
}

// ─── Letter Paper Component ──────────────────────────────────────
// The unfolding paper that rises from the envelope and reveals text.
function LetterPaper({ stage, onReadLetter }) {
  // stage: 0 = hidden, 1 = rising from envelope, 2 = unfolded, 3 = letter visible
  return (
    <AnimatePresence>
      {stage >= 1 && (
        <motion.div
          className="absolute left-1/2 z-30"
          style={{ translateX: '-50%' }}
          initial={{ bottom: '40%', opacity: 0, scale: 0.7 }}
          animate={
            stage === 1
              ? { bottom: '55%', opacity: 1, scale: 0.85 }
              : { bottom: '50%', opacity: 1, scale: 1 }
          }
          transition={{
            duration: stage === 1 ? 1.2 : 0.8,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          <motion.div
            className="relative cursor-pointer"
            style={{ perspective: '1200px' }}
            onClick={stage === 2 ? onReadLetter : undefined}
            whileHover={stage === 2 ? { scale: 1.02 } : {}}
          >
            {/* Paper with fold effect */}
            <motion.div
              className="letter-paper rounded-lg overflow-hidden"
              style={{
                width: stage >= 2 ? '280px' : '200px',
                minHeight: stage >= 2 ? '160px' : '80px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3), 0 2px 8px rgba(183,110,121,0.15)',
                transformOrigin: 'top center',
              }}
              animate={{
                width: stage >= 2 ? 280 : 200,
                minHeight: stage >= 2 ? 160 : 80,
                rotateX: stage === 1 ? 15 : 0,
              }}
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="relative z-10 p-5 text-center">
                {stage === 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    <p className="text-[#6b4a50] text-sm font-medium italic">
                      Tap to read your letter...
                    </p>
                    <motion.div
                      className="mt-2 text-[#b76e79]"
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      &#10084;
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Full Letter View Component ──────────────────────────────────
// The final reveal — the anniversary letter displayed in a beautiful,
// readable format. This is the emotional climax of the entire module.
function LetterView({ onClose }) {
  const scrollRef = useRef(null);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-charcoal/90 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
      />

      {/* Letter container */}
      <motion.div
        ref={scrollRef}
        className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl"
        initial={{ scale: 0.8, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Paper background */}
        <div className="letter-paper rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          {/* Close button */}
          <div className="sticky top-0 z-20 flex justify-end p-4 pb-0">
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-[#b76e79]/15 hover:bg-[#b76e79]/25 text-[#8b4a54] transition-colors"
              aria-label="Close letter"
            >
              &#10005;
            </button>
          </div>

          {/* Letter content area */}
          <div className="relative z-10 px-8 sm:px-12 pb-12 pt-2">
            {/* Date header */}
            <motion.p
              className="text-[#b76e79]/70 text-xs uppercase tracking-[0.25em] text-center mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              February 18, 2026
            </motion.p>

            {/* Title */}
            <motion.h2
              className="text-center text-2xl sm:text-3xl font-bold mb-8"
              style={{ color: '#6b3a42' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Happy Anniversary, My Love
            </motion.h2>

            {/* Decorative divider */}
            <motion.div
              className="flex items-center justify-center gap-3 mb-8"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="h-px w-16 bg-[#b76e79]/30" />
              <span className="text-[#b76e79]/50 text-sm">&#10084;</span>
              <div className="h-px w-16 bg-[#b76e79]/30" />
            </motion.div>


            <motion.div
              className="space-y-5 text-[#4a3038] leading-[1.9] text-base sm:text-lg"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 1.2 }}
            >
              {/* eslint-disable-next-line no-irregular-whitespace */}
              {/* &#9999;&#65039; REPLACE THIS WITH THE ANNIVERSARY LETTER CONTENT */}
              <p>
                Happy anniversary, my love! This year has been a beautiful journey of growth, laughter, and love. Every moment with you has been a gift I treasure more than words can say. You've made me a better person and shown me what it means to truly be loved. Here's to another year of adventures, memories, and the joy we share together.
              </p>
              <p className="text-right mt-10 italic text-[#6b3a42]">
                Forever and always yours,
                <br />
                <span className="font-semibold">Kurt Juanitez</span>
              </p>
            </motion.div>

            {/* Bottom heart decoration */}
            <motion.div
              className="text-center mt-10 text-[#b76e79]/40 text-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.8 }}
            >
              &#10084;
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Messages Module Component ──────────────────────────────
export default function MessagesContent() {
  const { showNotification } = useApp();

  // ── Lock/Unlock State ──
  const [isUnlocked, setIsUnlocked] = useState(() =>
    typeof window !== 'undefined' &&
    window.sessionStorage.getItem(MESSAGES_UNLOCK_STORAGE_KEY) === 'true'
  );
  const [passcodeInput, setPasscodeInput] = useState('');
  const [lockError, setLockError] = useState('');
  const [shakeKey, setShakeKey] = useState(0);

  // ── Envelope Animation Stages ──
  // 'envelope' = envelope visible, 'opening' = flap opening,
  // 'paper-rising' = paper emerges, 'paper-unfolded' = paper open,
  // 'letter' = full letter displayed
  const [stage, setStage] = useState('envelope');
  const [showLetter, setShowLetter] = useState(false);

  // ── Floating hearts configuration ──
  const hearts = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        delay: i * 1.2 + Math.random() * 2,
        x: (i * 5 + Math.random() * 6) % 100,
        size: `${14 + Math.random() * 16}px`,
        duration: 12 + Math.random() * 8,
      })),
    []
  );

  // ── Passcode submission handler ──
  const handleUnlockSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const trimmed = passcodeInput.trim();

      if (trimmed !== MESSAGES_LOCK_CODE) {
        // Gentle error with shake animation
        setLockError('That\u2019s not right. Try again, my love.');
        setShakeKey((prev) => prev + 1);
        return;
      }

      // Correct code — unlock with a smooth transition
      setIsUnlocked(true);
      setLockError('');
      setPasscodeInput('');
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(MESSAGES_UNLOCK_STORAGE_KEY, 'true');
      }
      showNotification('Unlocked. Something special awaits you...', 3000);
    },
    [passcodeInput, showNotification]
  );

  // ── Envelope click handler — triggers the multi-stage animation ──
  const handleEnvelopeClick = useCallback(() => {
    if (stage !== 'envelope') return;

    // Stage 1: Flap opens
    setStage('opening');

    // Stage 2: Paper rises after flap fully opens
    setTimeout(() => setStage('paper-rising'), 1100);

    // Stage 3: Paper unfolds
    setTimeout(() => setStage('paper-unfolded'), 2400);
  }, [stage]);

  // ── Letter reveal handler ──
  const handleReadLetter = useCallback(() => {
    setShowLetter(true);
    setStage('letter');
  }, []);

  // ── Close letter and reset to envelope ──
  const handleCloseLetter = useCallback(() => {
    setShowLetter(false);
    // Reset to initial envelope state so user can replay
    setStage('envelope');
  }, []);

  // ── Keyboard support: Enter to click envelope ──
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Enter' && stage === 'envelope') {
        handleEnvelopeClick();
      }
      if (event.key === 'Escape' && showLetter) {
        handleCloseLetter();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [stage, showLetter, handleEnvelopeClick, handleCloseLetter]);

  // Compute paper stage number for LetterPaper: 0=hidden, 1=rising, 2=unfolded
  const paperStage =
    stage === 'paper-rising' ? 1 : stage === 'paper-unfolded' || stage === 'letter' ? 2 : 0;

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-start p-6 pt-12 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* ── Title header ── */}
      <motion.div
        className="text-center mb-8 relative z-10"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <p className="text-amethyst-light/70 text-xs uppercase tracking-[0.28em] mb-2">
          Anniversary
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-gradient">
          A Letter For You
        </h2>
        <p className="mt-3 text-rose-gold-light/60 max-w-md mx-auto">
          {isUnlocked
            ? 'Something written from the heart, sealed with love.'
            : 'This letter is sealed. Enter the code to unlock it.'}
        </p>
      </motion.div>

      {/* ── Locked State: Passcode Input ── */}
      <AnimatePresence mode="wait">
        {!isUnlocked && (
          <motion.section
            key="lock-screen"
            className="relative z-10 mx-auto w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <div
              key={shakeKey}
              className={`rounded-2xl border border-rose-gold/30 bg-charcoal-light/60 p-6 md:p-8 backdrop-blur-sm ${
                lockError ? 'messages-shake' : ''
              }`}
            >
              {/* Lock icon */}
              <motion.div
                className="text-5xl text-center mb-4"
                animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
              >
                &#128140;
              </motion.div>

              <h3 className="text-xl md:text-2xl font-semibold text-rose-gold-light text-center">
                Sealed With Love
              </h3>
              <p className="mt-2 text-sm text-amethyst-light/65 text-center">
                Enter the special date that started it all.
              </p>

              <form className="mt-6 space-y-4" onSubmit={handleUnlockSubmit}>
                <label
                  htmlFor="messages-passcode"
                  className="block text-xs uppercase tracking-[0.18em] text-amethyst-light/60"
                >
                  Unlock Code
                </label>
                <input
                  id="messages-passcode"
                  type="password"
                  value={passcodeInput}
                  onChange={(event) => {
                    setPasscodeInput(event.target.value);
                    if (lockError) setLockError('');
                  }}
                  className="w-full rounded-lg border border-rose-gold/35 bg-charcoal-lighter/80 px-4 py-3 text-rose-gold-light text-center text-lg tracking-[0.3em] outline-none transition-colors focus:border-rose-gold placeholder:text-rose-gold-light/30 placeholder:tracking-normal placeholder:text-sm"
                  autoComplete="off"
                  inputMode="numeric"
                  placeholder="Enter code"
                  maxLength={8}
                />

                <AnimatePresence>
                  {lockError && (
                    <motion.p
                      className="text-sm text-rose-300 text-center"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {lockError}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  className="w-full rounded-lg bg-gradient-to-r from-rose-gold to-amethyst px-4 py-3 text-white font-medium transition-opacity hover:opacity-95"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Unlock Letter
                </motion.button>
              </form>

              <p className="mt-4 text-xs text-amethyst-light/40 text-center italic">
                Hint: The day our love story began
              </p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── Unlocked State: Envelope Experience ── */}
      <AnimatePresence mode="wait">
        {isUnlocked && (
          <motion.section
            key="envelope-screen"
            className="relative z-10 flex-1 flex flex-col items-center justify-center w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Floating hearts layer — behind the envelope */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {hearts.map((heart) => (
                <FloatingHeart key={heart.id} {...heart} />
              ))}
            </div>

            {/* Soft radial glow behind the envelope */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[500px] md:h-[500px] rounded-full pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, rgba(183,110,121,0.12) 0%, rgba(153,102,204,0.06) 40%, transparent 70%)',
              }}
            />

            {/* Envelope + Paper assembly */}
            <div className="relative flex flex-col items-center">
              {/* Paper rising from envelope */}
              <LetterPaper stage={paperStage} onReadLetter={handleReadLetter} />

              {/* Clickable envelope */}
              <motion.div
                className={`relative cursor-pointer ${
                  stage === 'envelope' ? 'envelope-pulse' : ''
                }`}
                onClick={handleEnvelopeClick}
                style={{ borderRadius: '12px' }}
                whileHover={stage === 'envelope' ? { scale: 1.04, y: -4 } : {}}
                whileTap={stage === 'envelope' ? { scale: 0.97 } : {}}
                role="button"
                tabIndex={0}
                aria-label="Open the envelope"
              >
                <EnvelopeSVG isOpen={stage !== 'envelope'} />
              </motion.div>

              {/* Prompt text below envelope */}
              <AnimatePresence>
                {stage === 'envelope' && (
                  <motion.p
                    className="mt-6 text-rose-gold-light/50 text-sm italic text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    Tap the envelope to open...
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Replay button — visible after paper unfolds */}
              <AnimatePresence>
                {(stage === 'paper-unfolded' || stage === 'letter') && !showLetter && (
                  <motion.button
                    type="button"
                    onClick={() => setStage('envelope')}
                    className="mt-6 px-5 py-2 rounded-lg border border-rose-gold/30 text-rose-gold-light/60 text-sm hover:border-rose-gold/50 hover:text-rose-gold-light/80 transition-all"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Replay animation
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── Full Letter Overlay ── */}
      <AnimatePresence>
        {showLetter && <LetterView onClose={handleCloseLetter} />}
      </AnimatePresence>
    </motion.div>
  );
}
