import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Users, Mail, ArrowLeft } from 'lucide-react';
import useGameStore from '../store/gameStore';
import { signInAnonymous, signInWithGoogle } from '../firebase/config';

const Login = () => {
  const { setGameState, setUser, startGame } = useGameStore();
  const [playerName, setPlayerNameLocal] = useState('');
  const [numPlayers, setNumPlayers] = useState(1);
  const [schoolId, setSchoolId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleAnonymousLogin = async () => {
    if (!playerName.trim()) {
      setError('Por favor, digite seu nome!');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Criar usuário fake se Firebase falhar
      let user;
      try {
        user = await signInAnonymous();
      } catch (firebaseError) {
        console.warn('Firebase não disponível, usando modo offline:', firebaseError);
        // Criar usuário fake para modo offline
        user = {
          uid: 'offline_' + Date.now(),
          isAnonymous: true,
          displayName: playerName
        };
      }
      setUser(user, playerName, schoolId);
      startGame(numPlayers);
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente!');
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
      setUser(user, user.displayName || 'Jogador', schoolId);
      startGame(numPlayers);
    } catch (err) {
      setError('Erro ao fazer login com Google. Tente novamente!');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-dengue-blue via-blue-400 to-dengue-green flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {/* Botão Voltar */}
        <button
          onClick={() => setGameState('menu')}
          className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        
        {/* Mosquito decorativo */}
        <motion.div
          className="text-8xl text-center mb-6"
          animate={{
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        >
          🦟
        </motion.div>
        
        {/* Título */}
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-2">
          Bem-vindo!
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Vamos começar sua jornada contra a dengue!
        </p>
        
        {/* Formulário */}
        <div className="space-y-4">
          {/* Nome do Jogador */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Seu Nome
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerNameLocal(e.target.value)}
              placeholder="Digite seu nome..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-dengue-blue focus:outline-none transition-colors"
              maxLength={20}
            />
          </div>
          
          {/* Número de Jogadores */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-2" />
              Número de Jogadores
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  onClick={() => setNumPlayers(num)}
                  className={`py-4 rounded-xl font-black text-2xl transition-all ${
                    numPlayers === num
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow scale-105'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-2 border-gray-300'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            {numPlayers > 1 && (
              <p className="text-xs text-gray-500 mt-2">
                ⚠️ Jogadores 2-{numPlayers} serão controlados pela IA
              </p>
            )}
          </div>
          
          {/* Escola (Opcional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Escola (Opcional)
            </label>
            <input
              type="text"
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              placeholder="Nome da sua escola..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-dengue-blue focus:outline-none transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Para participar do ranking escolar
            </p>
          </div>
          
          {/* Erro */}
          {error && (
            <motion.div
              className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}
          
          {/* Botões */}
          <div className="space-y-3 pt-4">
            <motion.button
              onClick={handleAnonymousLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-4 rounded-xl shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? '⏳ Carregando...' : '🎮 JOGAR SOLO'}
            </motion.button>
            
            <motion.button
              onClick={async () => {
                if (!playerName.trim()) {
                  setError('Por favor, digite seu nome!');
                  return;
                }
                setLoading(true);
                try {
                  const user = await signInAnonymous();
                  setUser(user, playerName, schoolId);
                  setGameState('multiplayer');
                } catch (err) {
                  setError('Erro ao fazer login');
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-bold py-4 rounded-xl shadow-glow-blue hover:shadow-glow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              👥 MULTIPLAYER ONLINE
            </motion.button>
            
            <motion.button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 font-bold py-4 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Entrar com Google
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
