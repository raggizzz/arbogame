import { motion } from 'framer-motion';
import { Play, Trophy, BookOpen, Info, Sparkles } from 'lucide-react';
import useGameStore from '../store/gameStore';

const MenuAAA = () => {
  const { setGameState } = useGameStore();

  // Partículas de fundo animadas com cor única (verde)
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 25 + 15,
    delay: Math.random() * 5
  }));

  // Grid lines para efeito futurista
  const gridLines = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    position: (i + 1) * 12.5
  }));

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Gradient - Verde uniforme */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
        <div className="absolute inset-0 bg-mesh-gradient opacity-20" />
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-primary-500/20 via-transparent to-transparent"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>

      {/* Grid Futurista Animado - Verde */}
      <div className="absolute inset-0 opacity-15">
        {gridLines.map((line) => (
          <motion.div
            key={`h-${line.id}`}
            className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent"
            style={{ top: `${line.position}%` }}
            animate={{
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: line.id * 0.2
            }}
          />
        ))}
        {gridLines.map((line) => (
          <motion.div
            key={`v-${line.id}`}
            className="absolute h-full w-px bg-gradient-to-b from-transparent via-primary-500 to-transparent"
            style={{ left: `${line.position}%` }}
            animate={{
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: line.id * 0.2
            }}
          />
        ))}
      </div>

      {/* Scan Line Effect - Verde */}
      <motion.div
        className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-400 to-transparent opacity-30 blur-sm"
        animate={{
          y: ['0vh', '100vh']
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Animated Particles - Verde uniforme */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: 'radial-gradient(circle, rgba(0,230,92,0.5) 0%, transparent 70%)',
            filter: 'blur(2px)'
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 30 - 15, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: particle.delay
          }}
        />
      ))}

      {/* Mosquito Decorativo com Parallax */}
      <motion.div
        className="hidden lg:block absolute top-20 right-20 text-8xl opacity-8 pointer-events-none"
        animate={{
          rotate: [0, 10, -10, 0],
          y: [0, -25, 0],
          x: [0, 15, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        🦟
      </motion.div>

      {/* Main Content - Responsivo e Perfeitamente Espaçado */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-6xl mx-auto">

          {/* Logo e Título - Responsivo */}
          <motion.div
            className="text-center mb-12 sm:mb-16 lg:mb-20"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            {/* Logo Animado */}
            <motion.div
              className="inline-block mb-6 sm:mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: 1,
                rotate: 0
              }}
              transition={{
                duration: 1.2,
                ease: [0.34, 1.56, 0.64, 1]
              }}
            >
              <div className="relative">
                <motion.div
                  className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl relative z-10"
                  animate={{
                    rotate: [0, -5, 5, 0],
                    y: [0, -10, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  🦟
                </motion.div>
                {/* Glow pulsante - Verde */}
                <motion.div
                  className="absolute -inset-4 sm:-inset-6 bg-primary-500/30 rounded-full blur-2xl sm:blur-3xl"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity
                  }}
                />
                {/* Anel externo - Verde */}
                <motion.div
                  className="absolute -inset-6 sm:-inset-8 border-2 border-primary-500/20 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5],
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
              </div>
            </motion.div>

            {/* Título com Gradient Verde */}
            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black mb-3 sm:mb-4 relative px-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <motion.span
                className="inline-block bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                style={{
                  backgroundSize: '200% 200%'
                }}
              >
                ARBOGAME
              </motion.span>
            </motion.h1>

            <motion.div
              className="text-xl sm:text-2xl md:text-3xl font-game font-semibold text-white/90 mb-2 px-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Ludo da Dengue
            </motion.div>

            <motion.p
              className="text-base sm:text-lg text-white/75 max-w-3xl mx-auto px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              Um tabuleiro vibrante inspirado no Ludo clássico para aprender jogando.
            </motion.p>
          </motion.div>

          {/* Menu Grid - 100% Responsivo */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            {/* Botão Jogar - Destaque */}
            <motion.button
              onClick={() => setGameState('login')}
              className="group relative sm:col-span-2 glass-dark rounded-3xl sm:rounded-4xl p-6 sm:p-8 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Animated Background Gradient - Verde */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,230,92,0.15), rgba(0,200,80,0.15))',
                  backgroundSize: '200% 200%'
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />

              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(0,230,92,0.2), transparent)',
                  backgroundSize: '200% 100%'
                }}
                animate={{
                  backgroundPosition: ['-200% 0', '200% 0']
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />

              <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <motion.div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-glow"
                  whileHover={{
                    rotate: 360,
                    scale: 1.1
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="white" />
                </motion.div>

                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-1 sm:mb-2 group-hover:text-primary-400 transition-colors">
                    JOGAR AGORA
                  </h2>
                  <p className="text-white/70 text-base sm:text-lg">
                    Comece sua aventura contra a dengue
                  </p>
                </div>

                <motion.div
                  className="hidden sm:block"
                  initial={{ opacity: 0, scale: 0 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Sparkles className="w-8 h-8 text-primary-400" />
                </motion.div>
              </div>
            </motion.button>

            {/* Cards Secundários - 100% Responsivos */}
            <MenuButton
              icon={Trophy}
              title="RANKING"
              description="Veja os melhores jogadores"
              onClick={() => setGameState('ranking')}
              delay={1.3}
            />

            <MenuButton
              icon={BookOpen}
              title="COMO JOGAR"
              description="Aprenda as regras"
              onClick={() => setGameState('howToPlay')}
              delay={1.4}
            />

            <MenuButton
              icon={Info}
              title="SOBRE A DENGUE"
              description="Informações importantes"
              onClick={() => setGameState('about')}
              delay={1.5}
            />
          </motion.div>

          {/* Footer */}
          <motion.div
            className="text-center text-white/60 text-sm font-semibold tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7 }}
          >
            Raggi
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Componente de Botão Reutilizável - Verde Uniforme e Responsivo
const MenuButton = ({ icon: Icon, title, description, onClick, delay }) => (
  <motion.button
    onClick={onClick}
    className="group relative glass-dark rounded-2xl sm:rounded-3xl p-5 sm:p-6 overflow-hidden"
    initial={{ opacity: 0, y: 30, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
    whileHover={{ scale: 1.05, y: -8 }}
    whileTap={{ scale: 0.95 }}
  >
    {/* Hover Glow Background - Verde */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600 opacity-0 group-hover:opacity-15 transition-opacity duration-500" />

    {/* Shimmer Effect - Verde */}
    <motion.div
      className="absolute inset-0 opacity-0 group-hover:opacity-100"
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(0,230,92,0.15), transparent)',
        backgroundSize: '200% 100%'
      }}
      animate={{
        backgroundPosition: ['-200% 0', '200% 0']
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear'
      }}
    />

    {/* Border Glow - Verde */}
    <motion.div
      className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-primary-500/0 group-hover:border-primary-500/30 transition-colors duration-500"
    />

    <div className="relative flex flex-col items-center text-center">
      <motion.div
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-3 sm:mb-4 shadow-lg"
        whileHover={{
          rotate: [0, -15, 15, 0],
          scale: 1.1
        }}
        transition={{ duration: 0.5 }}
      >
        <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
      </motion.div>

      <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-1 sm:mb-2 group-hover:text-primary-400 transition-colors">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-white/70 group-hover:text-white/90 transition-colors">
        {description}
      </p>
    </div>

    {/* Corner Accent - Verde */}
    <motion.div
      className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-400 opacity-0 group-hover:opacity-100"
      animate={{
        scale: [1, 1.5, 1],
        opacity: [0.5, 1, 0.5]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity
      }}
    />
  </motion.button>
);

export default MenuAAA;
