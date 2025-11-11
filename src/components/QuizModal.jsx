import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store/gameStore';

const QuizModal = () => {
  const { showQuiz, currentQuestion, answerQuiz } = useGameStore();
  
  if (!showQuiz || !currentQuestion) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 relative overflow-hidden"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
        >
          {/* Decoração de fundo */}
          <div className="absolute top-0 right-0 text-9xl opacity-5 pointer-events-none">
            🦟
          </div>
          
          {/* Cabeçalho */}
          <div className="text-center mb-6">
            <motion.div
              className="inline-block text-6xl mb-4"
              animate={{
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              ❓
            </motion.div>
            <h2 className="text-3xl font-bold text-dengue-blue mb-2">
              Hora do Quiz!
            </h2>
            <p className="text-gray-600">
              Responda corretamente e ganhe +10 pontos! 🎯
            </p>
          </div>
          
          {/* Pergunta */}
          <div className="bg-gradient-to-r from-dengue-blue to-blue-400 text-white rounded-2xl p-6 mb-6 shadow-lg">
            <p className="text-xl font-semibold text-center leading-relaxed">
              {currentQuestion.pergunta}
            </p>
          </div>
          
          {/* Alternativas */}
          <div className="grid grid-cols-1 gap-3 mb-6">
            {currentQuestion.alternativas.map((alternativa, index) => (
              <motion.button
                key={index}
                className="bg-white border-3 border-gray-300 hover:border-dengue-green hover:bg-dengue-green hover:bg-opacity-10 rounded-xl p-4 text-left transition-all shadow-md hover:shadow-lg group"
                onClick={() => answerQuiz(index)}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-dengue-blue to-blue-400 text-white flex items-center justify-center font-bold text-lg group-hover:from-dengue-green group-hover:to-green-500 transition-all">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-lg font-medium text-gray-800 flex-1">
                    {alternativa}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
          
          {/* Rodapé */}
          <div className="text-center text-sm text-gray-500">
            💡 Pense bem antes de responder!
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuizModal;
