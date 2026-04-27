# 👨‍💻 Guia de Desenvolvimento - Ludo da Dengue

Documentação técnica para desenvolvedores que desejam contribuir ou modificar o projeto.

---

## 🏗️ Arquitetura

### Stack Tecnológico

```
Frontend:
├── React 18.3.1 (UI Library)
├── Vite 5.3.3 (Build Tool)
├── Zustand 4.5.4 (State Management)
├── Framer Motion 11.3.0 (Animations)
├── Tailwind CSS 3.4.4 (Styling)
└── Lucide React 0.400.0 (Icons)

Backend:
└── Firebase 10.13.0
    ├── Authentication
    ├── Firestore
    └── Hosting
```

### Fluxo de Dados

```
User Action → Zustand Store → React Components → UI Update
                    ↓
              Firebase Services
                    ↓
              Firestore Database
```

---

## 📁 Estrutura de Componentes

### Hierarquia

```
App.jsx (Root)
├── Menu.jsx
├── Login.jsx
├── Game.jsx
│   ├── HUD.jsx
│   ├── Board.jsx
│   ├── Dice.jsx
│   ├── QuizModal.jsx
│   └── MessageOverlay.jsx
├── GameOver.jsx
├── Ranking.jsx
├── HowToPlay.jsx
└── About.jsx
```

### Responsabilidades

| Componente | Responsabilidade |
|------------|------------------|
| `App.jsx` | Roteamento de telas baseado em estado |
| `Menu.jsx` | Navegação principal |
| `Login.jsx` | Autenticação e configuração de jogo |
| `Game.jsx` | Orquestração do gameplay |
| `Board.jsx` | Renderização do tabuleiro |
| `Dice.jsx` | Lógica e animação do dado |
| `QuizModal.jsx` | Sistema de perguntas |
| `HUD.jsx` | Interface de informações |
| `MessageOverlay.jsx` | Feedback visual |
| `GameOver.jsx` | Tela final e estatísticas |
| `Ranking.jsx` | Exibição de rankings |

---

## 🎮 Gerenciamento de Estado (Zustand)

### Store Principal: `gameStore.js`

```javascript
const useGameStore = create((set, get) => ({
  // Estado
  gameState: 'menu',
  players: [],
  board: [],
  score: 0,
  
  // Ações
  startGame: (numPlayers) => { /* ... */ },
  rollDice: () => { /* ... */ },
  movePlayer: (steps) => { /* ... */ },
  answerQuiz: (answerIndex) => { /* ... */ }
}));
```

### Estados do Jogo

```javascript
gameState: 'menu' | 'login' | 'playing' | 'quiz' | 'gameOver' | 'ranking' | 'howToPlay' | 'about'
```

### Fluxo de Jogo

```
menu → login → playing → gameOver
              ↓
           quiz (modal)
```

---

## 🎲 Mecânicas do Jogo

### Geração do Tabuleiro

```javascript
// 40 casas em espiral
const generateBoard = () => {
  const board = [];
  
  // Casa inicial (0)
  board.push({ id: 0, type: 'start' });
  
  // Casas do meio (1-38)
  for (let i = 1; i < 39; i++) {
    if (i % 5 === 0) type = 'quiz';
    else if (i % 7 === 0) type = 'criadouro';
    else if (i % 9 === 0) type = 'mutirao';
    else type = 'normal';
    
    board.push({ id: i, type });
  }
  
  // Casa final (39)
  board.push({ id: 39, type: 'finish' });
  
  return board;
};
```

### Tipos de Casas

| Tipo | Efeito | Frequência |
|------|--------|------------|
| `start` | Início | 1x (casa 0) |
| `normal` | Nenhum | Maioria |
| `criadouro` | -3 casas | A cada 7 casas |
| `mutirao` | +2 casas | A cada 9 casas |
| `quiz` | Pergunta | A cada 5 casas |
| `finish` | Vitória | 1x (casa 39) |

### Sistema de Pontuação

```javascript
// Resposta correta
score += 10;
correctAnswers++;

// Resposta errada
wrongAnswers++;
// (sem penalidade de pontos)

// Precisão
precision = (correctAnswers / (correctAnswers + wrongAnswers)) * 100;
```

---

## 🔥 Integração Firebase

### Serviços Utilizados

#### 1. Authentication

```javascript
// Login anônimo
const user = await signInAnonymously(auth);

// Login com Google
const user = await signInWithPopup(auth, googleProvider);
```

#### 2. Firestore

**Coleções:**

```
/ranking/{userId}
  - playerName: string
  - score: number
  - correctAnswers: number
  - wrongAnswers: number
  - timestamp: timestamp

/schoolRanking/{schoolId}/players/{userId}
  - (mesmos campos + schoolId)

/progress/{userId}
  - currentPosition: number
  - score: number
  - lastPlayed: timestamp
```

**Queries:**

```javascript
// Top 10 global
const q = query(
  collection(db, 'ranking'),
  orderBy('score', 'desc'),
  orderBy('timestamp', 'desc'),
  limit(10)
);

// Ranking da escola
const q = query(
  collection(db, 'schoolRanking', schoolId, 'players'),
  orderBy('score', 'desc'),
  limit(10)
);
```

---

## 🎨 Sistema de Animações

### Framer Motion

```javascript
// Entrada de componente
<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -50 }}
/>

// Hover e Tap
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
/>

// Animação contínua
<motion.div
  animate={{
    rotate: [0, 360],
    scale: [1, 1.2, 1]
  }}
  transition={{
    duration: 2,
    repeat: Infinity
  }}
/>
```

### Animações Customizadas (Tailwind)

```javascript
// tailwind.config.js
animation: {
  'bounce-slow': 'bounce 2s infinite',
  'wiggle': 'wiggle 1s ease-in-out infinite',
  'float': 'float 3s ease-in-out infinite'
}
```

---

## 📊 Sistema de Perguntas

### Formato JSON

```json
{
  "id": 1,
  "pergunta": "Texto da pergunta?",
  "alternativas": ["A", "B", "C", "D"],
  "resposta": 1,  // Índice da resposta correta (0-3)
  "curiosidade": "Informação educativa"
}
```

### Lógica de Seleção

```javascript
// Evitar repetição
const availableQuestions = perguntasData.filter(
  q => !usedQuestions.includes(q.id)
);

// Seleção aleatória
const randomQuestion = availableQuestions[
  Math.floor(Math.random() * availableQuestions.length)
];

// Marcar como usada
usedQuestions.push(randomQuestion.id);
```

---

## 🎯 Adicionando Novas Features

### 1. Adicionar Nova Tela

```javascript
// 1. Criar componente
// src/components/NovaTelaComponent.jsx
const NovaTela = () => {
  const { setGameState } = useGameStore();
  return (
    <div>
      {/* Conteúdo */}
      <button onClick={() => setGameState('menu')}>
        Voltar
      </button>
    </div>
  );
};

// 2. Adicionar no App.jsx
import NovaTela from './components/NovaTela';

const renderScreen = () => {
  switch (gameState) {
    case 'novaTela':
      return <NovaTela />;
    // ...
  }
};

// 3. Adicionar navegação
<button onClick={() => setGameState('novaTela')}>
  Nova Tela
</button>
```

### 2. Adicionar Novo Tipo de Casa

```javascript
// 1. Definir tipo em gameStore.js
const BOARD_CONFIG = {
  cellTypes: {
    // ...
    novoTipo: 6
  }
};

// 2. Adicionar na geração do tabuleiro
if (i % 11 === 0) {
  type = BOARD_CONFIG.cellTypes.novoTipo;
  label = '🆕 NOVO';
}

// 3. Adicionar lógica no handleCellEffect
case BOARD_CONFIG.cellTypes.novoTipo:
  // Lógica do novo tipo
  break;

// 4. Adicionar estilo no Board.jsx
const getCellColor = (type) => {
  switch (type) {
    case 6: return 'bg-purple-100 border-purple-400';
    // ...
  }
};
```

### 3. Adicionar Nova Coleção Firebase

```javascript
// 1. Criar serviço em rankingService.js
export const saveNovaColecao = async (userId, data) => {
  const ref = doc(db, 'novaColecao', userId);
  await setDoc(ref, data);
};

// 2. Adicionar regras em firestore.rules
match /novaColecao/{userId} {
  allow read: if true;
  allow write: if request.auth != null;
}

// 3. Usar no componente
import { saveNovaColecao } from '../firebase/rankingService';

const handleSave = async () => {
  await saveNovaColecao(user.uid, { /* dados */ });
};
```

---

## 🧪 Testes

### Teste Manual

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build
npm run preview
```

### Checklist de Testes

- [ ] Login anônimo funciona
- [ ] Login com Google funciona
- [ ] Dado rola corretamente
- [ ] Peões se movem
- [ ] Casas especiais funcionam
- [ ] Quiz aparece e pontua
- [ ] Ranking salva e carrega
- [ ] GameOver exibe estatísticas
- [ ] Certificado pode ser baixado
- [ ] Responsivo em mobile

---

## 🐛 Debug

### Console Logs

```javascript
// Ativar logs detalhados
localStorage.setItem('debug', 'true');

// No código
if (localStorage.getItem('debug')) {
  console.log('Estado atual:', get());
}
```

### Firebase Emulator (Opcional)

```bash
# Instalar
npm install -g firebase-tools

# Iniciar emuladores
firebase emulators:start

# Configurar no código
import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';

if (location.hostname === 'localhost') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
}
```

---

## 📦 Build e Deploy

### Build Local

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

### Deploy Firebase

```bash
# Build + Deploy
npm run build
firebase deploy

# Apenas Hosting
firebase deploy --only hosting

# Apenas Firestore rules
firebase deploy --only firestore:rules
```

### Otimizações de Build

```javascript
// vite.config.js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore']
      }
    }
  }
}
```

---

## 🔧 Troubleshooting

### Erro: "Module not found"

```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro: Build falha

```bash
# Limpar cache do Vite
rm -rf node_modules/.vite
npm run build
```

### Erro: Firebase não conecta

```bash
# Verificar .env
cat .env

# Verificar se variáveis estão carregando
console.log(import.meta.env.VITE_FIREBASE_API_KEY);
```

---

## 📚 Recursos

### Documentação

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/docs)

### Ferramentas

- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools) (funciona com Zustand)
- [Firebase Console](https://console.firebase.google.com/)

---

## 🤝 Contribuindo

### Workflow

1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'Adiciona nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Abra um Pull Request

### Padrões de Código

- Use ESLint e Prettier
- Componentes em PascalCase
- Funções em camelCase
- Constantes em UPPER_CASE
- Comentários em português
- Props tipadas (se usar TypeScript)

### Commit Messages

```
feat: Adiciona nova funcionalidade
fix: Corrige bug
docs: Atualiza documentação
style: Formatação de código
refactor: Refatoração
test: Adiciona testes
chore: Tarefas de manutenção
```

---

## 🎓 Próximos Passos

### Melhorias Sugeridas

1. **Sons e Música**
   - Adicionar efeitos sonoros
   - Música de fundo
   - Controle de volume

2. **Multiplayer Online**
   - Firebase Realtime Database
   - Socket.io
   - Salas de jogo

3. **PWA**
   - Service Worker
   - Manifest.json
   - Instalável

4. **Analytics**
   - Google Analytics
   - Heatmaps
   - Métricas de engajamento

5. **Acessibilidade**
   - ARIA labels
   - Navegação por teclado
   - Alto contraste

---

**💻 Happy Coding!**

Para dúvidas, abra uma [Issue no GitHub](https://github.com/seu-usuario/ludo-da-dengue/issues).
