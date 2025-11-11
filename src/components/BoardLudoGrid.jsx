import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Star, Trophy, HelpCircle, Bug, Target } from 'lucide-react';
import useGameStore from '../store/gameStore';

const BoardLudoGrid = () => {
  const { board, players, currentPlayerIndex, diceValue } = useGameStore();
  
  if (!board || !players) return null;

  // Cores EXATAS do Ludo físico
  const colors = {
    0: { main: '#E63946', light: '#FEE2E2', dark: '#991B1B' }, // VERMELHO
    1: { main: '#2A9D8F', light: '#D1FAE5', dark: '#166534' }, // VERDE
    2: { main: '#264653', light: '#DBEAFE', dark: '#1E40AF' }, // AZUL
    3: { main: '#E9C46A', light: '#FEF3C7', dark: '#A16207' }  // AMARELO
  };

  // MAPA DE COORDENADAS - 52 CASAS EXTERNAS (CRUZ CONTÍNUA)
  const pathCoordinates = [
    // VERMELHO - Saída (casa 0) - Linha 9, começando da esquerda
    { col: 1, row: 9, color: 0, isStart: true },
    { col: 2, row: 9 }, { col: 3, row: 9 }, { col: 4, row: 9 }, { col: 5, row: 9 }, { col: 6, row: 9 },
    
    // Coluna esquerda subindo (6-11)
    { col: 7, row: 9 }, { col: 7, row: 8, isSafe: true }, { col: 7, row: 7 }, { col: 7, row: 6 }, { col: 7, row: 5 }, { col: 7, row: 4 },
    
    // VERDE - Saída (casa 12) - Coluna 7, subindo
    { col: 7, row: 3, color: 1, isStart: true },
    { col: 7, row: 2 }, { col: 7, row: 1 },
    
    // Linha superior (15-17) - indo para direita
    { col: 8, row: 1 }, { col: 9, row: 1 },
    
    // Coluna direita descendo (18-23)
    { col: 9, row: 2 }, { col: 9, row: 3 }, { col: 9, row: 4, isSafe: true }, { col: 9, row: 5 }, { col: 9, row: 6 }, { col: 9, row: 7 },
    
    // Linha central direita (24-25)
    { col: 9, row: 8 },
    
    // AZUL - Saída (casa 26) - Linha 9, vindo da direita
    { col: 9, row: 9, color: 2, isStart: true },
    { col: 10, row: 9 }, { col: 11, row: 9 }, { col: 12, row: 9 }, { col: 13, row: 9 }, { col: 14, row: 9 }, { col: 15, row: 9 },
    
    // Coluna direita descendo (33-38)
    { col: 9, row: 10 }, { col: 9, row: 11 }, { col: 9, row: 12, isSafe: true }, { col: 9, row: 13 }, { col: 9, row: 14 }, { col: 9, row: 15 },
    
    // AMARELO - Saída (casa 39) - Coluna 9, descendo
    { col: 9, row: 13, color: 3, isStart: true },
    
    // Linha inferior (40-44)
    { col: 8, row: 15 }, { col: 7, row: 15 },
    
    // Coluna esquerda subindo (45-50)
    { col: 7, row: 14 }, { col: 7, row: 13 }, { col: 7, row: 12, isSafe: true }, { col: 7, row: 11 }, { col: 7, row: 10 },
    
    // Fechamento (51)
    { col: 7, row: 10 }
  ];

  // CASAS BRANCAS ANTES DO CENTRO - 6 casas por braço (parte do caminho comum)
  const whiteCenterPaths = {
    0: [ // VERMELHO - 6 casas brancas horizontais (esquerda → centro)
      { col: 1, row: 8 }, { col: 2, row: 8 }, { col: 3, row: 8 }, { col: 4, row: 8 }, { col: 5, row: 8 }, { col: 6, row: 8 }
    ],
    1: [ // VERDE - 6 casas brancas verticais (cima → centro)
      { col: 8, row: 1 }, { col: 8, row: 2 }, { col: 8, row: 3 }, { col: 8, row: 4 }, { col: 8, row: 5 }, { col: 8, row: 6 }
    ],
    2: [ // AZUL - 6 casas brancas horizontais (direita → centro)
      { col: 15, row: 8 }, { col: 14, row: 8 }, { col: 13, row: 8 }, { col: 12, row: 8 }, { col: 11, row: 8 }, { col: 10, row: 8 }
    ],
    3: [ // AMARELO - 6 casas brancas verticais (baixo → centro)
      { col: 8, row: 15 }, { col: 8, row: 14 }, { col: 8, row: 13 }, { col: 8, row: 12 }, { col: 8, row: 11 }, { col: 8, row: 10 }
    ]
  };

  // CAMINHOS FINAIS - 6 casas COLORIDAS por jogador (DEPOIS das brancas)
  const finalPaths = {
    0: [ // VERMELHO - Horizontal (esquerda → centro)
      { col: 2, row: 8 }, { col: 3, row: 8 }, { col: 4, row: 8 }, { col: 5, row: 8 }, { col: 6, row: 8 }, { col: 7, row: 8 }
    ],
    1: [ // VERDE - Vertical (cima → centro)
      { col: 8, row: 2 }, { col: 8, row: 3 }, { col: 8, row: 4 }, { col: 8, row: 5 }, { col: 8, row: 6 }, { col: 8, row: 7 }
    ],
    2: [ // AZUL - Horizontal (direita → centro)
      { col: 14, row: 8 }, { col: 13, row: 8 }, { col: 12, row: 8 }, { col: 11, row: 8 }, { col: 10, row: 8 }, { col: 9, row: 8 }
    ],
    3: [ // AMARELO - Vertical (baixo → centro)
      { col: 8, row: 14 }, { col: 8, row: 13 }, { col: 8, row: 12 }, { col: 8, row: 11 }, { col: 8, row: 10 }, { col: 8, row: 9 }
    ]
  };

  // Obter peões em uma posição
  const getPawnsAtPosition = (location, position) => {
    const pawns = [];
    players.forEach(player => {
      player.pawns?.forEach(pawn => {
        if (pawn.location === location && pawn.position === position && !pawn.finished) {
          pawns.push({ ...pawn, playerIndex: player.id });
        }
      });
    });
    return pawns;
  };

  // Renderizar peão (SEM ANIMAÇÕES CURVAS)
  const Pawn = ({ playerIndex, size = 20, index = 0 }) => {
    const color = colors[playerIndex];
    const offset = index * 4;
    
    return (
      <div
        className="absolute rounded-full border-2 border-white"
        style={{ 
          width: size,
          height: size,
          left: `calc(50% - ${size/2}px + ${offset}px)`,
          top: `calc(50% - ${size/2}px + ${offset}px)`,
          background: `radial-gradient(circle at 35% 35%, ${color.light}, ${color.main})`,
          boxShadow: `0 2px 8px rgba(0,0,0,0.3)`,
          zIndex: 30 + index
        }}
      />
    );
  };

  // Renderizar casa QUADRADA (com alternância branco/cinza)
  const Cell = ({ coord, index, isFinal = false }) => {
    const pawns = getPawnsAtPosition(isFinal ? 'final' : 'main', index);
    const hasQuiz = !isFinal && index % 5 === 0 && index > 0;
    const hasMosquito = !isFinal && index % 7 === 0 && index > 0;
    
    let cellBg = 'white';
    let borderColor = '#D1D5DB';
    
    // Casas coloridas (saída ou caminho final)
    if (coord.color !== undefined && !isFinal) {
      cellBg = colors[coord.color].light;
      borderColor = colors[coord.color].main;
    } else if (isFinal) {
      // Caminhos finais coloridos
      cellBg = colors[coord.color].main;
      borderColor = colors[coord.color].dark;
    } else {
      // Casas brancas/cinza alternadas
      cellBg = index % 2 === 0 ? '#FFFFFF' : '#F5F5F5';
    }
    
    return (
      <div
        className="aspect-square flex items-center justify-center relative"
        style={{ 
          gridColumn: coord.col,
          gridRow: coord.row,
          backgroundColor: cellBg,
          border: `1px solid ${borderColor}`
        }}
      >
        {/* Ícones FIXOS (sem animação) */}
        {coord.isStart && <Target className="w-4 h-4 absolute" style={{ color: borderColor }} />}
        {coord.isSafe && <Shield className="w-4 h-4 text-blue-600" strokeWidth={2.5} />}
        {hasQuiz && <HelpCircle className="w-4 h-4 text-purple-600" />}
        {hasMosquito && <Bug className="w-4 h-4 text-red-600" />}
        
        {/* Peões */}
        {pawns.map((pawn, idx) => (
          <Pawn key={`${pawn.playerIndex}-${pawn.id}`} playerIndex={pawn.playerIndex} index={idx} />
        ))}
      </div>
    );
  };

  // Renderizar base
  const PlayerBase = ({ playerIndex, gridArea }) => {
    const color = colors[playerIndex];
    const player = players[playerIndex];
    const basePawns = player?.pawns?.filter(p => p.location === 'base') || [];
    
    return (
      <div 
        className="flex flex-col items-center justify-center p-3"
        style={{ gridArea, backgroundColor: color.main }}
      >
        <div className="text-white font-bold text-xs mb-2">{player?.name || `P${playerIndex + 1}`}</div>
        <div className="bg-white rounded-lg p-2 grid grid-cols-2 gap-2" style={{ width: '100px', height: '100px' }}>
          {[0, 1, 2, 3].map(i => {
            const pawn = basePawns.find(p => p.position === i);
            return (
              <div key={i} className="rounded-full border-2 flex items-center justify-center" style={{ borderColor: color.main }}>
                {pawn && <Pawn playerIndex={playerIndex} size={18} />}
              </div>
            );
          })}
        </div>
        <div className="text-white font-bold text-xs mt-1">🏆 {player?.score || 0}</div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 bg-gradient-to-br from-green-900 via-blue-900 to-cyan-800">
      <div className="relative">
        {/* Grid 15x15 - CRUZ CONTÍNUA LINEAR */}
        <div 
          className="grid bg-gray-100 shadow-2xl relative"
          style={{
            gridTemplateColumns: 'repeat(15, 40px)',
            gridTemplateRows: 'repeat(15, 40px)',
            width: '600px',
            height: '600px'
          }}
        >
          {/* BASES */}
          <PlayerBase playerIndex={1} gridArea="1 / 1 / 7 / 7" />
          <PlayerBase playerIndex={3} gridArea="1 / 10 / 7 / 16" />
          <PlayerBase playerIndex={0} gridArea="10 / 1 / 16 / 7" />
          <PlayerBase playerIndex={2} gridArea="10 / 10 / 16 / 16" />
          
          {/* CAMINHO EXTERNO - 52 casas */}
          {pathCoordinates.map((coord, i) => (
            <Cell key={`path-${i}`} coord={coord} index={i} />
          ))}
          
          {/* CASAS BRANCAS ANTES DO CENTRO - 6 por braço */}
          {Object.entries(whiteCenterPaths).map(([playerIndex, path]) =>
            path.map((coord, i) => (
              <Cell key={`white-${playerIndex}-${i}`} coord={coord} index={i + 100} />
            ))
          )}
          
          {/* CAMINHOS FINAIS COLORIDOS - 6 casas por cor (DEPOIS das brancas) */}
          {Object.entries(finalPaths).map(([playerIndex, path]) =>
            path.map((coord, i) => (
              <Cell key={`final-${playerIndex}-${i}`} coord={{ ...coord, color: parseInt(playerIndex) }} index={i} isFinal />
            ))
          )}
          
          {/* CENTRO - 4 triângulos coloridos PREENCHENDO TODO O QUADRADO */}
          <div style={{ gridColumn: 8, gridRow: 8 }} className="aspect-square relative border border-gray-400">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Verde - Triângulo Superior */}
              <polygon points="50,0 0,50 100,50" fill={colors[1].main} stroke="#333" strokeWidth="0.5" />
              
              {/* Vermelho - Triângulo Esquerdo */}
              <polygon points="0,50 50,0 50,100" fill={colors[0].main} stroke="#333" strokeWidth="0.5" />
              
              {/* Azul - Triângulo Direito */}
              <polygon points="100,50 50,0 50,100" fill={colors[2].main} stroke="#333" strokeWidth="0.5" />
              
              {/* Amarelo - Triângulo Inferior */}
              <polygon points="50,100 0,50 100,50" fill={colors[3].main} stroke="#333" strokeWidth="0.5" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                <Star className="w-3 h-3 text-yellow-500" fill="#EAB308" strokeWidth={3} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Dado */}
        {diceValue && (
          <div className="absolute -top-6 -right-6 bg-white text-gray-800 font-black text-xl w-12 h-12 rounded-lg flex items-center justify-center border-2 border-gray-800 shadow-xl">
            🎲 {diceValue}
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardLudoGrid;
