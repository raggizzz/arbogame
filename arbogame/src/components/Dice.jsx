import { motion } from 'framer-motion';
import { Dices } from 'lucide-react';
import useGameStore from '../store/gameStore';

const Dice = () => {
  const {
    diceValue,
    isRolling,
    canRoll,
    rollDice,
    players,
    currentPlayerIndex,
    isOnlineMultiplayer,
    localPlayerId
  } = useGameStore();
  const currentPlayer = players[currentPlayerIndex];
  const isLocalTurn = !isOnlineMultiplayer || currentPlayer?.id === localPlayerId;
  const canInteract = canRoll && !isRolling && isLocalTurn;

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
    <div className="flex w-full flex-col items-center gap-5">
      {currentPlayer && (
        <motion.div
          className="w-full text-center"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-2 text-xs font-black uppercase text-white/45">Vez de</div>
          <div
            className="rounded-2xl px-4 py-3 text-base font-black text-white shadow-lg ring-1 ring-white/20"
            style={{ backgroundColor: currentPlayer.color }}
          >
            {currentPlayer.name}
          </div>
        </motion.div>
      )}

      <motion.button
        className={`relative ${canInteract ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}
        whileHover={canInteract ? { scale: 1.06 } : {}}
        whileTap={canInteract ? { scale: 0.95 } : {}}
        onClick={() => canInteract && rollDice()}
        disabled={!canInteract}
        aria-label="Rolar dado"
      >
        <motion.div
          className="relative h-28 w-28 rounded-[1.75rem] border border-emerald-900/10 bg-white shadow-2xl sm:h-32 sm:w-32"
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
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-2 p-4">
            {Array.from({ length: 9 }).map((_, index) => {
              const row = Math.floor(index / 3);
              const col = index % 3;
              const hasDot = dots.some(([r, c]) => r === row && c === col);

              return (
                <motion.div
                  key={index}
                  className={`rounded-full ${hasDot ? 'bg-emerald-950' : 'bg-transparent'}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: hasDot ? 1 : 0 }}
                  transition={{ delay: hasDot ? 0.08 : 0 }}
                />
              );
            })}
          </div>
        </motion.div>
        <div className="absolute -bottom-2 left-1/2 h-4 w-20 -translate-x-1/2 rounded-full bg-black/25 blur-md" />
      </motion.button>

      <motion.button
        className={`inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl px-5 font-black transition ${
          canInteract
            ? 'action-primary'
            : 'cursor-not-allowed bg-white/10 text-white/45'
        }`}
        onClick={() => canInteract && rollDice()}
        disabled={!canInteract}
        whileHover={canInteract ? { scale: 1.02 } : {}}
        whileTap={canInteract ? { scale: 0.98 } : {}}
      >
        <Dices className="h-5 w-5" />
        {isRolling ? 'Rolando...' : isLocalTurn ? 'Rolar dado' : 'Aguardando vez'}
      </motion.button>

      {!isRolling && (
        <motion.div
          className="rounded-2xl bg-white/10 px-5 py-2 text-4xl font-black text-white"
          key={diceValue}
          initial={{ scale: 0, rotate: -120 }}
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
