import { motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle, Bug, Droplets, Home, Shield, ShieldCheck, Wind } from 'lucide-react';
import useGameStore from '../store/gameStore';

const facts = [
  {
    icon: Bug,
    title: 'O mosquito',
    description: 'O Aedes aegypti transmite dengue, zika e chikungunya. Ele costuma circular mais durante o dia.',
    tone: 'bg-emerald-950'
  },
  {
    icon: Droplets,
    title: 'Criadouros',
    description: 'Ovos podem surgir em agua limpa e parada, como vasos, pneus, calhas e caixas d\'agua abertas.',
    tone: 'bg-secondary-500'
  },
  {
    icon: AlertTriangle,
    title: 'Sintomas',
    description: 'Febre alta, dor no corpo, manchas vermelhas, dor de cabeca e dor atras dos olhos exigem atencao.',
    tone: 'bg-danger-500'
  },
  {
    icon: Shield,
    title: 'Prevencao',
    description: 'Eliminar agua parada toda semana continua sendo uma das formas mais fortes de protecao.',
    tone: 'bg-primary-600'
  }
];

const prevention = [
  'Tampe caixas d\'agua e cisternas.',
  'Coloque areia nos pratinhos de plantas.',
  'Limpe calhas e ralos externos.',
  'Descarte pneus velhos corretamente.',
  'Mantenha garrafas viradas para baixo.',
  'Use telas em portas e janelas.',
  'Mantenha lixeiras sempre tampadas.',
  'Troque a agua de recipientes com frequencia.'
];

const About = () => {
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
          className="mb-8 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <div className="icon-badge mb-4 h-14 w-14">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h1 className="brand-title text-4xl font-black leading-tight sm:text-6xl">Sobre a dengue</h1>
            <p className="brand-copy mt-3 max-w-2xl text-lg font-semibold">
              Informacoes essenciais para reconhecer riscos e agir antes que o mosquito se espalhe.
            </p>
          </div>
          <motion.button
            onClick={() => setGameState('login')}
            className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl px-5 font-black action-primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Home className="h-5 w-5" />
            Jogar e aprender
          </motion.button>
        </motion.header>

        <section className="mb-5 grid gap-4 md:grid-cols-2">
          {facts.map((fact, index) => (
            <motion.article
              key={fact.title}
              className="surface-panel rounded-[1.5rem] p-5"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-white ${fact.tone}`}>
                <fact.icon className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-black text-emerald-950">{fact.title}</h2>
              <p className="mt-2 font-medium leading-7 text-emerald-900/65">{fact.description}</p>
            </motion.article>
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
          <motion.div
            className="surface-panel rounded-[2rem] p-5 sm:p-6"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="icon-badge h-12 w-12">
                <Shield className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-black text-emerald-950">Medidas de prevencao</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {prevention.map((item, index) => (
                <div key={item} className="flex gap-3 rounded-2xl bg-white/70 p-4 ring-1 ring-emerald-900/8">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-sm font-black text-primary-700">
                    {index + 1}
                  </span>
                  <p className="font-semibold leading-6 text-emerald-900/70">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.aside
            className="grid gap-4"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
          >
            <div className="rounded-[2rem] bg-danger-500 p-6 text-white shadow-lg">
              <AlertTriangle className="mb-4 h-9 w-9" />
              <h2 className="text-2xl font-black">Atencao aos sintomas</h2>
              <p className="mt-3 font-semibold leading-7 text-white/88">
                Se houver suspeita de dengue, procure atendimento de saude. Evite automedicacao.
              </p>
            </div>

            <div className="surface-panel rounded-[2rem] p-6">
              <Wind className="mb-4 h-9 w-9 text-secondary-600" />
              <h2 className="text-2xl font-black text-emerald-950">Voce sabia?</h2>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <Metric value="4" label="sorotipos" />
                <Metric value="7-10" label="dias no ciclo" />
                <Metric value="1 ano" label="ovos secos" />
              </div>
            </div>
          </motion.aside>
        </section>
      </div>
    </main>
  );
};

const Metric = ({ value, label }) => (
  <div className="rounded-2xl bg-white/70 p-3 ring-1 ring-emerald-900/8">
    <div className="text-xl font-black text-secondary-700">{value}</div>
    <div className="mt-1 text-xs font-bold uppercase text-emerald-900/48">{label}</div>
  </div>
);

export default About;
