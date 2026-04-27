import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Home, RotateCcw, Share2, Download } from 'lucide-react';
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
    
    // Salvar no ranking global
    await saveScore(user.uid, playerData);
    
    // Salvar no ranking da escola
    if (schoolId) {
      await saveSchoolScore(schoolId, user.uid, playerData);
    }
    
    // Buscar posição no ranking
    const position = await getPlayerRank(user.uid);
    setRank(position);
    setSaved(true);
  };
  
  const getTitleByScore = () => {
    if (score >= 100) return '🏆 AGENTE MASTER DA DENGUE';
    if (score >= 70) return '🥇 AGENTE SÊNIOR DA DENGUE';
    if (score >= 50) return '🥈 AGENTE PLENO DA DENGUE';
    if (score >= 30) return '🥉 AGENTE JÚNIOR DA DENGUE';
    return '🎖️ AGENTE MIRIM DA DENGUE';
  };
  
  const getMessageByScore = () => {
    if (score >= 100) return 'Incrível! Você é um verdadeiro especialista!';
    if (score >= 70) return 'Excelente trabalho! Continue assim!';
    if (score >= 50) return 'Muito bem! Você está no caminho certo!';
    if (score >= 30) return 'Bom trabalho! Continue aprendendo!';
    return 'Parabéns por jogar! Tente novamente!';
  };
  
  const shareScore = () => {
    const text = `🦟 Acabei de jogar Ludo da Dengue!\n\n🏆 Pontuação: ${score} pontos\n✅ Acertos: ${correctAnswers}\n${rank ? `📊 Posição no ranking: ${rank}º\n` : ''}\nJogue você também e aprenda sobre prevenção da dengue! 🎮`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Ludo da Dengue',
        text: text
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Texto copiado! Cole nas suas redes sociais! 📋');
    }
  };
  
  const downloadCertificate = () => {
    setShowCertificate(true);
    setTimeout(() => {
      window.print();
    }, 500);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 p-4 flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-10" />
      
      <motion.div
        className="glass-dark rounded-3xl shadow-glow max-w-3xl w-full p-12 relative overflow-hidden border-2 border-primary-500/30"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
      >
        {/* Confetes animados */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl"
            initial={{
              x: Math.random() * 100 - 50,
              y: -50,
              rotate: 0
            }}
            animate={{
              y: 600,
              x: Math.random() * 400 - 200,
              rotate: 360
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: Math.random() * 0.5,
              repeat: Infinity
            }}
          >
            {['🎉', '🎊', '⭐', '✨', '🏆'][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
        
        {/* Conteúdo */}
        <div className="relative z-10">
          {/* Troféu animado */}
          <motion.div
            className="text-9xl text-center mb-6"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          >
            🏆
          </motion.div>
          
          {/* Título */}
          <h1 className="text-6xl font-black text-center gradient-text mb-6">
            PARABÉNS!
          </h1>
          
          <div className="text-center mb-10">
            <div className="text-3xl font-bold text-primary-400 mb-3">
              {getTitleByScore()}
            </div>
            <p className="text-white/80 text-xl">
              {getMessageByScore()}
            </p>
          </div>
          
          {/* Estatísticas */}
          <div className="grid grid-cols-2 gap-6 mb-10">
            <motion.div 
              className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-3xl p-8 text-center shadow-glow-yellow"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-6xl font-black text-white mb-3">{score}</div>
              <div className="text-white/90 font-bold text-lg uppercase tracking-wider">PONTOS</div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl p-8 text-center shadow-glow"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-6xl font-black text-white mb-3">{correctAnswers}</div>
              <div className="text-white/90 font-bold text-lg uppercase tracking-wider">ACERTOS</div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-danger-500 to-danger-600 rounded-3xl p-8 text-center shadow-glow-red"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-6xl font-black text-white mb-3">{wrongAnswers}</div>
              <div className="text-white/90 font-bold text-lg uppercase tracking-wider">ERROS</div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-3xl p-8 text-center shadow-glow-blue"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-6xl font-black text-white mb-3">
                {correctAnswers + wrongAnswers > 0 
                  ? Math.round((correctAnswers / (correctAnswers + wrongAnswers)) * 100) 
                  : 0}%
              </div>
              <div className="text-white/90 font-bold text-lg uppercase tracking-wider">PRECISÃO</div>
            </motion.div>
          </div>
          
          {/* Ranking */}
          {rank && (
            <motion.div
              className="glass-dark rounded-3xl p-6 mb-8 text-center border-2 border-accent-500/50"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-sm text-white/60 mb-2 uppercase tracking-wider">SUA POSIÇÃO NO RANKING</div>
              <div className="text-5xl font-black gradient-text">
                {rank}º lugar
              </div>
            </motion.div>
          )}
          
          {/* Botões */}
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              onClick={() => {
                resetGame();
                setGameState('menu');
              }}
              className="bg-dark-700 hover:bg-dark-600 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Home className="w-5 h-5" />
              Menu
            </motion.button>
            
            <motion.button
              onClick={() => {
                resetGame();
                setGameState('login');
              }}
              className="bg-gradient-to-r from-primary-500 to-primary-600 shadow-glow text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RotateCcw className="w-5 h-5" />
              Jogar Novamente
            </motion.button>
            
            <motion.button
              onClick={shareScore}
              className="bg-gradient-to-r from-secondary-500 to-secondary-600 shadow-glow-blue text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Share2 className="w-5 h-5" />
              Compartilhar
            </motion.button>
            
            <motion.button
              onClick={downloadCertificate}
              className="bg-gradient-to-r from-accent-500 to-accent-600 shadow-glow-yellow text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-5 h-5" />
              Certificado
            </motion.button>
          </div>
        </div>
      </motion.div>
      
      {/* Certificado (para impressão) */}
      {showCertificate && (
        <div className="hidden print:block fixed inset-0 bg-white p-12">
          <div className="border-8 border-dengue-green rounded-3xl p-12 h-full flex flex-col items-center justify-center">
            <div className="text-8xl mb-8">🏆</div>
            <h1 className="text-6xl font-bold text-dengue-blue mb-4">CERTIFICADO</h1>
            <h2 className="text-4xl font-bold text-gray-800 mb-8">{getTitleByScore()}</h2>
            <p className="text-2xl text-gray-700 mb-4">Certificamos que</p>
            <p className="text-5xl font-bold text-dengue-purple mb-8">{playerName}</p>
            <p className="text-2xl text-gray-700 mb-4">
              Completou o jogo Ludo da Dengue com
            </p>
            <p className="text-6xl font-bold text-dengue-yellow mb-8">{score} pontos</p>
            <p className="text-xl text-gray-600">
              {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameOver;
