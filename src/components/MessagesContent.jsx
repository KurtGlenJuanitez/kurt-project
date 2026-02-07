import { motion } from 'framer-motion';

// Placeholder - will be replaced with Scroll Stack from ReactBits
export default function MessagesContent() {
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
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          💌
        </motion.div>
        <h2 className="text-3xl font-bold text-gradient mb-4">
          Love Letters
        </h2>
        <p className="text-rose-gold-light/60 max-w-md">
          This section will feature the Scroll Stack component displaying
          long-form love letters and messages in a vertical scrollable stack.
        </p>
        <div className="mt-8 glass rounded-xl p-6">
          <p className="text-amethyst-light/50 text-sm italic">
            Coming soon: Refactored ReactBits Scroll Stack
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
