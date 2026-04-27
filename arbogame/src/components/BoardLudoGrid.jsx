import { LayoutGroup, motion } from 'framer-motion';
import { Bug, Droplets, HelpCircle, Shield, Sparkles, Star, Trophy } from 'lucide-react';
import useGameStore from '../store/gameStore';

const PLAYER_META = [
  { name: 'Verde', color: '#00A844', light: '#BBF7D0' },
  { name: 'Amarelo', color: '#F59E0B', light: '#FEF3C7' },
  { name: 'Azul', color: '#0BA5E9', light: '#BAE6FD' },
  { name: 'Vermelho', color: '#EF4444', light: '#FECACA' }
];

const basePath = [
  [7, 14], [7, 13], [7, 12], [7, 11], [7, 10], [6, 9], [5, 9], [4, 9],
  [3, 9], [2, 9], [1, 9], [1, 8], [1, 7], [2, 7], [3, 7], [4, 7],
  [5, 7], [6, 7], [7, 6], [7, 5], [7, 4], [7, 3], [7, 2], [7, 1],
  [8, 1], [9, 1], [9, 2], [9, 3], [9, 4], [9, 5], [9, 6], [10, 7],
  [11, 7], [12, 7], [13, 7], [14, 7], [15, 7], [15, 8], [15, 9], [14, 9],
  [13, 9], [12, 9], [11, 9], [10, 9], [9, 10], [9, 11], [9, 12], [9, 13],
  [9, 14], [9, 15], [8, 15], [7, 15]
];

const pathPositions = [...basePath.slice(13), ...basePath.slice(0, 13)].map(([col, row]) => ({ col, row }));

const finalPositions = [
  [[2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8]],
  [[8, 2], [8, 3], [8, 4], [8, 5], [8, 6], [8, 7]],
  [[14, 8], [13, 8], [12, 8], [11, 8], [10, 8], [9, 8]],
  [[8, 14], [8, 13], [8, 12], [8, 11], [8, 10], [8, 9]]
].map((lane) => lane.map(([col, row]) => ({ col, row })));

const baseAreas = ['1/1/7/7', '1/10/7/16', '10/10/16/16', '10/1/16/7'];
const safeCells = [0, 8, 13, 21, 26, 34, 39, 47];
const startCells = [0, 13, 26, 39];

const cellIconByType = {
  1: <Droplets className="h-3.5 w-3.5 text-sky-700" />,
  2: <Sparkles className="h-3.5 w-3.5 text-emerald-700" />,
  3: <HelpCircle className="h-3.5 w-3.5 text-violet-700" />,
  4: <Shield className="h-3.5 w-3.5 text-slate-700" />,
  5: <Star className="h-3.5 w-3.5 text-slate-700" />,
  9: <Bug className="h-3.5 w-3.5 text-red-700" />
};

const getCellTone = (cell, pathIdx) => {
  if (startCells.includes(pathIdx)) {
    const playerIndex = startCells.indexOf(pathIdx);
    return {
      background: PLAYER_META[playerIndex].light,
      border: PLAYER_META[playerIndex].color
    };
  }

  if (safeCells.includes(pathIdx)) {
    return { background: '#F8FAFC', border: '#64748B' };
  }

  switch (cell?.type) {
    case 1:
      return { background: '#DBEAFE', border: '#38BDF8' };
    case 2:
      return { background: '#DCFCE7', border: '#22C55E' };
    case 3:
      return { background: '#EDE9FE', border: '#8B5CF6' };
    case 9:
      return { background: '#FEE2E2', border: '#EF4444' };
    default:
      return { background: '#FFFFFF', border: '#CBD5E1' };
  }
};

const BoardLudoGrid = () => {
  const { board, players, currentPlayerIndex, selectPawn, canRoll } = useGameStore();

  const getPawnsAt = (location, position, playerFilter = null) => {
    const pawns = [];
    players.forEach((player, playerIndex) => {
      if (playerFilter !== null && playerIndex !== playerFilter) return;

      player.pawns?.forEach((pawn) => {
        if (pawn.location === location && (position === null || pawn.position === position) && !pawn.finished) {
          pawns.push({ ...pawn, playerIndex });
        }
      });
    });
    return pawns;
  };

  const handlePawnClick = (pawn) => {
    if (pawn.playerIndex !== currentPlayerIndex || !canRoll) return;
    selectPawn(pawn.id);
  };

  const Pawn = ({ pawn, compact = false }) => {
    const player = players[pawn.playerIndex];
    const isSelected = pawn.playerIndex === currentPlayerIndex && player?.selectedPawn === pawn.id;

    return (
      <motion.button
        type="button"
        layout
        layoutId={`pawn-${pawn.playerIndex}-${pawn.id}`}
        aria-label={`Selecionar peão ${pawn.id + 1}`}
        onClick={() => handlePawnClick(pawn)}
        className={`relative rounded-full border-2 shadow-lg transition-transform ${
          isSelected ? 'scale-110 border-white ring-4 ring-white/70' : 'border-white/80'
        } ${pawn.playerIndex === currentPlayerIndex && canRoll ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
        style={{
          width: compact ? 14 : 18,
          height: compact ? 14 : 18,
          backgroundColor: PLAYER_META[pawn.playerIndex].color
        }}
        animate={{
          y: isSelected ? [0, -2, 0] : 0,
          boxShadow: isSelected
            ? '0 8px 18px rgba(255,255,255,0.45)'
            : '0 6px 14px rgba(15,23,42,0.28)'
        }}
        transition={{
          layout: { type: 'spring', stiffness: 420, damping: 30 },
          y: { duration: 0.8, repeat: isSelected ? Infinity : 0, ease: 'easeInOut' },
          boxShadow: { duration: 0.2 }
        }}
      >
        {isSelected && (
          <motion.span
            className="absolute -inset-1 rounded-full border border-white/70"
            animate={{ scale: [1, 1.45], opacity: [0.75, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <span className="sr-only">{player?.name}</span>
      </motion.button>
    );
  };

  const renderPawnStack = (pawns) => (
    <div className="absolute inset-0 grid place-items-center">
      <div className="grid grid-cols-2 gap-0.5">
        {pawns.slice(0, 4).map((pawn) => (
          <Pawn key={`${pawn.playerIndex}-${pawn.id}`} pawn={pawn} compact={pawns.length > 1} />
        ))}
      </div>
    </div>
  );

  const Cell = ({ col, row }) => {
    const pathIdx = pathPositions.findIndex((position) => position.col === col && position.row === row);
    const finalPlayerIndex = finalPositions.findIndex((lane) => lane.some((position) => position.col === col && position.row === row));

    if (pathIdx === -1 && finalPlayerIndex === -1) return null;

    if (pathIdx !== -1) {
      const cell = board.mainPath[pathIdx];
      const pawns = getPawnsAt('main', pathIdx);
      const tone = getCellTone(cell, pathIdx);

      return (
        <div
          className="relative grid place-items-center rounded-[4px] border text-[10px] font-black shadow-sm"
          style={{ gridColumn: col, gridRow: row, backgroundColor: tone.background, borderColor: tone.border }}
        >
          {cellIconByType[cell?.type] || (safeCells.includes(pathIdx) ? cellIconByType[4] : null)}
          {pawns.length > 0 && renderPawnStack(pawns)}
        </div>
      );
    }

    const homeIdx = finalPositions[finalPlayerIndex].findIndex((position) => position.col === col && position.row === row);
    const pawns = getPawnsAt('final', homeIdx, finalPlayerIndex);

    return (
      <div
        className="relative grid place-items-center rounded-[4px] border border-white/70 shadow-sm"
        style={{
          gridColumn: col,
          gridRow: row,
          backgroundColor: PLAYER_META[finalPlayerIndex].color
        }}
      >
        {homeIdx === 5 && <Trophy className="h-3.5 w-3.5 text-white" />}
        {pawns.length > 0 && renderPawnStack(pawns)}
      </div>
    );
  };

  const PlayerBase = ({ playerIndex }) => {
    const player = players[playerIndex];
    const basePawns = getPawnsAt('base', null, playerIndex);
    const finishedCount = player?.pawns?.filter((pawn) => pawn.finished).length || 0;
    const isCurrent = currentPlayerIndex === playerIndex;

    return (
      <div
        className={`flex flex-col items-center justify-center rounded-lg p-2 text-white shadow-xl ${
          isCurrent ? 'ring-4 ring-white/80' : ''
        }`}
        style={{ gridArea: baseAreas[playerIndex], backgroundColor: PLAYER_META[playerIndex].color }}
      >
        <div className="mb-1 w-full truncate px-1 text-center text-[11px] font-black">
          {player?.name || PLAYER_META[playerIndex].name}
        </div>
        <div className="grid h-14 w-14 grid-cols-2 gap-1 rounded-lg bg-white/95 p-1.5 shadow-inner">
          {[0, 1, 2, 3].map((position) => {
            const pawn = basePawns.find((item) => item.position === position);
            return (
              <div
                key={position}
                className="relative grid place-items-center rounded-full border-2 bg-white"
                style={{ borderColor: PLAYER_META[playerIndex].color }}
              >
                {pawn && <Pawn pawn={pawn} compact />}
              </div>
            );
          })}
        </div>
        <div className="mt-1 flex items-center gap-1 text-[11px] font-bold">
          <Trophy className="h-3 w-3" />
          {finishedCount}/4
        </div>
      </div>
    );
  };

  return (
    <LayoutGroup>
      <div className="flex w-full flex-col items-center justify-center gap-3 p-2">
      <div
        className="grid aspect-square w-full max-w-[min(92vw,560px)] rounded-xl border-4 border-slate-900 bg-slate-200 p-1 shadow-2xl"
        style={{
          gridTemplateColumns: 'repeat(15, minmax(0, 1fr))',
          gridTemplateRows: 'repeat(15, minmax(0, 1fr))',
          gap: 2
        }}
      >
        {[0, 1, 2, 3].map((playerIndex) => (
          <PlayerBase key={playerIndex} playerIndex={playerIndex} />
        ))}

        {Array.from({ length: 15 }, (_, row) =>
          Array.from({ length: 15 }, (_, col) => (
            <Cell key={`${col + 1}-${row + 1}`} col={col + 1} row={row + 1} />
          ))
        )}

        <div
          className="relative overflow-hidden rounded-md border-2 border-slate-900 bg-white"
          style={{ gridColumn: 8, gridRow: 8 }}
        >
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polygon points="50,50 0,0 100,0" fill={PLAYER_META[1].color} />
            <polygon points="50,50 100,0 100,100" fill={PLAYER_META[2].color} />
            <polygon points="50,50 100,100 0,100" fill={PLAYER_META[3].color} />
            <polygon points="50,50 0,100 0,0" fill={PLAYER_META[0].color} />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-white shadow-lg">
              <Bug className="h-5 w-5 text-red-600" fill="currentColor" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 text-xs font-semibold text-slate-700">
        <span className="inline-flex items-center gap-1 rounded-full border bg-white px-2 py-1 shadow-sm">
          <Shield className="h-3.5 w-3.5" /> Casa segura
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border bg-white px-2 py-1 shadow-sm">
          <Droplets className="h-3.5 w-3.5 text-sky-600" /> Criadouro
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border bg-white px-2 py-1 shadow-sm">
          <HelpCircle className="h-3.5 w-3.5 text-violet-600" /> Quiz
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border bg-white px-2 py-1 shadow-sm">
          <Bug className="h-3.5 w-3.5 text-red-600" /> Foco
        </span>
      </div>
      </div>
    </LayoutGroup>
  );
};

export default BoardLudoGrid;
