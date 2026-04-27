import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Star, Trophy, HelpCircle, Droplets, Crown, Bug } from 'lucide-react';
import useGameStore from '../store/gameStore';

const BoardLudoClassic = () => {
  const { board, players, currentPlayerIndex, diceValue } = useGameStore();
  
  if (!board || !players) return null;

  // Cores profissionais estilo Ludo King
  const colors = {
    0: { 
      main: '#EF4444', // Vermelho
      light: '#FEE2E2',
      dark: '#DC2626',
      glow: 'rgba(239, 68, 68, 0.6)',
      gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      shadow: '0 8px 32px rgba(239, 68, 68, 0.4)'
    },
    1: { 
      main: '#10B981', // Verde
      light: '#D1FAE5',
      dark: '#059669',
      glow: 'rgba(16, 185, 129, 0.6)',
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      shadow: '0 8px 32px rgba(16, 185, 129, 0.4)'
    },
    2: { 
      main: '#3B82F6', // Azul
      light: '#DBEAFE',
      dark: '#2563EB',
      glow: 'rgba(59, 130, 246, 0.6)',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      shadow: '0 8px 32px rgba(59, 130, 246, 0.4)'
    },
    3: { 
      main: '#F59E0B', // Amarelo
      light: '#FEF3C7',
      dark: '#D97706',
      glow: 'rgba(245, 158, 11, 0.6)',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      shadow: '0 8px 32px rgba(245, 158, 11, 0.4)'
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
  const Pawn = ({ playerIndex, isActive, size = 24, index = 0 }) => {
    const color = colors[playerIndex];
    const offset = index * 5;
    
    return (
      <motion.div
        className="absolute cursor-pointer"
        style={{ 
          left: `calc(50% - ${size/2}px + ${offset}px)`,
          top: `calc(50% - ${size/2}px + ${offset}px)`,
          zIndex: 30 + index
        }}
        whileHover={{ scale: 1.3, filter: `drop-shadow(0 0 12px ${color.glow})` }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ 
          scale: 1, 
          rotate: 0,
          ...(isActive && {
            y: [0, -6, 0],
            filter: [
              `drop-shadow(0 0 0px ${color.glow})`,
              `drop-shadow(0 0 16px ${color.glow})`,
              `drop-shadow(0 0 0px ${color.glow})`
            ]
          })
        }}
        transition={{ duration: isActive ? 1.2 : 0.5, repeat: isActive ? Infinity : 0 }}
      >
        {/* Sombra */}
        <div 
          className="absolute blur-lg"
          style={{
            width: size * 0.85,
            height: size * 0.45,
            backgroundColor: 'rgba(0,0,0,0.35)',
            top: size * 0.75,
            left: size * 0.1,
            borderRadius: '50%'
          }}
        />
        
        {/* Peão circular */}
        <div
          className="rounded-full border-3 border-white relative"
          style={{ 
            width: size,
            height: size,
            background: `radial-gradient(circle at 30% 30%, ${color.light} 0%, ${color.main} 50%, ${color.dark} 100%)`,
            boxShadow: `${color.shadow}, inset 0 4px 8px rgba(255,255,255,0.6), inset 0 -4px 8px rgba(0,0,0,0.4)`
          }}
        >
          {/* Brilho */}
          <div 
            className="absolute bg-white blur-sm"
            style={{
              top: '18%',
              left: '22%',
              width: '45%',
              height: '32%',
              opacity: 0.85,
              borderRadius: '50%'
            }}
          />
          
          {/* Coroa */}
          {isActive && (
            <motion.div
              className="absolute -top-4 -right-4"
              animate={{ rotate: [0, 18, -18, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Crown className="w-5 h-5 text-yellow-400" fill="#FCD34D" />
            </motion.div>
          )}
          
          {/* Número */}
          <div 
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border-2 flex items-center justify-center text-[9px] font-black"
            style={{ borderColor: color.dark, color: color.dark }}
          >
            {playerIndex + 1}
          </div>
        </div>
      </motion.div>
    );
  };

  // Renderizar casa QUADRADA
  const Cell = ({ index, playerColor = null, isFinal = false, isStart = false, isSafe = false }) => {
    const pawns = getPawnsAtPosition(isFinal ? 'final' : 'main', index);
    const hasQuiz = !isFinal && !isStart && index % 5 === 0 && index > 0;
    const hasMosquito = !isFinal && !isStart && index % 7 === 0 && index > 0;
    const hasSaneamento = !isFinal && !isStart && index % 9 === 0 && index > 0;
    
    let cellBg = 'white';
    let borderColor = '#E5E7EB';
    let borderWidth = '1px';
    let cellShadow = 'inset 0 2px 4px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1)';
    let gradient = 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)';
    
    if (playerColor !== null) {
      cellBg = colors[playerColor].light;
      borderColor = colors[playerColor].main;
      borderWidth = '2px';
      cellShadow = `inset 0 2px 4px rgba(0,0,0,0.15), 0 2px 8px ${colors[playerColor].glow}`;
      gradient = `linear-gradient(135deg, ${colors[playerColor].light} 0%, ${cellBg} 100%)`;
    }
    
    return (
      <motion.div 
        className="aspect-square relative flex items-center justify-center overflow-visible"
        style={{ 
          background: gradient,
          border: `${borderWidth} solid ${borderColor}`,
          width: '40px',
          height: '40px',
          boxShadow: cellShadow,
          borderRadius: '0px'
        }}
        whileHover={{ scale: 1.05, zIndex: 20 }}
      >
        {/* Ícones */}
        {isStart && (
          <motion.div animate={{ rotate: 360, scale: [1, 1.3, 1] }} transition={{ rotate: { duration: 4, repeat: Infinity }, scale: { duration: 2, repeat: Infinity } }}>
            <Star className="w-5 h-5 text-yellow-500" fill="#FCD34D" />
          </motion.div>
        )}
        
        {isSafe && !isStart && (
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <Shield className="w-5 h-5 text-blue-500" />
          </motion.div>
        )}
        
        {hasQuiz && <HelpCircle className="w-5 h-5 text-purple-500" />}
        {hasMosquito && (
          <motion.div animate={{ rotate: [-5, 5, -5], y: [0, -2, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>
            <Bug className="w-5 h-5 text-red-500" />
          </motion.div>
        )}
        {hasSaneamento && <Droplets className="w-5 h-5 text-cyan-400 opacity-80" />}
        
        {/* Peões */}
        <AnimatePresence>
          {pawns.map((pawn, idx) => (
            <Pawn 
              key={`${pawn.playerIndex}-${pawn.id}-${index}`}
              playerIndex={pawn.playerIndex}
              isActive={pawn.playerIndex === currentPlayerIndex}
              size={24}
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
        className="w-full h-full p-4 flex flex-col items-center justify-center relative"
        style={{ background: color.gradient }}
      >
        <div className="text-white font-black text-sm mb-2">{player?.name || `P${playerIndex + 1}`}</div>
        <div className="grid grid-cols-2 gap-3">
          {[0, 1, 2, 3].map(i => {
            const pawn = basePawns.find(p => p.position === i);
            return (
              <div 
                key={i}
                className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center relative"
                style={{ backgroundColor: pawn ? 'white' : 'rgba(255,255,255,0.3)' }}
              >
                {pawn && <Pawn playerIndex={playerIndex} isActive={isCurrentPlayer} size={28} />}
              </div>
            );
          })}
        </div>
        <div className="text-white font-bold text-xs mt-2">🏆 {player?.score || 0}</div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-blue-50 to-gray-200" />
      
      <div className="relative">
        {/* Grid 15x15 - LAYOUT CORRETO DO LUDO */}
        <motion.div 
          className="grid bg-white shadow-2xl relative"
          style={{
            gridTemplateColumns: 'repeat(15, 40px)',
            gridTemplateRows: 'repeat(15, 40px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* ========== BASES (4 CANTOS) ========== */}
          
          {/* Base VERMELHA - Canto Superior Esquerdo */}
          <div style={{ gridColumn: '1 / 7', gridRow: '1 / 7' }}>
            <PlayerBase playerIndex={0} />
          </div>
          
          {/* Base VERDE - Canto Superior Direito */}
          <div style={{ gridColumn: '10 / 16', gridRow: '1 / 7' }}>
            <PlayerBase playerIndex={1} />
          </div>
          
          {/* Base AZUL - Canto Inferior Esquerdo */}
          <div style={{ gridColumn: '1 / 7', gridRow: '10 / 16' }}>
            <PlayerBase playerIndex={2} />
          </div>
          
          {/* Base AMARELA - Canto Inferior Direito */}
          <div style={{ gridColumn: '10 / 16', gridRow: '10 / 16' }}>
            <PlayerBase playerIndex={3} />
          </div>
          
          {/* ========== CAMINHO EXTERNO - 52 CASAS EM CRUZ (MEIO DO TABULEIRO) ========== */}
          
          {/* BRAÇO ESQUERDO - Horizontal (casas 0-5) */}
          {/* Saída VERMELHA na casa 0 */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={`left${i}`} style={{ gridColumn: i + 1, gridRow: 8 }}>
              <Cell index={i} isStart={i === 0} playerColor={i === 0 ? 0 : null} />
            </div>
          ))}
          
          {/* BRAÇO SUPERIOR - Vertical (casas 6-11) */}
          {/* Casa segura na 8 */}
          {[6, 7, 8, 9, 10, 11].map((i, idx) => (
            <div key={`up${i}`} style={{ gridColumn: 7, gridRow: 7 - idx }}>
              <Cell index={i} isSafe={i === 8} />
            </div>
          ))}
          
          {/* BRAÇO SUPERIOR - Horizontal (casas 12-17) */}
          {/* Saída VERDE na casa 13 */}
          {[12, 13, 14, 15, 16, 17].map((i, idx) => (
            <div key={`top${i}`} style={{ gridColumn: 7 + idx, gridRow: 1 }}>
              <Cell index={i} isStart={i === 13} playerColor={i === 13 ? 1 : null} />
            </div>
          ))}
          
          {/* BRAÇO DIREITO - Vertical (casas 18-23) */}
          {/* Casa segura na 21 */}
          {[18, 19, 20, 21, 22, 23].map((i, idx) => (
            <div key={`right1${i}`} style={{ gridColumn: 9, gridRow: idx + 1 }}>
              <Cell index={i} isSafe={i === 21} />
            </div>
          ))}
          
          {/* BRAÇO DIREITO - Horizontal (casas 24-29) */}
          {/* Saída AZUL na casa 26 */}
          {[24, 25, 26, 27, 28, 29].map((i, idx) => (
            <div key={`right2${i}`} style={{ gridColumn: 9 + idx, gridRow: 8 }}>
              <Cell index={i} isStart={i === 26} playerColor={i === 26 ? 2 : null} />
            </div>
          ))}
          
          {/* BRAÇO INFERIOR - Vertical (casas 30-35) */}
          {/* Casa segura na 34 */}
          {[30, 31, 32, 33, 34, 35].map((i, idx) => (
            <div key={`down1${i}`} style={{ gridColumn: 9, gridRow: 9 + idx }}>
              <Cell index={i} isSafe={i === 34} />
            </div>
          ))}
          
          {/* BRAÇO INFERIOR - Horizontal (casas 36-41) */}
          {/* Saída AMARELA na casa 39 */}
          {[36, 37, 38, 39, 40, 41].map((i, idx) => (
            <div key={`bottom${i}`} style={{ gridColumn: 9 - idx, gridRow: 15 }}>
              <Cell index={i} isStart={i === 39} playerColor={i === 39 ? 3 : null} />
            </div>
          ))}
          
          {/* BRAÇO ESQUERDO - Vertical (casas 42-47) */}
          {/* Casa segura na 47 */}
          {[42, 43, 44, 45, 46, 47].map((i, idx) => (
            <div key={`left2${i}`} style={{ gridColumn: 7, gridRow: 15 - idx }}>
              <Cell index={i} isSafe={i === 47} />
            </div>
          ))}
          
          {/* ÚLTIMAS CASAS - Completando o círculo (casas 48-51) */}
          {[48, 49, 50, 51].map((i, idx) => (
            <div key={`final${i}`} style={{ gridColumn: 7 - idx, gridRow: 8 }}>
              <Cell index={i} />
            </div>
          ))}
          
          {/* ========== CAMINHOS FINAIS - 6 CASAS POR COR ========== */}
          
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
          
          {/* AZUL - Horizontal (direita → centro) */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={`bf${i}`} style={{ gridColumn: 14 - i, gridRow: 8 }}>
              <Cell index={i} playerColor={2} isFinal />
            </div>
          ))}
          
          {/* AMARELO - Vertical (baixo → centro) */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={`yf${i}`} style={{ gridColumn: 8, gridRow: 14 - i }}>
              <Cell index={i} playerColor={3} isFinal />
            </div>
          ))}
          
          {/* ========== CENTRO - LOSANGO COLORIDO ========== */}
          <div style={{ gridColumn: '8 / 9', gridRow: '8 / 9' }}>
            <motion.div
              className="w-[40px] h-[40px] flex items-center justify-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #dbeafe 100%)',
                boxShadow: 'inset 0 2px 4px rgba(59, 130, 246, 0.2), 0 0 20px rgba(59, 130, 246, 0.4)',
                borderRadius: '0px'
              }}
              animate={{ 
                boxShadow: [
                  'inset 0 2px 4px rgba(59, 130, 246, 0.2), 0 0 20px rgba(59, 130, 246, 0.4)',
                  'inset 0 2px 4px rgba(16, 185, 129, 0.2), 0 0 30px rgba(16, 185, 129, 0.6)',
                  'inset 0 2px 4px rgba(59, 130, 246, 0.2), 0 0 20px rgba(59, 130, 246, 0.4)'
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              {/* Triângulos coloridos */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 40 40">
                <polygon points="20,8 12,20 28,20" fill={colors[0].main} opacity="0.7" />
                <polygon points="32,20 20,12 20,28" fill={colors[1].main} opacity="0.7" />
                <polygon points="20,32 12,20 28,20" fill={colors[2].main} opacity="0.7" />
                <polygon points="8,20 20,12 20,28" fill={colors[3].main} opacity="0.7" />
              </svg>
              
              {/* Troféu */}
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{ rotate: { duration: 20, repeat: Infinity, ease: 'linear' }, scale: { duration: 2, repeat: Infinity } }}
              >
                <Trophy className="w-6 h-6 text-yellow-500 relative z-10" fill="#FCD34D" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Indicador de dado */}
        {diceValue && (
          <motion.div
            className="absolute -top-6 -right-6 text-white font-black text-3xl w-20 h-20 rounded-2xl flex items-center justify-center border-4 border-white"
            style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
              boxShadow: '0 8px 32px rgba(245, 158, 11, 0.6)'
            }}
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

export default BoardLudoClassic;
