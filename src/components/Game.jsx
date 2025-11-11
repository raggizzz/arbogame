import { motion } from 'framer-motion';
import { Pause, Play, Home, Trophy, CheckCircle, XCircle, Target, Users } from 'lucide-react';
import { useState } from 'react';
import useGameStore from '../store/gameStore';
import BoardLudoGrid from './BoardLudoGrid';
import Dice from './Dice';
import HUD from './HUD';
import QuizModal from './QuizModal';
import MessageOverlay from './MessageOverlay';

const Game = () => {
  const { resetGame, setGameState } = useGameStore();
  const [isPaused, setIsPaused] = useState(false);
  
  const handlePause = () => {
    setIsPaused(!isPaused);
  };
  
  const handleQuit = () => {
    if (window.confirm('Deseja realmente sair? Seu progresso será perdido.')) {
      resetGame();
      setGameState('menu');
    }
  };
  
  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-10" />
      
      {/* Layout em Grid */}
      <div className="relative h-full grid grid-cols-12 gap-4 p-4">
        {/* Coluna Esquerda - Pontuação */}
        <div className="col-span-2 flex flex-col gap-4">
          <motion.div
            className="glass-dark rounded-3xl p-6 shadow-glow"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-glow-yellow">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xs text-white/60 font-semibold uppercase tracking-wider">Pontuação</div>
                <div className="text-3xl font-black gradient-text">{useGameStore.getState().score}</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-primary-400" />
                <span className="text-white/80">Acertos: <strong className="text-white">{useGameStore.getState().correctAnswers}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <XCircle className="w-4 h-4 text-danger-400" />
                <span className="text-white/80">Erros: <strong className="text-white">{useGameStore.getState().wrongAnswers}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-secondary-400" />
                <span className="text-white/80">
                  Precisão: <strong className="text-white">{useGameStore.getState().correctAnswers + useGameStore.getState().wrongAnswers > 0 ? Math.round((useGameStore.getState().correctAnswers / (useGameStore.getState().correctAnswers + useGameStore.getState().wrongAnswers)) * 100) : 0}%</strong>
                </span>
              </div>
            </div>
          </motion.div>

          {/* Controles */}
          <motion.div
            className="glass-dark rounded-3xl p-4 space-y-3"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <motion.button
              onClick={handlePause}
              className="w-full bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold py-3 rounded-2xl shadow-glow-yellow hover:shadow-glow-yellow-lg transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              {isPaused ? 'Continuar' : 'Pausar'}
            </motion.button>
            
            <motion.button
              onClick={handleQuit}
              className="w-full bg-dark-700 hover:bg-dark-600 text-white font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Home className="w-5 h-5" />
              Sair
            </motion.button>
          </motion.div>
        </div>
        
        {/* Coluna Central - Tabuleiro */}
        <div className="col-span-7 flex items-center justify-center">
          <BoardLudoGrid />
        </div>
        
        {/* Coluna Direita - Jogadores e Dado */}
        <div className="col-span-3 flex flex-col gap-4">
          {/* Jogadores */}
          <motion.div
            className="glass-dark rounded-3xl p-6 shadow-glow-blue"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-secondary-400" />
              <div className="text-sm font-bold text-white uppercase tracking-wider">Jogadores</div>
            </div>
            
            <div className="space-y-3">
              {useGameStore.getState().players.map((player, index) => {
                const finishedCount = player.pawns?.filter(p => p.finished).length || 0;
                const inPlayCount = player.pawns?.filter(p => p.location !== 'base' && !p.finished).length || 0;
                
                return (
                  <motion.div
                    key={player.id}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-dark-700/50 border border-dark-600"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div
                      className="w-10 h-10 rounded-2xl border-2 border-white/20 shadow-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: player.color }}
                    >
                      {player.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate">
                        {player.name}
                      </div>
                      <div className="text-xs text-white/60">
                        🏠 {4 - inPlayCount - finishedCount} • 🎮 {inPlayCount} • 🏆 {finishedCount} • {player.score} pts
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
          
          {/* Dado */}
          <motion.div
            className="glass-dark rounded-3xl p-6 flex flex-col items-center justify-center shadow-glow"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Dice />
          </motion.div>
          
          {/* Dica */}
          <motion.div
            className="glass-dark rounded-3xl p-4 border border-primary-500/30"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-sm font-bold text-primary-400 mb-2">💡 DICA</div>
            <p className="text-xs text-white/70 leading-relaxed">
              Responda corretamente as perguntas do quiz para ganhar pontos extras!
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Quiz Modal */}
      <QuizModal />
      
      {/* Message Overlay */}
      <MessageOverlay />
      
      {/* Pause Overlay */}
      {isPaused && (
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white rounded-3xl p-12 text-center shadow-2xl"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <div className="text-8xl mb-6">⏸️</div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">JOGO PAUSADO</h2>
            <p className="text-gray-600 mb-8">Clique em "Continuar" para voltar ao jogo</p>
            <motion.button
              onClick={handlePause}
              className="bg-gradient-to-r from-dengue-green to-green-500 text-white font-bold py-4 px-12 rounded-xl shadow-lg hover:shadow-xl transition-all"
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
