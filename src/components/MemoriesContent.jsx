import { motion } from 'framer-motion';

// Placeholder - will be replaced with Flowing Menu and Card Swap from ReactBits
export default function MemoriesContent() {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-6 pt-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="text-center"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="text-6xl mb-6"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          📸
        </motion.div>
        <h2 className="text-3xl font-bold text-gradient mb-4">
          Our Memories
        </h2>
        <p className="text-rose-gold-light/60 max-w-md">
          This section will feature the Flowing Menu with months (January 2025 - February 2026)
          and Card Swap component to display photos and messages.
        </p>
        <div className="mt-8 glass rounded-xl p-6">
          <p className="text-amethyst-light/50 text-sm italic">
            Coming soon: Refactored ReactBits components
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
