// Script para inicializar o Firebase e criar estrutura do banco de dados
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDAmTT7VPDk-F-YKot0tq8gFA-YMDrkmTQ",
  authDomain: "arbogame-6e1b7.firebaseapp.com",
  projectId: "arbogame-6e1b7",
  storageBucket: "arbogame-6e1b7.firebasestorage.app",
  messagingSenderId: "844105785131",
  appId: "1:844105785131:web:6baaa86c3ba98e40cfaf6e",
  measurementId: "G-MHPV9HFJRM"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function initializeDatabase() {
  console.log('🔥 Inicializando banco de dados Firebase...\n');

  try {
    // 1. Criar coleção de estatísticas globais
    console.log('📊 Criando estatísticas globais...');
    await setDoc(doc(db, 'stats', 'global'), {
      totalPlayers: 0,
      totalGames: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      averageScore: 0,
      lastUpdated: serverTimestamp(),
      createdAt: serverTimestamp()
    });
    console.log('✅ Estatísticas globais criadas!\n');

    // 2. Criar documento de exemplo no ranking
    console.log('🏆 Criando exemplo de ranking...');
    await setDoc(doc(db, 'ranking', 'demo-player-1'), {
      playerName: 'Jogador Demo',
      score: 100,
      correctAnswers: 10,
      wrongAnswers: 0,
      precision: 100,
      gamesPlayed: 1,
      timestamp: serverTimestamp(),
      updatedAt: new Date().toISOString()
    });
    console.log('✅ Exemplo de ranking criado!\n');

    // 3. Criar exemplo de ranking escolar
    console.log('🏫 Criando exemplo de ranking escolar...');
    await setDoc(doc(db, 'schoolRanking', 'escola-demo', 'players', 'demo-player-1'), {
      playerName: 'Aluno Demo',
      schoolId: 'escola-demo',
      schoolName: 'Escola Demonstração',
      score: 100,
      correctAnswers: 10,
      wrongAnswers: 0,
      timestamp: serverTimestamp(),
      updatedAt: new Date().toISOString()
    });
    console.log('✅ Exemplo de ranking escolar criado!\n');

    // 4. Criar sala multiplayer de exemplo
    console.log('👥 Criando sala multiplayer de exemplo...');
    await setDoc(doc(db, 'rooms', 'demo-room'), {
      roomCode: 'DEMO',
      hostId: 'demo-player-1',
      hostName: 'Host Demo',
      maxPlayers: 4,
      currentPlayers: 1,
      status: 'waiting', // waiting, playing, finished
      players: [{
        id: 'demo-player-1',
        name: 'Host Demo',
        position: 0,
        score: 0,
        color: '#00E65C',
        isReady: true
      }],
      gameState: {
        currentPlayerIndex: 0,
        diceValue: 1,
        board: []
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('✅ Sala multiplayer criada!\n');

    // 5. Criar configurações do jogo
    console.log('⚙️ Criando configurações do jogo...');
    await setDoc(doc(db, 'config', 'game'), {
      version: '1.0.0',
      maxPlayersPerRoom: 4,
      questionTimeLimit: 30,
      diceRollDelay: 1000,
      moveAnimationSpeed: 500,
      enableMultiplayer: true,
      enableRanking: true,
      enableSchoolRanking: true,
      maintenanceMode: false,
      updatedAt: serverTimestamp()
    });
    console.log('✅ Configurações criadas!\n');

    console.log('🎉 Banco de dados inicializado com sucesso!\n');
    console.log('📋 Estrutura criada:');
    console.log('   ✓ stats/global - Estatísticas globais');
    console.log('   ✓ ranking/* - Ranking global de jogadores');
    console.log('   ✓ schoolRanking/{schoolId}/players/* - Rankings escolares');
    console.log('   ✓ rooms/* - Salas multiplayer');
    console.log('   ✓ config/game - Configurações do jogo');
    console.log('\n✨ Pronto para jogar!\n');

  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    process.exit(1);
  }
}

// Executar inicialização
initializeDatabase()
  .then(() => {
    console.log('👍 Script finalizado com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
  });
