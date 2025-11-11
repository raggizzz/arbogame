import { motion } from 'framer-motion';
import { Play, Trophy, BookOpen, Info, Sparkles } from 'lucide-react';
import useGameStore from '../store/gameStore';

const MenuAAA = () => {
  const { setGameState } = useGameStore();
  
  // Partículas de fundo animadas
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10
  }));
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
        <div className="absolute inset-0 bg-mesh-gradient opacity-30" />
        <div className="absolute inset-0 bg-gradient-radial from-primary-500/20 via-transparent to-transparent" />
      </div>
      
      {/* Animated Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary-400/30 blur-sm"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}
      
      {/* Mosquito Decorativo Animado */}
      <motion.div
        className="absolute top-20 right-20 text-9xl opacity-10"
        animate={{
          rotate: [0, 10, -10, 0],
          y: [0, -20, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        🦟
      </motion.div>
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="max-w-6xl w-full">
          {/* Logo e Título */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Logo Animado */}
            <motion.div
              className="inline-block mb-8"
              animate={{
                scale: [1, 1.05, 1],
                filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <div className="relative">
                <motion.div
                  className="text-9xl"
                  animate={{
                    rotate: [0, -5, 5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  🦟
                </motion.div>
                <motion.div
                  className="absolute -inset-4 bg-primary-500/20 rounded-full blur-2xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                />
              </div>
            </motion.div>
            
            {/* Título com Gradient */}
            <motion.h1
              className="text-7xl md:text-8xl font-display font-black mb-4 gradient-text"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              ARBOGAME
            </motion.h1>
            
            <motion.div
              className="text-2xl md:text-3xl font-game font-semibold text-white/90 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Ludo da Dengue
            </motion.div>
            
            <motion.p
              className="text-lg text-white/75 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Um tabuleiro vibrante inspirado no Ludo clássico para aprender jogando.
            </motion.p>
          </motion.div>
          
          {/* Menu Grid */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {/* Botão Jogar - Destaque */}
            <motion.button
              onClick={() => setGameState('login')}
              className="group relative md:col-span-2 glass-dark rounded-4xl p-8 overflow-hidden"
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-accent-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                style={{
                  backgroundSize: '200% 200%'
                }}
              />
              
              <div className="relative flex items-center justify-center gap-6">
                <motion.div
                  className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-glow"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Play className="w-10 h-10 text-white" fill="white" />
                </motion.div>
                
                <div className="text-left flex-1">
                  <h2 className="text-4xl font-display font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                    JOGAR AGORA
                  </h2>
                  <p className="text-white/70 text-lg">
                    Comece sua aventura contra a dengue
                  </p>
                </div>
                
                <Sparkles className="w-8 h-8 text-accent-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.button>
            
            {/* Ranking */}
            <MenuButton
              icon={Trophy}
              title="RANKING"
              description="Veja os melhores jogadores"
              gradient="from-accent-500 to-accent-600"
              onClick={() => setGameState('ranking')}
              delay={1}
            />
            
            {/* Como Jogar */}
            <MenuButton
              icon={BookOpen}
              title="COMO JOGAR"
              description="Aprenda as regras"
              gradient="from-secondary-500 to-secondary-600"
              onClick={() => setGameState('howToPlay')}
              delay={1.1}
            />
            
            {/* Sobre */}
            <MenuButton
              icon={Info}
              title="SOBRE A DENGUE"
              description="Informações importantes"
              gradient="from-danger-500 to-danger-600"
              onClick={() => setGameState('about')}
              delay={1.2}
            />
          </motion.div>
          
          {/* Footer */}
          <motion.div
            className="text-center text-white/60 text-sm font-semibold tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            Raggi
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Componente de Botão Reutilizável
const MenuButton = ({ icon: Icon, title, description, gradient, onClick, delay }) => (
  <motion.button
    onClick={onClick}
    className="group relative glass-dark rounded-3xl p-6 overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ scale: 1.05, y: -5 }}
    whileTap={{ scale: 0.95 }}
  >
    {/* Hover Glow */}
    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300" 
         style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }} />
    
    <div className="relative">
      <motion.div
        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg`}
        whileHover={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.4 }}
      >
        <Icon className="w-8 h-8 text-white" />
      </motion.div>
      
      <h3 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
        {title}
      </h3>
      <p className="text-white/70">
        {description}
      </p>
    </div>
  </motion.button>
);

export default MenuAAA;
