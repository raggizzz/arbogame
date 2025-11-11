import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  updateDoc,
  deleteDoc,
  query, 
  where,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from './config';

// Gerar código de sala único
const generateRoomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Criar nova sala multiplayer
export const createRoom = async (hostId, hostName, maxPlayers = 4) => {
  try {
    const roomCode = generateRoomCode();
    const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const roomData = {
      roomCode,
      roomId,
      hostId,
      hostName,
      maxPlayers,
      currentPlayers: 1,
      status: 'waiting', // waiting, playing, finished
      players: [{
        id: hostId,
        name: hostName,
        position: 0,
        score: 0,
        color: '#00E65C',
        isReady: true,
        isHost: true
      }],
      gameState: {
        currentPlayerIndex: 0,
        diceValue: 1,
        canRoll: true,
        showQuiz: false,
        currentQuestion: null
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(doc(db, 'rooms', roomId), roomData);
    
    return { roomId, roomCode, ...roomData };
  } catch (error) {
    console.error('Erro ao criar sala:', error);
    throw error;
  }
};

// Entrar em uma sala pelo código
export const joinRoom = async (roomCode, playerId, playerName) => {
  try {
    // Buscar sala pelo código
    const roomsRef = collection(db, 'rooms');
    const q = query(roomsRef, where('roomCode', '==', roomCode), where('status', '==', 'waiting'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      throw new Error('Sala não encontrada ou já iniciada');
    }
    
    const roomDoc = snapshot.docs[0];
    const roomData = roomDoc.data();
    
    // Verificar se há espaço
    if (roomData.currentPlayers >= roomData.maxPlayers) {
      throw new Error('Sala cheia');
    }
    
    // Verificar se jogador já está na sala
    if (roomData.players.some(p => p.id === playerId)) {
      throw new Error('Você já está nesta sala');
    }
    
    // Cores disponíveis
    const colors = ['#00E65C', '#0BA5E9', '#F59E0B', '#EF4444'];
    const usedColors = roomData.players.map(p => p.color);
    const availableColor = colors.find(c => !usedColors.includes(c)) || colors[0];
    
    // Adicionar jogador
    const newPlayer = {
      id: playerId,
      name: playerName,
      position: 0,
      score: 0,
      color: availableColor,
      isReady: false,
      isHost: false
    };
    
    await updateDoc(doc(db, 'rooms', roomDoc.id), {
      players: arrayUnion(newPlayer),
      currentPlayers: roomData.currentPlayers + 1,
      updatedAt: serverTimestamp()
    });
    
    return { roomId: roomDoc.id, ...roomData, players: [...roomData.players, newPlayer] };
  } catch (error) {
    console.error('Erro ao entrar na sala:', error);
    throw error;
  }
};

// Marcar jogador como pronto
export const setPlayerReady = async (roomId, playerId, isReady) => {
  try {
    const roomRef = doc(db, 'rooms', roomId);
    const roomSnap = await getDoc(roomRef);
    
    if (!roomSnap.exists()) {
      throw new Error('Sala não encontrada');
    }
    
    const roomData = roomSnap.data();
    const updatedPlayers = roomData.players.map(p => 
      p.id === playerId ? { ...p, isReady } : p
    );
    
    await updateDoc(roomRef, {
      players: updatedPlayers,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao marcar pronto:', error);
    throw error;
  }
};

// Iniciar jogo (apenas host)
export const startGame = async (roomId, hostId) => {
  try {
    const roomRef = doc(db, 'rooms', roomId);
    const roomSnap = await getDoc(roomRef);
    
    if (!roomSnap.exists()) {
      throw new Error('Sala não encontrada');
    }
    
    const roomData = roomSnap.data();
    
    // Verificar se é o host
    if (roomData.hostId !== hostId) {
      throw new Error('Apenas o host pode iniciar o jogo');
    }
    
    // Verificar se todos estão prontos
    const allReady = roomData.players.every(p => p.isReady);
    if (!allReady) {
      throw new Error('Nem todos os jogadores estão prontos');
    }
    
    await updateDoc(roomRef, {
      status: 'playing',
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao iniciar jogo:', error);
    throw error;
  }
};

// Atualizar estado do jogo
export const updateGameState = async (roomId, gameState) => {
  try {
    const roomRef = doc(db, 'rooms', roomId);
    
    await updateDoc(roomRef, {
      gameState,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar estado:', error);
    throw error;
  }
};

// Atualizar posição do jogador
export const updatePlayerPosition = async (roomId, playerId, position, score) => {
  try {
    const roomRef = doc(db, 'rooms', roomId);
    const roomSnap = await getDoc(roomRef);
    
    if (!roomSnap.exists()) {
      throw new Error('Sala não encontrada');
    }
    
    const roomData = roomSnap.data();
    const updatedPlayers = roomData.players.map(p => 
      p.id === playerId ? { ...p, position, score } : p
    );
    
    await updateDoc(roomRef, {
      players: updatedPlayers,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar posição:', error);
    throw error;
  }
};

// Sair da sala
export const leaveRoom = async (roomId, playerId) => {
  try {
    const roomRef = doc(db, 'rooms', roomId);
    const roomSnap = await getDoc(roomRef);
    
    if (!roomSnap.exists()) {
      return true;
    }
    
    const roomData = roomSnap.data();
    const player = roomData.players.find(p => p.id === playerId);
    
    if (!player) {
      return true;
    }
    
    // Se for o host e houver outros jogadores, passar host
    if (player.isHost && roomData.players.length > 1) {
      const updatedPlayers = roomData.players
        .filter(p => p.id !== playerId)
        .map((p, i) => i === 0 ? { ...p, isHost: true } : p);
      
      await updateDoc(roomRef, {
        players: updatedPlayers,
        currentPlayers: roomData.currentPlayers - 1,
        hostId: updatedPlayers[0].id,
        hostName: updatedPlayers[0].name,
        updatedAt: serverTimestamp()
      });
    } else if (roomData.players.length === 1) {
      // Se for o último jogador, deletar sala
      await deleteDoc(roomRef);
    } else {
      // Remover jogador
      await updateDoc(roomRef, {
        players: arrayRemove(player),
        currentPlayers: roomData.currentPlayers - 1,
        updatedAt: serverTimestamp()
      });
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao sair da sala:', error);
    throw error;
  }
};

// Observar mudanças na sala em tempo real
export const subscribeToRoom = (roomId, callback) => {
  const roomRef = doc(db, 'rooms', roomId);
  
  return onSnapshot(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({ roomId: snapshot.id, ...snapshot.data() });
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('Erro ao observar sala:', error);
    callback(null);
  });
};

// Listar salas disponíveis
export const listAvailableRooms = async () => {
  try {
    const roomsRef = collection(db, 'rooms');
    const q = query(roomsRef, where('status', '==', 'waiting'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      roomId: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao listar salas:', error);
    return [];
  }
};

// Finalizar jogo
export const finishGame = async (roomId, winnerId) => {
  try {
    const roomRef = doc(db, 'rooms', roomId);
    
    await updateDoc(roomRef, {
      status: 'finished',
      winnerId,
      finishedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao finalizar jogo:', error);
    throw error;
  }
};
