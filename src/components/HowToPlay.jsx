import { motion } from 'framer-motion';
import { ArrowLeft, Dice1, HelpCircle, Award, Users } from 'lucide-react';
import useGameStore from '../store/gameStore';

const HowToPlay = () => {
  const { setGameState } = useGameStore();
  
  const rules = [
    {
      icon: '🎲',
      title: 'Role o Dado',
      description: 'Clique no botão "Rolar Dado" para mover seu peão pelo tabuleiro.',
      color: 'from-dengue-blue to-blue-400'
    },
    {
      icon: '💧',
      title: 'Casa do Criadouro',
      description: 'Ops! Você encontrou água parada. Volte 3 casas e aprenda a evitar!',
      color: 'from-red-400 to-red-500'
    },
    {
      icon: '💪',
      title: 'Mutirão de Limpeza',
      description: 'Parabéns! Você ajudou a limpar. Avance 2 casas!',
      color: 'from-dengue-green to-green-500'
    },
    {
      icon: '❓',
      title: 'Casa do Quiz',
      description: 'Responda perguntas sobre dengue e ganhe +10 pontos por acerto!',
      color: 'from-dengue-yellow to-yellow-500'
    },
    {
      icon: '🏆',
      title: 'Chegue ao Fim',
      description: 'Seja o primeiro a chegar na casa final e vença o jogo!',
      color: 'from-dengue-purple to-purple-500'
    }
  ];
  
  const tips = [
    '💡 Leia as curiosidades após cada pergunta para aprender mais!',
    '🎯 Quanto mais perguntas acertar, maior sua pontuação!',
    '🏫 Jogue com amigos e compare resultados!',
    '📊 Seu progresso é salvo automaticamente!',
    '🌟 Compartilhe seu certificado nas redes sociais!'
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-dengue-blue via-blue-400 to-dengue-green p-4">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <button
            onClick={() => setGameState('menu')}
            className="absolute top-4 left-4 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          
          <motion.div
            className="text-8xl mb-4"
            animate={{
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          >
            📖
          </motion.div>
          
          <h1 className="text-6xl font-bold text-white drop-shadow-2xl mb-2">
            COMO JOGAR
          </h1>
          <p className="text-xl text-white drop-shadow-lg">
            Aprenda as regras do jogo!
          </p>
        </motion.div>
        
        {/* Regras */}
        <motion.div
          className="space-y-4 mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {rules.map((rule, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-3xl p-6 shadow-xl"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${rule.color} flex items-center justify-center text-4xl flex-shrink-0`}>
                  {rule.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {rule.title}
                  </h3>
                  <p className="text-gray-600 text-lg">
                    {rule.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Dicas */}
        <motion.div
          className="bg-white rounded-3xl p-8 shadow-xl mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Award className="w-8 h-8 text-dengue-yellow" />
            Dicas Importantes
          </h2>
          
          <div className="space-y-3">
            {tips.map((tip, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <div className="text-2xl">{tip.split(' ')[0]}</div>
                <p className="text-gray-700 flex-1">{tip.substring(3)}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Botão Jogar */}
        <motion.button
          onClick={() => setGameState('login')}
          className="w-full bg-gradient-to-r from-dengue-green to-green-500 text-white font-bold py-6 rounded-3xl shadow-2xl hover:shadow-3xl transition-all text-2xl"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          🎮 COMEÇAR A JOGAR!
        </motion.button>
      </div>
    </div>
  );
};

export default HowToPlay;
