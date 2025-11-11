import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';

const Board = () => {
  const { board, players } = useGameStore();
  
  // Calcular posição no grid (espiral)
  const getCellPosition = (index) => {
    const gridSize = 10; // 10x10 grid
    const side = Math.floor(index / gridSize);
    const pos = index % gridSize;
    
    // Criar caminho em espiral
    if (side === 0) {
      // Lado inferior (esquerda para direita)
      return { x: pos, y: gridSize - 1 };
    } else if (side === 1) {
      // Lado direito (baixo para cima)
      return { x: gridSize - 1, y: gridSize - 1 - pos };
    } else if (side === 2) {
      // Lado superior (direita para esquerda)
      return { x: gridSize - 1 - pos, y: 0 };
    } else {
      // Lado esquerdo (cima para baixo)
      return { x: 0, y: pos };
    }
  };
  
  // Cores das casas por tipo
  const getCellColor = (type) => {
    switch (type) {
      case 0: return 'bg-white border-gray-300'; // Normal
      case 1: return 'bg-red-100 border-red-400'; // Criadouro
      case 2: return 'bg-green-100 border-green-400'; // Mutirão
      case 3: return 'bg-blue-100 border-blue-400'; // Quiz
      case 4: return 'bg-yellow-200 border-yellow-500'; // Início
      case 5: return 'bg-purple-200 border-purple-500'; // Fim
      default: return 'bg-white border-gray-300';
    }
  };
  
  // Ícone da casa
  const getCellIcon = (type) => {
    switch (type) {
      case 1: return '💧';
      case 2: return '💪';
      case 3: return '❓';
      case 4: return '🏁';
      case 5: return '🏆';
      default: return '';
    }
  };
  
  // Jogadores na mesma casa
  const getPlayersAtPosition = (position) => {
    return players.filter(p => p.position === position);
  };
  
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      {/* Tabuleiro em grid */}
      <div className="relative w-full max-w-4xl aspect-square">
        {board.map((cell, index) => {
          const pos = getCellPosition(index);
          const cellPlayers = getPlayersAtPosition(index);
          
          return (
            <motion.div
              key={cell.id}
              className={`absolute w-[9%] h-[9%] border-2 rounded-lg shadow-md flex flex-col items-center justify-center text-center p-1 ${getCellColor(cell.type)}`}
              style={{
                left: `${pos.x * 10}%`,
                top: `${pos.y * 10}%`
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.01 }}
            >
              {/* Número da casa */}
              <div className="text-xs font-bold text-gray-600">{index}</div>
              
              {/* Ícone */}
              {getCellIcon(cell.type) && (
                <div className="text-2xl">{getCellIcon(cell.type)}</div>
              )}
              
              {/* Label */}
              {cell.label && (
                <div className="text-[8px] font-semibold text-gray-700 leading-tight">
                  {cell.label}
                </div>
              )}
              
              {/* Peões dos jogadores */}
              {cellPlayers.length > 0 && (
                <div className="absolute -top-2 -right-2 flex gap-0.5">
                  {cellPlayers.map((player) => (
                    <motion.div
                      key={player.id}
                      className="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: player.color }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      {player.name.charAt(0)}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
        
        {/* Mosquito decorativo no centro */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl opacity-10 pointer-events-none"
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          🦟
        </motion.div>
      </div>
    </div>
  );
};

export default Board;
