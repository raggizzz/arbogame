import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Star, Trophy, HelpCircle, Droplets, Crown, Bug, Target } from 'lucide-react';
import useGameStore from '../store/gameStore';

const BoardLudoPhysical = () => {
  const { board, players, currentPlayerIndex, diceValue } = useGameStore();
  
  if (!board || !players) return null;

  // Cores EXATAS do Ludo físico
  const colors = {
    0: { // VERMELHO (Canto Inferior Esquerdo)
      main: '#DC2626',
      light: '#FEE2E2',
      dark: '#991B1B',
      glow: 'rgba(220, 38, 38, 0.6)'
    },
    1: { // VERDE (Canto Superior Esquerdo)
      main: '#16A34A',
      light: '#D1FAE5',
      dark: '#166534',
      glow: 'rgba(22, 163, 74, 0.6)'
    },
    2: { // AZUL (Canto Inferior Direito)
      main: '#2563EB',
      light: '#DBEAFE',
      dark: '#1E40AF',
      glow: 'rgba(37, 99, 235, 0.6)'
    },
    3: { // AMARELO (Canto Superior Direito)
      main: '#EAB308',
      light: '#FEF3C7',
      dark: '#A16207',
      glow: 'rgba(234, 179, 8, 0.6)'
    }
  };

  // Obter peões em uma posição
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

  // Renderizar peão CIRCULAR
  const Pawn = ({ playerIndex, isActive, size = 22, index = 0 }) => {
    const color = colors[playerIndex];
    const offset = index * 4;
    
    return (
      <motion.div
        className="absolute cursor-pointer"
        style={{ 
          left: `calc(50% - ${size/2}px + ${offset}px)`,
          top: `calc(50% - ${size/2}px + ${offset}px)`,
          zIndex: 30 + index
        }}
        whileHover={{ scale: 1.25 }}
        initial={{ scale: 0 }}
        animate={{ 
          scale: 1,
          ...(isActive && { y: [0, -5, 0] })
        }}
        transition={{ duration: isActive ? 1 : 0.4, repeat: isActive ? Infinity : 0 }}
      >
        {/* Sombra */}
        <div 
          className="absolute blur-md"
          style={{
            width: size * 0.8,
            height: size * 0.4,
            backgroundColor: 'rgba(0,0,0,0.3)',
            top: size * 0.7,
            borderRadius: '50%'
          }}
        />
        
        {/* Peão */}
        <div
          className="rounded-full border-2 border-white relative"
          style={{ 
            width: size,
            height: size,
            background: `radial-gradient(circle at 35% 35%, ${color.light}, ${color.main})`,
            boxShadow: `0 4px 12px ${color.glow}, inset 0 2px 4px rgba(255,255,255,0.5)`
          }}
        >
          {isActive && (
            <motion.div
              className="absolute -top-3 -right-3"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Crown className="w-4 h-4 text-yellow-400" fill="#FCD34D" />
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  // Renderizar casa QUADRADA
  const Cell = ({ index, playerColor = null, isFinal = false, isStart = false, isSafe = false, hasArrow = false }) => {
    const pawns = getPawnsAtPosition(isFinal ? 'final' : 'main', index);
    const hasQuiz = !isFinal && !isStart && index % 5 === 0 && index > 0;
    const hasMosquito = !isFinal && !isStart && index % 7 === 0 && index > 0;
    
    let cellBg = 'white';
    let borderColor = '#D1D5DB';
    
    if (playerColor !== null) {
      cellBg = colors[playerColor].light;
      borderColor = colors[playerColor].main;
    }
    
    return (
      <motion.div 
        className="aspect-square relative flex items-center justify-center"
        style={{ 
          background: cellBg,
          border: `1px solid ${borderColor}`,
          width: '35px',
          height: '35px'
        }}
        whileHover={{ scale: 1.05, zIndex: 20 }}
      >
        {/* Seta de entrada */}
        {hasArrow && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Target className="w-4 h-4" style={{ color: borderColor }} />
          </div>
        )}
        
        {/* Estrela de início */}
        {isStart && (
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
            <Star className="w-4 h-4 text-yellow-500" fill="#FCD34D" />
          </motion.div>
        )}
        
        {/* Escudo de segurança */}
        {isSafe && !isStart && (
          <Shield className="w-4 h-4 text-blue-500" strokeWidth={2.5} />
        )}
        
        {/* Ícones educativos */}
        {hasQuiz && <HelpCircle className="w-4 h-4 text-purple-500" />}
        {hasMosquito && <Bug className="w-4 h-4 text-red-500" />}
        
        {/* Peões */}
        <AnimatePresence>
          {pawns.map((pawn, idx) => (
            <Pawn 
              key={`${pawn.playerIndex}-${pawn.id}-${index}`}
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

  // Renderizar base
  const PlayerBase = ({ playerIndex }) => {
    const color = colors[playerIndex];
    const player = players[playerIndex];
    const basePawns = player?.pawns?.filter(p => p.location === 'base') || [];
    const isCurrentPlayer = playerIndex === currentPlayerIndex;
    
    return (
      <div 
        className="w-full h-full p-3 flex flex-col items-center justify-center relative"
        style={{ backgroundColor: color.main }}
      >
        {/* Nome */}
        <div className="text-white font-bold text-xs mb-2">
          {player?.name || `P${playerIndex + 1}`}
        </div>
        
        {/* Grid 2x2 para peões */}
        <div 
          className="bg-white rounded-lg p-2 grid grid-cols-2 gap-2"
          style={{ width: '120px', height: '120px' }}
        >
          {[0, 1, 2, 3].map(i => {
            const pawn = basePawns.find(p => p.position === i);
            return (
              <div 
                key={i}
                className="rounded-full border-2 flex items-center justify-center relative"
                style={{ 
                  borderColor: color.main,
                  backgroundColor: pawn ? color.light : 'transparent'
                }}
              >
                {pawn && <Pawn playerIndex={playerIndex} isActive={isCurrentPlayer} size={24} />}
              </div>
            );
          })}
        </div>
        
        {/* Pontuação */}
        <div className="text-white font-bold text-xs mt-2">
          🏆 {player?.score || 0}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 bg-gradient-to-br from-green-800 via-teal-700 to-blue-900">
      <div className="relative">
        {/* Grid 15x15 - LAYOUT EXATO DO LUDO FÍSICO */}
        <motion.div 
          className="grid bg-white shadow-2xl relative"
          style={{
            gridTemplateColumns: 'repeat(15, 35px)',
            gridTemplateRows: 'repeat(15, 35px)',
            gap: '0px'
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* ========== BASES (4 CANTOS) ========== */}
          
          {/* Base VERDE - Canto Superior Esquerdo */}
          <div style={{ gridColumn: '1 / 7', gridRow: '1 / 7' }}>
            <PlayerBase playerIndex={1} />
          </div>
          
          {/* Base AMARELA - Canto Superior Direito */}
          <div style={{ gridColumn: '10 / 16', gridRow: '1 / 7' }}>
            <PlayerBase playerIndex={3} />
          </div>
          
          {/* Base VERMELHA - Canto Inferior Esquerdo */}
          <div style={{ gridColumn: '1 / 7', gridRow: '10 / 16' }}>
            <PlayerBase playerIndex={0} />
          </div>
          
          {/* Base AZUL - Canto Inferior Direito */}
          <div style={{ gridColumn: '10 / 16', gridRow: '10 / 16' }}>
            <PlayerBase playerIndex={2} />
          </div>
          
          {/* ========== CAMINHO EXTERNO - 52 CASAS BRANCAS ========== */}
          
          {/* BRAÇO ESQUERDO INFERIOR - Horizontal (casas 0-5) - Saída VERMELHA */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={`h1-${i}`} style={{ gridColumn: i + 1, gridRow: 9 }}>
              <Cell index={i} isStart={i === 1} playerColor={i === 1 ? 0 : null} hasArrow={i === 1} />
            </div>
          ))}
          
          {/* COLUNA ESQUERDA - Vertical subindo (casas 6-11) */}
          {[6, 7, 8, 9, 10, 11].map((i, idx) => (
            <div key={`v1-${i}`} style={{ gridColumn: 7, gridRow: 9 - idx }}>
              <Cell index={i} isSafe={i === 8} />
            </div>
          ))}
          
          {/* BRAÇO SUPERIOR ESQUERDO - Horizontal (casas 12-17) - Saída VERDE */}
          {[12, 13, 14, 15, 16, 17].map((i, idx) => (
            <div key={`h2-${i}`} style={{ gridColumn: 7 - idx, gridRow: 1 }}>
              <Cell index={i} isStart={i === 13} playerColor={i === 13 ? 1 : null} hasArrow={i === 13} />
            </div>
          ))}
          
          {/* COLUNA ESQUERDA SUPERIOR - Vertical descendo (casas 18-23) */}
          {[18, 19, 20, 21, 22, 23].map((i, idx) => (
            <div key={`v2-${i}`} style={{ gridColumn: 1, gridRow: idx + 1 }}>
              <Cell index={i} isSafe={i === 21} />
            </div>
          ))}
          
          {/* BRAÇO SUPERIOR DIREITO - Horizontal (casas 24-29) - Saída AMARELA */}
          {[24, 25, 26, 27, 28, 29].map((i, idx) => (
            <div key={`h3-${i}`} style={{ gridColumn: idx + 1, gridRow: 7 }}>
              <Cell index={i} isStart={i === 26} playerColor={i === 26 ? 3 : null} hasArrow={i === 26} />
            </div>
          ))}
          
          {/* COLUNA DIREITA SUPERIOR - Vertical descendo (casas 30-35) */}
          {[30, 31, 32, 33, 34, 35].map((i, idx) => (
            <div key={`v3-${i}`} style={{ gridColumn: 9, gridRow: idx + 1 }}>
              <Cell index={i} isSafe={i === 34} />
            </div>
          ))}
          
          {/* BRAÇO DIREITO SUPERIOR - Horizontal (casas 36-41) - Saída AZUL */}
          {[36, 37, 38, 39, 40, 41].map((i, idx) => (
            <div key={`h4-${i}`} style={{ gridColumn: 15 - idx, gridRow: 9 }}>
              <Cell index={i} isStart={i === 39} playerColor={i === 39 ? 2 : null} hasArrow={i === 39} />
            </div>
          ))}
          
          {/* COLUNA DIREITA - Vertical descendo (casas 42-47) */}
          {[42, 43, 44, 45, 46, 47].map((i, idx) => (
            <div key={`v4-${i}`} style={{ gridColumn: 9, gridRow: 9 + idx }}>
              <Cell index={i} isSafe={i === 47} />
            </div>
          ))}
          
          {/* BRAÇO INFERIOR DIREITO - Horizontal (casas 48-51) */}
          {[48, 49, 50, 51].map((i, idx) => (
            <div key={`h5-${i}`} style={{ gridColumn: 9 + idx, gridRow: 15 }}>
              <Cell index={i} />
            </div>
          ))}
          
          {/* ========== CAMINHOS FINAIS COLORIDOS - 6 CASAS CADA ========== */}
          
          {/* VERMELHO - Horizontal (esquerda → centro) */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={`rf${i}`} style={{ gridColumn: i + 2, gridRow: 8 }}>
              <Cell index={i} playerColor={0} isFinal />
            </div>
          ))}
          
          {/* VERDE - Vertical (cima → centro) */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={`gf${i}`} style={{ gridColumn: 8, gridRow: i + 2 }}>
              <Cell index={i} playerColor={1} isFinal />
            </div>
          ))}
          
          {/* AMARELO - Vertical (cima → centro) */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={`yf${i}`} style={{ gridColumn: 8, gridRow: 7 - i }}>
              <Cell index={i} playerColor={3} isFinal />
            </div>
          ))}
          
          {/* AZUL - Horizontal (direita → centro) */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={`bf${i}`} style={{ gridColumn: 14 - i, gridRow: 8 }}>
              <Cell index={i} playerColor={2} isFinal />
            </div>
          ))}
          
          {/* ========== CENTRO - LOSANGO COM 4 TRIÂNGULOS ========== */}
          <div style={{ gridColumn: '8 / 9', gridRow: '8 / 9' }}>
            <div
              className="w-[35px] h-[35px] flex items-center justify-center relative"
              style={{ backgroundColor: 'white' }}
            >
              {/* Triângulos coloridos */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 35 35">
                {/* Verde - Superior */}
                <polygon points="17.5,5 5,17.5 30,17.5" fill={colors[1].main} />
                {/* Vermelho - Esquerdo */}
                <polygon points="5,17.5 17.5,5 17.5,30" fill={colors[0].main} />
                {/* Amarelo - Superior Direito */}
                <polygon points="30,17.5 17.5,5 17.5,30" fill={colors[3].main} />
                {/* Azul - Inferior */}
                <polygon points="17.5,30 5,17.5 30,17.5" fill={colors[2].main} />
              </svg>
              
              {/* Troféu */}
              <motion.div
                className="relative z-10"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Trophy className="w-5 h-5 text-yellow-400" fill="#FCD34D" />
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Dado */}
        {diceValue && (
          <motion.div
            className="absolute -top-8 -right-8 bg-white text-gray-800 font-black text-2xl w-16 h-16 rounded-xl flex items-center justify-center border-4 border-gray-800 shadow-2xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
          >
            🎲 {diceValue}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BoardLudoPhysical;
