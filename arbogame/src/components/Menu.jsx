import { motion } from 'framer-motion';
import { Play, Trophy, BookOpen, Users } from 'lucide-react';
import useGameStore from '../store/gameStore';

const Menu = () => {
  const { setGameState } = useGameStore();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-dengue-green via-green-400 to-dengue-blue flex items-center justify-center p-4 relative overflow-hidden">
      {/* Mosquitos animados de fundo */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-6xl opacity-10"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            rotate: [0, 360]
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          🦟
        </motion.div>
      ))}
      
      <div className="relative z-10 max-w-4xl w-full">
        {/* Logo e Título */}
        <motion.div
          className="text-center mb-12"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <motion.div
            className="text-9xl mb-4"
            animate={{
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            🦟
          </motion.div>
          
          <h1 className="text-7xl font-bold text-white mb-4 drop-shadow-2xl font-game">
            LUDO DA DENGUE
          </h1>
          
          <p className="text-2xl text-white drop-shadow-lg">
            🎲 Aprenda brincando a combater o mosquito! 🎯
          </p>
        </motion.div>
        
        {/* Botões do Menu */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Jogar */}
          <motion.button
            className="bg-white hover:bg-gray-50 rounded-3xl p-8 shadow-2xl transition-all group"
            onClick={() => setGameState('login')}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-16 h-16 text-dengue-green mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">JOGAR</h2>
            <p className="text-gray-600">Comece sua aventura!</p>
          </motion.button>
          
          {/* Ranking */}
          <motion.button
            className="bg-white hover:bg-gray-50 rounded-3xl p-8 shadow-2xl transition-all group"
            onClick={() => setGameState('ranking')}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Trophy className="w-16 h-16 text-dengue-yellow mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">RANKING</h2>
            <p className="text-gray-600">Veja os melhores!</p>
          </motion.button>
          
          {/* Como Jogar */}
          <motion.button
            className="bg-white hover:bg-gray-50 rounded-3xl p-8 shadow-2xl transition-all group"
            onClick={() => setGameState('howToPlay')}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <BookOpen className="w-16 h-16 text-dengue-blue mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">COMO JOGAR</h2>
            <p className="text-gray-600">Aprenda as regras!</p>
          </motion.button>
          
          {/* Sobre a Dengue */}
          <motion.button
            className="bg-white hover:bg-gray-50 rounded-3xl p-8 shadow-2xl transition-all group"
            onClick={() => setGameState('about')}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Users className="w-16 h-16 text-dengue-purple mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">SOBRE</h2>
            <p className="text-gray-600">Conheça a dengue!</p>
          </motion.button>
        </motion.div>
        
        {/* Créditos */}
        <motion.div
          className="text-center text-white text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="drop-shadow-lg">
            🎮 Jogo educativo desenvolvido para conscientização sobre a dengue
          </p>
          <p className="mt-2 drop-shadow-lg">
            💚 Feito com React + Firebase • 2024
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Menu;
