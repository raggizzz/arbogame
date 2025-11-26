import { Star, Bug } from 'lucide-react';
import useGameStore from '../store/gameStore';

const BoardLudoGrid = () => {
  const { board, players } = useGameStore();

  if (!board || !players) return null;

  const colors = {
    red: '#DC2626',
    green: '#059669',
    yellow: '#EAB308',
    blue: '#2563EB'
  };

  // Cruz completa
  const crossCells = [];
  for (let row = 1; row <= 15; row++) {
    for (let col = 1; col <= 15; col++) {
      if ((row >= 7 && row <= 9) || (col >= 7 && col <= 9)) {
        crossCells.push({ col, row });
      }
    }
  }

  // Caminho principal (52 casas) - CORRIGIDO
  const pathPositions = [
    // VERMELHO (inferior esquerdo)
    { col: 2, row: 9, color: 'red', isStart: true }, // 0
    { col: 3, row: 9 }, { col: 4, row: 9 }, { col: 5, row: 9 }, { col: 6, row: 9 },

    // Sobe coluna 7
    { col: 7, row: 9 }, { col: 7, row: 8, isSafe: true }, { col: 7, row: 7 },
    { col: 7, row: 6 }, { col: 7, row: 5 }, { col: 7, row: 4 }, { col: 7, row: 3 },

    // VERDE (superior esquerdo)
    { col: 7, row: 2, color: 'green', isStart: true }, // 12

    // Direita linha 1
    { col: 8, row: 1 }, { col: 9, row: 1 },

    // Desce coluna 9
    { col: 9, row: 2 }, { col: 9, row: 3 }, { col: 9, row: 4, isSafe: true },
    { col: 9, row: 5 }, { col: 9, row: 6 },

    // AMARELO (superior direito) - saída em row 7, col 14
    { col: 14, row: 7, color: 'yellow', isStart: true }, // 20
    { col: 13, row: 7 }, { col: 12, row: 7 }, { col: 11, row: 7 }, { col: 10, row: 7 }, { col: 9, row: 7 },

    // Continua descendo
    { col: 9, row: 8 }, { col: 9, row: 9 },

    // Continua borda direita
    { col: 10, row: 9 }, { col: 11, row: 9 }, { col: 12, row: 9 }, { col: 13, row: 9 },
    { col: 14, row: 9 }, { col: 15, row: 9 },

    // Desce coluna 9
    { col: 9, row: 10 }, { col: 9, row: 11 }, { col: 9, row: 12, isSafe: true }, { col: 9, row: 13 },

    // AZUL (inferior direito) - saída em row 14, col 9
    { col: 9, row: 14, color: 'blue', isStart: true }, // 39
    { col: 9, row: 15 },

    // Esquerda linha 15
    { col: 8, row: 15 }, { col: 7, row: 15 },

    // Sobe coluna 7
    { col: 7, row: 14 }, { col: 7, row: 13 }, { col: 7, row: 12, isSafe: true },
    { col: 7, row: 11 }, { col: 7, row: 10 },

    // Fecha círculo linha 9
    { col: 6, row: 9 }, { col: 5, row: 9 }, { col: 4, row: 9 },
    { col: 3, row: 9 }, { col: 2, row: 9 }, { col: 1, row: 9 }
  ];

  // Caminhos finais SEM o centro (8,8)
  const homePositions = {
    red: [{ col: 2, row: 8 }, { col: 3, row: 8 }, { col: 4, row: 8 }, { col: 5, row: 8 }, { col: 6, row: 8 }, { col: 7, row: 8 }],
    green: [{ col: 8, row: 2 }, { col: 8, row: 3 }, { col: 8, row: 4 }, { col: 8, row: 5 }, { col: 8, row: 6 }, { col: 8, row: 7 }],
    yellow: [{ col: 14, row: 8 }, { col: 13, row: 8 }, { col: 12, row: 8 }, { col: 11, row: 8 }, { col: 10, row: 8 }, { col: 9, row: 8 }],
    blue: [{ col: 8, row: 14 }, { col: 8, row: 13 }, { col: 8, row: 12 }, { col: 8, row: 11 }, { col: 8, row: 10 }, { col: 8, row: 9 }]
  };

  const getCellType = (col, row) => {
    if (col === 8 && row === 8) return { type: 'center' };

    const pathIdx = pathPositions.findIndex(p => p.col === col && p.row === row);
    if (pathIdx >= 0) return { type: 'path', ...pathPositions[pathIdx], pathIdx };

    for (const [color, positions] of Object.entries(homePositions)) {
      const homeIdx = positions.findIndex(p => p.col === col && p.row === row);
      if (homeIdx >= 0) return { type: 'home', color, homeIdx };
    }

    return { type: 'empty' };
  };

  const getPawnsAt = (location, position) => {
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

  const Pawn = ({ playerIdx, size = 12 }) => {
    const colorMap = [colors.red, colors.green, colors.yellow, colors.blue];
    return (
      <div className="absolute rounded-full border-2 border-white shadow-lg" style={{
        width: size, height: size,
        backgroundColor: colorMap[playerIdx],
        left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 20
      }} />
    );
  };

  const Cell = ({ col, row }) => {
    const cellInfo = getCellType(col, row);
    let bgColor = '#FFFFFF';
    let borderColor = '#D1D5DB';
    let content = null;
    let pawns = [];

    if (cellInfo.type === 'center') return null;

    if (cellInfo.type === 'path') {
      pawns = getPawnsAt('main', cellInfo.pathIdx);

      if (cellInfo.color) {
        bgColor = cellInfo.color === 'red' ? '#FCA5A5' :
          cellInfo.color === 'green' ? '#6EE7B7' :
            cellInfo.color === 'yellow' ? '#FDE047' : '#93C5FD';
        borderColor = colors[cellInfo.color];
      }

      if (cellInfo.isSafe) {
        content = <Star className="w-3 h-3 text-gray-700" strokeWidth={2.5} />;
      }

      if (cellInfo.pathIdx % 8 === 0 && cellInfo.pathIdx > 0) {
        content = <Bug className="w-3 h-3 text-red-500 absolute top-0 right-0" />;
      }
    }

    if (cellInfo.type === 'home') {
      pawns = getPawnsAt('final', cellInfo.homeIdx);
      bgColor = colors[cellInfo.color];
      borderColor = colors[cellInfo.color];
    }

    return (
      <div
        className="relative flex items-center justify-center bg-white"
        style={{
          gridColumn: col, gridRow: row,
          backgroundColor: bgColor,
          border: `1px solid ${borderColor}`,
          minHeight: '26px', minWidth: '26px'
        }}
      >
        {content}
        {pawns.map(p => <Pawn key={`${p.playerIndex}-${p.id}`} playerIdx={p.playerIndex} />)}
      </div>
    );
  };

  const PlayerBase = ({ playerIdx, area }) => {
    const colorMap = [colors.red, colors.green, colors.yellow, colors.blue];
    const names = ['Vermelho', 'Verde', 'Amarelo', 'Azul'];
    const color = colorMap[playerIdx];
    const player = players[playerIdx];
    const basePawns = player?.pawns?.filter(p => p.location === 'base') || [];

    return (
      <div
        className="flex flex-col items-center justify-center p-2 rounded-lg shadow-xl"
        style={{ gridArea: area, backgroundColor: color }}
      >
        <div className="text-white text-xs font-bold mb-1 text-center truncate w-full px-1">
          {player?.name || names[playerIdx]}
        </div>
        <div className="grid grid-cols-2 gap-1 bg-white/95 rounded-lg p-1.5 shadow-inner" style={{ width: '48px', height: '48px' }}>
          {[0, 1, 2, 3].map(i => {
            const pawn = basePawns.find(p => p.position === i);
            return (
              <div key={i} className="rounded-full border-2 flex items-center justify-center bg-white"
                style={{ borderColor: color }}>
                {pawn && <Pawn playerIdx={playerIdx} size={10} />}
              </div>
            );
          })}
        </div>
        <div className="text-white text-xs font-bold mt-0.5">🏆 {player?.score || 0}</div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <div className="relative">
        <div
          className="grid bg-gray-200 shadow-2xl rounded-xl border-4 border-gray-900"
          style={{
            gridTemplateColumns: 'repeat(15, minmax(24px, 28px))',
            gridTemplateRows: 'repeat(15, minmax(24px, 28px))',
            maxWidth: '520px',
            aspectRatio: '1/1',
            gap: '1px'
          }}
        >
          <PlayerBase playerIdx={0} area="10/1/16/7" />
          <PlayerBase playerIdx={1} area="1/1/7/7" />
          <PlayerBase playerIdx={2} area="1/10/7/16" />
          <PlayerBase playerIdx={3} area="10/10/16/16" />

          {crossCells.map((cell) => (
            <Cell key={`${cell.col}-${cell.row}`} col={cell.col} row={cell.row} />
          ))}

          {/* Centro - vitória final */}
          <div className="relative bg-white border-2 border-gray-900 rounded-sm" style={{ gridColumn: 8, gridRow: 8 }}>
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="50,50 0,0 100,0" fill={colors.green} />
              <polygon points="50,50 100,0 100,100" fill={colors.yellow} />
              <polygon points="50,50 100,100 0,100" fill={colors.blue} />
              <polygon points="50,50 0,100 0,0" fill={colors.red} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-full p-0.5 shadow-lg">
                <Bug className="w-3 h-3 text-red-600" fill="currentColor" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 flex justify-center gap-2 text-xs">
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-sm border">
            <Star className="w-3 h-3 text-gray-700" />
            <span>Segura</span>
          </div>
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-sm border">
            <Bug className="w-3 h-3 text-red-500" />
            <span>Mosquito</span>
          </div>
        </div>

        <div className="mt-2 text-center text-sm font-bold text-primary-500">
          🦟 Ludo da Dengue 💧
        </div>
      </div>
    </div>
  );
};

export default BoardLudoGrid;
