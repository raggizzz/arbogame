import { motion } from 'framer-motion';
import { ArrowLeft, Award, Dice5, Droplets, HelpCircle, ShieldCheck, Sparkles, Trophy } from 'lucide-react';
import useGameStore from '../store/gameStore';

const rules = [
  {
    icon: Dice5,
    title: 'Role o dado',
    description: 'Clique no dado para mover seu peao. Se tirar 6, voce joga novamente.',
    tone: 'bg-secondary-500'
  },
  {
    icon: Droplets,
    title: 'Evite criadouros',
    description: 'Casas de agua parada podem fazer voce voltar algumas posicoes.',
    tone: 'bg-danger-500'
  },
  {
    icon: Sparkles,
    title: 'Aproveite o mutirao',
    description: 'Casas positivas ajudam sua equipe a avancar pelo tabuleiro.',
    tone: 'bg-primary-600'
  },
  {
    icon: HelpCircle,
    title: 'Responda quizzes',
    description: 'Perguntas corretas somam pontos e reforcam dicas de prevencao.',
    tone: 'bg-accent-500'
  },
  {
    icon: Trophy,
    title: 'Chegue ao fim',
    description: 'Vence quem levar os peoes ao final com boa estrategia.',
    tone: 'bg-emerald-950'
  }
];

const tips = [
  'Leia cada pergunta com calma antes de responder.',
  'Use o turno extra do 6 para colocar mais peoes em jogo.',
  'Compare a pontuacao no ranking depois da partida.',
  'No multiplayer, aguarde sua vez para jogar o dado.',
  'Convide amigos para aprenderem juntos.'
];

const HowToPlay = () => {
  const { setGameState } = useGameStore();

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
          className="mb-8"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="icon-badge mb-4 h-14 w-14">
            <Dice5 className="h-8 w-8" />
          </div>
          <h1 className="brand-title text-4xl font-black leading-tight sm:text-6xl">Como jogar</h1>
          <p className="brand-copy mt-3 max-w-2xl text-lg font-semibold">
            O ArboGame mistura regras de Ludo com desafios de prevencao contra a dengue.
          </p>
        </motion.header>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-3">
            {rules.map((rule, index) => (
              <motion.div
                key={rule.title}
                className="surface-panel grid grid-cols-[auto_1fr] gap-4 rounded-[1.5rem] p-4 sm:p-5"
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white ${rule.tone}`}>
                  <rule.icon className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-emerald-950">{rule.title}</h2>
                  <p className="mt-1 font-medium leading-6 text-emerald-900/62">{rule.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.aside
            className="surface-panel rounded-[2rem] p-5 sm:p-6"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="icon-badge h-12 w-12">
                <Award className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-black text-emerald-950">Dicas rapidas</h2>
            </div>

            <div className="grid gap-3">
              {tips.map((tip, index) => (
                <div key={tip} className="flex gap-3 rounded-2xl bg-white/70 p-4 ring-1 ring-emerald-900/8">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-sm font-black text-primary-700">
                    {index + 1}
                  </span>
                  <p className="font-semibold leading-6 text-emerald-900/70">{tip}</p>
                </div>
              ))}
            </div>

            <motion.button
              onClick={() => setGameState('login')}
              className="mt-5 inline-flex min-h-[58px] w-full items-center justify-center gap-2 rounded-2xl px-5 font-black action-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ShieldCheck className="h-5 w-5" />
              Comecar partida
            </motion.button>
          </motion.aside>
        </section>
      </div>
    </main>
  );
};

export default HowToPlay;
