import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Download, Home, RotateCcw, Share2, Target, Trophy } from 'lucide-react';
import useGameStore from '../store/gameStore';
import { saveScore, saveSchoolScore, getPlayerRank } from '../firebase/rankingService';

const GameOver = () => {
  const {
    score,
    correctAnswers,
    wrongAnswers,
    playerName,
    user,
    schoolId,
    resetGame,
    setGameState
  } = useGameStore();

  const [rank, setRank] = useState(null);
  const [saved, setSaved] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const totalAnswers = correctAnswers + wrongAnswers;
  const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  useEffect(() => {
    savePlayerScore();
  }, []);

  const savePlayerScore = async () => {
    if (!user || saved) return;

    const playerData = {
      playerName,
      score,
      correctAnswers,
      wrongAnswers,
      timestamp: Date.now()
    };

    await saveScore(user.uid, playerData);

    if (schoolId) {
      await saveSchoolScore(schoolId, user.uid, playerData);
    }

    const position = await getPlayerRank(user.uid);
    setRank(position);
    setSaved(true);
  };

  const getTitleByScore = () => {
    if (score >= 100) return 'Agente Master da Dengue';
    if (score >= 70) return 'Agente Senior da Dengue';
    if (score >= 50) return 'Agente Pleno da Dengue';
    if (score >= 30) return 'Agente Junior da Dengue';
    return 'Agente Mirim da Dengue';
  };

  const getMessageByScore = () => {
    if (score >= 100) return 'Incrivel! Voce conhece muito sobre prevencao.';
    if (score >= 70) return 'Excelente trabalho. Continue assim.';
    if (score >= 50) return 'Muito bem. Voce esta no caminho certo.';
    if (score >= 30) return 'Bom trabalho. Continue aprendendo.';
    return 'Parabens por jogar. Tente novamente para subir no ranking.';
  };

  const shareScore = () => {
    const text = `Acabei de jogar ArboGame - Ludo da Dengue.\nPontuacao: ${score} pontos\nAcertos: ${correctAnswers}${rank ? `\nRanking: ${rank} lugar` : ''}`;

    if (navigator.share) {
      navigator.share({
        title: 'ArboGame',
        text
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Texto copiado para compartilhar.');
    }
  };

  const downloadCertificate = () => {
    setShowCertificate(true);
    setTimeout(() => window.print(), 500);
  };

  return (
    <main className="screen-shell">
      <div className="page-container flex min-h-screen items-center py-6 sm:py-10">
        <motion.section
          className="surface-panel w-full overflow-hidden rounded-[2rem] p-5 sm:p-8 lg:p-10"
          initial={{ scale: 0.94, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
        >
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <div className="icon-badge mb-5 h-16 w-16">
                <Trophy className="h-9 w-9" />
              </div>
              <h1 className="brand-title text-4xl font-black leading-tight sm:text-6xl">Partida concluida!</h1>
              <p className="brand-copy mt-4 text-lg font-semibold leading-8">{getMessageByScore()}</p>

              <div className="mt-7 rounded-[1.5rem] bg-emerald-950 p-5 text-white">
                <div className="text-sm font-bold uppercase text-primary-200/80">Titulo conquistado</div>
                <div className="mt-1 text-2xl font-black">{getTitleByScore()}</div>
                {rank && (
                  <div className="mt-4 inline-flex rounded-2xl bg-white/10 px-4 py-2 text-sm font-black">
                    {rank} lugar no ranking
                  </div>
                )}
              </div>
            </div>

            <div className="grid content-start gap-4">
              <div className="grid grid-cols-2 gap-3">
                <StatCard icon={Trophy} value={score} label="Pontos" tone="bg-accent-500" />
                <StatCard icon={Target} value={`${accuracy}%`} label="Precisao" tone="bg-secondary-500" />
                <StatCard icon={Award} value={correctAnswers} label="Acertos" tone="bg-primary-600" />
                <StatCard icon={RotateCcw} value={wrongAnswers} label="Erros" tone="bg-danger-500" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <ActionButton
                  icon={Home}
                  label="Menu"
                  variant="secondary"
                  onClick={() => {
                    resetGame();
                    setGameState('menu');
                  }}
                />
                <ActionButton
                  icon={RotateCcw}
                  label="Jogar novamente"
                  onClick={() => {
                    resetGame();
                    setGameState('login');
                  }}
                />
                <ActionButton icon={Share2} label="Compartilhar" variant="secondary" onClick={shareScore} />
                <ActionButton icon={Download} label="Certificado" variant="secondary" onClick={downloadCertificate} />
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      {showCertificate && (
        <div className="hidden print:block fixed inset-0 bg-white p-12">
          <div className="flex h-full flex-col items-center justify-center rounded-3xl border-8 border-primary-500 p-12 text-center">
            <Trophy className="mb-8 h-24 w-24 text-accent-500" />
            <h1 className="mb-4 text-6xl font-bold text-secondary-700">CERTIFICADO</h1>
            <h2 className="mb-8 text-4xl font-bold text-gray-800">{getTitleByScore()}</h2>
            <p className="mb-4 text-2xl text-gray-700">Certificamos que</p>
            <p className="mb-8 text-5xl font-bold text-primary-700">{playerName}</p>
            <p className="mb-4 text-2xl text-gray-700">completou o ArboGame com</p>
            <p className="mb-8 text-6xl font-bold text-accent-500">{score} pontos</p>
            <p className="text-xl text-gray-600">{new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      )}
    </main>
  );
};

const StatCard = ({ icon: Icon, value, label, tone }) => (
  <motion.div className={`${tone} rounded-[1.5rem] p-5 text-white shadow-lg`} whileHover={{ y: -3 }}>
    <Icon className="mb-4 h-6 w-6 text-white/80" />
    <div className="text-4xl font-black leading-none">{value}</div>
    <div className="mt-2 text-xs font-black uppercase text-white/80">{label}</div>
  </motion.div>
);

const ActionButton = ({ icon: Icon, label, onClick, variant = 'primary' }) => (
  <motion.button
    onClick={onClick}
    className={`inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl px-4 font-black ${
      variant === 'primary' ? 'action-primary' : 'action-secondary'
    }`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Icon className="h-5 w-5" />
    {label}
  </motion.button>
);

export default GameOver;
