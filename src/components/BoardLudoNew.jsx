import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';

const BoardLudoNew = () => {
  const { board, players } = useGameStore();
  
  if (!board || !players) return <div className="text-white">Carregando...</div>;

  // Cores dos jogadores
  const colors = {
    0: '#00E65C', // Verde
    1: '#F59E0B', // Amarelo  
    2: '#0BA5E9', // Azul
    3: '#EF4444'  // Vermelho
  };

  // Renderizar peão
  const Pawn = ({ color, size = 'w-4 h-4' }) => (
    <div 
      className={`${size} rounded-full border-2 border-white shadow-lg`}
      style={{ backgroundColor: color }}
    />
  );

  // Renderizar casa do caminho
  const Cell = ({ color = 'white', star = false, children }) => (
    <div 
      className="w-8 h-8 border border-gray-400 flex items-center justify-center relative"
      style={{ backgroundColor: color }}
    >
      {star && <span className="text-yellow-500 text-xs">★</span>}
      {children}
    </div>
  );

  // Renderizar base de um jogador
  const Base = ({ playerIndex }) => {
    const color = colors[playerIndex];
    return (
      <div 
        className="w-full h-full p-3 relative flex items-center justify-center"
        style={{ backgroundColor: color }}
      >
        {/* Triângulo branco central */}
        <div 
          className="absolute w-20 h-20 bg-white transform rotate-45"
          style={{
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
          }}
        />
        
        {/* Grid 2x2 para peões */}
        <div className="relative z-10 grid grid-cols-2 gap-3 w-32 h-32">
          {[0, 1, 2, 3].map(i => (
            <div 
              key={i}
              className="rounded-full border-3 border-white bg-white/40 flex items-center justify-center"
            >
              <Pawn color={color} size="w-6 h-6" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="w-full max-w-4xl aspect-square">
        {/* Container principal - Grid 15x15 */}
        <div className="w-full h-full grid grid-cols-15 grid-rows-15 gap-0 bg-white border-8 border-gray-900">
          
          {/* ===== LINHA 1-6: TOPO ===== */}
          {/* Base Verde (0,0 - 6x6) */}
          <div className="col-span-6 row-span-6 border-r-4 border-b-4 border-gray-900">
            <Base playerIndex={0} />
          </div>
          
          {/* Coluna Central Superior (6,0 - 3x6) */}
          <div className="col-span-3 row-span-6 grid grid-rows-6 border-b-4 border-gray-900">
            <Cell><Pawn color={colors[3]} /></Cell>
            <Cell><Pawn color={colors[3]} /></Cell>
            <Cell star />
            <Cell />
            <Cell />
            <Cell />
          </div>
          
          {/* Base Amarela (9,0 - 6x6) */}
          <div className="col-span-6 row-span-6 border-l-4 border-b-4 border-gray-900">
            <Base playerIndex={1} />
          </div>

          {/* ===== LINHA 7-9: MEIO SUPERIOR ===== */}
          {/* Linha Esquerda (0,6 - 6x3) */}
          <div className="col-span-6 row-span-3 grid grid-cols-6 border-r-4 border-gray-900">
            <Cell />
            <Cell />
            <Cell star />
            <Cell />
            <Cell />
            <Cell><Pawn color={colors[0]} /></Cell>
          </div>
          
          {/* Caminho Final Verde - Setas Verdes (6,6 - 3x3) */}
          <div className="col-span-3 row-span-3 grid grid-cols-3 bg-green-500">
            <Cell color={colors[0]} />
            <Cell color={colors[0]} />
            <Cell color={colors[0]} star />
          </div>
          
          {/* Linha Direita (9,6 - 6x3) */}
          <div className="col-span-6 row-span-3 grid grid-cols-6 border-l-4 border-gray-900">
            <Cell><Pawn color={colors[1]} /></Cell>
            <Cell />
            <Cell />
            <Cell star />
            <Cell />
            <Cell />
          </div>

          {/* ===== LINHA 10-12: CENTRO ===== */}
          {/* Linha Esquerda (0,9 - 6x3) */}
          <div className="col-span-6 row-span-3 grid grid-cols-6 border-r-4 border-gray-900">
            <Cell><Pawn color={colors[0]} /></Cell>
            <Cell />
            <Cell />
            <Cell />
            <Cell />
            <Cell />
          </div>
          
          {/* Centro - Triângulo Amarelo (6,9 - 3x3) */}
          <div className="col-span-3 row-span-3 relative">
            <motion.div
              className="w-full h-full bg-yellow-400 flex items-center justify-center relative overflow-hidden"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* Triângulos coloridos apontando para cada base */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                {/* Verde - Cima */}
                <polygon points="50,20 40,40 60,40" fill="#00E65C" />
                {/* Amarelo - Direita */}
                <polygon points="80,50 60,40 60,60" fill="#F59E0B" />
                {/* Azul - Baixo */}
                <polygon points="50,80 40,60 60,60" fill="#0BA5E9" />
                {/* Vermelho - Esquerda */}
                <polygon points="20,50 40,40 40,60" fill="#EF4444" />
              </svg>
              <span className="text-5xl z-10">★</span>
            </motion.div>
          </div>
          
          {/* Linha Direita (9,9 - 6x3) */}
          <div className="col-span-6 row-span-3 grid grid-cols-6 border-l-4 border-gray-900">
            <Cell />
            <Cell />
            <Cell />
            <Cell />
            <Cell />
            <Cell><Pawn color={colors[1]} /></Cell>
          </div>

          {/* ===== LINHA 13-15: MEIO INFERIOR ===== */}
          {/* Linha Esquerda (0,12 - 6x3) */}
          <div className="col-span-6 row-span-3 grid grid-cols-6 border-r-4 border-gray-900">
            <Cell />
            <Cell />
            <Cell />
            <Cell star />
            <Cell />
            <Cell />
          </div>
          
          {/* Caminho Final Azul - Setas Azuis (6,12 - 3x3) */}
          <div className="col-span-3 row-span-3 grid grid-cols-3 bg-blue-500">
            <Cell color={colors[2]} star />
            <Cell color={colors[2]} />
            <Cell color={colors[2]} />
          </div>
          
          {/* Linha Direita (9,12 - 6x3) */}
          <div className="col-span-6 row-span-3 grid grid-cols-6 border-l-4 border-gray-900">
            <Cell />
            <Cell />
            <Cell star />
            <Cell />
            <Cell />
            <Cell />
          </div>

          {/* ===== LINHA 16-21: BASE INFERIOR ===== */}
          {/* Base Azul (0,15 - 6x6) */}
          <div className="col-span-6 row-span-6 border-r-4 border-t-4 border-gray-900">
            <Base playerIndex={2} />
          </div>
          
          {/* Coluna Central Inferior (6,15 - 3x6) */}
          <div className="col-span-3 row-span-6 grid grid-rows-6 border-t-4 border-gray-900">
            <Cell />
            <Cell />
            <Cell />
            <Cell star />
            <Cell><Pawn color={colors[2]} /></Cell>
            <Cell><Pawn color={colors[2]} /></Cell>
          </div>
          
          {/* Base Vermelha (9,15 - 6x6) */}
          <div className="col-span-6 row-span-6 border-l-4 border-t-4 border-gray-900">
            <Base playerIndex={3} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default BoardLudoNew;
