import { motion } from 'framer-motion';
import { Trophy, Target, CheckCircle, XCircle, Users } from 'lucide-react';
import useGameStore from '../store/gameStore';

const HUD = () => {
  const { score, correctAnswers, wrongAnswers, players, playerName } = useGameStore();
  
  return (
    <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-start gap-4">
        {/* Painel esquerdo - Pontuação */}
        <motion.div
          className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-xl p-4 pointer-events-auto"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-dengue-yellow to-yellow-500 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-semibold">PONTUAÇÃO</div>
              <div className="text-2xl font-bold text-dengue-blue">{score}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-gray-700">Acertos: <strong>{correctAnswers}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-gray-700">Erros: <strong>{wrongAnswers}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="text-gray-700">
                Precisão: <strong>{correctAnswers + wrongAnswers > 0 ? Math.round((correctAnswers / (correctAnswers + wrongAnswers)) * 100) : 0}%</strong>
              </span>
            </div>
          </div>
        </motion.div>
        
        {/* Painel direito - Jogadores */}
        <motion.div
          className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-xl p-4 pointer-events-auto"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-dengue-blue" />
            <div className="text-sm font-bold text-gray-700">JOGADORES</div>
          </div>
          
          <div className="space-y-2 min-w-[200px]">
            {players.map((player, index) => (
              <motion.div
                key={player.id}
                className="flex items-center gap-3 p-2 rounded-lg bg-gray-50"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className="w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: player.color }}
                >
                  {player.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800">
                    {player.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    Casa {player.position} • {player.score} pts
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Nome do jogador (canto superior) */}
      <motion.div
        className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-dengue-green to-green-500 text-white px-6 py-2 rounded-full shadow-lg pointer-events-auto"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="text-sm font-bold">
          🦟 {playerName || 'Agente da Dengue'}
        </div>
      </motion.div>
    </div>
  );
};

export default HUD;
