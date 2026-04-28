import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Cpu, Gamepad2, Mail, Play, User, Users, Wifi } from 'lucide-react';
import useGameStore from '../store/gameStore';
import { signInAnonymous, signInWithGoogle } from '../firebase/config';

const Login = () => {
  const { setGameState, setUser, startGame } = useGameStore();
  const [playerName, setPlayerNameLocal] = useState('');
  const [numPlayers, setNumPlayers] = useState(1);
  const [isLocalMultiplayer, setIsLocalMultiplayer] = useState(false);
  const [schoolId, setSchoolId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ensureName = () => {
    if (!playerName.trim()) {
      setError('Digite seu nome para começar.');
      return false;
    }
    return true;
  };

  const createGuestUser = async () => {
    try {
      return await signInAnonymous();
    } catch (firebaseError) {
      console.warn('Firebase indisponivel, usando modo offline:', firebaseError);
      return {
        uid: `offline_${Date.now()}`,
        isAnonymous: true,
        displayName: playerName
      };
    }
  };

  const handleAnonymousLogin = async () => {
    if (!ensureName()) return;
    setLoading(true);
    setError('');

    try {
      const user = await createGuestUser();
      setUser(user, playerName.trim(), schoolId.trim());
      startGame(numPlayers, isLocalMultiplayer);
    } catch (err) {
      setError('Não foi possível iniciar a partida. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOnlineMultiplayer = async () => {
    if (!ensureName()) return;
    setLoading(true);
    setError('');

    try {
      const user = await createGuestUser();
      setUser(user, playerName.trim(), schoolId.trim());
      setGameState('multiplayer');
    } catch (err) {
      setError('Não foi possível entrar no multiplayer.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const user = await signInWithGoogle();
      const name = playerName.trim() || user.displayName || 'Jogador';
      setUser(user, name, schoolId.trim());
      startGame(numPlayers, isLocalMultiplayer);
    } catch (err) {
      setError('Erro ao entrar com Google. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="screen-shell">
      <div className="page-container flex min-h-screen items-center py-6 sm:py-10">
        <motion.section
          className="grid w-full gap-5 lg:grid-cols-[0.85fr_1.15fr]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <aside className="surface-panel overflow-hidden rounded-[2rem] p-6 sm:p-8">
            <button
              onClick={() => setGameState('menu')}
              className="mb-8 inline-flex h-11 w-11 items-center justify-center rounded-2xl action-secondary"
              aria-label="Voltar ao menu"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <h1 className="brand-title text-4xl font-black leading-tight sm:text-5xl">
              Prepare sua rodada.
            </h1>
            <p className="brand-copy mt-4 text-base font-medium leading-7">
              Escolha seu nome, modo de jogo e comece uma partida local, contra CPU ou online.
            </p>

            <div className="mt-8 grid gap-3">
              {[
                ['Quiz educativo', 'Perguntas aparecem no caminho.'],
                ['Turno extra no 6', 'A regra clássica agora funciona.'],
                ['Multiplayer online', 'Salas sincronizadas em tempo real.']
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl bg-white/70 p-4 ring-1 ring-emerald-900/10">
                  <div className="font-black text-emerald-950">{title}</div>
                  <div className="mt-1 text-sm font-medium text-emerald-900/60">{text}</div>
                </div>
              ))}
            </div>
          </aside>

          <div className="surface-panel rounded-[2rem] p-5 sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-emerald-950 sm:text-3xl">Dados da partida</h2>
              <p className="mt-1 text-sm font-semibold text-emerald-900/55">Tudo pronto em poucos segundos.</p>
            </div>

            <div className="grid gap-5">
              <Field label="Seu nome" icon={User}>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerNameLocal(e.target.value)}
                  placeholder="Digite seu nome"
                  className="w-full rounded-2xl border border-emerald-900/14 bg-white px-4 py-4 text-base font-bold text-emerald-950 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-500/15"
                  maxLength={20}
                />
              </Field>

              <Field label="Jogadores" icon={Users}>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => setNumPlayers(num)}
                      className={`min-h-[58px] rounded-2xl text-2xl font-black transition ${
                        numPlayers === num
                          ? 'action-primary'
                          : 'bg-white text-emerald-950 ring-1 ring-emerald-900/12 hover:ring-primary-500/40'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </Field>

              {numPlayers > 1 && (
                <Field label="Modo local" icon={Gamepad2}>
                  <div className="grid grid-cols-2 gap-3">
                    <ModeButton
                      active={!isLocalMultiplayer}
                      icon={Cpu}
                      title="VS CPU"
                      text="O computador joga os outros turnos."
                      onClick={() => setIsLocalMultiplayer(false)}
                    />
                    <ModeButton
                      active={isLocalMultiplayer}
                      icon={Gamepad2}
                      title="Local"
                      text="Todos jogam no mesmo aparelho."
                      onClick={() => setIsLocalMultiplayer(true)}
                    />
                  </div>
                </Field>
              )}

              <Field label="Escola (opcional)" icon={Mail}>
                <input
                  type="text"
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  placeholder="Nome da sua escola"
                  className="w-full rounded-2xl border border-emerald-900/14 bg-white px-4 py-4 text-base font-bold text-emerald-950 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-500/15"
                />
              </Field>

              {error && (
                <motion.div
                  className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}

              <div className="grid gap-3 pt-2 sm:grid-cols-2">
                <motion.button
                  onClick={handleAnonymousLogin}
                  disabled={loading}
                  className="inline-flex min-h-[58px] items-center justify-center gap-3 rounded-2xl px-5 text-base font-black action-primary disabled:cursor-not-allowed disabled:opacity-60"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  <Play className="h-5 w-5" fill="currentColor" />
                  {loading ? 'Carregando...' : 'Jogar'}
                </motion.button>

                <motion.button
                  onClick={handleOnlineMultiplayer}
                  disabled={loading}
                  className="inline-flex min-h-[58px] items-center justify-center gap-3 rounded-2xl px-5 text-base font-black action-secondary disabled:cursor-not-allowed disabled:opacity-60"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  <Wifi className="h-5 w-5 text-secondary-600" />
                  Multiplayer
                </motion.button>
              </div>

              <motion.button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="inline-flex min-h-[54px] items-center justify-center gap-3 rounded-2xl bg-white px-5 text-sm font-black text-emerald-950 ring-1 ring-emerald-900/14 transition hover:ring-primary-500/40 disabled:cursor-not-allowed disabled:opacity-60"
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
              >
                <GoogleMark />
                Entrar com Google
              </motion.button>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
};

const Field = ({ label, icon: Icon, children }) => (
  <label className="block">
    <span className="mb-2 flex items-center gap-2 text-sm font-black uppercase text-emerald-900/62">
      <Icon className="h-4 w-4 text-primary-600" />
      {label}
    </span>
    {children}
  </label>
);

const ModeButton = ({ active, icon: Icon, title, text, onClick }) => (
  <button
    onClick={onClick}
    className={`rounded-2xl p-4 text-left transition ${
      active
        ? 'bg-emerald-950 text-white shadow-lg'
        : 'bg-white text-emerald-950 ring-1 ring-emerald-900/12 hover:ring-primary-500/40'
    }`}
  >
    <Icon className={`mb-3 h-6 w-6 ${active ? 'text-primary-300' : 'text-primary-600'}`} />
    <div className="font-black">{title}</div>
    <div className={`mt-1 text-xs font-semibold leading-5 ${active ? 'text-white/70' : 'text-emerald-900/58'}`}>{text}</div>
  </button>
);

const GoogleMark = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export default Login;
