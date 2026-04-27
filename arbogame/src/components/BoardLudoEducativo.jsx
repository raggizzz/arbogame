import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';

const BoardLudoEducativo = () => {
  const { board, players, currentPlayerIndex } = useGameStore();
  
  if (!board || !players) return null;

  // Cores vibrantes e educativas
  const colors = {
    0: { main: '#10B981', light: '#D1FAE5', dark: '#059669' }, // Verde
    1: { main: '#F59E0B', light: '#FEF3C7', dark: '#D97706' }, // Amarelo
    2: { main: '#3B82F6', light: '#DBEAFE', dark: '#2563EB' }, // Azul
    3: { main: '#EF4444', light: '#FEE2E2', dark: '#DC2626' }  // Vermelho
  };

  // Renderizar peão com sombra
  const Pawn = ({ playerIndex, size = 16 }) => (
    <g>
      {/* Sombra */}
      <circle 
        cx={size/2 + 1} 
        cy={size/2 + 2} 
        r={size/2} 
        fill="rgba(0,0,0,0.15)" 
      />
      {/* Peão */}
      <circle 
        cx={size/2} 
        cy={size/2} 
        r={size/2} 
        fill={colors[playerIndex].main}
        stroke="white"
        strokeWidth="2"
      />
      {/* Brilho */}
      <circle 
        cx={size/2 - 2} 
        cy={size/2 - 2} 
        r={size/4} 
        fill="rgba(255,255,255,0.4)"
      />
    </g>
  );

  // Renderizar casa do caminho
  const PathCell = ({ x, y, size, color = 'white', star = false, arrow = false }) => (
    <g transform={`translate(${x}, ${y})`}>
      {/* Sombra da casa */}
      <rect 
        x="2" 
        y="2" 
        width={size} 
        height={size} 
        rx="4" 
        fill="rgba(0,0,0,0.1)" 
      />
      {/* Casa */}
      <rect 
        width={size} 
        height={size} 
        rx="4" 
        fill={color}
        stroke="#E5E7EB"
        strokeWidth="1.5"
      />
      {/* Estrela */}
      {star && (
        <text 
          x={size/2} 
          y={size/2 + 6} 
          textAnchor="middle" 
          fontSize="18" 
          fill="#FCD34D"
        >
          ★
        </text>
      )}
      {/* Seta */}
      {arrow && (
        <text 
          x={size/2} 
          y={size/2 + 6} 
          textAnchor="middle" 
          fontSize="16" 
          fill="white"
        >
          ▶
        </text>
      )}
    </g>
  );

  // Renderizar base de um jogador
  const PlayerBase = ({ playerIndex, x, y, size }) => {
    const color = colors[playerIndex];
    const circleSize = size * 0.18;
    const spacing = size * 0.35;
    
    return (
      <g transform={`translate(${x}, ${y})`}>
        {/* Fundo colorido com gradiente */}
        <defs>
          <linearGradient id={`grad${playerIndex}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color.light} />
            <stop offset="100%" stopColor={color.main} stopOpacity="0.3" />
          </linearGradient>
        </defs>
        
        {/* Sombra da base */}
        <rect 
          x="4" 
          y="4" 
          width={size} 
          height={size} 
          rx="12" 
          fill="rgba(0,0,0,0.1)" 
        />
        
        {/* Base */}
        <rect 
          width={size} 
          height={size} 
          rx="12" 
          fill={`url(#grad${playerIndex})`}
          stroke={color.main}
          strokeWidth="3"
        />
        
        {/* Triângulo decorativo central */}
        <polygon 
          points={`${size/2},${size*0.3} ${size*0.35},${size*0.65} ${size*0.65},${size*0.65}`}
          fill="white"
          opacity="0.6"
          stroke={color.dark}
          strokeWidth="2"
        />
        
        {/* 4 círculos para peões */}
        {[
          [size*0.3, size*0.3],
          [size*0.7, size*0.3],
          [size*0.3, size*0.7],
          [size*0.7, size*0.7]
        ].map(([cx, cy], i) => (
          <g key={i}>
            {/* Sombra do círculo */}
            <circle 
              cx={cx + 1} 
              cy={cy + 2} 
              r={circleSize} 
              fill="rgba(0,0,0,0.1)" 
            />
            {/* Círculo */}
            <circle 
              cx={cx} 
              cy={cy} 
              r={circleSize} 
              fill="white"
              stroke={color.dark}
              strokeWidth="2.5"
            />
            {/* Peão dentro */}
            <g transform={`translate(${cx - 8}, ${cy - 8})`}>
              <Pawn playerIndex={playerIndex} size={16} />
            </g>
          </g>
        ))}
      </g>
    );
  };

  const boardSize = 600;
  const cellSize = 35;
  const baseSize = 180;
  const centerSize = 120;

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="shadow-2xl rounded-2xl overflow-hidden"
      >
        <svg 
          width={boardSize} 
          height={boardSize} 
          viewBox={`0 0 ${boardSize} ${boardSize}`}
          className="bg-gradient-to-br from-gray-50 to-gray-100"
        >
          {/* Borda externa */}
          <rect 
            width={boardSize} 
            height={boardSize} 
            fill="none"
            stroke="#1F2937"
            strokeWidth="8"
            rx="16"
          />

          {/* ========== BASES NOS CANTOS ========== */}
          
          {/* Base Verde - Superior Esquerdo */}
          <PlayerBase playerIndex={0} x={20} y={20} size={baseSize} />
          
          {/* Base Amarela - Superior Direito */}
          <PlayerBase playerIndex={1} x={boardSize - baseSize - 20} y={20} size={baseSize} />
          
          {/* Base Azul - Inferior Esquerdo */}
          <PlayerBase playerIndex={2} x={20} y={boardSize - baseSize - 20} size={baseSize} />
          
          {/* Base Vermelha - Inferior Direito */}
          <PlayerBase playerIndex={3} x={boardSize - baseSize - 20} y={boardSize - baseSize - 20} size={baseSize} />

          {/* ========== CAMINHOS HORIZONTAIS ========== */}
          
          {/* Caminho Superior */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <PathCell 
              key={`top-${i}`}
              x={20 + i * cellSize} 
              y={baseSize + 30} 
              size={cellSize}
              star={i === 2}
            />
          ))}
          
          {/* Caminho Inferior */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <PathCell 
              key={`bottom-${i}`}
              x={20 + i * cellSize} 
              y={boardSize - baseSize - 30 - cellSize} 
              size={cellSize}
              star={i === 3}
            />
          ))}
          
          {/* Caminho Superior Direito */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <PathCell 
              key={`top-right-${i}`}
              x={boardSize - 20 - (i + 1) * cellSize} 
              y={baseSize + 30} 
              size={cellSize}
              star={i === 3}
            />
          ))}
          
          {/* Caminho Inferior Direito */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <PathCell 
              key={`bottom-right-${i}`}
              x={boardSize - 20 - (i + 1) * cellSize} 
              y={boardSize - baseSize - 30 - cellSize} 
              size={cellSize}
              star={i === 2}
            />
          ))}

          {/* ========== CAMINHOS VERTICAIS ========== */}
          
          {/* Caminho Esquerdo Superior */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <PathCell 
              key={`left-top-${i}`}
              x={baseSize + 30} 
              y={20 + i * cellSize} 
              size={cellSize}
              star={i === 2}
            />
          ))}
          
          {/* Caminho Direito Superior */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <PathCell 
              key={`right-top-${i}`}
              x={boardSize - baseSize - 30 - cellSize} 
              y={20 + i * cellSize} 
              size={cellSize}
              star={i === 3}
            />
          ))}
          
          {/* Caminho Esquerdo Inferior */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <PathCell 
              key={`left-bottom-${i}`}
              x={baseSize + 30} 
              y={boardSize - 20 - (i + 1) * cellSize} 
              size={cellSize}
              star={i === 3}
            />
          ))}
          
          {/* Caminho Direito Inferior */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <PathCell 
              key={`right-bottom-${i}`}
              x={boardSize - baseSize - 30 - cellSize} 
              y={boardSize - 20 - (i + 1) * cellSize} 
              size={cellSize}
              star={i === 2}
            />
          ))}

          {/* ========== CAMINHOS FINAIS (SETAS COLORIDAS) ========== */}
          
          {/* Setas Verdes (Horizontal Superior) */}
          {[0, 1, 2].map(i => (
            <PathCell 
              key={`green-arrow-${i}`}
              x={baseSize + 30 + cellSize + i * cellSize} 
              y={baseSize + 30 + cellSize} 
              size={cellSize}
              color={colors[0].main}
              arrow={i === 2}
            />
          ))}
          
          {/* Setas Azuis (Horizontal Inferior) */}
          {[0, 1, 2].map(i => (
            <PathCell 
              key={`blue-arrow-${i}`}
              x={baseSize + 30 + cellSize + i * cellSize} 
              y={boardSize - baseSize - 30 - cellSize * 2} 
              size={cellSize}
              color={colors[2].main}
              arrow={i === 2}
            />
          ))}
          
          {/* Setas Amarelas (Vertical Direita) */}
          {[0, 1, 2].map(i => (
            <PathCell 
              key={`yellow-arrow-${i}`}
              x={boardSize - baseSize - 30 - cellSize * 2} 
              y={baseSize + 30 + cellSize + i * cellSize} 
              size={cellSize}
              color={colors[1].main}
              arrow={i === 2}
            />
          ))}
          
          {/* Setas Vermelhas (Vertical Esquerda) */}
          {[0, 1, 2].map(i => (
            <PathCell 
              key={`red-arrow-${i}`}
              x={baseSize + 30 + cellSize} 
              y={baseSize + 30 + cellSize + i * cellSize} 
              size={cellSize}
              color={colors[3].main}
              arrow={i === 2}
            />
          ))}

          {/* ========== CENTRO COM TRIÂNGULOS ========== */}
          
          <g transform={`translate(${boardSize/2 - centerSize/2}, ${boardSize/2 - centerSize/2})`}>
            {/* Sombra do centro */}
            <rect 
              x="4" 
              y="4" 
              width={centerSize} 
              height={centerSize} 
              rx="12" 
              fill="rgba(0,0,0,0.15)" 
            />
            
            {/* Fundo amarelo */}
            <rect 
              width={centerSize} 
              height={centerSize} 
              rx="12" 
              fill="#FCD34D"
              stroke="#F59E0B"
              strokeWidth="4"
            />
            
            {/* 4 Triângulos coloridos apontando para o centro */}
            {/* Verde - Cima */}
            <polygon 
              points={`${centerSize/2},${centerSize*0.2} ${centerSize*0.35},${centerSize*0.45} ${centerSize*0.65},${centerSize*0.45}`}
              fill={colors[0].main}
              stroke="white"
              strokeWidth="2"
            />
            
            {/* Amarelo - Direita */}
            <polygon 
              points={`${centerSize*0.8},${centerSize/2} ${centerSize*0.55},${centerSize*0.35} ${centerSize*0.55},${centerSize*0.65}`}
              fill={colors[1].main}
              stroke="white"
              strokeWidth="2"
            />
            
            {/* Azul - Baixo */}
            <polygon 
              points={`${centerSize/2},${centerSize*0.8} ${centerSize*0.35},${centerSize*0.55} ${centerSize*0.65},${centerSize*0.55}`}
              fill={colors[2].main}
              stroke="white"
              strokeWidth="2"
            />
            
            {/* Vermelho - Esquerda */}
            <polygon 
              points={`${centerSize*0.2},${centerSize/2} ${centerSize*0.45},${centerSize*0.35} ${centerSize*0.45},${centerSize*0.65}`}
              fill={colors[3].main}
              stroke="white"
              strokeWidth="2"
            />
            
            {/* Estrela central */}
            <motion.text 
              x={centerSize/2} 
              y={centerSize/2 + 12} 
              textAnchor="middle" 
              fontSize="36" 
              fill="white"
              stroke="#1F2937"
              strokeWidth="2"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            >
              ★
            </motion.text>
          </g>

        </svg>
      </motion.div>
    </div>
  );
};

export default BoardLudoEducativo;
