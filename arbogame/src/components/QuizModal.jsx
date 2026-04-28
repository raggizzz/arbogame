import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Lightbulb } from 'lucide-react';
import useGameStore from '../store/gameStore';

const QuizModal = () => {
  const {
    showQuiz,
    currentQuestion,
    answerQuiz,
    players,
    currentPlayerIndex,
    isOnlineMultiplayer,
    localPlayerId
  } = useGameStore();
  const currentPlayer = players[currentPlayerIndex];
  const canAnswer = !isOnlineMultiplayer || currentPlayer?.id === localPlayerId;

  if (!showQuiz || !currentQuestion) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/72 p-4 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="surface-panel relative w-full max-w-2xl overflow-hidden rounded-[2rem] p-5 sm:p-8"
          initial={{ scale: 0.92, y: 28 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.92, y: 28 }}
        >
          <div className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-primary-300/30 blur-3xl" />
          <div className="absolute -bottom-14 -left-12 h-40 w-40 rounded-full bg-secondary-300/25 blur-3xl" />

          <div className="relative">
            <div className="mb-5 flex items-start gap-4">
              <div className="icon-badge h-14 w-14 flex-shrink-0">
                <HelpCircle className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-emerald-950 sm:text-3xl">Hora do quiz</h2>
                <p className="mt-1 text-sm font-semibold text-emerald-900/58">
                  Responda corretamente para ganhar 10 pontos.
                </p>
              </div>
            </div>

            <div className="mb-5 rounded-[1.5rem] bg-emerald-950 p-5 text-white shadow-lg">
              <p className="text-lg font-bold leading-7 sm:text-xl">{currentQuestion.pergunta}</p>
            </div>

            <div className="grid gap-3">
              {currentQuestion.alternativas.map((alternativa, index) => (
                <motion.button
                  key={index}
                  className={`group flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                    canAnswer
                      ? 'border-emerald-900/12 bg-white hover:border-primary-500/50 hover:bg-primary-50'
                      : 'cursor-not-allowed border-emerald-900/8 bg-white/55 opacity-65'
                  }`}
                  onClick={() => canAnswer && answerQuiz(index)}
                  disabled={!canAnswer}
                  whileHover={canAnswer ? { scale: 1.01, x: 3 } : {}}
                  whileTap={canAnswer ? { scale: 0.99 } : {}}
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-950 text-base font-black text-white transition group-hover:bg-primary-600">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="min-w-0 flex-1 text-base font-bold leading-6 text-emerald-950">{alternativa}</span>
                </motion.button>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-center text-sm font-semibold text-emerald-900/56">
              <Lightbulb className="h-4 w-4 text-accent-500" />
              {canAnswer ? 'Pense bem antes de responder.' : 'Aguardando resposta do jogador da vez.'}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuizModal;
