import { motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle, Shield, Droplets, Bug } from 'lucide-react';
import useGameStore from '../store/gameStore';

const About = () => {
  const { setGameState } = useGameStore();
  
  const facts = [
    {
      icon: <Bug className="w-8 h-8" />,
      title: 'O Mosquito',
      description: 'O Aedes aegypti é o principal transmissor da dengue, zika e chikungunya. Tem listras brancas no corpo e nas patas.',
      color: 'from-gray-700 to-gray-900'
    },
    {
      icon: <Droplets className="w-8 h-8" />,
      title: 'Criadouros',
      description: 'O mosquito deposita ovos em água limpa e parada. Vasos, pneus, caixas d\'água e calhas são locais perfeitos.',
      color: 'from-blue-500 to-blue-700'
    },
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: 'Sintomas',
      description: 'Febre alta, dor de cabeça, dor muscular, manchas vermelhas na pele e dor atrás dos olhos são sintomas comuns.',
      color: 'from-red-500 to-red-700'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Prevenção',
      description: 'Elimine água parada, use repelente, instale telas e mantenha caixas d\'água bem fechadas. A prevenção é a melhor arma!',
      color: 'from-green-500 to-green-700'
    }
  ];
  
  const prevention = [
    '🚰 Tampe caixas d\'água e cisternas',
    '🌱 Troque água de vasos semanalmente',
    '🛞 Fure ou descarte pneus velhos',
    '🏠 Limpe calhas regularmente',
    '🗑️ Mantenha lixeiras tampadas',
    '🪴 Coloque areia nos pratinhos de plantas',
    '💧 Vire garrafas de cabeça para baixo',
    '🏊 Esvazie piscinas de plástico',
    '🚿 Limpe ralos externos',
    '🪟 Use telas em portas e janelas'
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-dengue-red via-red-400 to-dengue-yellow p-4">
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
              x: [-10, 10, -10],
              rotate: [-5, 5, -5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          >
            🦟
          </motion.div>
          
          <h1 className="text-6xl font-bold text-white drop-shadow-2xl mb-2">
            SOBRE A DENGUE
          </h1>
          <p className="text-xl text-white drop-shadow-lg">
            Conheça o inimigo e saiba como combatê-lo!
          </p>
        </motion.div>
        
        {/* Fatos sobre a Dengue */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {facts.map((fact, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-3xl p-6 shadow-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${fact.color} text-white flex items-center justify-center mb-4`}>
                {fact.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {fact.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {fact.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Medidas de Prevenção */}
        <motion.div
          className="bg-white rounded-3xl p-8 shadow-xl mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Shield className="w-8 h-8 text-dengue-green" />
            10 Medidas de Prevenção
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {prevention.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ x: 5, backgroundColor: '#e0f2fe' }}
              >
                <div className="text-2xl">{item.split(' ')[0]}</div>
                <p className="text-gray-700 font-medium flex-1">
                  {item.substring(3)}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Alerta Importante */}
        <motion.div
          className="bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-8 shadow-xl mb-8 text-white"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-12 h-12 flex-shrink-0" />
            <div>
              <h3 className="text-2xl font-bold mb-3">⚠️ ATENÇÃO!</h3>
              <p className="text-lg leading-relaxed mb-3">
                Se você apresentar sintomas de dengue, procure imediatamente um médico ou posto de saúde.
              </p>
              <p className="text-lg leading-relaxed font-bold">
                NUNCA tome AAS (aspirina) ou anti-inflamatórios sem orientação médica!
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Estatísticas */}
        <motion.div
          className="bg-white rounded-3xl p-8 shadow-xl mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            📊 Você Sabia?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-dengue-blue mb-2">4</div>
              <p className="text-gray-600">Tipos de vírus da dengue</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-dengue-green mb-2">7-10</div>
              <p className="text-gray-600">Dias do ciclo do mosquito</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-dengue-yellow mb-2">1 ano</div>
              <p className="text-gray-600">Ovos resistem secos</p>
            </div>
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
          transition={{ delay: 1.2 }}
        >
          🎮 JOGAR E APRENDER!
        </motion.button>
      </div>
    </div>
  );
};

export default About;
