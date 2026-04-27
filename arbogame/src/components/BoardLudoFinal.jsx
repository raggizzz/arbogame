import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';

const BoardLudoFinal = () => {
  const { board, players, currentPlayerIndex } = useGameStore();
  
  if (!board || !players) return null;

  // Cores dos jogadores
  const playerColors = {
    0: { bg: '#00E65C', light: '#4ADE80' }, // Verde
    1: { bg: '#F59E0B', light: '#FCD34D' }, // Amarelo
    2: { bg: '#0BA5E9', light: '#38BDF8' }, // Azul
    3: { bg: '#EF4444', light: '#F87171' }  // Vermelho
  };

  // Renderizar peão
  const Pawn = ({ playerIndex, size = 'small' }) => {
    const sizeClass = size === 'large' ? 'w-8 h-8' : 'w-4 h-4';
    return (
      <motion.div
        className={`${sizeClass} rounded-full border-2 border-white shadow-lg`}
        style={{ backgroundColor: playerColors[playerIndex].bg }}
        whileHover={{ scale: 1.2 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    );
  };

  // Renderizar casa do caminho
  const PathCell = ({ star = false, color = 'white', children }) => (
    <div 
      className="relative border border-gray-300 flex items-center justify-center"
      style={{ 
        backgroundColor: color,
        aspectRatio: '1/1'
      }}
    >
      {star && <span className="absolute text-yellow-500 text-lg">★</span>}
      {children}
    </div>
  );

  // Renderizar base de um jogador
  const PlayerBase = ({ playerIndex }) => {
    const color = playerColors[playerIndex];
    return (
      <div 
        className="relative w-full h-full p-6 flex items-center justify-center"
        style={{ backgroundColor: color.bg }}
      >
        {/* Triângulo branco central */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="60%" height="60%" viewBox="0 0 100 100">
            <polygon 
              points="50,10 10,90 90,90" 
              fill="white" 
              stroke="#333" 
              strokeWidth="2"
            />
          </svg>
        </div>
        
        {/* Grid 2x2 para os 4 peões */}
        <div className="relative z-10 grid grid-cols-2 gap-6 w-3/4 h-3/4">
          {[0, 1, 2, 3].map(i => (
            <div 
              key={i}
              className="rounded-full border-4 border-white flex items-center justify-center"
              style={{ backgroundColor: color.light }}
            >
              <Pawn playerIndex={playerIndex} size="large" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <div className="w-full max-w-5xl aspect-square">
        {/* Grid 15x15 */}
        <div className="w-full h-full grid grid-cols-15 grid-rows-15 gap-0 bg-white shadow-2xl border-8 border-black">
          
          {/* ========== LINHA 1-6: TOPO ========== */}
          
          {/* Base Verde - Canto Superior Esquerdo */}
          <div className="col-span-6 row-span-6 border-r-4 border-b-4 border-black">
            <PlayerBase playerIndex={0} />
          </div>
          
          {/* Coluna Central Superior - 6 casas verticais */}
          <div className="col-span-3 row-span-6 grid grid-rows-6 border-b-4 border-black">
            <PathCell><Pawn playerIndex={3} /></PathCell>
            <PathCell><Pawn playerIndex={3} /></PathCell>
            <PathCell star />
            <PathCell />
            <PathCell />
            <PathCell />
          </div>
          
          {/* Base Amarela - Canto Superior Direito */}
          <div className="col-span-6 row-span-6 border-l-4 border-b-4 border-black">
            <PlayerBase playerIndex={1} />
          </div>

          {/* ========== LINHA 7-9: FAIXA SUPERIOR ========== */}
          
          {/* 6 casas horizontais à esquerda */}
          <div className="col-span-6 row-span-3 grid grid-cols-6 border-r-4 border-black">
            <PathCell />
            <PathCell />
            <PathCell star />
            <PathCell />
            <PathCell />
            <PathCell><Pawn playerIndex={0} /></PathCell>
          </div>
          
          {/* Caminho Final Verde - 3 casas verdes */}
          <div className="col-span-3 row-span-3 grid grid-cols-3" style={{ backgroundColor: playerColors[0].bg }}>
            <PathCell color={playerColors[0].bg} />
            <PathCell color={playerColors[0].bg} />
            <PathCell color={playerColors[0].bg} star />
          </div>
          
          {/* 6 casas horizontais à direita */}
          <div className="col-span-6 row-span-3 grid grid-cols-6 border-l-4 border-black">
            <PathCell><Pawn playerIndex={1} /></PathCell>
            <PathCell />
            <PathCell />
            <PathCell star />
            <PathCell />
            <PathCell />
          </div>

          {/* ========== LINHA 10-12: FAIXA CENTRAL ========== */}
          
          {/* 6 casas horizontais à esquerda */}
          <div className="col-span-6 row-span-3 grid grid-cols-6 border-r-4 border-black">
            <PathCell><Pawn playerIndex={0} /></PathCell>
            <PathCell />
            <PathCell />
            <PathCell />
            <PathCell />
            <PathCell />
          </div>
          
          {/* Centro - Estrela Amarela com Triângulos */}
          <div className="col-span-3 row-span-3 relative" style={{ backgroundColor: '#FCD34D' }}>
            <motion.div
              className="w-full h-full flex items-center justify-center relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              {/* Triângulos coloridos */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                {/* Verde - Cima */}
                <polygon points="50,15 35,45 65,45" fill={playerColors[0].bg} />
                {/* Amarelo - Direita */}
                <polygon points="85,50 55,35 55,65" fill={playerColors[1].bg} />
                {/* Azul - Baixo */}
                <polygon points="50,85 35,55 65,55" fill={playerColors[2].bg} />
                {/* Vermelho - Esquerda */}
                <polygon points="15,50 45,35 45,65" fill={playerColors[3].bg} />
              </svg>
            </motion.div>
            {/* Estrela Central */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl z-10">★</span>
            </div>
          </div>
          
          {/* 6 casas horizontais à direita */}
          <div className="col-span-6 row-span-3 grid grid-cols-6 border-l-4 border-black">
            <PathCell />
            <PathCell />
            <PathCell />
            <PathCell />
            <PathCell />
            <PathCell><Pawn playerIndex={1} /></PathCell>
          </div>

          {/* ========== LINHA 13-15: FAIXA INFERIOR ========== */}
          
          {/* 6 casas horizontais à esquerda */}
          <div className="col-span-6 row-span-3 grid grid-cols-6 border-r-4 border-black">
            <PathCell />
            <PathCell />
            <PathCell />
            <PathCell star />
            <PathCell />
            <PathCell />
          </div>
          
          {/* Caminho Final Azul - 3 casas azuis */}
          <div className="col-span-3 row-span-3 grid grid-cols-3" style={{ backgroundColor: playerColors[2].bg }}>
            <PathCell color={playerColors[2].bg} star />
            <PathCell color={playerColors[2].bg} />
            <PathCell color={playerColors[2].bg} />
          </div>
          
          {/* 6 casas horizontais à direita */}
          <div className="col-span-6 row-span-3 grid grid-cols-6 border-l-4 border-black">
            <PathCell />
            <PathCell />
            <PathCell star />
            <PathCell />
            <PathCell />
            <PathCell />
          </div>

          {/* ========== LINHA 16-21: BASE INFERIOR ========== */}
          
          {/* Base Azul - Canto Inferior Esquerdo */}
          <div className="col-span-6 row-span-6 border-r-4 border-t-4 border-black">
            <PlayerBase playerIndex={2} />
          </div>
          
          {/* Coluna Central Inferior - 6 casas verticais */}
          <div className="col-span-3 row-span-6 grid grid-rows-6 border-t-4 border-black">
            <PathCell />
            <PathCell />
            <PathCell />
            <PathCell star />
            <PathCell><Pawn playerIndex={2} /></PathCell>
            <PathCell><Pawn playerIndex={2} /></PathCell>
          </div>
          
          {/* Base Vermelha - Canto Inferior Direito */}
          <div className="col-span-6 row-span-6 border-l-4 border-t-4 border-black">
            <PlayerBase playerIndex={3} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default BoardLudoFinal;
