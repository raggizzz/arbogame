import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';

const Dice = () => {
  const { diceValue, isRolling, canRoll, rollDice, players, currentPlayerIndex } = useGameStore();
  const currentPlayer = players[currentPlayerIndex];
  
  // Faces do dado
  const diceFaces = {
    1: [[1, 1]],
    2: [[0, 0], [2, 2]],
    3: [[0, 0], [1, 1], [2, 2]],
    4: [[0, 0], [0, 2], [2, 0], [2, 2]],
    5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
    6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]]
  };
  
  const dots = diceFaces[diceValue] || diceFaces[1];
  
  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Informação do jogador atual */}
      {currentPlayer && (
        <motion.div
          className="text-center w-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">
            Vez de:
          </div>
          <div
            className="text-lg font-bold px-6 py-3 rounded-2xl text-white shadow-lg border-2 border-white/20"
            style={{ backgroundColor: currentPlayer.color }}
          >
            {currentPlayer.name}
          </div>
        </motion.div>
      )}
      
      {/* Dado */}
      <motion.div
        className="relative cursor-pointer"
        whileHover={canRoll && !isRolling ? { scale: 1.1 } : {}}
        whileTap={canRoll && !isRolling ? { scale: 0.95 } : {}}
        onClick={() => canRoll && !isRolling && rollDice()}
      >
        <motion.div
          className="w-32 h-32 bg-white rounded-3xl shadow-2xl border-4 border-primary-500/50 relative"
          animate={isRolling ? {
            rotateX: [0, 360, 720, 1080],
            rotateY: [0, 360, 720, 1080],
            rotateZ: [0, 180, 360, 540]
          } : {}}
          transition={isRolling ? {
            duration: 1,
            ease: 'easeOut'
          } : {}}
        >
          {/* Grid 3x3 para os pontos */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-2 p-3">
            {Array.from({ length: 9 }).map((_, index) => {
              const row = Math.floor(index / 3);
              const col = index % 3;
              const hasDot = dots.some(([r, c]) => r === row && c === col);
              
              return (
                <motion.div
                  key={index}
                  className={`rounded-full ${hasDot ? 'bg-red-500' : 'bg-transparent'}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: hasDot ? 1 : 0 }}
                  transition={{ delay: hasDot ? 0.1 : 0 }}
                />
              );
            })}
          </div>
        </motion.div>
        
        {/* Sombra do dado */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-black opacity-20 rounded-full blur-md" />
      </motion.div>
      
      {/* Botão de rolar */}
      <motion.button
        className={`w-full px-8 py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${
          canRoll && !isRolling
            ? 'bg-gradient-to-r from-primary-500 to-primary-600 shadow-glow hover:shadow-glow-lg'
            : 'bg-dark-600 cursor-not-allowed opacity-50'
        }`}
        onClick={() => canRoll && !isRolling && rollDice()}
        disabled={!canRoll || isRolling}
        whileHover={canRoll && !isRolling ? { scale: 1.02 } : {}}
        whileTap={canRoll && !isRolling ? { scale: 0.98 } : {}}
      >
        {isRolling ? '🎲 Rolando...' : '🎲 Rolar Dado'}
      </motion.button>
      
      {/* Valor do dado */}
      {!isRolling && (
        <motion.div
          className="text-5xl font-black gradient-text"
          key={diceValue}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {diceValue}
        </motion.div>
      )}
    </div>
  );
};

export default Dice;
