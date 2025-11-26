import { motion } from 'framer-motion';
import { Pause, Play, Home, Trophy, CheckCircle, XCircle, TrendingUp, Users, Activity } from 'lucide-react';
import { useState } from 'react';
import useGameStore from '../store/gameStore';
import BoardLudoGrid from './BoardLudoGrid';
import Dice from './Dice';
import QuizModal from './QuizModal';
import MessageOverlay from './MessageOverlay';

const Game = () => {
  const { resetGame, setGameState } = useGameStore();
  const [isPaused, setIsPaused] = useState(false);

  const handlePause = () => setIsPaused(!isPaused);

  const handleQuit = () => {
    if (window.confirm('Deseja realmente sair? Seu progresso será perdido.')) {
      resetGame();
      setGameState('menu');
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-5" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />

      {/* Layout Responsivo Premium */}
      <div className="relative h-full min-h-screen flex flex-col lg:grid lg:grid-cols-12 gap-3 sm:gap-4 p-3 sm:p-4 lg:p-6">

        {/* HEADER MOBILE - Barra Superior Compacta */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-900/95 via-emerald-800/95 to-emerald-900/95 backdrop-blur-md border-b border-emerald-700/50 shadow-lg">
          <div className="flex items-center justify-between px-4 pypy-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xs text-emerald-200">Pontuação</div>
                <div className="text-lg font-black text-white">{useGameStore.getState().score}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-emerald-100">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-primary-400" />
                {useGameStore.getState().correctAnswers}
              </span>
              <span className="flex items-center gap-1">
                <XCircle className="w-3 h-3 text-red-400" />
                {useGameStore.getState().wrongAnswers}
              </span>
            </div>
          </div>
        </div>

        {/* Espaçamento para header mobile */}
        <div className="lg:hidden h-12" />

        {/* SIDEBAR DESKTOP - Esquerda */}
        <div className="hidden lg:flex lg:col-span-2 flex-col gap-4">
          <motion.div
            className="glass-dark rounded-2xl p-5 shadow-2xl border border-emerald-500/20"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-glow">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xs text-emerald-300 font-semibold uppercase tracking-wide">Pontos</div>
                <div className="text-3xl font-black text-white">{useGameStore.getState().score}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm bg-emerald-950/50 p-2 rounded-lg">
                <CheckCircle className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <span className="text-emerald-200">Acertos:</span>
                <strong className="text-white ml-auto">{useGameStore.getState().correctAnswers}</strong>
              </div>
              <div className="flex items-center gap-2 text-sm bg-emerald-950/50 p-2 rounded-lg">
                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-emerald-200">Erros:</span>
                <strong className="text-white ml-auto">{useGameStore.getState().wrongAnswers}</strong>
              </div>
              <div className="flex items-center gap-2 text-sm bg-emerald-950/50 p-2 rounded-lg">
                <TrendingUp className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-emerald-200">Precisão:</span>
                <strong className="text-white ml-auto">
                  {useGameStore.getState().correctAnswers + useGameStore.getState().wrongAnswers > 0
                    ? Math.round((useGameStore.getState().correctAnswers / (useGameStore.getState().correctAnswers + useGameStore.getState().wrongAnswers)) * 100)
                    : 0}%
                </strong>
              </div>
            </div>
          </motion.div>

          {/* Controles Desktop */}
          <motion.div
            className="glass-dark rounded-2xl p-4 flex flex-col gap-3 border border-emerald-500/20"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <motion.button
              onClick={handlePause}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-3 rounded-xl shadow-glow hover:shadow-glow-lg transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              {isPaused ? 'Continuar' : 'Pausar'}
            </motion.button>

            <motion.button
              onClick={handleQuit}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Home className="w-5 h-5" />
              Sair
            </motion.button>
          </motion.div>
        </div>

        {/* TABULEIRO - Centro */}
        <div className="flex-1 lg:col-span-7 flex items-center justify-center">
          <BoardLudoGrid />
        </div>

        {/* SIDEBAR DIREITA - Jogadores e Dado */}
        <div className="lg:col-span-3 flex flex-col gap-3 sm:gap-4">

          {/* Jogadores */}
          <motion.div
            className="glass-dark rounded-2xl p-4 sm:p-5 shadow-2xl border border-emerald-500/20"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-primary-400" />
              <div className="text-sm font-bold text-white uppercase tracking-wide">Jogadores</div>
            </div>

            <div className="space-y-3">
              {useGameStore.getState().players.map((player, index) => {
                const finishedCount = player.pawns?.filter(p => p.finished).length || 0;
                const inPlayCount = player.pawns?.filter(p => p.location !== 'base' && !p.finished).length || 0;
                const isCurrentPlayer = index === useGameStore.getState().currentPlayerIndex;

                return (
                  <motion.div
                    key={player.id}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isCurrentPlayer
                        ? 'bg-primary-500/20 border-2 border-primary-500'
                        : 'bg-emerald-950/30 border border-emerald-800/30'
                      }`}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl border-2 border-white/20 shadow-lg flex items-center justify-center text-white font-bold relative"
                      style={{ backgroundColor: player.color }}
                    >
                      {player.name.charAt(0)}
                      {isCurrentPlayer && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-400 rounded-full border-2 border-white animate-pulse" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate">
                        {player.name}
                      </div>
                      <div className="text-xs text-emerald-300 flex items-center gap-2">
                        <span>🏠{4 - inPlayCount - finishedCount}</span>
                        <span>🎮{inPlayCount}</span>
                        <span>🏆{finishedCount}</span>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-primary-400">
                      {player.score}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Dado */}
          <motion.div
            className="glass-dark rounded-2xl p-5 flex flex-col items-center justify-center shadow-2xl border border-emerald-500/20"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-3 text-emerald-300 text-sm font-semibold">
              <Activity className="w-4 h-4" />
              <span>Lançar Dado</span>
            </div>
            <Dice />
          </motion.div>
        </div>

        {/* CONTROLES MOBILE - Bottom Fixed */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-emerald-900/95 via-emerald-800/95 to-transparent backdrop-blur-md border-t border-emerald-700/50 p-3">
          <div className="flex gap-3">
            <motion.button
              onClick={handlePause}
              className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-3 rounded-xl shadow-xl flex items-center justify-center gap-2"
              whileTap={{ scale: 0.95 }}
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              <span>{isPaused ? 'Continuar' : 'Pausar'}</span>
            </motion.button>

            <motion.button
              onClick={handleQuit}
              className="bg-gray-700 text-white font-bold py-3 px-6 rounded-xl shadow-xl flex items-center justify-center"
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Espaçamento para controles mobile */}
        <div className="lg:hidden h-16" />
      </div>

      <QuizModal />
      <MessageOverlay />

      {/* Pause Overlay */}
      {isPaused && (
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-gradient-to-br from-emerald-900 to-emerald-800 rounded-3xl p-10 text-center shadow-2xl max-w-sm mx-4 border-2 border-emerald-500/30"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <div className="text-7xl mb-5">⏸️</div>
            <h2 className="text-3xl font-bold text-white mb-3">JOGO PAUSADO</h2>
            <p className="text-emerald-200 mb-8">Clique para continuar jogando</p>
            <motion.button
              onClick={handlePause}
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-4 px-12 rounded-2xl shadow-glow hover:shadow-glow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ▶️ Continuar
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Game;
