import { motion } from 'framer-motion';
import { Shield, Star, Home as HomeIcon, Trophy, HelpCircle, Heart, AlertTriangle, Droplets, Zap } from 'lucide-react';
import useGameStore from '../store/gameStore';

const BoardLudoDengue = () => {
  const { board, players, currentPlayerIndex } = useGameStore();
  
  if (!board || !players) return null;

  // Cores das regiões do DF
  const regions = {
    0: { 
      main: '#10B981', 
      light: '#D1FAE5', 
      dark: '#059669', 
      name: 'Ceilândia',
      subtitle: 'Educação e Comunidade'
    },
    1: { 
      main: '#F59E0B', 
      light: '#FEF3C7', 
      dark: '#D97706', 
      name: 'Plano Piloto',
      subtitle: 'Ciência e Prevenção'
    },
    2: { 
      main: '#EF4444', 
      light: '#FEE2E2', 
      dark: '#DC2626', 
      name: 'Samambaia',
      subtitle: 'Alerta e Ação'
    },
    3: { 
      main: '#3B82F6', 
      light: '#DBEAFE', 
      dark: '#2563EB', 
      name: 'Taguatinga',
      subtitle: 'Coleta e Limpeza'
    }
  };

  // Tipos de casas especiais
  const getCellIcon = (index) => {
    // Casas de início (saída)
    if ([0, 13, 26, 39].includes(index)) {
      return <Star className="w-4 h-4 text-yellow-500" fill="#FCD34D" />;
    }
    // Casas seguras
    if ([8, 21, 34, 47].includes(index)) {
      return <Shield className="w-4 h-4 text-blue-500" />;
    }
    // Quiz (a cada 5 casas)
    if (index % 5 === 0 && index > 0) {
      return <HelpCircle className="w-4 h-4 text-purple-500" />;
    }
    // Criadouro (a cada 7 casas)
    if (index % 7 === 0 && index > 0) {
      return <Droplets className="w-4 h-4 text-red-500" />;
    }
    // Saúde (a cada 9 casas)
    if (index % 9 === 0 && index > 0) {
      return <Heart className="w-4 h-4 text-pink-500" />;
    }
    // Mosquito (a cada 11 casas)
    if (index % 11 === 0 && index > 0) {
      return <span className="text-sm">🦟</span>;
    }
    return null;
  };

  // Renderizar peão
  const Pawn = ({ playerIndex, size = 14 }) => (
    <motion.div
      className="rounded-full border-2 border-white shadow-lg relative"
      style={{ 
        width: size,
        height: size,
        backgroundColor: regions[playerIndex].main
      }}
      whileHover={{ scale: 1.4 }}
      animate={{ 
        scale: playerIndex === currentPlayerIndex ? [1, 1.2, 1] : 1,
        boxShadow: playerIndex === currentPlayerIndex 
          ? ['0 0 0 0 rgba(255,255,255,0.7)', '0 0 0 8px rgba(255,255,255,0)']
          : '0 4px 6px rgba(0,0,0,0.1)'
      }}
      transition={{ duration: 1, repeat: Infinity }}
    >
      {/* Brilho */}
      <div 
        className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-white opacity-60"
      />
    </motion.div>
  );

  // Renderizar casa do caminho
  const Cell = ({ index, color = 'white', isFinal = false, children }) => {
    const icon = !isFinal ? getCellIcon(index) : null;
    const hasIcon = icon !== null;
    
    return (
      <motion.div 
        className="w-9 h-9 border border-gray-300 flex items-center justify-center relative transition-all hover:border-gray-500 hover:shadow-md rounded-sm"
        style={{ backgroundColor: color }}
        whileHover={{ scale: 1.05 }}
      >
        {/* Ícone da casa */}
        {hasIcon && (
          <div className="absolute inset-0 flex items-center justify-center">
            {icon}
          </div>
        )}
        
        {/* Número da casa (pequeno, canto) */}
        {!hasIcon && !isFinal && (
          <span className="text-[7px] text-gray-400 font-bold absolute top-0.5 left-0.5">
            {index}
          </span>
        )}
        
        {children}
      </motion.div>
    );
  };

  // Renderizar base de jogador
  const PlayerBase = ({ playerIndex }) => {
    const region = regions[playerIndex];
    
    return (
      <div 
        className="w-full h-full p-3 rounded-xl border-4 relative overflow-hidden"
        style={{ 
          backgroundColor: region.light,
          borderColor: region.main
        }}
      >
        {/* Cabeçalho da região */}
        <div 
          className="absolute top-1 left-1 right-1 px-2 py-1 rounded-lg text-white text-center shadow-lg"
          style={{ backgroundColor: region.main }}
        >
          <div className="text-[10px] font-bold">{region.name}</div>
          <div className="text-[7px] opacity-80">{region.subtitle}</div>
        </div>
        
        {/* Triângulo decorativo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <svg width="80" height="80" viewBox="0 0 100 100">
            <polygon 
              points="50,10 10,90 90,90" 
              fill={region.main}
            />
          </svg>
        </div>
        
        {/* Grid 2x2 para peões */}
        <div className="relative z-10 grid grid-cols-2 gap-3 h-full items-center justify-items-center pt-8">
          {[0, 1, 2, 3].map(i => (
            <div 
              key={i}
              className="w-12 h-12 rounded-full border-3 flex items-center justify-center shadow-lg"
              style={{ 
                backgroundColor: 'white',
                borderColor: region.dark,
                borderWidth: '3px'
              }}
            >
              <Pawn playerIndex={playerIndex} size={18} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar caminho principal (52 casas)
  const renderMainPath = () => {
    const cells = [];
    
    // LADO INFERIOR (0-12) - Esquerda → Direita
    for (let i = 0; i <= 12; i++) {
      cells.push(
        <div key={`b-${i}`} style={{ gridColumn: i + 1, gridRow: 13 }}>
          <Cell index={i} />
        </div>
      );
    }
    
    // LADO DIREITO (13-25) - Baixo → Cima
    for (let i = 13; i <= 25; i++) {
      cells.push(
        <div key={`r-${i}`} style={{ gridColumn: 13, gridRow: 13 - (i - 13) }}>
          <Cell index={i} />
        </div>
      );
    }
    
    // LADO SUPERIOR (26-38) - Direita → Esquerda
    for (let i = 26; i <= 38; i++) {
      cells.push(
        <div key={`t-${i}`} style={{ gridColumn: 13 - (i - 26), gridRow: 1 }}>
          <Cell index={i} />
        </div>
      );
    }
    
    // LADO ESQUERDO (39-51) - Cima → Baixo
    for (let i = 39; i <= 51; i++) {
      cells.push(
        <div key={`l-${i}`} style={{ gridColumn: 1, gridRow: (i - 39) + 1 }}>
          <Cell index={i} />
        </div>
      );
    }
    
    return cells;
  };

  // Renderizar caminhos finais
  const renderFinalPaths = () => {
    const paths = [];
    
    // Verde (horizontal)
    for (let i = 0; i < 6; i++) {
      paths.push(
        <div key={`gf-${i}`} style={{ gridColumn: i + 2, gridRow: 7 }}>
          <Cell index={`G${i}`} color={regions[0].light} isFinal>
            {i === 5 && <Trophy className="w-4 h-4 text-white" fill={regions[0].main} />}
          </Cell>
        </div>
      );
    }
    
    // Amarelo (vertical)
    for (let i = 0; i < 6; i++) {
      paths.push(
        <div key={`yf-${i}`} style={{ gridColumn: 7, gridRow: i + 2 }}>
          <Cell index={`Y${i}`} color={regions[1].light} isFinal>
            {i === 5 && <Trophy className="w-4 h-4 text-white" fill={regions[1].main} />}
          </Cell>
        </div>
      );
    }
    
    // Vermelho (horizontal)
    for (let i = 0; i < 6; i++) {
      paths.push(
        <div key={`rf-${i}`} style={{ gridColumn: 12 - i, gridRow: 7 }}>
          <Cell index={`R${i}`} color={regions[2].light} isFinal>
            {i === 5 && <Trophy className="w-4 h-4 text-white" fill={regions[2].main} />}
          </Cell>
        </div>
      );
    }
    
    // Azul (vertical)
    for (let i = 0; i < 6; i++) {
      paths.push(
        <div key={`bf-${i}`} style={{ gridColumn: 7, gridRow: 12 - i }}>
          <Cell index={`B${i}`} color={regions[3].light} isFinal>
            {i === 5 && <Trophy className="w-4 h-4 text-white" fill={regions[3].main} />}
          </Cell>
        </div>
      );
    }
    
    return paths;
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <div className="relative">
        {/* Grid 13x13 */}
        <div 
          className="grid gap-0 bg-gradient-to-br from-gray-50 to-gray-100 shadow-2xl rounded-2xl p-3 border-8 border-gray-900"
          style={{
            gridTemplateColumns: 'repeat(13, 36px)',
            gridTemplateRows: 'repeat(13, 36px)'
          }}
        >
          {/* Caminho principal (52 casas) */}
          {renderMainPath()}
          
          {/* Caminhos finais (24 casas) */}
          {renderFinalPaths()}
          
          {/* BASE VERDE - Superior Esquerdo */}
          <div style={{ gridColumn: '2 / 7', gridRow: '2 / 7' }}>
            <PlayerBase playerIndex={0} />
          </div>
          
          {/* BASE AMARELA - Superior Direito */}
          <div style={{ gridColumn: '8 / 13', gridRow: '2 / 7' }}>
            <PlayerBase playerIndex={1} />
          </div>
          
          {/* BASE VERMELHA - Inferior Esquerdo */}
          <div style={{ gridColumn: '2 / 7', gridRow: '8 / 13' }}>
            <PlayerBase playerIndex={2} />
          </div>
          
          {/* BASE AZUL - Inferior Direito */}
          <div style={{ gridColumn: '8 / 13', gridRow: '8 / 13' }}>
            <PlayerBase playerIndex={3} />
          </div>
          
          {/* CENTRO - Santuário Livre de Dengue */}
          <div style={{ gridColumn: '7 / 8', gridRow: '7 / 8' }}>
            <motion.div
              className="w-9 h-9 rounded-lg flex items-center justify-center relative overflow-hidden shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #10B981 0%, #F59E0B 25%, #EF4444 50%, #3B82F6 75%, #10B981 100%)'
              }}
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity, 
                ease: 'linear' 
              }}
            >
              {/* Triângulos coloridos */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 36 36">
                <polygon points="18,6 12,16 24,16" fill={regions[0].main} opacity="0.8" />
                <polygon points="30,18 20,12 20,24" fill={regions[1].main} opacity="0.8" />
                <polygon points="18,30 12,20 24,20" fill={regions[2].main} opacity="0.8" />
                <polygon points="6,18 16,12 16,24" fill={regions[3].main} opacity="0.8" />
              </svg>
              
              {/* Ícone central */}
              <Zap className="w-5 h-5 text-white z-10 drop-shadow-lg" fill="white" />
            </motion.div>
          </div>
        </div>
        
        {/* Legenda */}
        <div className="mt-3 flex justify-center gap-4 text-xs flex-wrap">
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg shadow">
            <Star className="w-3 h-3 text-yellow-500" fill="#FCD34D" />
            <span className="text-gray-700 font-medium">Início</span>
          </div>
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg shadow">
            <Shield className="w-3 h-3 text-blue-500" />
            <span className="text-gray-700 font-medium">Segura</span>
          </div>
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg shadow">
            <HelpCircle className="w-3 h-3 text-purple-500" />
            <span className="text-gray-700 font-medium">Quiz</span>
          </div>
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg shadow">
            <Droplets className="w-3 h-3 text-red-500" />
            <span className="text-gray-700 font-medium">Criadouro</span>
          </div>
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg shadow">
            <Heart className="w-3 h-3 text-pink-500" />
            <span className="text-gray-700 font-medium">Saúde</span>
          </div>
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg shadow">
            <span className="text-sm">🦟</span>
            <span className="text-gray-700 font-medium">Mosquito</span>
          </div>
        </div>
        
        {/* Título do Santuário */}
        <div className="mt-2 text-center">
          <div className="text-sm font-bold text-white drop-shadow-lg">
            ⚡ Santuário Livre de Dengue ⚡
          </div>
          <div className="text-xs text-gray-300">
            Distrito Federal - Combate à Dengue
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardLudoDengue;
