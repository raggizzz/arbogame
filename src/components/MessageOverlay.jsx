import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store/gameStore';

const MessageOverlay = () => {
  const { showMessage, message } = useGameStore();
  
  return (
    <AnimatePresence>
      {showMessage && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-4 text-center border-4 border-dengue-blue pointer-events-auto"
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.5, rotate: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {/* Mosquito animado */}
            {message.includes('❌') && (
              <motion.div
                className="text-8xl mb-4"
                animate={{
                  x: [-20, 20, -20],
                  rotate: [-10, 10, -10]
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity
                }}
              >
                🦟
              </motion.div>
            )}
            
            {message.includes('✅') && (
              <motion.div
                className="text-8xl mb-4"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 0.6
                }}
              >
                🎉
              </motion.div>
            )}
            
            {message.includes('💧') && (
              <motion.div
                className="text-8xl mb-4"
                animate={{
                  y: [0, -20, 0]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity
                }}
              >
                💧
              </motion.div>
            )}
            
            {message.includes('💪') && (
              <motion.div
                className="text-8xl mb-4"
                animate={{
                  scale: [1, 1.3, 1]
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 0.5
                }}
              >
                💪
              </motion.div>
            )}
            
            {/* Mensagem */}
            <div className="text-xl font-bold text-gray-800 whitespace-pre-line leading-relaxed">
              {message}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MessageOverlay;
