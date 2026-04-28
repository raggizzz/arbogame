import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Medal, RefreshCw, School, Trophy, Users } from 'lucide-react';
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

  const data = activeTab === 'global' ? globalRanking : schoolRanking;

  return (
    <main className="screen-shell">
      <div className="page-container py-6 sm:py-10">
        <button
          onClick={() => setGameState('menu')}
          className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-2xl action-secondary"
          aria-label="Voltar ao menu"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <motion.header
          className="mb-7 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <div className="icon-badge mb-4 h-14 w-14">
              <Trophy className="h-8 w-8" />
            </div>
            <h1 className="brand-title text-4xl font-black leading-tight sm:text-6xl">Ranking</h1>
            <p className="brand-copy mt-3 max-w-xl text-lg font-semibold">
              Veja quem esta liderando a campanha de prevencao.
            </p>
          </div>

          <button
            onClick={loadRankings}
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl px-5 font-black action-primary"
          >
            <RefreshCw className="h-5 w-5" />
            Atualizar
          </button>
        </motion.header>

        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          <TabButton active={activeTab === 'global'} icon={Users} label="Global" onClick={() => setActiveTab('global')} />
          {schoolId && <TabButton active={activeTab === 'school'} icon={School} label="Minha escola" onClick={() => setActiveTab('school')} />}
        </div>

        <motion.section
          className="surface-panel rounded-[2rem] p-4 sm:p-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {loading ? (
            <div className="py-16 text-center">
              <RefreshCw className="mx-auto mb-4 h-10 w-10 animate-spin text-primary-600" />
              <p className="font-bold text-emerald-900/60">Carregando ranking...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="py-16 text-center">
              <Trophy className="mx-auto mb-4 h-14 w-14 text-emerald-900/20" />
              <p className="text-lg font-black text-emerald-950">Nenhum jogador ainda</p>
              <p className="mt-1 font-semibold text-emerald-900/55">Seja o primeiro a jogar.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {data.map((player, index) => (
                <RankingRow key={player.userId || `${player.playerName}-${index}`} player={player} index={index} />
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </main>
  );
};

const TabButton = ({ active, icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl px-5 font-black transition ${
      active ? 'action-primary' : 'action-secondary'
    }`}
  >
    <Icon className="h-5 w-5" />
    {label}
  </button>
);

const RankingRow = ({ player, index }) => {
  const topThree = index < 3;

  return (
    <motion.div
      className={`grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl p-4 ${
        topThree ? 'bg-accent-50 ring-1 ring-accent-300' : 'bg-white/75 ring-1 ring-emerald-900/8'
      }`}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.04 }}
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl font-black ${topThree ? 'bg-accent-400 text-white' : 'bg-emerald-950 text-white'}`}>
        {topThree ? <Medal className="h-6 w-6" /> : index + 1}
      </div>

      <div className="min-w-0">
        <div className="truncate text-base font-black text-emerald-950">{player.playerName || player.name || 'Jogador'}</div>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs font-bold text-emerald-900/52">
          {player.schoolId && <span>{player.schoolId}</span>}
          <span>{player.correctAnswers || 0} acertos</span>
          <span>{player.wrongAnswers || 0} erros</span>
        </div>
      </div>

      <div className="text-right">
        <div className="text-2xl font-black text-secondary-700">{player.score}</div>
        <div className="text-xs font-bold uppercase text-emerald-900/45">pontos</div>
      </div>
    </motion.div>
  );
};

export default Ranking;
