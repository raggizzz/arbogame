import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Star, Trophy, HelpCircle, Heart, Droplets, Zap, Crown, User, Target } from 'lucide-react';
import useGameStore from '../store/gameStore';

const BoardLudoUltimate = () => {
  const { board, players, currentPlayerIndex, diceValue } = useGameStore();
  
  if (!board || !players) return null;

  // Cores profissionais com gradientes
  const colors = {
    0: { 
      main: '#10B981', 
      light: '#D1FAE5', 
      dark: '#059669', 
      glow: 'rgba(16, 185, 129, 0.6)',
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
    },
    1: { 
      main: '#F59E0B', 
      light: '#FEF3C7', 
      dark: '#D97706', 
      glow: 'rgba(245, 158, 11, 0.6)',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
    },
    2: { 
      main: '#EF4444', 
      light: '#FEE2E2', 
      dark: '#DC2626', 
      glow: 'rgba(239, 68, 68, 0.6)',
      gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
    },
    3: { 
      main: '#3B82F6', 
      light: '#DBEAFE', 
      dark: '#2563EB', 
      glow: 'rgba(59, 130, 246, 0.6)',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
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

  // Renderizar peão MELHORADO
  const Pawn = ({ playerIndex, isActive, size = 24, index = 0, showPlayer = false }) => {
    const color = colors[playerIndex];
    const offset = index * 4;
    const player = players[playerIndex];
    
    return (
      <motion.div
        className="absolute cursor-pointer group"
        style={{ 
          left: `calc(50% - ${size/2}px + ${offset}px)`,
          top: `calc(50% - ${size/2}px + ${offset}px)`,
          zIndex: 20 + index
        }}
        whileHover={{ scale: 1.4, zIndex: 100 }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ 
          scale: 1, 
          rotate: 0,
          ...(isActive && {
            y: [0, -8, 0],
            boxShadow: [
              `0 0 0 0 ${color.glow}`,
              `0 0 0 15px ${color.glow}`,
              `0 0 0 0 ${color.glow}`
            ]
          })
        }}
        transition={{ 
          duration: isActive ? 1.5 : 0.5,
          repeat: isActive ? Infinity : 0
        }}
      >
        {/* Sombra do peão */}
        <div 
          className="absolute rounded-full blur-md"
          style={{
            width: size,
            height: size,
            backgroundColor: 'rgba(0,0,0,0.3)',
            top: '4px',
            left: '0'
          }}
        />
        
        {/* Peão principal */}
        <div
          className="relative rounded-full border-4 border-white shadow-2xl"
          style={{ 
            width: size,
            height: size,
            background: color.gradient,
            boxShadow: `0 4px 12px ${color.glow}, inset 0 2px 4px rgba(255,255,255,0.3)`
          }}
        >
          {/* Brilho superior */}
          <div 
            className="absolute top-1 left-1 w-3 h-3 rounded-full bg-white opacity-70 blur-sm"
          />
          
          {/* Ícone do jogador */}
          {showPlayer && (
            <User 
              className="absolute inset-0 m-auto text-white" 
              size={size * 0.5}
              strokeWidth={3}
            />
          )}
          
          {/* Coroa para jogador atual */}
          {isActive && (
            <motion.div
              className="absolute -top-3 -right-3"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Crown className="w-5 h-5 text-yellow-400 drop-shadow-lg" fill="#FCD34D" />
            </motion.div>
          )}
          
          {/* Indicador de número do jogador */}
          <div 
            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white border-2 flex items-center justify-center text-[8px] font-bold"
            style={{ borderColor: color.dark, color: color.dark }}
          >
            {playerIndex + 1}
          </div>
        </div>
        
        {/* Tooltip com nome do jogador */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          <div 
            className="px-2 py-1 rounded-lg text-white text-xs font-bold shadow-lg"
            style={{ background: color.gradient }}
          >
            {player?.name || `P${playerIndex + 1}`}
          </div>
        </div>
      </motion.div>
    );
  };

  // Renderizar casa MELHORADA - COM CORES!
  const Cell = ({ index, color = 'white', isFinal = false, isStart = false, isSafe = false, playerColor = null }) => {
    const pawns = getPawnsAtPosition(isFinal ? 'final' : 'main', index);
    const hasQuiz = !isFinal && index % 5 === 0 && index > 0;
    const hasCriadouro = !isFinal && index % 7 === 0 && index > 0;
    
    // Cor da casa final ou de início
    let cellColor = color;
    if (isFinal && playerColor !== null) {
      cellColor = colors[playerColor].light;
    } else if (isStart && playerColor !== null) {
      cellColor = colors[playerColor].light;
    }
    
    return (
      <motion.div 
        className="relative border-2 flex items-center justify-center rounded-lg overflow-visible"
        style={{ 
          backgroundColor: cellColor,
          borderColor: playerColor !== null ? colors[playerColor].dark : '#9CA3AF',
          borderWidth: playerColor !== null ? '3px' : '2px',
          width: '55px',
          height: '55px',
          boxShadow: playerColor !== null 
            ? `0 4px 12px ${colors[playerColor].glow}` 
            : '0 2px 4px rgba(0,0,0,0.1)'
        }}
        whileHover={{ 
          scale: 1.08,
          borderColor: '#1F2937',
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
          zIndex: 10
        }}
      >
        {/* Fundo com padrão */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
            backgroundSize: '8px 8px'
          }} />
        </div>
        
        {/* Ícones de casa especial */}
        {isStart && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Star className="w-7 h-7 text-yellow-500 absolute" fill="#FCD34D" strokeWidth={2.5} />
          </motion.div>
        )}
        
        {isSafe && !isStart && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Shield className="w-7 h-7 text-blue-500 absolute" strokeWidth={3} />
          </motion.div>
        )}
        
        {hasQuiz && (
          <HelpCircle className="w-6 h-6 text-purple-500 absolute" strokeWidth={2.5} />
        )}
        
        {hasCriadouro && (
          <Droplets className="w-6 h-6 text-red-500 absolute" strokeWidth={2.5} />
        )}
        
        {/* Número da casa */}
        {!isStart && !isSafe && !hasQuiz && !hasCriadouro && !isFinal && (
          <span className="text-[10px] text-gray-500 font-bold absolute top-1 left-1.5 bg-white rounded px-1">
            {index}
          </span>
        )}
        
        {/* Peões nesta casa */}
        <AnimatePresence>
          {pawns.map((pawn, idx) => (
            <Pawn 
              key={`${pawn.playerIndex}-${pawn.id}-${index}`}
              playerIndex={pawn.playerIndex}
              isActive={pawn.playerIndex === currentPlayerIndex}
              size={26}
              index={idx}
              showPlayer={pawns.length === 1}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    );
  };

  // Renderizar base MELHORADA
  const PlayerBase = ({ playerIndex }) => {
    const color = colors[playerIndex];
    const player = players[playerIndex];
    const basePawns = player?.pawns?.filter(p => p.location === 'base') || [];
    const isCurrentPlayer = playerIndex === currentPlayerIndex;
    
    return (
      <motion.div 
        className="w-full h-full p-5 rounded-3xl border-4 relative overflow-hidden"
        style={{ 
          backgroundColor: color.light,
          borderColor: color.main,
          boxShadow: isCurrentPlayer 
            ? `0 0 40px ${color.glow}, 0 8px 32px rgba(0,0,0,0.2)`
            : `0 8px 32px rgba(0,0,0,0.1)`
        }}
        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          rotate: 0,
          ...(isCurrentPlayer && {
            borderColor: [color.main, color.dark, color.main]
          })
        }}
        transition={{ 
          delay: playerIndex * 0.15,
          duration: 0.6,
          borderColor: { duration: 2, repeat: Infinity }
        }}
      >
        {/* Fundo animado */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            className="w-full h-full"
            style={{ background: color.gradient }}
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>
        
        {/* Header do jogador */}
        <motion.div 
          className="absolute top-3 left-3 right-3 px-4 py-3 rounded-2xl text-white text-center shadow-2xl z-20 border-2 border-white/30"
          style={{ background: color.gradient }}
          animate={isCurrentPlayer ? {
            scale: [1, 1.05, 1],
            boxShadow: [
              `0 4px 12px ${color.glow}`,
              `0 8px 32px ${color.glow}`,
              `0 4px 12px ${color.glow}`
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <User className="w-4 h-4" strokeWidth={2.5} />
            <div className="text-sm font-bold tracking-wide">
              {player?.name || `Jogador ${playerIndex + 1}`}
            </div>
            {isCurrentPlayer && <Crown className="w-4 h-4" fill="white" />}
          </div>
          <div className="text-[10px] opacity-90 font-semibold">
            {basePawns.length}/4 peões na base
          </div>
          <div className="text-xs font-bold mt-1">
            🏆 {player?.score || 0} pts
          </div>
        </motion.div>
        
        {/* Triângulo decorativo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <svg width="140" height="140" viewBox="0 0 100 100">
            <polygon 
              points="50,15 15,85 85,85" 
              fill={color.main}
            />
          </svg>
        </div>
        
        {/* Grid 2x2 para peões */}
        <div className="relative z-10 grid grid-cols-2 gap-5 h-full items-center justify-items-center pt-20">
          {[0, 1, 2, 3].map(i => {
            const pawn = basePawns.find(p => p.position === i);
            const hasPawn = !!pawn;
            
            return (
              <motion.div 
                key={i}
                className="w-20 h-20 rounded-full border-4 flex items-center justify-center shadow-2xl relative"
                style={{ 
                  backgroundColor: hasPawn ? 'white' : color.light,
                  borderColor: color.dark,
                  boxShadow: hasPawn ? `0 4px 16px ${color.glow}` : '0 2px 8px rgba(0,0,0,0.1)'
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                animate={hasPawn && isCurrentPlayer ? {
                  borderColor: [color.dark, color.main, color.dark]
                } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {hasPawn && (
                  <Pawn 
                    playerIndex={playerIndex}
                    isActive={isCurrentPlayer}
                    size={28}
                    showPlayer
                  />
                )}
                {!hasPawn && (
                  <div className="text-2xl opacity-30">○</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  // Renderizar caminho principal (52 casas) - COM CORES DE INÍCIO!
  const renderMainPath = () => {
    const cells = [];
    
    // Linha inferior (casas 0-12) - Verde começa em 0
    for (let i = 0; i <= 12; i++) {
      cells.push(
        <div key={`b${i}`} style={{ gridColumn: i + 1, gridRow: 13 }}>
          <Cell 
            index={i} 
            isStart={i === 0} 
            isSafe={i === 8} 
            playerColor={i === 0 ? 0 : null}
          />
        </div>
      );
    }
    
    // Coluna direita (casas 13-25) - Amarelo começa em 13
    for (let i = 13; i <= 25; i++) {
      cells.push(
        <div key={`r${i}`} style={{ gridColumn: 13, gridRow: 13 - (i - 13) }}>
          <Cell 
            index={i} 
            isStart={i === 13} 
            isSafe={i === 21} 
            playerColor={i === 13 ? 1 : null}
          />
        </div>
      );
    }
    
    // Linha superior (casas 26-38) - Vermelho começa em 26
    for (let i = 26; i <= 38; i++) {
      cells.push(
        <div key={`t${i}`} style={{ gridColumn: 13 - (i - 26), gridRow: 1 }}>
          <Cell 
            index={i} 
            isStart={i === 26} 
            isSafe={i === 34} 
            playerColor={i === 26 ? 2 : null}
          />
        </div>
      );
    }
    
    // Coluna esquerda (casas 39-51) - Azul começa em 39
    for (let i = 39; i <= 51; i++) {
      cells.push(
        <div key={`l${i}`} style={{ gridColumn: 1, gridRow: (i - 39) + 1 }}>
          <Cell 
            index={i} 
            isStart={i === 39} 
            isSafe={i === 47} 
            playerColor={i === 39 ? 3 : null}
          />
        </div>
      );
    }
    
    return cells;
  };

  // Renderizar caminhos finais - COM CORES!
  const renderFinalPaths = () => {
    const paths = [];
    
    // Verde - Horizontal (esquerda → centro)
    for (let i = 0; i < 6; i++) {
      paths.push(
        <div key={`gf${i}`} style={{ gridColumn: i + 2, gridRow: 7 }}>
          <Cell index={i} color={colors[0].light} isFinal playerColor={0} />
        </div>
      );
    }
    
    // Amarelo - Vertical (cima → centro)
    for (let i = 0; i < 6; i++) {
      paths.push(
        <div key={`yf${i}`} style={{ gridColumn: 7, gridRow: i + 2 }}>
          <Cell index={i} color={colors[1].light} isFinal playerColor={1} />
        </div>
      );
    }
    
    // Vermelho - Horizontal (direita → centro)
    for (let i = 0; i < 6; i++) {
      paths.push(
        <div key={`rf${i}`} style={{ gridColumn: 12 - i, gridRow: 7 }}>
          <Cell index={i} color={colors[2].light} isFinal playerColor={2} />
        </div>
      );
    }
    
    // Azul - Vertical (baixo → centro)
    for (let i = 0; i < 6; i++) {
      paths.push(
        <div key={`bf${i}`} style={{ gridColumn: 7, gridRow: 12 - i }}>
          <Cell index={i} color={colors[3].light} isFinal playerColor={3} />
        </div>
      );
    }
    
    return paths;
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="relative">
        {/* Grid 13x13 ULTIMATE */}
        <motion.div 
          className="grid gap-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 shadow-2xl rounded-3xl p-6 border-8 border-gray-950 relative"
          style={{
            gridTemplateColumns: 'repeat(13, 55px)',
            gridTemplateRows: 'repeat(13, 55px)'
          }}
          initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Brilho de fundo */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl" />
          
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
          
          {/* CENTRO ÉPICO */}
          <div style={{ gridColumn: '7 / 8', gridRow: '7 / 8' }}>
            <motion.div
              className="w-[55px] h-[55px] rounded-2xl flex items-center justify-center relative overflow-hidden shadow-2xl border-4 border-white/20"
              style={{
                background: 'linear-gradient(135deg, #10B981 0%, #F59E0B 25%, #EF4444 50%, #3B82F6 75%, #10B981 100%)',
                backgroundSize: '200% 200%'
              }}
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                boxShadow: [
                  '0 0 20px rgba(16, 185, 129, 0.5)',
                  '0 0 40px rgba(245, 158, 11, 0.5)',
                  '0 0 20px rgba(16, 185, 129, 0.5)'
                ]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: 'linear' 
              }}
            >
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 55 55">
                <polygon points="27.5,12 20,24 35,24" fill={colors[0].main} opacity="0.9" />
                <polygon points="43,27.5 31,20 31,35" fill={colors[1].main} opacity="0.9" />
                <polygon points="27.5,43 20,31 35,31" fill={colors[2].main} opacity="0.9" />
                <polygon points="12,27.5 24,20 24,35" fill={colors[3].main} opacity="0.9" />
              </svg>
              
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              >
                <Trophy className="w-8 h-8 text-white z-10 drop-shadow-2xl" fill="white" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Legenda ULTIMATE */}
        <motion.div 
          className="mt-5 flex justify-center gap-3 flex-wrap"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { icon: Star, label: 'Início', color: '#FCD34D', desc: 'Saída' },
            { icon: Shield, label: 'Segura', color: '#3B82F6', desc: 'Proteção' },
            { icon: HelpCircle, label: 'Quiz', color: '#A855F7', desc: 'Pergunta' },
            { icon: Droplets, label: 'Criadouro', color: '#EF4444', desc: 'Perigo' },
            { icon: Trophy, label: 'Chegada', color: '#F59E0B', desc: 'Vitória' }
          ].map(({ icon: Icon, label, color, desc }) => (
            <motion.div 
              key={label}
              className="flex items-center gap-2 bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-2.5 rounded-xl shadow-xl border border-gray-700 hover:border-gray-500 transition-all"
              whileHover={{ scale: 1.08, y: -2 }}
            >
              <Icon className="w-5 h-5" style={{ color }} strokeWidth={2.5} />
              <div>
                <div className="text-xs text-white font-bold">{label}</div>
                <div className="text-[9px] text-gray-400">{desc}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Indicador de dado */}
        {diceValue && (
          <motion.div
            className="absolute -top-4 -right-4 bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold text-2xl w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            {diceValue}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BoardLudoUltimate;
