import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Droplets, Sparkles } from 'lucide-react';
import useGameStore from '../store/gameStore';

const MessageOverlay = () => {
  const { showMessage, message } = useGameStore();

  const Icon = getMessageIcon(message);

  return (
    <AnimatePresence>
      {showMessage && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="surface-panel pointer-events-auto max-w-md rounded-[2rem] p-6 text-center"
            initial={{ scale: 0.82, y: 18 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.82, y: 18 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          >
            <div className="icon-badge mx-auto mb-4 h-16 w-16">
              <Icon className="h-8 w-8" />
            </div>
            <div className="whitespace-pre-line text-lg font-black leading-7 text-emerald-950">
              {cleanMessage(message)}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const getMessageIcon = (message) => {
  if (message.includes('✅') || message.toLowerCase().includes('corret')) return CheckCircle;
  if (message.includes('💧') || message.toLowerCase().includes('criadouro')) return Droplets;
  if (message.includes('❌') || message.toLowerCase().includes('err')) return AlertTriangle;
  return Sparkles;
};

const cleanMessage = (message) =>
  message
    .replaceAll('✅', '')
    .replaceAll('❌', '')
    .replaceAll('💧', '')
    .replaceAll('💪', '')
    .replaceAll('🎉', '')
    .trim();

export default MessageOverlay;
