import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Copy, Crown, Loader, Play, RefreshCw, Users } from 'lucide-react';
import useGameStore from '../store/gameStore';
import {
  createRoom,
  joinRoom,
  setPlayerReady,
  startGame,
  leaveRoom,
  subscribeToRoom,
  listAvailableRooms
} from '../firebase/multiplayerService';

const MultiplayerLobby = () => {
  const { user, playerName, setGameState, startOnlineGame } = useGameStore();
  const [mode, setMode] = useState('menu');
  const [roomCode, setRoomCode] = useState('');
  const [currentRoom, setCurrentRoom] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [unsubscribe, setUnsubscribe] = useState(null);

  useEffect(() => {
    if (!user) setGameState('login');
  }, [setGameState, user]);

  useEffect(() => {
    if (mode === 'join') {
      loadAvailableRooms();
    }
  }, [mode]);

  useEffect(() => {
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [unsubscribe]);

  const watchRoom = (roomId) => {
    const unsub = subscribeToRoom(roomId, (updatedRoom) => {
      if (updatedRoom) {
        setCurrentRoom(updatedRoom);
        if (updatedRoom.status === 'playing' && updatedRoom.gameState) {
          startOnlineGame(updatedRoom, user.uid);
        }
      } else {
        setMode('menu');
        setCurrentRoom(null);
      }
    });
    setUnsubscribe(() => unsub);
  };

  const loadAvailableRooms = async () => {
    setLoading(true);
    setError('');
    try {
      const rooms = await listAvailableRooms();
      setAvailableRooms(rooms);
    } catch (err) {
      setError('Erro ao carregar salas.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const room = await createRoom(user.uid, playerName, 4);
      setCurrentRoom(room);
      setMode('lobby');
      watchRoom(room.roomId);
    } catch (err) {
      setError(`Erro ao criar sala: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (code) => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const room = await joinRoom(code, user.uid, playerName);
      setCurrentRoom(room);
      setMode('lobby');
      watchRoom(room.roomId);
    } catch (err) {
      setError(`Erro ao entrar na sala: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleReady = async () => {
    if (!currentRoom || !user) return;
    const player = currentRoom.players.find((p) => p.id === user.uid);
    if (!player) return;

    try {
      await setPlayerReady(currentRoom.roomId, user.uid, !player.isReady);
    } catch (err) {
      setError('Erro ao marcar pronto.');
    }
  };

  const handleStartGame = async () => {
    if (!currentRoom || !user) return;
    setLoading(true);
    try {
      await startGame(currentRoom.roomId, user.uid);
    } catch (err) {
      setError(`Erro ao iniciar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveRoom = async () => {
    if (!currentRoom || !user) return;
    try {
      await leaveRoom(currentRoom.roomId, user.uid);
      if (unsubscribe) {
        unsubscribe();
        setUnsubscribe(null);
      }
      setCurrentRoom(null);
      setMode('menu');
    } catch (err) {
      setError('Erro ao sair da sala.');
    }
  };

  const copyRoomCode = () => {
    if (!currentRoom) return;
    navigator.clipboard.writeText(currentRoom.roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isHost = currentRoom && user && currentRoom.hostId === user.uid;
  const allReady = currentRoom && currentRoom.players.every((p) => p.isReady);

  return (
    <main className="screen-shell-dark">
      <div className="page-container flex min-h-screen items-center py-6 sm:py-10">
        <div className="w-full">
          <AnimatePresence mode="wait">
            {mode === 'menu' && (
              <LobbyFrame
                key="menu"
                back={() => setGameState('login')}
                title="Multiplayer online"
                subtitle="Crie uma sala ou entre com o codigo de um amigo."
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <ChoiceCard
                    icon={Users}
                    title="Criar sala"
                    text="Gere um codigo e espere os jogadores ficarem prontos."
                    onClick={handleCreateRoom}
                    disabled={loading}
                  />
                  <ChoiceCard
                    icon={Play}
                    title="Entrar em sala"
                    text="Use um codigo ou escolha uma sala disponivel."
                    onClick={() => setMode('join')}
                  />
                </div>
                <ErrorBox error={error} />
              </LobbyFrame>
            )}

            {mode === 'join' && (
              <LobbyFrame
                key="join"
                back={() => setMode('menu')}
                title="Entrar em sala"
                subtitle="Digite o codigo de seis caracteres ou escolha uma sala aberta."
              >
                <section className="surface-panel-dark rounded-[2rem] p-5 sm:p-6">
                  <label className="mb-2 block text-sm font-black uppercase text-white/60">Codigo da sala</label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="text"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                      placeholder="ABC123"
                      className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-center font-mono text-2xl font-black tracking-[0.24em] text-white outline-none transition placeholder:text-white/25 focus:border-primary-400 focus:ring-4 focus:ring-primary-400/15"
                      maxLength={6}
                    />
                    <motion.button
                      onClick={() => handleJoinRoom(roomCode)}
                      disabled={loading || roomCode.length !== 6}
                      className="inline-flex min-h-[58px] items-center justify-center rounded-2xl px-7 font-black action-primary disabled:cursor-not-allowed disabled:opacity-50"
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                    >
                      {loading ? <Loader className="h-5 w-5 animate-spin" /> : 'Entrar'}
                    </motion.button>
                  </div>
                </section>

                <section className="surface-panel-dark rounded-[2rem] p-5 sm:p-6">
                  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-black text-white">Salas disponiveis</h2>
                    <button
                      onClick={loadAvailableRooms}
                      className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/15"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Atualizar
                    </button>
                  </div>

                  {loading ? (
                    <div className="py-8 text-center">
                      <Loader className="mx-auto h-8 w-8 animate-spin text-primary-400" />
                    </div>
                  ) : availableRooms.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/14 py-10 text-center font-semibold text-white/50">
                      Nenhuma sala aberta agora.
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {availableRooms.map((room) => (
                        <motion.button
                          key={room.roomId}
                          onClick={() => handleJoinRoom(room.roomCode)}
                          className="flex items-center justify-between gap-4 rounded-2xl bg-white/10 p-4 text-left transition hover:bg-white/15"
                          whileHover={{ x: 4 }}
                        >
                          <span>
                            <span className="block font-black text-white">{room.hostName || 'Sala'} </span>
                            <span className="text-sm font-semibold text-white/50">Codigo: {room.roomCode}</span>
                          </span>
                          <span className="rounded-xl bg-white/10 px-3 py-2 text-sm font-black text-white">
                            {room.currentPlayers}/{room.maxPlayers}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </section>
                <ErrorBox error={error} />
              </LobbyFrame>
            )}

            {mode === 'lobby' && currentRoom && (
              <LobbyFrame
                key="lobby"
                back={handleLeaveRoom}
                title={`Sala ${currentRoom.roomCode}`}
                subtitle="Compartilhe o codigo e aguarde todos ficarem prontos."
              >
                <button
                  onClick={copyRoomCode}
                  className="mx-auto flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 font-bold text-white transition hover:bg-white/15"
                >
                  {copied ? <Check className="h-5 w-5 text-primary-300" /> : <Copy className="h-5 w-5" />}
                  {copied ? 'Codigo copiado' : 'Copiar codigo'}
                </button>

                <section className="surface-panel-dark rounded-[2rem] p-5 sm:p-6">
                  <h2 className="mb-5 text-xl font-black text-white">
                    Jogadores ({currentRoom.currentPlayers}/{currentRoom.maxPlayers})
                  </h2>
                  <div className="grid gap-3 md:grid-cols-2">
                    {currentRoom.players.map((player, index) => (
                      <motion.div
                        key={player.id}
                        className="relative rounded-2xl bg-white/10 p-4"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.06 }}
                      >
                        {player.isHost && <Crown className="absolute right-4 top-4 h-5 w-5 text-accent-300" />}
                        <div className="flex items-center gap-4 pr-8">
                          <div
                            className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-xl font-black text-white shadow-lg"
                            style={{ backgroundColor: player.color }}
                          >
                            {player.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate font-black text-white">{player.name}</div>
                            <div className={`mt-1 text-sm font-bold ${player.isReady ? 'text-primary-300' : 'text-white/45'}`}>
                              {player.isReady ? 'Pronto' : 'Aguardando'}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {Array.from({ length: currentRoom.maxPlayers - currentRoom.currentPlayers }).map((_, i) => (
                      <div key={`empty-${i}`} className="rounded-2xl border border-dashed border-white/14 p-4 text-center text-white/35">
                        <Users className="mx-auto mb-2 h-7 w-7" />
                        <div className="text-sm font-bold">Aguardando jogador</div>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="grid gap-3 sm:grid-cols-2">
                  <motion.button
                    onClick={handleToggleReady}
                    disabled={isHost}
                    className={`min-h-[58px] rounded-2xl px-5 font-black transition ${
                      currentRoom.players.find((p) => p.id === user?.uid)?.isReady
                        ? 'bg-white/10 text-white/55'
                        : 'action-primary'
                    } ${isHost ? 'cursor-not-allowed opacity-50' : ''}`}
                    whileHover={!isHost ? { scale: 1.02 } : {}}
                    whileTap={!isHost ? { scale: 0.98 } : {}}
                  >
                    {currentRoom.players.find((p) => p.id === user?.uid)?.isReady ? 'Pronto' : 'Marcar como pronto'}
                  </motion.button>

                  {isHost && (
                    <motion.button
                      onClick={handleStartGame}
                      disabled={!allReady || loading}
                      className="min-h-[58px] rounded-2xl bg-accent-500 px-5 font-black text-white shadow-lg transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-50"
                      whileHover={allReady && !loading ? { scale: 1.02 } : {}}
                      whileTap={allReady && !loading ? { scale: 0.98 } : {}}
                    >
                      {loading ? <Loader className="mx-auto h-5 w-5 animate-spin" /> : 'Iniciar jogo'}
                    </motion.button>
                  )}
                </div>

                {!allReady && isHost && (
                  <p className="text-center text-sm font-semibold text-white/45">Aguardando todos os jogadores ficarem prontos.</p>
                )}
                <ErrorBox error={error} />
              </LobbyFrame>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
};

const LobbyFrame = ({ back, title, subtitle, children }) => (
  <motion.div
    className="mx-auto max-w-4xl space-y-5"
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -18 }}
  >
    <button
      onClick={back}
      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white transition hover:bg-white/15"
      aria-label="Voltar"
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
    <div className="text-center">
      <h1 className="brand-title-dark text-4xl font-black leading-tight sm:text-6xl">{title}</h1>
      <p className="brand-copy-dark mx-auto mt-3 max-w-xl text-base font-medium sm:text-lg">{subtitle}</p>
    </div>
    {children}
  </motion.div>
);

const ChoiceCard = ({ icon: Icon, title, text, onClick, disabled }) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    className="surface-panel-dark min-h-[190px] rounded-[2rem] p-6 text-left transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
  >
    <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-400/15 text-primary-300">
      <Icon className="h-8 w-8" />
    </span>
    <span className="block text-2xl font-black text-white">{title}</span>
    <span className="mt-2 block text-sm font-semibold leading-6 text-white/58">{text}</span>
  </motion.button>
);

const ErrorBox = ({ error }) => {
  if (!error) return null;

  return (
    <motion.div
      className="rounded-2xl border border-red-300/40 bg-red-500/15 p-4 text-center font-bold text-red-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {error}
    </motion.div>
  );
};

export default MultiplayerLobby;
