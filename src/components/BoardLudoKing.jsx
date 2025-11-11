import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Star, Trophy, HelpCircle, Droplets, Zap, Crown, User, Target, Bug } from 'lucide-react';
import useGameStore from '../store/gameStore';

const BoardLudoKing = () => {
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

  // Renderizar peão CIRCULAR estilo Ludo King AAA
  const Pawn = ({ playerIndex, isActive, size = 24, index = 0 }) => {
    const color = colors[playerIndex];
    const offset = index * 5;
    const canMove = isActive;
    
    return (
      <motion.div
        className="absolute cursor-pointer group"
        style={{ 
          left: `calc(50% - ${size/2}px + ${offset}px)`,
          top: `calc(50% - ${size/2}px + ${offset}px)`,
          zIndex: 30 + index
        }}
        whileHover={{ 
          scale: 1.3, 
          zIndex: 100,
          filter: `drop-shadow(0 0 12px ${color.glow})`
        }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ 
          scale: 1, 
          rotate: 0,
          ...(canMove && {
            y: [0, -6, 0],
            scale: [1, 1.08, 1],
            filter: [
              `drop-shadow(0 0 0px ${color.glow})`,
              `drop-shadow(0 0 16px ${color.glow})`,
              `drop-shadow(0 0 0px ${color.glow})`
            ]
          })
        }}
        transition={{ 
          duration: canMove ? 1.2 : 0.5,
          repeat: canMove ? Infinity : 0,
          ease: 'easeInOut'
        }}
      >
        {/* Sombra 3D realista */}
        <motion.div 
          className="absolute blur-lg"
          style={{
            width: size * 0.85,
            height: size * 0.45,
            backgroundColor: 'rgba(0,0,0,0.35)',
            top: size * 0.75,
            left: size * 0.1,
            borderRadius: '50%'
          }}
          animate={canMove ? {
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.5, 0.35]
          } : {}}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        
        {/* Peão CIRCULAR principal - Estilo 3D AAA */}
        <motion.div
          className="rounded-full border-3 border-white relative"
          style={{ 
            width: size,
            height: size,
            borderRadius: '50%', // CIRCULAR!
            background: `radial-gradient(circle at 30% 30%, ${color.light} 0%, ${color.main} 50%, ${color.dark} 100%)`,
            boxShadow: `
              ${color.shadow}, 
              inset 0 4px 8px rgba(255,255,255,0.6), 
              inset 0 -4px 8px rgba(0,0,0,0.4),
              0 0 0 2px ${color.main}
            `
          }}
          whileHover={{
            boxShadow: `
              0 0 24px ${color.glow},
              ${color.shadow}, 
              inset 0 4px 8px rgba(255,255,255,0.6), 
              inset 0 -4px 8px rgba(0,0,0,0.4),
              0 0 0 3px ${color.main}
            `
          }}
        >
          {/* Brilho superior 3D */}
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
          
          {/* Reflexo lateral */}
          <div 
            className="absolute bg-white blur-[2px]"
            style={{
              top: '42%',
              right: '18%',
              width: '18%',
              height: '22%',
              opacity: 0.35,
              borderRadius: '50%'
            }}
          />
          
          {/* Coroa para jogador atual - ANIMADA */}
          {isActive && (
            <motion.div
              className="absolute -top-4 -right-4 z-50"
              animate={{ 
                rotate: [0, 18, -18, 0], 
                scale: [1, 1.15, 1],
                y: [0, -2, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Crown 
                className="w-5 h-5 text-yellow-400" 
                fill="#FCD34D" 
                strokeWidth={2.5}
                style={{
                  filter: 'drop-shadow(0 3px 8px rgba(252, 211, 77, 0.8))'
                }}
              />
            </motion.div>
          )}
          
          {/* Número do jogador - MELHORADO */}
          <motion.div 
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border-2 flex items-center justify-center text-[9px] font-black shadow-lg"
            style={{ 
              borderColor: color.dark, 
              color: color.dark,
              boxShadow: `0 2px 6px ${color.glow}`
            }}
            whileHover={{ scale: 1.15 }}
          >
            {playerIndex + 1}
          </motion.div>
        </motion.div>
      </motion.div>
    );
  };

  // Renderizar casa QUADRADA estilo Ludo King AAA
  const Cell = ({ index, playerColor = null, isFinal = false, isStart = false, isSafe = false }) => {
    const pawns = getPawnsAtPosition(isFinal ? 'final' : 'main', index);
    const hasQuiz = !isFinal && !isStart && index % 5 === 0 && index > 0;
    const hasMosquito = !isFinal && !isStart && index % 7 === 0 && index > 0;
    const hasSaneamento = !isFinal && !isStart && index % 9 === 0 && index > 0;
    
    // Cor da casa QUADRADA
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
          borderRadius: '0px' // QUADRADO - SEM ARREDONDAMENTO!
        }}
        whileHover={{ 
          scale: 1.05,
          zIndex: 20,
          boxShadow: playerColor !== null 
            ? `inset 0 2px 4px rgba(0,0,0,0.15), 0 0 20px ${colors[playerColor].glow}, 0 4px 12px rgba(0,0,0,0.2)`
            : 'inset 0 2px 4px rgba(0,0,0,0.1), 0 0 12px rgba(59, 130, 246, 0.4), 0 4px 12px rgba(0,0,0,0.2)'
        }}
      >
        {/* Ícone de estrela para início - ANIMADO */}
        {isStart && (
          <motion.div
            animate={{ 
              rotate: 360, 
              scale: [1, 1.3, 1],
              filter: [
                'drop-shadow(0 0 2px #FCD34D)',
                'drop-shadow(0 0 8px #FCD34D)',
                'drop-shadow(0 0 2px #FCD34D)'
              ]
            }}
            transition={{ 
              rotate: { duration: 4, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity },
              filter: { duration: 2, repeat: Infinity }
            }}
          >
            <Star className="w-5 h-5 text-yellow-500 absolute" fill="#FCD34D" strokeWidth={2.5} />
          </motion.div>
        )}
        
        {/* Ícone de escudo para casa segura - PULSANTE */}
        {isSafe && !isStart && (
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
              filter: [
                'drop-shadow(0 0 2px #3B82F6)',
                'drop-shadow(0 0 10px #3B82F6)',
                'drop-shadow(0 0 2px #3B82F6)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Shield className="w-5 h-5 text-blue-500 absolute" strokeWidth={3} />
          </motion.div>
        )}
        
        {/* Ícone de quiz - PISCANTE */}
        {hasQuiz && (
          <motion.div
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.7, 1, 0.7],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <HelpCircle className="w-5 h-5 text-purple-500 absolute" strokeWidth={2.5} />
          </motion.div>
        )}
        
        {/* Ícone de mosquito - BATENDO ASAS */}
        {hasMosquito && (
          <motion.div
            animate={{ 
              rotate: [-5, 5, -5],
              y: [0, -2, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 0.5, 
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <Bug className="w-5 h-5 text-red-500 absolute" strokeWidth={2.5} />
          </motion.div>
        )}
        
        {/* Ícone de saneamento - TRANSLÚCIDO */}
        {hasSaneamento && (
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Droplets className="w-5 h-5 text-cyan-400 absolute opacity-80" strokeWidth={2.5} />
          </motion.div>
        )}
        
        {/* Peões nesta casa */}
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

  // Renderizar base estilo Ludo King
  const PlayerBase = ({ playerIndex, position }) => {
    const color = colors[playerIndex];
    const player = players[playerIndex];
    const basePawns = player?.pawns?.filter(p => p.location === 'base') || [];
    const isCurrentPlayer = playerIndex === currentPlayerIndex;
    
    return (
      <motion.div 
        className="relative w-full h-full p-4 flex flex-col items-center justify-center"
        style={{ 
          background: color.gradient,
          boxShadow: isCurrentPlayer ? `0 0 40px ${color.glow}, ${color.shadow}` : color.shadow
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          ...(isCurrentPlayer && {
            boxShadow: [
              `0 0 20px ${color.glow}`,
              `0 0 60px ${color.glow}`,
              `0 0 20px ${color.glow}`
            ]
          })
        }}
        transition={{ 
          duration: 0.5,
          boxShadow: { duration: 2, repeat: Infinity }
        }}
      >
        {/* Nome do jogador */}
        <div className="absolute top-2 left-2 right-2 text-center">
          <div 
            className="text-white font-black text-sm tracking-wide px-2 py-1 rounded-lg shadow-lg"
            style={{ backgroundColor: color.dark }}
          >
            {player?.name || `P${playerIndex + 1}`}
            {isCurrentPlayer && ' 👑'}
          </div>
        </div>
        
        {/* Grid 2x2 para peões */}
        <div className="grid grid-cols-2 gap-3 mt-8">
          {[0, 1, 2, 3].map(i => {
            const pawn = basePawns.find(p => p.position === i);
            const hasPawn = !!pawn;
            
            return (
              <motion.div 
                key={i}
                className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center shadow-2xl relative"
                style={{ 
                  backgroundColor: hasPawn ? 'white' : 'rgba(255,255,255,0.3)',
                  boxShadow: hasPawn ? `0 4px 20px ${color.glow}` : 'inset 0 2px 8px rgba(0,0,0,0.2)'
                }}
                whileHover={{ scale: 1.1 }}
              >
                {hasPawn && (
                  <Pawn 
                    playerIndex={playerIndex}
                    isActive={isCurrentPlayer}
                    size={28}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
        
        {/* Pontuação */}
        <div className="absolute bottom-2 left-2 right-2 text-center">
          <div className="text-white font-bold text-xs bg-black bg-opacity-30 rounded-lg px-2 py-1">
            🏆 {player?.score || 0} pts
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fundo gradiente radial AAA */}
      <div className="absolute inset-0 bg-gradient-radial from-gray-100 via-blue-50 to-gray-200" />
      
      {/* Padrão de fundo sutil */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle, #3B82F6 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}
        />
      </div>
      
      {/* Partículas flutuantes */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%']
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 2px, transparent 2px)',
          backgroundSize: '50px 50px'
        }}
      />
      
      <div className="relative">
        {/* Grid 15x15 estilo Ludo King */}
        <motion.div 
          className="grid bg-white shadow-2xl relative"
          style={{
            gridTemplateColumns: 'repeat(15, 40px)',
            gridTemplateRows: 'repeat(15, 40px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
          }}
          initial={{ opacity: 0, scale: 0.8, rotateX: 30 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* BASE VERMELHA - Superior Esquerda */}
          <div style={{ gridColumn: '1 / 7', gridRow: '1 / 7' }}>
            <PlayerBase playerIndex={0} position="top-left" />
          </div>
          
          {/* BASE VERDE - Superior Direita */}
          <div style={{ gridColumn: '10 / 16', gridRow: '1 / 7' }}>
            <PlayerBase playerIndex={1} position="top-right" />
          </div>
          
          {/* BASE AZUL - Inferior Esquerda */}
          <div style={{ gridColumn: '1 / 7', gridRow: '10 / 16' }}>
            <PlayerBase playerIndex={2} position="bottom-left" />
          </div>
          
          {/* BASE AMARELA - Inferior Direita */}
          <div style={{ gridColumn: '10 / 16', gridRow: '10 / 16' }}>
            <PlayerBase playerIndex={3} position="bottom-right" />
          </div>
          
          {/* CAMINHO PRINCIPAL - 52 casas */}
          {/* Linha inferior (0-5) - Vermelho */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={`b${i}`} style={{ gridColumn: i + 1, gridRow: 9 }}>
              <Cell index={i} isStart={i === 0} playerColor={i === 0 ? 0 : null} />
            </div>
          ))}
          
          {/* Coluna esquerda subindo (6-11) */}
          {[6, 7, 8, 9, 10, 11].map((i, idx) => (
            <div key={`l${i}`} style={{ gridColumn: 1, gridRow: 9 - idx }}>
              <Cell index={i} isSafe={i === 8} />
            </div>
          ))}
          
          {/* Linha superior (12-17) - Verde */}
          {[12, 13, 14, 15, 16, 17].map((i, idx) => (
            <div key={`t${i}`} style={{ gridColumn: idx + 1, gridRow: 1 }}>
              <Cell index={i} isStart={i === 13} playerColor={i === 13 ? 1 : null} />
            </div>
          ))}
          
          {/* Coluna direita descendo (18-23) */}
          {[18, 19, 20, 21, 22, 23].map((i, idx) => (
            <div key={`r${i}`} style={{ gridColumn: 15, gridRow: idx + 1 }}>
              <Cell index={i} isSafe={i === 21} />
            </div>
          ))}
          
          {/* Linha inferior direita (24-29) - Azul */}
          {[24, 25, 26, 27, 28, 29].map((i, idx) => (
            <div key={`br${i}`} style={{ gridColumn: 15 - idx, gridRow: 9 }}>
              <Cell index={i} isStart={i === 26} playerColor={i === 26 ? 2 : null} />
            </div>
          ))}
          
          {/* Coluna direita subindo (30-35) */}
          {[30, 31, 32, 33, 34, 35].map((i, idx) => (
            <div key={`ru${i}`} style={{ gridColumn: 9, gridRow: 9 + idx }}>
              <Cell index={i} isSafe={i === 34} />
            </div>
          ))}
          
          {/* Linha inferior (36-41) - Amarelo */}
          {[36, 37, 38, 39, 40, 41].map((i, idx) => (
            <div key={`bb${i}`} style={{ gridColumn: 9 + idx, gridRow: 15 }}>
              <Cell index={i} isStart={i === 39} playerColor={i === 39 ? 3 : null} />
            </div>
          ))}
          
          {/* Coluna esquerda descendo (42-47) */}
          {[42, 43, 44, 45, 46, 47].map((i, idx) => (
            <div key={`ld${i}`} style={{ gridColumn: 15, gridRow: 15 - idx }}>
              <Cell index={i} isSafe={i === 47} />
            </div>
          ))}
          
          {/* Últimas casas (48-51) */}
          {[48, 49, 50, 51].map((i, idx) => (
            <div key={`f${i}`} style={{ gridColumn: 15 - idx, gridRow: 9 }}>
              <Cell index={i} />
            </div>
          ))}
          
          {/* CAMINHOS FINAIS - 6 casas cada */}
          {/* Vermelho - Horizontal */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={`rf${i}`} style={{ gridColumn: i + 2, gridRow: 8 }}>
              <Cell index={i} playerColor={0} isFinal />
            </div>
          ))}
          
          {/* Verde - Vertical */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={`gf${i}`} style={{ gridColumn: 8, gridRow: i + 2 }}>
              <Cell index={i} playerColor={1} isFinal />
            </div>
          ))}
          
          {/* Azul - Horizontal */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={`bf${i}`} style={{ gridColumn: 14 - i, gridRow: 8 }}>
              <Cell index={i} playerColor={2} isFinal />
            </div>
          ))}
          
          {/* Amarelo - Vertical */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={`yf${i}`} style={{ gridColumn: 8, gridRow: 14 - i }}>
              <Cell index={i} playerColor={3} isFinal />
            </div>
          ))}
          
          {/* CENTRO QUADRADO - Santuário Livre de Dengue AAA */}
          <div style={{ gridColumn: '8 / 9', gridRow: '8 / 9' }}>
            <motion.div
              className="aspect-square w-[40px] h-[40px] flex items-center justify-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #dbeafe 100%)',
                boxShadow: 'inset 0 2px 4px rgba(59, 130, 246, 0.2), 0 0 20px rgba(59, 130, 246, 0.4)',
                borderRadius: '0px' // QUADRADO!
              }}
              animate={{ 
                boxShadow: [
                  'inset 0 2px 8px rgba(59, 130, 246, 0.3), 0 0 20px rgba(59, 130, 246, 0.4)',
                  'inset 0 2px 8px rgba(16, 185, 129, 0.3), 0 0 30px rgba(16, 185, 129, 0.6)',
                  'inset 0 2px 8px rgba(59, 130, 246, 0.3), 0 0 20px rgba(59, 130, 246, 0.4)'
                ]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
            >
              {/* Mosaico de fundo */}
              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 40 40">
                <defs>
                  <pattern id="mosaic" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="5" height="5" fill="#3B82F6" />
                    <rect x="5" y="5" width="5" height="5" fill="#10B981" />
                  </pattern>
                </defs>
                <rect width="40" height="40" fill="url(#mosaic)" />
              </svg>
              
              {/* Triângulos coloridos */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 40 40">
                <polygon points="20,8 12,20 28,20" fill={colors[0].main} opacity="0.7" />
                <polygon points="32,20 20,12 20,28" fill={colors[1].main} opacity="0.7" />
                <polygon points="20,32 12,20 28,20" fill={colors[2].main} opacity="0.7" />
                <polygon points="8,20 20,12 20,28" fill={colors[3].main} opacity="0.7" />
              </svg>
              
              {/* Brilho radial animado */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: [
                    'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 60%)',
                    'radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, transparent 70%)',
                    'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 60%)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              {/* Troféu girando */}
              <motion.div
                className="relative z-10"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 2, repeat: Infinity }
                }}
              >
                <Trophy 
                  className="w-6 h-6 text-yellow-500" 
                  fill="#FCD34D" 
                  strokeWidth={2}
                  style={{
                    filter: 'drop-shadow(0 2px 8px rgba(252, 211, 77, 0.8))'
                  }}
                />
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
            transition={{ type: 'spring', stiffness: 200 }}
          >
            🎲 {diceValue}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BoardLudoKing;
