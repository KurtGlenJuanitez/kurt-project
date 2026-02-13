import { useState, useEffect, useMemo, useRef, memo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';

// Elegant Ticket Component - Clean design with download functionality
function ValentineTicket({ onClose }) {
  const ticketRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXVal = e.clientX - rect.left;
    const mouseYVal = e.clientY - rect.top;
    const xPct = mouseXVal / width - 0.5;
    const yPct = mouseYVal / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDownloading(true);

    // Simulate printing/generation animation
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // Create canvas manually to avoid html2canvas CSS issues
      const scale = 2;
      const width = 340 * scale;
      const height = 480 * scale;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // Background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, '#1a1025');
      bgGradient.addColorStop(0.5, '#1a1228');
      bgGradient.addColorStop(1, '#16101e');

      // Draw rounded rectangle background
      const radius = 16 * scale;
      ctx.beginPath();
      ctx.roundRect(0, 0, width, height, radius);
      ctx.fillStyle = bgGradient;
      ctx.fill();

      // Rose gold border (gradient effect)
      const borderGradient = ctx.createLinearGradient(0, 0, width, height);
      borderGradient.addColorStop(0, '#b76e79');
      borderGradient.addColorStop(0.5, '#d4a5ac');
      borderGradient.addColorStop(1, '#b76e79');
      ctx.strokeStyle = borderGradient;
      ctx.lineWidth = 2 * scale;
      ctx.stroke();

      // Top decorative bar
      ctx.fillStyle = '#b76e79';
      ctx.beginPath();
      ctx.roundRect(0, 0, width, 8 * scale, [radius, radius, 0, 0]);
      ctx.fill();

      // Header - "Exclusive Pass"
      ctx.fillStyle = 'rgba(183, 110, 121, 0.6)';
      ctx.font = `${9 * scale}px Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('E X C L U S I V E   P A S S', width / 2, 42 * scale);

      // Header - "VIP Date Pass"
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${22 * scale}px Georgia, serif`;
      ctx.fillText('VIP Date Pass', width / 2, 72 * scale);

      // Divider lines with "Admit One"
      ctx.strokeStyle = 'rgba(183, 110, 121, 0.5)';
      ctx.lineWidth = 1 * scale;
      const lineY = 95 * scale;

      // Left line
      const leftGradient = ctx.createLinearGradient(70 * scale, 0, 130 * scale, 0);
      leftGradient.addColorStop(0, 'transparent');
      leftGradient.addColorStop(1, 'rgba(183, 110, 121, 0.5)');
      ctx.strokeStyle = leftGradient;
      ctx.beginPath();
      ctx.moveTo(70 * scale, lineY);
      ctx.lineTo(130 * scale, lineY);
      ctx.stroke();

      // Right line
      const rightGradient = ctx.createLinearGradient(210 * scale, 0, 270 * scale, 0);
      rightGradient.addColorStop(0, 'rgba(183, 110, 121, 0.5)');
      rightGradient.addColorStop(1, 'transparent');
      ctx.strokeStyle = rightGradient;
      ctx.beginPath();
      ctx.moveTo(210 * scale, lineY);
      ctx.lineTo(270 * scale, lineY);
      ctx.stroke();

      ctx.fillStyle = '#b76e79';
      ctx.font = `${11 * scale}px Arial, sans-serif`;
      ctx.fillText('Admit One', width / 2, 99 * scale);

      // Dashed divider line
      const dashY = 120 * scale;
      ctx.setLineDash([6 * scale, 4 * scale]);
      ctx.strokeStyle = 'rgba(183, 110, 121, 0.3)';
      ctx.beginPath();
      ctx.moveTo(20 * scale, dashY);
      ctx.lineTo(width - 20 * scale, dashY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Side notch circles (cut into the ticket)
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(0, dashY, 8 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(width, dashY, 8 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';

      // "This pass entitles bearer to"
      ctx.fillStyle = 'rgba(183, 110, 121, 0.5)';
      ctx.font = `${8 * scale}px Arial, sans-serif`;
      ctx.fillText('T H I S   P A S S   E N T I T L E S   B E A R E R   T O', width / 2, 150 * scale);

      // "An Entire Day of"
      ctx.fillStyle = '#ffffff';
      ctx.font = `${16 * scale}px Georgia, serif`;
      ctx.fillText('An Entire Day of', width / 2, 178 * scale);

      // "Quality Time Together"
      ctx.fillStyle = '#d4a5ac';
      ctx.font = `italic ${16 * scale}px Georgia, serif`;
      ctx.fillText('Quality Time Together', width / 2, 202 * scale);

      // Date box background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.strokeStyle = 'rgba(183, 110, 121, 0.2)';
      ctx.lineWidth = 1 * scale;
      const boxX = 35 * scale;
      const boxY = 220 * scale;
      const boxW = 270 * scale;
      const boxH = 115 * scale;
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 10 * scale);
      ctx.fill();
      ctx.stroke();

      // "Valid On"
      ctx.fillStyle = 'rgba(183, 110, 121, 0.4)';
      ctx.font = `${8 * scale}px Arial, sans-serif`;
      ctx.fillText('V A L I D   O N', width / 2, 242 * scale);

      // Date values - positioned evenly
      const dateY = 282 * scale;
      const labelY = 302 * scale;

      // Date - 18
      ctx.fillStyle = '#ffffff';
      ctx.font = `300 ${28 * scale}px Georgia, serif`;
      ctx.fillText('18', 85 * scale, dateY);
      ctx.fillStyle = 'rgba(183, 110, 121, 0.5)';
      ctx.font = `${8 * scale}px Arial, sans-serif`;
      ctx.fillText('DAY', 85 * scale, labelY);

      // Divider line
      ctx.strokeStyle = 'rgba(183, 110, 121, 0.2)';
      ctx.beginPath();
      ctx.moveTo(130 * scale, 255 * scale);
      ctx.lineTo(130 * scale, 310 * scale);
      ctx.stroke();

      // Date - Feb
      ctx.fillStyle = '#ffffff';
      ctx.font = `300 ${28 * scale}px Georgia, serif`;
      ctx.fillText('Feb', width / 2, dateY);
      ctx.fillStyle = 'rgba(183, 110, 121, 0.5)';
      ctx.font = `${8 * scale}px Arial, sans-serif`;
      ctx.fillText('MONTH', width / 2, labelY);

      // Divider line
      ctx.beginPath();
      ctx.moveTo(210 * scale, 255 * scale);
      ctx.lineTo(210 * scale, 310 * scale);
      ctx.stroke();

      // Date - 2026
      ctx.fillStyle = '#ffffff';
      ctx.font = `300 ${28 * scale}px Georgia, serif`;
      ctx.fillText('2026', 255 * scale, dateY);
      ctx.fillStyle = 'rgba(183, 110, 121, 0.5)';
      ctx.font = `${8 * scale}px Arial, sans-serif`;
      ctx.fillText('YEAR', 255 * scale, labelY);

      // "Our Anniversary"
      ctx.fillStyle = 'rgba(212, 165, 172, 0.8)';
      ctx.font = `500 ${11 * scale}px Georgia, serif`;
      ctx.fillText('Our Anniversary', width / 2, 328 * scale);

      // Features row
      const featY = 375 * scale;
      const featLabelY = 395 * scale;

      ctx.fillStyle = '#b76e79';
      ctx.font = `300 ${16 * scale}px Georgia, serif`;
      ctx.fillText('24h', 70 * scale, featY);
      ctx.fillText('1:1', width / 2, featY);
      ctx.fillText('VIP', 270 * scale, featY);

      ctx.fillStyle = 'rgba(183, 110, 121, 0.4)';
      ctx.font = `${8 * scale}px Arial, sans-serif`;
      ctx.fillText('ALL DAY', 70 * scale, featLabelY);
      ctx.fillText('EXCLUSIVE', width / 2, featLabelY);
      ctx.fillText('ACCESS', 270 * scale, featLabelY);

      // "Non-transferable"
      ctx.fillStyle = 'rgba(183, 110, 121, 0.3)';
      ctx.font = `${9 * scale}px Arial, sans-serif`;
      ctx.fillText('Non-transferable', width / 2, 425 * scale);

      // "— KGJ —" initials
      ctx.fillStyle = 'rgba(183, 110, 121, 0.4)';
      ctx.font = `300 ${10 * scale}px Georgia, serif`;
      ctx.fillText('— K G J —', width / 2, 455 * scale);

      // Bottom decorative bar
      ctx.fillStyle = '#b76e79';
      ctx.beginPath();
      ctx.roundRect(0, height - 6 * scale, width, 6 * scale, [0, 0, radius, radius]);
      ctx.fill();

      // Download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'valentine-ticket-2026.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download error:', err);
    }

    setIsDownloading(false);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={handleBackdropClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="relative max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, clipPath: 'inset(0 0 100% 0)' }}
        animate={{ opacity: 1, scale: 1, clipPath: 'inset(0 0 0% 0)' }}
        exit={{ opacity: 0, scale: 0.9, clipPath: 'inset(0 0 100% 0)' }}
        transition={{ duration: 1.5, ease: [0.2, 0.65, 0.3, 0.9] }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Scanning line effect */}
        <motion.div
          className="absolute left-0 right-0 h-0.5 bg-rose-gold/80 shadow-[0_0_15px_rgba(183,110,121,0.8)] z-[60]"
          initial={{ top: 0, opacity: 1 }}
          animate={{ top: "100%", opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.2, 0.65, 0.3, 0.9] }}
        />

        {/* Outer glow effect */}
        <div className="absolute -inset-2 bg-gradient-to-r from-rose-gold/40 via-pink-400/30 to-amethyst/40 rounded-3xl blur-xl" />

        {/* Ticket Container - This will be captured */}
        <div
          ref={ticketRef}
          className="relative bg-gradient-to-br from-rose-gold via-rose-gold to-rose-gold-light rounded-2xl p-[2px] shadow-2xl overflow-hidden"
        >
          {/* Printing Animation Overlay */}
          <AnimatePresence>
            {isDownloading && (
              <motion.div
                className="absolute inset-0 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Scanning Light */}
                <motion.div
                  className="absolute left-0 right-0 h-1 bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)] z-20"
                  initial={{ top: 0 }}
                  animate={{ top: "100%" }}
                  transition={{ duration: 1.8, ease: "linear" }}
                />
                {/* Gradient Trail */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-rose-gold/20 to-transparent z-10"
                  initial={{ height: "0%" }}
                  animate={{ height: "100%" }}
                  transition={{ duration: 1.8, ease: "linear" }}
                />
                {/* Status Badge */}
                <div className="absolute inset-0 flex items-center justify-center z-30">
                  <motion.div
                    className="bg-black/70 backdrop-blur-md px-6 py-3 rounded-full border border-rose-gold/30 shadow-xl"
                    initial={{ scale: 0.9, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="w-2 h-2 bg-rose-gold rounded-full"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <p className="text-rose-gold-light text-xs font-bold tracking-widest uppercase">
                        Printing Ticket...
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-gradient-to-b from-[#1a1025] via-[#1a1228] to-[#16101e] rounded-2xl overflow-hidden">

            {/* Decorative top pattern */}
            <div className="h-2 bg-gradient-to-r from-rose-gold via-rose-gold-light to-rose-gold" />

            {/* Header Section */}
            <div className="px-8 pt-6 pb-4 text-center">
              <p className="text-rose-gold/60 text-[10px] uppercase tracking-[0.4em] mb-2">
                Exclusive Pass
              </p>
              <h1 className="text-2xl font-bold text-white tracking-wide">
                VIP Date Pass
              </h1>
              <div className="flex items-center justify-center gap-3 mt-2">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-rose-gold/50" />
                <span className="text-rose-gold text-xs">Admit One</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-rose-gold/50" />
              </div>
            </div>

            {/* Divider with circles */}
            <div className="relative flex items-center px-0 my-2">
              <div className="absolute left-0 w-4 h-4 bg-black/80 rounded-full -translate-x-1/2" />
              <div className="flex-1 border-t border-dashed border-rose-gold/30 mx-4" />
              <div className="absolute right-0 w-4 h-4 bg-black/80 rounded-full translate-x-1/2" />
            </div>

            {/* Main Content */}
            <div className="px-8 py-4">
              <div className="text-center mb-5">
                <p className="text-rose-gold/50 text-[10px] uppercase tracking-[0.2em] mb-2">
                  This pass entitles bearer to
                </p>
                <h2 className="text-lg font-medium text-white leading-relaxed">
                  An Entire Day of
                </h2>
                <h2 className="text-lg font-semibold text-rose-gold-light leading-relaxed">
                  Quality Time Together
                </h2>
              </div>

              {/* Date Box */}
              <div className="bg-white/[0.03] rounded-xl p-4 border border-rose-gold/20 mb-4">
                <p className="text-rose-gold/40 text-[10px] uppercase tracking-[0.2em] mb-3 text-center">
                  Valid On
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <span className="block text-3xl font-light text-white">18</span>
                    <span className="text-[10px] text-rose-gold/50 uppercase tracking-wider">Day</span>
                  </div>
                  <div className="w-px h-10 bg-rose-gold/20" />
                  <div className="text-center">
                    <span className="block text-3xl font-light text-white">Feb</span>
                    <span className="text-[10px] text-rose-gold/50 uppercase tracking-wider">Month</span>
                  </div>
                  <div className="w-px h-10 bg-rose-gold/20" />
                  <div className="text-center">
                    <span className="block text-3xl font-light text-white">2026</span>
                    <span className="text-[10px] text-rose-gold/50 uppercase tracking-wider">Year</span>
                  </div>
                </div>
                <p className="text-center mt-3 text-rose-gold-light/80 text-xs font-medium">
                  Our Anniversary
                </p>
              </div>

              {/* Features - cleaner, no emojis */}
              <div className="flex justify-between text-center px-4 mb-2">
                <div>
                  <span className="block text-rose-gold text-lg font-light">24h</span>
                  <span className="text-[10px] text-rose-gold/40 uppercase">All Day</span>
                </div>
                <div>
                  <span className="block text-rose-gold text-lg font-light">1:1</span>
                  <span className="text-[10px] text-rose-gold/40 uppercase">Exclusive</span>
                </div>
                <div>
                  <span className="block text-rose-gold text-lg font-light">VIP</span>
                  <span className="text-[10px] text-rose-gold/40 uppercase">Access</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 pb-5 pt-2">
              <div className="text-center text-rose-gold/30 text-[10px] tracking-wider">
                Non-transferable
              </div>
            </div>

            {/* Decorative bottom pattern */}
            <div className="h-1.5 bg-gradient-to-r from-rose-gold via-rose-gold-light to-rose-gold" />
          </div>
        </div>

        {/* Initials - outside the captured ticket */}
        <p className="text-center mt-4 text-rose-gold/40 text-xs tracking-[0.3em] font-light">
          — KGJ —
        </p>

        {/* Download Button - outside the captured area */}
        <div className="relative z-[100] mt-4">
          <button
            type="button"
            className="w-full py-4 bg-gradient-to-r from-rose-gold to-rose-gold-light rounded-xl text-midnight font-semibold text-base shadow-lg hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer select-none"
            onClick={(e) => handleDownload(e)}
            disabled={isDownloading}
          >
            {isDownloading ? 'Generating...' : "I Can't Wait!"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Notification Component
function Notification({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full mx-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
    >
      <div className="glass-strong rounded-2xl p-4 shadow-xl border border-rose-gold/30">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💝</span>
          <p className="text-rose-gold-light/90 text-sm">{message}</p>
        </div>
      </div>
    </motion.div>
  );
}

const letterContent = `To my favorite person,

I know I usually spend my time staring at lines of code, trying to make systems run perfectly. But no matter how complicated and frustrating a project gets, the one thing that has always remained simple and clear is how I feel about you.

For this year, I didn't just want to give you something simple such as a card; I wanted to give you something that is made by me, where I can keep and show you the happiness and love that we have been sharing for the past year, locked away from the rest of the world.

You made this program feel like a home, and you're the only person I'd ever want to share my screen, and my life with. From our quiet moments to the chaos of our random energy and looking after our little kitten, Skyler, every second with you is a feature, a unique one, and never a bug.

So, let's make it official...

Will you be my Valentine?`;

// Floating image component with Framer Motion animations
const FloatingImage = memo(function FloatingImage({ imageNum, position }) {
  const basePath = import.meta.env.BASE_URL;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        zIndex: 0,
        willChange: 'transform, opacity',
      }}
      initial={{ opacity: 0, scale: 0.5, rotate: position.rotate - 10 }}
      animate={{
        opacity: [0, 0.9, 0.9, 0],
        scale: [0.5, 1, 1, 0.8],
        rotate: [position.rotate - 5, position.rotate, position.rotate + 3, position.rotate],
        y: [0, -15, -25, -40],
      }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{
        duration: 6,
        ease: "easeInOut",
      }}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-gold/20 to-amethyst/20 rounded-2xl blur-lg" />
        <img
          src={`${basePath}memories/image-${imageNum}.jpg`}
          alt={`Memory ${imageNum}`}
          className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-2xl border-2 border-rose-gold/30 shadow-2xl"
          style={{
            boxShadow: '0 10px 40px rgba(183, 110, 121, 0.3)',
          }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
    </motion.div>
  );
});

// Floating video component with Framer Motion animations
const FloatingVideo = memo(function FloatingVideo({ videoNum, position }) {
  const basePath = import.meta.env.BASE_URL;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        zIndex: 0,
        willChange: 'transform, opacity',
      }}
      initial={{ opacity: 0, scale: 0.5, rotate: position.rotate - 10 }}
      animate={{
        opacity: [0, 0.9, 0.9, 0],
        scale: [0.5, 1, 1, 0.8],
        rotate: [position.rotate - 5, position.rotate, position.rotate + 3, position.rotate],
        y: [0, -15, -25, -40],
      }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{
        duration: 8,
        ease: "easeInOut",
      }}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-gold/20 to-amethyst/20 rounded-2xl blur-lg" />
        <video
          src={`${basePath}memories/vid-${videoNum}.mp4`}
          className="w-40 h-40 md:w-48 md:h-48 object-cover rounded-2xl border-2 border-rose-gold/30 shadow-2xl"
          style={{
            boxShadow: '0 10px 40px rgba(183, 110, 121, 0.3)',
          }}
          autoPlay
          loop
          muted
          playsInline
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
    </motion.div>
  );
});

export default function HomeContent() {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [isPopping, setIsPopping] = useState(false);
  const [popMedia, setPopMedia] = useState([]);
  const containerRef = useRef(null);

  // Cycling media state - max 10 items visible at once (7 images + 3 videos)
  const [activeMedia, setActiveMedia] = useState([]);
  const mediaIndexRef = useRef({ image: 0, video: 0 });
  const mediaIdCounter = useRef(0);

  const TOTAL_IMAGES = 43;
  const TOTAL_VIDEOS = 15;
  const MAX_VISIBLE = 18;
  const MAX_IMAGES = 12;
  const MAX_VIDEOS = 6;

  // Pre-defined positions for videos (edges only, avoid center)
  const videoPositions = useMemo(() => [
    { x: '2%', y: '15%', rotate: -6 },
    { x: '82%', y: '20%', rotate: 8 },
    { x: '5%', y: '70%', rotate: -10 },
    { x: '85%', y: '75%', rotate: 5 },
    { x: '88%', y: '45%', rotate: -8 },
    { x: '10%', y: '5%', rotate: 7 },
    { x: '78%', y: '88%', rotate: -5 },
    { x: '0%', y: '50%', rotate: 9 },
    { x: '92%', y: '60%', rotate: -7 },
    { x: '15%', y: '85%', rotate: 6 },
    { x: '80%', y: '8%', rotate: -9 },
    { x: '3%', y: '35%', rotate: 8 },
    { x: '90%', y: '32%', rotate: -6 },
    { x: '8%', y: '90%', rotate: 5 },
    { x: '85%', y: '55%', rotate: -10 },
  ], []);

  // Pre-defined positions for images (spread around with top/bottom focus)
  const imagePositions = useMemo(() => [
    // Top row (spread across)
    { x: '5%', y: '2%', rotate: -8 },
    { x: '20%', y: '5%', rotate: 10 },
    { x: '35%', y: '3%', rotate: -5 },
    { x: '50%', y: '2%', rotate: 7 },
    { x: '65%', y: '4%', rotate: -6 },
    { x: '80%', y: '3%', rotate: 12 },
    { x: '92%', y: '5%', rotate: -10 },
    // Second top row
    { x: '10%', y: '12%', rotate: 6 },
    { x: '28%', y: '10%', rotate: -8 },
    { x: '45%', y: '8%', rotate: 5 },
    { x: '60%', y: '11%', rotate: -7 },
    { x: '75%', y: '9%', rotate: 9 },
    { x: '88%', y: '14%', rotate: -5 },
    // Bottom row (spread across)
    { x: '5%', y: '88%', rotate: 5 },
    { x: '18%', y: '92%', rotate: -9 },
    { x: '32%', y: '90%', rotate: 8 },
    { x: '48%', y: '88%', rotate: -6 },
    { x: '62%', y: '91%', rotate: 7 },
    { x: '78%', y: '89%', rotate: -8 },
    { x: '90%', y: '92%', rotate: 10 },
    // Second bottom row
    { x: '8%', y: '78%', rotate: -7 },
    { x: '25%', y: '82%', rotate: 6 },
    { x: '40%', y: '80%', rotate: -10 },
    { x: '55%', y: '83%', rotate: 8 },
    { x: '70%', y: '79%', rotate: -5 },
    { x: '85%', y: '82%', rotate: 9 },
    // Left side
    { x: '2%', y: '25%', rotate: -8 },
    { x: '5%', y: '40%', rotate: 6 },
    { x: '3%', y: '55%', rotate: -11 },
    { x: '6%', y: '68%', rotate: 7 },
    // Right side
    { x: '90%', y: '28%', rotate: 5 },
    { x: '88%', y: '42%', rotate: -9 },
    { x: '92%', y: '58%', rotate: 7 },
    { x: '87%', y: '70%', rotate: -6 },
    // Near container edges
    { x: '22%', y: '22%', rotate: -6 },
    { x: '72%', y: '20%', rotate: 8 },
    { x: '20%', y: '72%', rotate: -10 },
    { x: '75%', y: '75%', rotate: 5 },
    // Extra positions
    { x: '15%', y: '35%', rotate: -7 },
    { x: '82%', y: '35%', rotate: 10 },
    { x: '12%', y: '62%', rotate: -8 },
    { x: '85%', y: '65%', rotate: 6 },
  ], []);

  // Typewriter effect
  useEffect(() => {
    if (displayedText.length < letterContent.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(letterContent.slice(0, displayedText.length + 1));
      }, 30);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [displayedText]);

  // Cycling media effect - adds new items and removes old ones
  useEffect(() => {
    // Start showing media after some text is displayed
    if (displayedText.length < 50) return;

    // Add initial batch of media
    if (activeMedia.length === 0) {
      const initialMedia = [];
      // Add initial images
      for (let i = 0; i < MAX_IMAGES; i++) {
        initialMedia.push({
          id: mediaIdCounter.current++,
          type: 'image',
          num: (mediaIndexRef.current.image % TOTAL_IMAGES) + 1,
          positionIndex: i,
        });
        mediaIndexRef.current.image++;
      }
      // Add initial videos
      for (let i = 0; i < MAX_VIDEOS; i++) {
        initialMedia.push({
          id: mediaIdCounter.current++,
          type: 'video',
          num: (mediaIndexRef.current.video % TOTAL_VIDEOS) + 1,
          positionIndex: i,
        });
        mediaIndexRef.current.video++;
      }
      setActiveMedia(initialMedia);
    }
  }, [displayedText, activeMedia.length]);

  // Cycle media items - remove one and add a new one periodically
  useEffect(() => {
    if (activeMedia.length === 0) return;

    const cycleInterval = setInterval(() => {
      setActiveMedia(prev => {
        if (prev.length === 0) return prev;

        // Remove the oldest item
        const newMedia = prev.slice(1);

        // Determine what type to add (alternate between image and video)
        const imageCount = newMedia.filter(m => m.type === 'image').length;
        const videoCount = newMedia.filter(m => m.type === 'video').length;

        let newItem;
        if (imageCount < MAX_IMAGES) {
          newItem = {
            id: mediaIdCounter.current++,
            type: 'image',
            num: (mediaIndexRef.current.image % TOTAL_IMAGES) + 1,
            positionIndex: mediaIndexRef.current.image % imagePositions.length,
          };
          mediaIndexRef.current.image++;
        } else if (videoCount < MAX_VIDEOS) {
          newItem = {
            id: mediaIdCounter.current++,
            type: 'video',
            num: (mediaIndexRef.current.video % TOTAL_VIDEOS) + 1,
            positionIndex: mediaIndexRef.current.video % videoPositions.length,
          };
          mediaIndexRef.current.video++;
        } else {
          // Default to image
          newItem = {
            id: mediaIdCounter.current++,
            type: 'image',
            num: (mediaIndexRef.current.image % TOTAL_IMAGES) + 1,
            positionIndex: mediaIndexRef.current.image % imagePositions.length,
          };
          mediaIndexRef.current.image++;
        }

        return [...newMedia, newItem];
      });
    }, 2000); // Cycle every 2 seconds

    return () => clearInterval(cycleInterval);
  }, [activeMedia.length, imagePositions.length, videoPositions.length]);

  // Handle "Pop Pictures" button click
  const handlePop = () => {
    if (isPopping) return;
    setIsPopping(true);

    // Generate all images and videos at edge positions (avoid center where message is)
    const edgePosition = () => {
      // Pick left/right edges or top/bottom edges to avoid center
      const side = Math.random();
      let x, y;
      if (side < 0.25) {
        // Left edge
        x = Math.random() * 15 + 2;
        y = Math.random() * 85 + 5;
      } else if (side < 0.5) {
        // Right edge
        x = Math.random() * 15 + 78;
        y = Math.random() * 85 + 5;
      } else if (side < 0.75) {
        // Top edge
        x = Math.random() * 80 + 10;
        y = Math.random() * 15 + 2;
      } else {
        // Bottom edge
        x = Math.random() * 80 + 10;
        y = Math.random() * 15 + 78;
      }
      return { x: `${x}%`, y: `${y}%` };
    };

    const allPop = [];
    for (let i = 1; i <= TOTAL_IMAGES; i++) {
      const pos = edgePosition();
      allPop.push({
        id: `pop-img-${i}`,
        type: 'image',
        num: i,
        x: pos.x,
        y: pos.y,
        rotate: Math.random() * 30 - 15,
      });
    }
    for (let i = 1; i <= TOTAL_VIDEOS; i++) {
      const pos = edgePosition();
      allPop.push({
        id: `pop-vid-${i}`,
        type: 'video',
        num: i,
        x: pos.x,
        y: pos.y,
        rotate: Math.random() * 30 - 15,
      });
    }
    setPopMedia(allPop);
    setActiveMedia([]); // hide normal cycling

    // After animation completes, clear pop and resume cycling
    setTimeout(() => {
      setPopMedia([]);
      setIsPopping(false);
      // Reset cycling media
      mediaIndexRef.current = { image: 0, video: 0 };
      mediaIdCounter.current = 0;
      const initialMedia = [];
      for (let i = 0; i < MAX_IMAGES; i++) {
        initialMedia.push({
          id: mediaIdCounter.current++,
          type: 'image',
          num: (mediaIndexRef.current.image % TOTAL_IMAGES) + 1,
          positionIndex: i,
        });
        mediaIndexRef.current.image++;
      }
      for (let i = 0; i < MAX_VIDEOS; i++) {
        initialMedia.push({
          id: mediaIdCounter.current++,
          type: 'video',
          num: (mediaIndexRef.current.video % TOTAL_VIDEOS) + 1,
          positionIndex: i,
        });
        mediaIndexRef.current.video++;
      }
      setActiveMedia(initialMedia);
    }, 4000);
  };

  // Handle "No" button click
  const handleNo = () => {
    setShowNotification(true);
    // Scroll to top of container
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle "Yes" button click
  const handleYes = () => {
    setShowTicket(true);
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center p-6 pt-12 overflow-hidden"
    >
      {/* Pop Pictures Button - fixed on the side */}
      <motion.button
        className="fixed right-4 top-1/2 -translate-y-1/2 z-30 px-3 py-4 bg-gradient-to-b from-rose-gold to-amethyst rounded-xl text-white font-semibold shadow-lg"
        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(183, 110, 121, 0.5)' }}
        whileTap={{ scale: 0.95 }}
        onClick={handlePop}
        disabled={isPopping}
      >
        {isPopping ? 'Popping...' : 'Pop Pictures'}
      </motion.button>

      {/* Pop Media Burst - all at once (behind the letter card) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <AnimatePresence>
          {popMedia.map((item, i) => {
            const basePath = import.meta.env.BASE_URL;
            return (
              <motion.div
                key={item.id}
                className="absolute"
                style={{
                  left: item.x,
                  top: item.y,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1.2, 1, 0.6],
                  rotate: [0, item.rotate],
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  duration: 3.5,
                  delay: i * 0.03,
                  ease: "easeOut",
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-gold/30 to-amethyst/30 rounded-2xl blur-lg" />
                  {item.type === 'image' ? (
                    <img
                      src={`${basePath}memories/image-${item.num}.jpg`}
                      alt={`Memory ${item.num}`}
                      className="w-28 h-28 md:w-36 md:h-36 object-cover rounded-2xl border-2 border-rose-gold/40 shadow-2xl"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <video
                      src={`${basePath}memories/vid-${item.num}.mp4`}
                      className="w-28 h-28 md:w-36 md:h-36 object-cover rounded-2xl border-2 border-rose-gold/40 shadow-2xl"
                      autoPlay loop muted playsInline
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Floating Images/Videos Background - max 10 items cycling */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence mode="popLayout">
          {activeMedia.map((item) => {
            if (item.type === 'image') {
              const position = imagePositions[item.positionIndex % imagePositions.length];
              if (!position) return null;
              return (
                <FloatingImage
                  key={item.id}
                  imageNum={item.num}
                  position={position}
                />
              );
            } else {
              const position = videoPositions[item.positionIndex % videoPositions.length];
              if (!position) return null;
              return (
                <FloatingVideo
                  key={item.id}
                  videoNum={item.num}
                  position={position}
                />
              );
            }
          })}
        </AnimatePresence>
      </div>

      {/* Letter Card */}
      <motion.div
        className="relative z-10 glass-strong rounded-3xl p-8 md:p-12 max-w-2xl w-full glow-rose"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Letter Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.div
            className="text-4xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            💌
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-bold text-gradient">
            Valentine's Letter
          </h2>
          <motion.div
            className="text-4xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🌹
          </motion.div>
        </div>

        {/* Letter Content with Typewriter Effect */}
        <div className="relative">
          <p className="text-rose-gold-light/90 text-lg leading-relaxed whitespace-pre-wrap font-serif">
            {displayedText}
            {isTyping && (
              <motion.span
                className="inline-block w-0.5 h-6 bg-rose-gold ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </p>
        </div>

        {/* Yes/No Buttons */}
        <AnimatePresence>
          {!isTyping && !showTicket && (
            <motion.div
              className="mt-8 pt-6 border-t border-rose-gold/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex gap-4 text-2xl justify-center mb-6">
                {['💕', '✨', '💕'].map((emoji, i) => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ delay: i * 0.2, duration: 1.5, repeat: Infinity }}
                  >
                    {emoji}
                  </motion.span>
                ))}
              </div>

              <div className="flex gap-4 justify-center">
                <motion.button
                  className="px-8 py-3 bg-gradient-to-r from-rose-gold to-amethyst rounded-xl text-white font-semibold shadow-lg"
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(183, 110, 121, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleYes}
                >
                  Yes! 💕
                </motion.button>
                <motion.button
                  className="px-8 py-3 bg-transparent border-2 border-rose-gold/50 rounded-xl text-rose-gold-light font-semibold"
                  whileHover={{ scale: 1.05, borderColor: 'rgba(183, 110, 121, 0.8)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNo}
                >
                  Not yet...
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <Notification
            message="It's okay, take your time. You can read the message again :)"
            onClose={() => setShowNotification(false)}
          />
        )}
      </AnimatePresence>

      {/* Valentine Ticket */}
      <AnimatePresence>
        {showTicket && (
          <ValentineTicket onClose={() => setShowTicket(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
