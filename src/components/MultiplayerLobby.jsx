import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Copy, Check, Play, ArrowLeft, Crown, Loader } from 'lucide-react';
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
  const { user, playerName, setGameState } = useGameStore();
  const [mode, setMode] = useState('menu'); // menu, create, join, lobby
  const [roomCode, setRoomCode] = useState('');
  const [currentRoom, setCurrentRoom] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [unsubscribe, setUnsubscribe] = useState(null);

  useEffect(() => {
    if (mode === 'join') {
      loadAvailableRooms();
    }
  }, [mode]);

  useEffect(() => {
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      if (currentRoom) {
        leaveRoom(currentRoom.roomId, user.uid);
      }
    };
  }, []);

  const loadAvailableRooms = async () => {
    setLoading(true);
    try {
      const rooms = await listAvailableRooms();
      setAvailableRooms(rooms);
    } catch (err) {
      setError('Erro ao carregar salas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    setLoading(true);
    setError('');
    try {
      const room = await createRoom(user.uid, playerName, 4);
      setCurrentRoom(room);
      setMode('lobby');
      
      // Observar mudanças na sala
      const unsub = subscribeToRoom(room.roomId, (updatedRoom) => {
        if (updatedRoom) {
          setCurrentRoom(updatedRoom);
          // Se o jogo iniciou, ir para tela de jogo
          if (updatedRoom.status === 'playing') {
            setGameState('playing');
          }
        } else {
          // Sala foi deletada
          setMode('menu');
          setCurrentRoom(null);
        }
      });
      setUnsubscribe(() => unsub);
    } catch (err) {
      setError('Erro ao criar sala: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (code) => {
    setLoading(true);
    setError('');
    try {
      const room = await joinRoom(code, user.uid, playerName);
      setCurrentRoom(room);
      setMode('lobby');
      
      // Observar mudanças na sala
      const unsub = subscribeToRoom(room.roomId, (updatedRoom) => {
        if (updatedRoom) {
          setCurrentRoom(updatedRoom);
          if (updatedRoom.status === 'playing') {
            setGameState('playing');
          }
        } else {
          setMode('menu');
          setCurrentRoom(null);
        }
      });
      setUnsubscribe(() => unsub);
    } catch (err) {
      setError('Erro ao entrar na sala: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleReady = async () => {
    if (!currentRoom) return;
    const player = currentRoom.players.find(p => p.id === user.uid);
    if (!player) return;
    
    try {
      await setPlayerReady(currentRoom.roomId, user.uid, !player.isReady);
    } catch (err) {
      setError('Erro ao marcar pronto');
    }
  };

  const handleStartGame = async () => {
    if (!currentRoom) return;
    setLoading(true);
    try {
      await startGame(currentRoom.roomId, user.uid);
    } catch (err) {
      setError('Erro ao iniciar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveRoom = async () => {
    if (!currentRoom) return;
    try {
      await leaveRoom(currentRoom.roomId, user.uid);
      if (unsubscribe) {
        unsubscribe();
        setUnsubscribe(null);
      }
      setCurrentRoom(null);
      setMode('menu');
    } catch (err) {
      setError('Erro ao sair da sala');
    }
  };

  const copyRoomCode = () => {
    if (currentRoom) {
      navigator.clipboard.writeText(currentRoom.roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isHost = currentRoom && currentRoom.hostId === user.uid;
  const allReady = currentRoom && currentRoom.players.every(p => p.isReady);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
        <div className="absolute inset-0 bg-mesh-gradient opacity-20" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          <AnimatePresence mode="wait">
            {/* Menu Principal */}
            {mode === 'menu' && (
              <motion.div
                key="menu"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <button
                  onClick={() => setGameState('login')}
                  className="absolute top-8 left-8 p-3 glass-dark rounded-2xl hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 text-white" />
                </button>

                <div className="text-center mb-12">
                  <h1 className="text-6xl font-display font-black gradient-text mb-4">
                    MULTIPLAYER
                  </h1>
                  <p className="text-white/70 text-xl">
                    Jogue com seus amigos online
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.button
                    onClick={handleCreateRoom}
                    className="glass-dark rounded-3xl p-8 hover:bg-white/10 transition-all"
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                  >
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mx-auto mb-4 shadow-glow">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-white mb-2">
                      CRIAR SALA
                    </h2>
                    <p className="text-white/70">
                      Crie uma nova sala e convide amigos
                    </p>
                  </motion.button>

                  <motion.button
                    onClick={() => setMode('join')}
                    className="glass-dark rounded-3xl p-8 hover:bg-white/10 transition-all"
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center mx-auto mb-4 shadow-glow-blue">
                      <Play className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-white mb-2">
                      ENTRAR
                    </h2>
                    <p className="text-white/70">
                      Entre em uma sala existente
                    </p>
                  </motion.button>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-danger-500/20 border-2 border-danger-500 rounded-2xl p-4 text-white text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Entrar na Sala */}
            {mode === 'join' && (
              <motion.div
                key="join"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <button
                  onClick={() => setMode('menu')}
                  className="absolute top-8 left-8 p-3 glass-dark rounded-2xl hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 text-white" />
                </button>

                <div className="text-center mb-8">
                  <h1 className="text-5xl font-display font-black text-white mb-4">
                    ENTRAR NA SALA
                  </h1>
                </div>

                <div className="glass-dark rounded-3xl p-8">
                  <label className="block text-white font-semibold mb-3">
                    Código da Sala
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                      placeholder="Digite o código..."
                      className="flex-1 bg-dark-700 text-white px-6 py-4 rounded-2xl border-2 border-dark-600 focus:border-primary-500 outline-none text-2xl font-mono text-center tracking-widest"
                      maxLength={6}
                    />
                    <motion.button
                      onClick={() => handleJoinRoom(roomCode)}
                      disabled={loading || roomCode.length !== 6}
                      className="bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold px-8 py-4 rounded-2xl shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: loading ? 1 : 1.05 }}
                      whileTap={{ scale: loading ? 1 : 0.95 }}
                    >
                      {loading ? <Loader className="w-6 h-6 animate-spin" /> : 'ENTRAR'}
                    </motion.button>
                  </div>
                </div>

                {/* Salas Disponíveis */}
                <div className="glass-dark rounded-3xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-display font-bold text-white">
                      Salas Disponíveis
                    </h2>
                    <button
                      onClick={loadAvailableRooms}
                      className="text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      🔄 Atualizar
                    </button>
                  </div>

                  {loading ? (
                    <div className="text-center py-8">
                      <Loader className="w-8 h-8 animate-spin text-primary-500 mx-auto" />
                    </div>
                  ) : availableRooms.length === 0 ? (
                    <div className="text-center py-8 text-white/50">
                      Nenhuma sala disponível
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {availableRooms.map((room) => (
                        <motion.button
                          key={room.roomId}
                          onClick={() => handleJoinRoom(room.roomCode)}
                          className="w-full bg-dark-700 hover:bg-dark-600 rounded-2xl p-4 flex items-center justify-between transition-colors"
                          whileHover={{ x: 5 }}
                        >
                          <div className="text-left">
                            <div className="text-white font-bold text-lg">
                              {room.hostName}'s Room
                            </div>
                            <div className="text-white/50 text-sm">
                              Código: {room.roomCode}
                            </div>
                          </div>
                          <div className="text-white/70">
                            {room.currentPlayers}/{room.maxPlayers} jogadores
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-danger-500/20 border-2 border-danger-500 rounded-2xl p-4 text-white text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Lobby da Sala */}
            {mode === 'lobby' && currentRoom && (
              <motion.div
                key="lobby"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <button
                  onClick={handleLeaveRoom}
                  className="absolute top-8 left-8 p-3 glass-dark rounded-2xl hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 text-white" />
                </button>

                <div className="text-center mb-8">
                  <h1 className="text-5xl font-display font-black text-white mb-4">
                    SALA: {currentRoom.roomCode}
                  </h1>
                  <button
                    onClick={copyRoomCode}
                    className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        Copiar código
                      </>
                    )}
                  </button>
                </div>

                {/* Jogadores */}
                <div className="glass-dark rounded-3xl p-8">
                  <h2 className="text-2xl font-display font-bold text-white mb-6">
                    Jogadores ({currentRoom.currentPlayers}/{currentRoom.maxPlayers})
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentRoom.players.map((player, index) => (
                      <motion.div
                        key={player.id}
                        className="bg-dark-700 rounded-2xl p-6 relative"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {player.isHost && (
                          <div className="absolute top-3 right-3">
                            <Crown className="w-6 h-6 text-accent-400" />
                          </div>
                        )}

                        <div className="flex items-center gap-4">
                          <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                            style={{ backgroundColor: player.color }}
                          >
                            {player.name.charAt(0)}
                          </div>

                          <div className="flex-1">
                            <div className="text-white font-bold text-lg">
                              {player.name}
                            </div>
                            <div className={`text-sm font-semibold ${player.isReady ? 'text-primary-400' : 'text-white/50'}`}>
                              {player.isReady ? '✓ Pronto' : 'Aguardando...'}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Slots vazios */}
                    {Array.from({ length: currentRoom.maxPlayers - currentRoom.currentPlayers }).map((_, i) => (
                      <div
                        key={`empty-${i}`}
                        className="bg-dark-700/50 rounded-2xl p-6 border-2 border-dashed border-dark-600 flex items-center justify-center"
                      >
                        <div className="text-white/30 text-center">
                          <Users className="w-8 h-8 mx-auto mb-2" />
                          <div className="text-sm">Aguardando jogador...</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-4">
                  <motion.button
                    onClick={handleToggleReady}
                    disabled={isHost}
                    className={`flex-1 font-bold py-4 rounded-2xl transition-all ${
                      currentRoom.players.find(p => p.id === user.uid)?.isReady
                        ? 'bg-dark-700 text-white/50'
                        : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow'
                    } ${isHost ? 'opacity-50 cursor-not-allowed' : ''}`}
                    whileHover={!isHost ? { scale: 1.02 } : {}}
                    whileTap={!isHost ? { scale: 0.98 } : {}}
                  >
                    {currentRoom.players.find(p => p.id === user.uid)?.isReady ? 'PRONTO ✓' : 'MARCAR COMO PRONTO'}
                  </motion.button>

                  {isHost && (
                    <motion.button
                      onClick={handleStartGame}
                      disabled={!allReady || loading}
                      className="flex-1 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold py-4 rounded-2xl shadow-glow-yellow disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={allReady && !loading ? { scale: 1.02 } : {}}
                      whileTap={allReady && !loading ? { scale: 0.98 } : {}}
                    >
                      {loading ? (
                        <Loader className="w-6 h-6 animate-spin mx-auto" />
                      ) : (
                        'INICIAR JOGO'
                      )}
                    </motion.button>
                  )}
                </div>

                {!allReady && isHost && (
                  <div className="text-center text-white/50 text-sm">
                    Aguardando todos os jogadores ficarem prontos...
                  </div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-danger-500/20 border-2 border-danger-500 rounded-2xl p-4 text-white text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerLobby;
