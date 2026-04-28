import { motion } from 'framer-motion';
import { BookOpen, Bug, Info, Play, ShieldCheck, Sparkles, Trophy, Users } from 'lucide-react';
import useGameStore from '../store/gameStore';

const menuItems = [
  {
    icon: Trophy,
    title: 'Ranking',
    description: 'Compare sua pontuacao com outros agentes.',
    state: 'ranking'
  },
  {
    icon: BookOpen,
    title: 'Como jogar',
    description: 'Veja as regras antes da primeira rodada.',
    state: 'howToPlay'
  },
  {
    icon: Info,
    title: 'Sobre a dengue',
    description: 'Aprenda prevencao de um jeito direto.',
    state: 'about'
  }
];

const boardCells = [
  'bg-primary-500', 'bg-white', 'bg-white', 'bg-accent-400', 'bg-white',
  'bg-secondary-500', 'bg-white', 'bg-white', 'bg-danger-400', 'bg-white',
  'bg-white', 'bg-primary-500', 'bg-white', 'bg-secondary-500', 'bg-white',
  'bg-accent-400', 'bg-white', 'bg-white', 'bg-primary-500', 'bg-white',
  'bg-white', 'bg-danger-400', 'bg-white', 'bg-white', 'bg-secondary-500'
];

const MenuAAA = () => {
  const { setGameState } = useGameStore();

  return (
    <main className="screen-shell">
      <div className="page-container min-h-screen py-6 sm:py-8 lg:py-10 flex flex-col">
        <motion.header
          className="flex items-center justify-between gap-4"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <div className="icon-badge h-11 w-11">
              <Bug className="h-6 w-6" />
            </div>
            <div>
              <div className="text-lg font-black text-emerald-950 leading-none">ArboGame</div>
              <div className="text-xs font-semibold uppercase text-emerald-700/70">Ludo da Dengue</div>
            </div>
          </div>
          <button
            onClick={() => setGameState('about')}
            className="hidden sm:inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold action-secondary"
          >
            <ShieldCheck className="h-4 w-4 text-primary-600" />
            Prevencao
          </button>
        </motion.header>

        <section className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:py-8">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-2xl bg-white/70 px-4 py-2 text-sm font-bold text-emerald-800 shadow-sm ring-1 ring-emerald-900/10">
              <Sparkles className="h-4 w-4 text-accent-500" />
              Jogo educativo, rapido e multiplayer
            </div>

            <h1 className="brand-title text-5xl font-black leading-[0.95] sm:text-6xl lg:text-7xl">
              Aprenda a combater a dengue jogando Ludo.
            </h1>
            <p className="brand-copy mt-5 max-w-xl text-lg font-medium leading-8">
              Avance pelo tabuleiro, responda quizzes, evite criadouros e dispute com amigos para virar agente de prevencao.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <motion.button
                onClick={() => setGameState('login')}
                className="inline-flex min-h-[58px] items-center justify-center gap-3 rounded-2xl px-7 text-base font-black action-primary"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="h-5 w-5" fill="currentColor" />
                Jogar agora
              </motion.button>
              <motion.button
                onClick={() => setGameState('login')}
                className="inline-flex min-h-[58px] items-center justify-center gap-3 rounded-2xl px-7 text-base font-black action-secondary"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Users className="h-5 w-5 text-secondary-600" />
                Multiplayer
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            className="surface-panel relative overflow-hidden rounded-[2rem] p-5 sm:p-6"
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.16 }}
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-300/30 blur-3xl" />
            <div className="absolute -bottom-12 -left-8 h-44 w-44 rounded-full bg-accent-300/30 blur-3xl" />

            <div className="relative grid gap-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-emerald-950">Rodada de prevencao</h2>
                  <p className="mt-1 text-sm font-medium text-emerald-900/60">Casa especial, quiz e movimento animado.</p>
                </div>
                <div className="rounded-2xl bg-emerald-950 px-3 py-2 text-sm font-black text-white">+10</div>
              </div>

              <div className="mini-board grid aspect-square grid-cols-5 gap-2 rounded-[1.5rem] border border-emerald-900/10 p-3 shadow-inner">
                {boardCells.map((cell, index) => (
                  <div key={index} className={`rounded-xl border border-emerald-950/10 ${cell}`}>
                    {[6, 12, 18].includes(index) && (
                      <div className="h-full w-full rounded-xl bg-emerald-950/80 shadow-lg" />
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  ['4', 'peoes'],
                  ['6', 'turno extra'],
                  ['100%', 'responsivo']
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl bg-white/75 p-3 text-center ring-1 ring-emerald-900/10">
                    <div className="text-xl font-black text-emerald-950">{value}</div>
                    <div className="text-xs font-bold uppercase text-emerald-900/50">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <motion.nav
          className="grid gap-3 pb-4 sm:grid-cols-3"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          {menuItems.map((item) => (
            <MenuButton key={item.title} {...item} onClick={() => setGameState(item.state)} />
          ))}
        </motion.nav>
      </div>
    </main>
  );
};

const MenuButton = ({ icon: Icon, title, description, onClick }) => (
  <motion.button
    onClick={onClick}
    className="surface-panel group flex min-h-[112px] items-center gap-4 rounded-3xl p-4 text-left transition"
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
  >
    <span className="icon-badge h-14 w-14 flex-shrink-0 transition group-hover:scale-105">
      <Icon className="h-7 w-7" />
    </span>
    <span className="min-w-0">
      <span className="block text-lg font-black text-emerald-950">{title}</span>
      <span className="mt-1 block text-sm font-medium leading-5 text-emerald-900/62">{description}</span>
    </span>
  </motion.button>
);

export default MenuAAA;
