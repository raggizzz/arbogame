import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, ArrowLeft, School, Globe } from 'lucide-react';
import useGameStore from '../store/gameStore';
import { getTopRanking, getSchoolRanking } from '../firebase/rankingService';

const Ranking = () => {
  const { setGameState, schoolId } = useGameStore();
  const [globalRanking, setGlobalRanking] = useState([]);
  const [schoolRanking, setSchoolRanking] = useState([]);
  const [activeTab, setActiveTab] = useState('global');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadRankings();
  }, []);
  
  const loadRankings = async () => {
    setLoading(true);
    try {
      const global = await getTopRanking(10);
      setGlobalRanking(global);
      
      if (schoolId) {
        const school = await getSchoolRanking(schoolId, 10);
        setSchoolRanking(school);
      }
    } catch (error) {
      console.error('Erro ao carregar rankings:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getMedalEmoji = (position) => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${position}º`;
    }
  };
  
  const RankingList = ({ data, type }) => (
    <div className="space-y-3">
      {data.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Trophy className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>Nenhum jogador ainda!</p>
          <p className="text-sm mt-2">Seja o primeiro a jogar! 🎮</p>
        </div>
      ) : (
        data.map((player, index) => (
          <motion.div
            key={player.userId}
            className={`flex items-center gap-4 p-4 rounded-2xl shadow-md transition-all ${
              index < 3
                ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-400'
                : 'bg-white border-2 border-gray-200'
            }`}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02, x: 5 }}
          >
            {/* Posição */}
            <div className="text-3xl font-bold min-w-[60px] text-center">
              {getMedalEmoji(index + 1)}
            </div>
            
            {/* Info do Jogador */}
            <div className="flex-1">
              <div className="font-bold text-lg text-gray-800">
                {player.playerName || player.name || 'Jogador'}
              </div>
              {player.schoolId && (
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <School className="w-3 h-3" />
                  {player.schoolId}
                </div>
              )}
            </div>
            
            {/* Pontuação */}
            <div className="text-right">
              <div className="text-2xl font-bold text-dengue-blue">
                {player.score}
              </div>
              <div className="text-xs text-gray-500">pontos</div>
            </div>
            
            {/* Estatísticas */}
            <div className="text-xs text-gray-500 text-right min-w-[80px]">
              <div>✅ {player.correctAnswers || 0}</div>
              <div>❌ {player.wrongAnswers || 0}</div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-dengue-yellow via-yellow-400 to-dengue-green p-4">
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
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          >
            🏆
          </motion.div>
          
          <h1 className="text-6xl font-bold text-white drop-shadow-2xl mb-2">
            RANKING
          </h1>
          <p className="text-xl text-white drop-shadow-lg">
            Os melhores agentes da dengue!
          </p>
        </motion.div>
        
        {/* Tabs */}
        <motion.div
          className="flex gap-4 mb-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <button
            onClick={() => setActiveTab('global')}
            className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${
              activeTab === 'global'
                ? 'bg-white text-dengue-blue'
                : 'bg-white bg-opacity-50 text-white hover:bg-opacity-70'
            }`}
          >
            <Globe className="w-6 h-6 inline mr-2" />
            Global
          </button>
          
          {schoolId && (
            <button
              onClick={() => setActiveTab('school')}
              className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${
                activeTab === 'school'
                  ? 'bg-white text-dengue-blue'
                  : 'bg-white bg-opacity-50 text-white hover:bg-opacity-70'
              }`}
            >
              <School className="w-6 h-6 inline mr-2" />
              Minha Escola
            </button>
          )}
        </motion.div>
        
        {/* Lista de Ranking */}
        <motion.div
          className="bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {loading ? (
            <div className="text-center py-12">
              <motion.div
                className="text-6xl mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                ⏳
              </motion.div>
              <p className="text-gray-600">Carregando ranking...</p>
            </div>
          ) : (
            <>
              {activeTab === 'global' && <RankingList data={globalRanking} type="global" />}
              {activeTab === 'school' && <RankingList data={schoolRanking} type="school" />}
            </>
          )}
        </motion.div>
        
        {/* Botão Atualizar */}
        <motion.button
          onClick={loadRankings}
          className="w-full mt-6 bg-white text-dengue-blue font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          🔄 Atualizar Ranking
        </motion.button>
      </div>
    </div>
  );
};

export default Ranking;
