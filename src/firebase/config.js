import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// Configuração do Firebase - ArboGame
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
let app;
let auth;
let db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  
  // Habilitar persistência offline
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Persistência offline não disponível (múltiplas abas abertas)');
    } else if (err.code === 'unimplemented') {
      console.warn('Persistência offline não suportada neste navegador');
    }
  });
} catch (error) {
  console.error('Erro ao inicializar Firebase:', error);
}

// Provider do Google
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Funções de autenticação
export const signInAnonymous = async () => {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error('Erro no login anônimo:', error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Erro no login com Google:', error);
    throw error;
  }
};

export { app, auth, db };
