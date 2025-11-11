import { motion } from 'framer-motion';
import { Shield, Star, Home as HomeIcon, Trophy } from 'lucide-react';
import useGameStore from '../store/gameStore';

const BoardLudoCompleto = () => {
  const { board, players, currentPlayerIndex } = useGameStore();
  
  if (!board || !players) return null;

  // Cores vibrantes
  const colors = {
    0: { main: '#10B981', light: '#D1FAE5', dark: '#059669', name: 'Verde' },
    1: { main: '#F59E0B', light: '#FEF3C7', dark: '#D97706', name: 'Amarelo' },
    2: { main: '#3B82F6', light: '#DBEAFE', dark: '#2563EB', name: 'Azul' },
    3: { main: '#EF4444', light: '#FEE2E2', dark: '#DC2626', name: 'Vermelho' }
  };

  // Renderizar peão
  const Pawn = ({ playerIndex, size = 12 }) => (
    <motion.div
      className="rounded-full border-2 border-white shadow-lg"
      style={{ 
        width: size,
        height: size,
        backgroundColor: colors[playerIndex].main
      }}
      whileHover={{ scale: 1.3 }}
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
    />
  );

  // Renderizar casa do caminho
  const Cell = ({ index, isSafe = false, isStart = false, color = 'white', children }) => {
    const cellSize = 'w-10 h-10';
    
    return (
      <div 
        className={`${cellSize} border-2 border-gray-300 flex items-center justify-center relative transition-all hover:border-gray-500 hover:shadow-md`}
        style={{ backgroundColor: color }}
      >
        {/* Ícone de segurança */}
        {isSafe && (
          <Shield className="w-5 h-5 text-blue-500 absolute" strokeWidth={2.5} />
        )}
        
        {/* Ícone de início */}
        {isStart && (
          <Star className="w-5 h-5 text-yellow-500 absolute" fill="#FCD34D" strokeWidth={2} />
        )}
        
        {/* Número da casa (debug) */}
        {!isSafe && !isStart && (
          <span className="text-[8px] text-gray-400 font-bold">{index}</span>
        )}
        
        {children}
      </div>
    );
  };

  // Renderizar base de jogador
  const PlayerBase = ({ playerIndex }) => {
    const color = colors[playerIndex];
    
    return (
      <div 
        className="w-full h-full p-4 rounded-2xl border-4 relative"
        style={{ 
          backgroundColor: color.light,
          borderColor: color.main
        }}
      >
        {/* Nome do jogador */}
        <div 
          className="absolute top-2 left-2 px-3 py-1 rounded-full text-white font-bold text-xs shadow-lg"
          style={{ backgroundColor: color.main }}
        >
          {color.name}
        </div>
        
        {/* Triângulo decorativo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div 
            className="w-24 h-24 transform rotate-45"
            style={{ backgroundColor: color.main }}
          />
        </div>
        
        {/* Grid 2x2 para peões */}
        <div className="relative z-10 grid grid-cols-2 gap-4 h-full items-center justify-items-center">
          {[0, 1, 2, 3].map(i => (
            <div 
              key={i}
              className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center shadow-lg"
              style={{ backgroundColor: color.main }}
            >
              <Pawn playerIndex={playerIndex} size={20} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Posições das 52 casas do caminho principal
  // Caminho começa na posição 0 (saída do verde) e vai até 51
  const renderMainPath = () => {
    const cells = [];
    const cellSize = 40; // 10 * 4 = 40px
    
    // LADO INFERIOR (casas 0-12) - Da esquerda para direita
    for (let i = 0; i <= 12; i++) {
      const isStart = i === 0; // Saída do Verde
      const isSafe = i === 8;
      cells.push(
        <div key={`bottom-${i}`} style={{ gridColumn: i + 1, gridRow: 13 }}>
          <Cell index={i} isStart={isStart} isSafe={isSafe} />
        </div>
      );
    }
    
    // LADO DIREITO (casas 13-25) - De baixo para cima
    for (let i = 13; i <= 25; i++) {
      const isStart = i === 13; // Saída do Amarelo
      const isSafe = i === 21;
      cells.push(
        <div key={`right-${i}`} style={{ gridColumn: 13, gridRow: 13 - (i - 13) }}>
          <Cell index={i} isStart={isStart} isSafe={isSafe} />
        </div>
      );
    }
    
    // LADO SUPERIOR (casas 26-38) - Da direita para esquerda
    for (let i = 26; i <= 38; i++) {
      const isStart = i === 26; // Saída do Azul
      const isSafe = i === 34;
      cells.push(
        <div key={`top-${i}`} style={{ gridColumn: 13 - (i - 26), gridRow: 1 }}>
          <Cell index={i} isStart={isStart} isSafe={isSafe} />
        </div>
      );
    }
    
    // LADO ESQUERDO (casas 39-51) - De cima para baixo
    for (let i = 39; i <= 51; i++) {
      const isStart = i === 39; // Saída do Vermelho
      const isSafe = i === 47;
      cells.push(
        <div key={`left-${i}`} style={{ gridColumn: 1, gridRow: (i - 39) + 1 }}>
          <Cell index={i} isStart={isStart} isSafe={isSafe} />
        </div>
      );
    }
    
    return cells;
  };

  // Renderizar caminhos finais (setas coloridas)
  const renderFinalPaths = () => {
    const paths = [];
    
    // Caminho final VERDE (horizontal, linha 7)
    for (let i = 0; i < 6; i++) {
      paths.push(
        <div key={`green-final-${i}`} style={{ gridColumn: i + 2, gridRow: 7 }}>
          <Cell index={`G${i}`} color={colors[0].light}>
            {i === 5 && <Trophy className="w-5 h-5 text-white" fill={colors[0].main} />}
          </Cell>
        </div>
      );
    }
    
    // Caminho final AMARELO (vertical, coluna 7)
    for (let i = 0; i < 6; i++) {
      paths.push(
        <div key={`yellow-final-${i}`} style={{ gridColumn: 7, gridRow: i + 2 }}>
          <Cell index={`Y${i}`} color={colors[1].light}>
            {i === 5 && <Trophy className="w-5 h-5 text-white" fill={colors[1].main} />}
          </Cell>
        </div>
      );
    }
    
    // Caminho final AZUL (horizontal, linha 7)
    for (let i = 0; i < 6; i++) {
      paths.push(
        <div key={`blue-final-${i}`} style={{ gridColumn: 12 - i, gridRow: 7 }}>
          <Cell index={`B${i}`} color={colors[2].light}>
            {i === 5 && <Trophy className="w-5 h-5 text-white" fill={colors[2].main} />}
          </Cell>
        </div>
      );
    }
    
    // Caminho final VERMELHO (vertical, coluna 7)
    for (let i = 0; i < 6; i++) {
      paths.push(
        <div key={`red-final-${i}`} style={{ gridColumn: 7, gridRow: 12 - i }}>
          <Cell index={`R${i}`} color={colors[3].light}>
            {i === 5 && <Trophy className="w-5 h-5 text-white" fill={colors[3].main} />}
          </Cell>
        </div>
      );
    }
    
    return paths;
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <div className="relative">
        {/* Grid 13x13 para o tabuleiro */}
        <div 
          className="grid gap-0 bg-white shadow-2xl rounded-2xl p-4 border-8 border-gray-900"
          style={{
            gridTemplateColumns: 'repeat(13, 40px)',
            gridTemplateRows: 'repeat(13, 40px)'
          }}
        >
          {/* Caminho principal (52 casas) */}
          {renderMainPath()}
          
          {/* Caminhos finais (4 x 6 casas) */}
          {renderFinalPaths()}
          
          {/* BASE VERDE - Canto Superior Esquerdo */}
          <div style={{ gridColumn: '2 / 7', gridRow: '2 / 7' }}>
            <PlayerBase playerIndex={0} />
          </div>
          
          {/* BASE AMARELA - Canto Superior Direito */}
          <div style={{ gridColumn: '8 / 13', gridRow: '2 / 7' }}>
            <PlayerBase playerIndex={1} />
          </div>
          
          {/* BASE AZUL - Canto Inferior Direito */}
          <div style={{ gridColumn: '8 / 13', gridRow: '8 / 13' }}>
            <PlayerBase playerIndex={2} />
          </div>
          
          {/* BASE VERMELHA - Canto Inferior Esquerdo */}
          <div style={{ gridColumn: '2 / 7', gridRow: '8 / 13' }}>
            <PlayerBase playerIndex={3} />
          </div>
          
          {/* CENTRO - Quadrado central */}
          <div style={{ gridColumn: '7 / 8', gridRow: '7 / 8' }}>
            <motion.div
              className="w-10 h-10 rounded-lg flex items-center justify-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #10B981, #F59E0B, #3B82F6, #EF4444)'
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              {/* Triângulos apontando para cada base */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 40 40">
                <polygon points="20,8 15,18 25,18" fill={colors[0].main} />
                <polygon points="32,20 22,15 22,25" fill={colors[1].main} />
                <polygon points="20,32 15,22 25,22" fill={colors[2].main} />
                <polygon points="8,20 18,15 18,25" fill={colors[3].main} />
              </svg>
              
              <HomeIcon className="w-6 h-6 text-white z-10" fill="white" />
            </motion.div>
          </div>
        </div>
        
        {/* Legenda */}
        <div className="mt-4 flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" fill="#FCD34D" />
            <span className="text-white">Início</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="text-white">Segura</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-white">Chegada</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardLudoCompleto;
