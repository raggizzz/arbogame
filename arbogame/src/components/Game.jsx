import { motion } from 'framer-motion';
import { Activity, CheckCircle, Home, Pause, Play, Trophy, TrendingUp, Users, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import useGameStore from '../store/gameStore';
import { leaveRoom, subscribeToRoom } from '../firebase/multiplayerService';
import BoardLudoGrid from './BoardLudoGrid';
import Dice from './Dice';
import QuizModal from './QuizModal';
import MessageOverlay from './MessageOverlay';

const Game = () => {
  const {
    resetGame,
    setGameState,
    score,
    correctAnswers,
    wrongAnswers,
    players,
    currentPlayerIndex,
    isOnlineMultiplayer,
    multiplayerRoomId,
    localPlayerId,
    applyOnlineRoomState
  } = useGameStore();
  const [isPaused, setIsPaused] = useState(false);
  const totalAnswers = correctAnswers + wrongAnswers;
  const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  const handlePause = () => setIsPaused(!isPaused);

  useEffect(() => {
    if (!isOnlineMultiplayer || !multiplayerRoomId) return undefined;

    const unsubscribe = subscribeToRoom(multiplayerRoomId, (room) => {
      if (!room) {
        resetGame();
        setGameState('menu');
        return;
      }

      if (room.status === 'playing' || room.status === 'finished') {
        applyOnlineRoomState(room);
      }
    });

    return unsubscribe;
  }, [applyOnlineRoomState, isOnlineMultiplayer, multiplayerRoomId, resetGame, setGameState]);

  const handleQuit = () => {
    if (window.confirm('Deseja realmente sair? Seu progresso sera perdido.')) {
      if (isOnlineMultiplayer && multiplayerRoomId && localPlayerId) {
        leaveRoom(multiplayerRoomId, localPlayerId).catch((error) => {
          console.error('Erro ao sair da sala online:', error);
        });
      }
      resetGame();
      setGameState('menu');
    }
  };

  return (
    <main className="screen-shell-dark">
      <div className="relative z-10 min-h-screen p-3 pb-28 sm:p-4 lg:grid lg:grid-cols-[240px_minmax(0,1fr)_300px] lg:gap-4 lg:p-5 lg:pb-5">
        <MobileTopBar score={score} correctAnswers={correctAnswers} wrongAnswers={wrongAnswers} />

        <aside className="hidden min-w-0 flex-col gap-4 lg:flex">
          <ScorePanel score={score} correctAnswers={correctAnswers} wrongAnswers={wrongAnswers} accuracy={accuracy} />
          <ControlPanel isPaused={isPaused} onPause={handlePause} onQuit={handleQuit} />
        </aside>

        <section className="flex min-w-0 items-center justify-center pt-16 lg:pt-0">
          <div className="w-full max-w-[min(92vh,900px)]">
            <BoardLudoGrid />
          </div>
        </section>

        <aside className="mt-4 flex min-w-0 flex-col gap-4 lg:mt-0">
          <PlayersPanel players={players} currentPlayerIndex={currentPlayerIndex} />
          <DicePanel />
        </aside>

        <MobileBottomBar isPaused={isPaused} onPause={handlePause} onQuit={handleQuit} />
      </div>

      <QuizModal />
      <MessageOverlay />

      {isPaused && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/76 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="surface-panel w-full max-w-sm rounded-[2rem] p-6 text-center"
            initial={{ scale: 0.92 }}
            animate={{ scale: 1 }}
          >
            <div className="icon-badge mx-auto mb-4 h-16 w-16">
              <Pause className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-black text-emerald-950">Jogo pausado</h2>
            <p className="mt-2 font-semibold text-emerald-900/60">Continue quando estiver pronto.</p>
            <motion.button
              onClick={handlePause}
              className="mt-6 inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl font-black action-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="h-5 w-5" fill="currentColor" />
              Continuar
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </main>
  );
};

const MobileTopBar = ({ score, correctAnswers, wrongAnswers }) => (
  <div className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-emerald-950/82 px-4 py-3 backdrop-blur-xl lg:hidden">
    <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
      <div>
        <div className="text-xs font-bold uppercase text-primary-200/70">Pontos</div>
        <div className="text-2xl font-black text-white">{score}</div>
      </div>
      <div className="flex items-center gap-3 text-sm font-black text-white">
        <span className="inline-flex items-center gap-1"><CheckCircle className="h-4 w-4 text-primary-300" />{correctAnswers}</span>
        <span className="inline-flex items-center gap-1"><XCircle className="h-4 w-4 text-red-300" />{wrongAnswers}</span>
      </div>
    </div>
  </div>
);

const ScorePanel = ({ score, correctAnswers, wrongAnswers, accuracy }) => (
  <motion.section
    className="surface-panel-dark rounded-[1.5rem] p-4"
    initial={{ x: -18, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
  >
    <div className="mb-5 flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-400/15 text-primary-300">
        <Trophy className="h-6 w-6" />
      </div>
      <div>
        <div className="text-xs font-black uppercase text-white/45">Pontuacao</div>
        <div className="text-3xl font-black text-white">{score}</div>
      </div>
    </div>

    <div className="grid gap-2">
      <MiniMetric icon={CheckCircle} label="Acertos" value={correctAnswers} tone="text-primary-300" />
      <MiniMetric icon={XCircle} label="Erros" value={wrongAnswers} tone="text-red-300" />
      <MiniMetric icon={TrendingUp} label="Precisao" value={`${accuracy}%`} tone="text-secondary-300" />
    </div>
  </motion.section>
);

const ControlPanel = ({ isPaused, onPause, onQuit }) => (
  <motion.section
    className="surface-panel-dark rounded-[1.5rem] p-4"
    initial={{ x: -18, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: 0.08 }}
  >
    <div className="grid gap-3">
      <motion.button
        onClick={onPause}
        className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl font-black action-primary"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
        {isPaused ? 'Continuar' : 'Pausar'}
      </motion.button>
      <motion.button
        onClick={onQuit}
        className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-white/10 font-black text-white transition hover:bg-white/15"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Home className="h-5 w-5" />
        Sair
      </motion.button>
    </div>
  </motion.section>
);

const PlayersPanel = ({ players, currentPlayerIndex }) => (
  <motion.section
    className="surface-panel-dark rounded-[1.5rem] p-4"
    initial={{ x: 18, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
  >
    <div className="mb-4 flex items-center gap-2">
      <Users className="h-5 w-5 text-primary-300" />
      <div className="text-sm font-black uppercase text-white">Jogadores</div>
    </div>

    <div className="grid gap-2">
      {players.map((player, index) => {
        const finishedCount = player.pawns?.filter((p) => p.finished).length || 0;
        const inPlayCount = player.pawns?.filter((p) => p.location !== 'base' && !p.finished).length || 0;
        const isCurrentPlayer = index === currentPlayerIndex;

        return (
          <motion.div
            key={player.id}
            className={`flex items-center gap-3 rounded-2xl p-3 transition ${
              isCurrentPlayer ? 'bg-primary-400/16 ring-2 ring-primary-300/70' : 'bg-white/8 ring-1 ring-white/8'
            }`}
            initial={{ x: 18, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <div
              className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl text-base font-black text-white shadow-lg"
              style={{ backgroundColor: player.color }}
            >
              {player.name.charAt(0)}
              {isCurrentPlayer && <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-emerald-950 bg-primary-300" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-black text-white">{player.name}</div>
              <div className="mt-1 flex gap-2 text-xs font-bold text-white/50">
                <span>Base {4 - inPlayCount - finishedCount}</span>
                <span>Jogo {inPlayCount}</span>
                <span>Fim {finishedCount}</span>
              </div>
            </div>
            <div className="text-sm font-black text-primary-300">{player.score}</div>
          </motion.div>
        );
      })}
    </div>
  </motion.section>
);

const DicePanel = () => (
  <motion.section
    className="surface-panel-dark rounded-[1.5rem] p-5 text-center"
    initial={{ x: 18, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: 0.08 }}
  >
    <div className="mb-3 inline-flex items-center gap-2 text-sm font-black uppercase text-white/55">
      <Activity className="h-4 w-4 text-primary-300" />
      Lancar dado
    </div>
    <Dice />
  </motion.section>
);

const MiniMetric = ({ icon: Icon, label, value, tone }) => (
  <div className="flex items-center gap-2 rounded-2xl bg-white/8 px-3 py-2">
    <Icon className={`h-4 w-4 ${tone}`} />
    <span className="text-sm font-semibold text-white/60">{label}</span>
    <strong className="ml-auto text-white">{value}</strong>
  </div>
);

const MobileBottomBar = ({ isPaused, onPause, onQuit }) => (
  <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-emerald-950/82 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
    <div className="mx-auto flex max-w-3xl gap-3">
      <button
        onClick={onPause}
        className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl font-black action-primary"
      >
        {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
        {isPaused ? 'Continuar' : 'Pausar'}
      </button>
      <button
        onClick={onQuit}
        className="inline-flex min-h-[52px] w-16 items-center justify-center rounded-2xl bg-white/10 text-white"
        aria-label="Sair"
      >
        <Home className="h-5 w-5" />
      </button>
    </div>
  </div>
);

export default Game;
