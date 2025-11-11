import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';

// Salvar pontuação no ranking global
export const saveScore = async (userId, playerData) => {
  try {
    const rankingRef = doc(db, 'ranking', userId);
    await setDoc(rankingRef, {
      ...playerData,
      timestamp: serverTimestamp(),
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Erro ao salvar pontuação:', error);
    // Fallback para localStorage
    const localRanking = JSON.parse(localStorage.getItem('ludoDengueRanking') || '[]');
    const existingIndex = localRanking.findIndex(p => p.userId === userId);
    if (existingIndex >= 0) {
      localRanking[existingIndex] = { ...playerData, userId, timestamp: Date.now() };
    } else {
      localRanking.push({ ...playerData, userId, timestamp: Date.now() });
    }
    localStorage.setItem('ludoDengueRanking', JSON.stringify(localRanking));
    return false;
  }
};

// Buscar top 10 do ranking global
export const getTopRanking = async (limitCount = 10) => {
  try {
    const rankingRef = collection(db, 'ranking');
    const q = query(rankingRef, orderBy('score', 'desc'), orderBy('timestamp', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      userId: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar ranking:', error);
    // Fallback para localStorage
    const localRanking = JSON.parse(localStorage.getItem('ludoDengueRanking') || '[]');
    return localRanking
      .sort((a, b) => b.score - a.score)
      .slice(0, limitCount);
  }
};

// Salvar pontuação no ranking da escola
export const saveSchoolScore = async (schoolId, userId, playerData) => {
  try {
    const schoolRankingRef = doc(db, 'schoolRanking', schoolId, 'players', userId);
    await setDoc(schoolRankingRef, {
      ...playerData,
      schoolId,
      timestamp: serverTimestamp(),
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Erro ao salvar pontuação da escola:', error);
    return false;
  }
};

// Buscar ranking da escola
export const getSchoolRanking = async (schoolId, limitCount = 10) => {
  try {
    const schoolRankingRef = collection(db, 'schoolRanking', schoolId, 'players');
    const q = query(schoolRankingRef, orderBy('score', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      userId: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar ranking da escola:', error);
    return [];
  }
};

// Salvar progresso do jogador
export const saveProgress = async (userId, progressData) => {
  try {
    const progressRef = doc(db, 'progress', userId);
    await setDoc(progressRef, {
      ...progressData,
      lastPlayed: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Erro ao salvar progresso:', error);
    localStorage.setItem(`ludoDengueProgress_${userId}`, JSON.stringify(progressData));
    return false;
  }
};

// Carregar progresso do jogador
export const loadProgress = async (userId) => {
  try {
    const progressRef = doc(db, 'progress', userId);
    const snapshot = await getDoc(progressRef);
    
    if (snapshot.exists()) {
      return snapshot.data();
    }
    return null;
  } catch (error) {
    console.error('Erro ao carregar progresso:', error);
    const localProgress = localStorage.getItem(`ludoDengueProgress_${userId}`);
    return localProgress ? JSON.parse(localProgress) : null;
  }
};

// Buscar posição do jogador no ranking
export const getPlayerRank = async (userId) => {
  try {
    const rankingRef = collection(db, 'ranking');
    const q = query(rankingRef, orderBy('score', 'desc'));
    const snapshot = await getDocs(q);
    
    const players = snapshot.docs.map(doc => doc.id);
    const position = players.indexOf(userId) + 1;
    
    return position > 0 ? position : null;
  } catch (error) {
    console.error('Erro ao buscar posição:', error);
    return null;
  }
};
