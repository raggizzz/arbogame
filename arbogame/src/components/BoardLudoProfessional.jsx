import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Star, Trophy, HelpCircle, Heart, Droplets, Zap, Crown } from 'lucide-react';
import useGameStore from '../store/gameStore';

const BoardLudoProfessional = () => {
  const { board, players, currentPlayerIndex } = useGameStore();
  
  if (!board || !players) return null;

  // Cores vibrantes e profissionais
  const colors = {
    0: { main: '#10B981', light: '#D1FAE5', dark: '#059669', glow: 'rgba(16, 185, 129, 0.5)' },
    1: { main: '#F59E0B', light: '#FEF3C7', dark: '#D97706', glow: 'rgba(245, 158, 11, 0.5)' },
    2: { main: '#EF4444', light: '#FEE2E2', dark: '#DC2626', glow: 'rgba(239, 68, 68, 0.5)' },
    3: { main: '#3B82F6', light: '#DBEAFE', dark: '#2563EB', glow: 'rgba(59, 130, 246, 0.5)' }
  };

  // Obter peões em uma posição específica
  const getPawnsAtPosition = (location, position) => {
    const pawns = [];
    players.forEach(player => {
      player.pawns?.forEach(pawn => {
        if (pawn.location === location && pawn.position === position && !pawn.finished) {
          pawns.push({ ...pawn, playerIndex: player.id, color: colors[player.id] });
        }
      });
    });
    return pawns;
  };

  // Renderizar peão individual
  const Pawn = ({ playerIndex, isActive, size = 20, index = 0 }) => {
    const color = colors[playerIndex];
    const offset = index * 3; // Offset para múltiplos peões
    
    return (
      <motion.div
        className="absolute rounded-full border-3 shadow-xl cursor-pointer"
        style={{ 
          width: size,
          height: size,
          backgroundColor: color.main,
          borderColor: 'white',
          borderWidth: '3px',
          left: `calc(50% - ${size/2}px + ${offset}px)`,
          top: `calc(50% - ${size/2}px + ${offset}px)`,
          zIndex: 10 + index
        }}
        whileHover={{ scale: 1.3, zIndex: 50 }}
        animate={isActive ? { 
          scale: [1, 1.2, 1],
          boxShadow: [
            `0 0 0 0 ${color.glow}`,
            `0 0 0 10px ${color.glow}`,
            `0 0 0 0 ${color.glow}`
          ]
        } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {/* Brilho */}
        <div 
          className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white opacity-70"
        />
        {/* Coroa se for o jogador atual */}
        {isActive && (
          <Crown 
            className="absolute -top-2 -right-2 w-4 h-4 text-yellow-400" 
            fill="#FCD34D"
          />
        )}
      </motion.div>
    );
  };

  // Renderizar casa do caminho
  const Cell = ({ index, color = 'white', isFinal = false, isStart = false, isSafe = false }) => {
    const pawns = getPawnsAtPosition(isFinal ? 'final' : 'main', index);
    const hasIcon = isStart || isSafe || (index % 5 === 0 && index > 0);
    
    return (
      <motion.div 
        className="relative border-2 border-gray-400 flex items-center justify-center rounded-md overflow-visible"
        style={{ 
          backgroundColor: color,
          width: '50px',
          height: '50px'
        }}
        whileHover={{ 
          scale: 1.05,
          borderColor: '#1F2937',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}
      >
        {/* Ícones de casa especial */}
        {isStart && (
          <Star className="w-6 h-6 text-yellow-500 absolute" fill="#FCD34D" strokeWidth={2} />
        )}
        {isSafe && !isStart && (
          <Shield className="w-6 h-6 text-blue-500 absolute" strokeWidth={2.5} />
        )}
        {!isStart && !isSafe && index % 5 === 0 && index > 0 && (
          <HelpCircle className="w-5 h-5 text-purple-500 absolute" strokeWidth={2} />
        )}
        {!isStart && !isSafe && index % 7 === 0 && index > 0 && (
          <Droplets className="w-5 h-5 text-red-500 absolute" strokeWidth={2} />
        )}
        
        {/* Número da casa */}
        {!hasIcon && !isFinal && (
          <span className="text-[9px] text-gray-500 font-bold absolute top-1 left-1">
            {index}
          </span>
        )}
        
        {/* Peões nesta casa */}
        <AnimatePresence>
          {pawns.map((pawn, idx) => (
            <Pawn 
              key={`${pawn.playerIndex}-${pawn.id}`}
              playerIndex={pawn.playerIndex}
              isActive={pawn.playerIndex === currentPlayerIndex}
              size={22}
              index={idx}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    );
  };

  // Renderizar base de jogador
  const PlayerBase = ({ playerIndex }) => {
    const color = colors[playerIndex];
    const player = players[playerIndex];
    const basePawns = player?.pawns?.filter(p => p.location === 'base') || [];
    
    return (
      <motion.div 
        className="w-full h-full p-4 rounded-2xl border-4 relative overflow-hidden"
        style={{ 
          backgroundColor: color.light,
          borderColor: color.main,
          boxShadow: `0 8px 32px ${color.glow}`
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: playerIndex * 0.1 }}
      >
        {/* Nome do jogador */}
        <motion.div 
          className="absolute top-2 left-2 right-2 px-3 py-2 rounded-xl text-white text-center shadow-xl z-20"
          style={{ backgroundColor: color.main }}
          animate={playerIndex === currentPlayerIndex ? {
            scale: [1, 1.05, 1],
            boxShadow: [
              `0 4px 12px ${color.glow}`,
              `0 8px 24px ${color.glow}`,
              `0 4px 12px ${color.glow}`
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-sm font-bold">{player?.name || `Jogador ${playerIndex + 1}`}</div>
          <div className="text-[10px] opacity-90">
            {basePawns.length} peões na base
          </div>
        </motion.div>
        
        {/* Triângulo decorativo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-15">
          <svg width="120" height="120" viewBox="0 0 100 100">
            <polygon 
              points="50,15 15,85 85,85" 
              fill={color.main}
            />
          </svg>
        </div>
        
        {/* Grid 2x2 para peões */}
        <div className="relative z-10 grid grid-cols-2 gap-4 h-full items-center justify-items-center pt-14">
          {[0, 1, 2, 3].map(i => {
            const hasPawn = basePawns.some(p => p.position === i);
            return (
              <motion.div 
                key={i}
                className="w-16 h-16 rounded-full border-4 flex items-center justify-center shadow-xl relative"
                style={{ 
                  backgroundColor: hasPawn ? 'white' : color.light,
                  borderColor: color.dark
                }}
                whileHover={{ scale: 1.1 }}
              >
                {hasPawn && (
                  <Pawn 
                    playerIndex={playerIndex}
                    isActive={playerIndex === currentPlayerIndex}
                    size={24}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  // Renderizar caminho principal (52 casas)
  const renderMainPath = () => {
    const cells = [];
    
    // INFERIOR (0-12)
    for (let i = 0; i <= 12; i++) {
      cells.push(
        <div key={`b${i}`} style={{ gridColumn: i + 1, gridRow: 13 }}>
          <Cell index={i} isStart={i === 0} isSafe={i === 8} />
        </div>
      );
    }
    
    // DIREITA (13-25)
    for (let i = 13; i <= 25; i++) {
      cells.push(
        <div key={`r${i}`} style={{ gridColumn: 13, gridRow: 13 - (i - 13) }}>
          <Cell index={i} isStart={i === 13} isSafe={i === 21} />
        </div>
      );
    }
    
    // SUPERIOR (26-38)
    for (let i = 26; i <= 38; i++) {
      cells.push(
        <div key={`t${i}`} style={{ gridColumn: 13 - (i - 26), gridRow: 1 }}>
          <Cell index={i} isStart={i === 26} isSafe={i === 34} />
        </div>
      );
    }
    
    // ESQUERDA (39-51)
    for (let i = 39; i <= 51; i++) {
      cells.push(
        <div key={`l${i}`} style={{ gridColumn: 1, gridRow: (i - 39) + 1 }}>
          <Cell index={i} isStart={i === 39} isSafe={i === 47} />
        </div>
      );
    }
    
    return cells;
  };

  // Renderizar caminhos finais
  const renderFinalPaths = () => {
    const paths = [];
    
    // Verde
    for (let i = 0; i < 6; i++) {
      const pawns = getPawnsAtPosition('final', i);
      const hasGreenPawn = pawns.some(p => p.playerIndex === 0);
      paths.push(
        <div key={`gf${i}`} style={{ gridColumn: i + 2, gridRow: 7 }}>
          <Cell index={i} color={colors[0].light} isFinal />
        </div>
      );
    }
    
    // Amarelo
    for (let i = 0; i < 6; i++) {
      paths.push(
        <div key={`yf${i}`} style={{ gridColumn: 7, gridRow: i + 2 }}>
          <Cell index={i} color={colors[1].light} isFinal />
        </div>
      );
    }
    
    // Vermelho
    for (let i = 0; i < 6; i++) {
      paths.push(
        <div key={`rf${i}`} style={{ gridColumn: 12 - i, gridRow: 7 }}>
          <Cell index={i} color={colors[2].light} isFinal />
        </div>
      );
    }
    
    // Azul
    for (let i = 0; i < 6; i++) {
      paths.push(
        <div key={`bf${i}`} style={{ gridColumn: 7, gridRow: 12 - i }}>
          <Cell index={i} color={colors[3].light} isFinal />
        </div>
      );
    }
    
    return paths;
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="relative">
        {/* Grid 13x13 MAIOR */}
        <motion.div 
          className="grid gap-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl rounded-3xl p-6 border-8 border-gray-950"
          style={{
            gridTemplateColumns: 'repeat(13, 50px)',
            gridTemplateRows: 'repeat(13, 50px)'
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Caminho principal */}
          {renderMainPath()}
          
          {/* Caminhos finais */}
          {renderFinalPaths()}
          
          {/* BASES */}
          <div style={{ gridColumn: '2 / 7', gridRow: '2 / 7' }}>
            <PlayerBase playerIndex={0} />
          </div>
          
          <div style={{ gridColumn: '8 / 13', gridRow: '2 / 7' }}>
            <PlayerBase playerIndex={1} />
          </div>
          
          <div style={{ gridColumn: '2 / 7', gridRow: '8 / 13' }}>
            <PlayerBase playerIndex={2} />
          </div>
          
          <div style={{ gridColumn: '8 / 13', gridRow: '8 / 13' }}>
            <PlayerBase playerIndex={3} />
          </div>
          
          {/* CENTRO */}
          <div style={{ gridColumn: '7 / 8', gridRow: '7 / 8' }}>
            <motion.div
              className="w-[50px] h-[50px] rounded-xl flex items-center justify-center relative overflow-hidden shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #10B981 0%, #F59E0B 25%, #EF4444 50%, #3B82F6 75%, #10B981 100%)',
                backgroundSize: '200% 200%'
              }}
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: 'linear' 
              }}
            >
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 50 50">
                <polygon points="25,10 18,22 32,22" fill={colors[0].main} opacity="0.9" />
                <polygon points="40,25 28,18 28,32" fill={colors[1].main} opacity="0.9" />
                <polygon points="25,40 18,28 32,28" fill={colors[2].main} opacity="0.9" />
                <polygon points="10,25 22,18 22,32" fill={colors[3].main} opacity="0.9" />
              </svg>
              
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Zap className="w-7 h-7 text-white z-10 drop-shadow-2xl" fill="white" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Legenda Profissional */}
        <motion.div 
          className="mt-4 flex justify-center gap-3 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {[
            { icon: Star, label: 'Início', color: '#FCD34D' },
            { icon: Shield, label: 'Segura', color: '#3B82F6' },
            { icon: HelpCircle, label: 'Quiz', color: '#A855F7' },
            { icon: Droplets, label: 'Criadouro', color: '#EF4444' },
            { icon: Heart, label: 'Saúde', color: '#EC4899' },
            { icon: Trophy, label: 'Chegada', color: '#F59E0B' }
          ].map(({ icon: Icon, label, color }) => (
            <motion.div 
              key={label}
              className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-xl shadow-lg border border-gray-700"
              whileHover={{ scale: 1.05, backgroundColor: '#374151' }}
            >
              <Icon className="w-4 h-4" style={{ color }} strokeWidth={2.5} />
              <span className="text-xs text-white font-semibold">{label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BoardLudoProfessional;
