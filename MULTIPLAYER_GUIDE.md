# 👥 GUIA MULTIPLAYER - ARBOGAME

Sistema multiplayer online completo com Firebase Realtime.

---

## 🎮 FUNCIONALIDADES

### ✅ Sistema Completo
- **Criar Sala**: Gere código único de 6 caracteres
- **Entrar na Sala**: Use código ou lista de salas disponíveis
- **Lobby em Tempo Real**: Veja jogadores entrando/saindo
- **Sistema de Pronto**: Todos devem estar prontos para iniciar
- **Host Controls**: Apenas host pode iniciar o jogo
- **Sincronização**: Estado do jogo sincronizado em tempo real
- **Desconexão**: Tratamento automático de saídas

---

## 🔥 ESTRUTURA FIREBASE

### Coleções Criadas

#### 1. `rooms/{roomId}`
```javascript
{
  roomCode: "ABC123",          // Código único da sala
  roomId: "room_timestamp_id", // ID único
  hostId: "user_id",           // ID do host
  hostName: "Nome do Host",    // Nome do host
  maxPlayers: 4,               // Máximo de jogadores
  currentPlayers: 2,           // Jogadores atuais
  status: "waiting",           // waiting, playing, finished
  players: [                   // Array de jogadores
    {
      id: "user_id",
      name: "Nome",
      position: 0,
      score: 0,
      color: "#00E65C",
      isReady: true,
      isHost: true
    }
  ],
  gameState: {                 // Estado do jogo
    currentPlayerIndex: 0,
    diceValue: 1,
    canRoll: true,
    showQuiz: false,
    currentQuestion: null
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 2. `stats/global`
```javascript
{
  totalPlayers: 0,
  totalGames: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  averageScore: 0,
  lastUpdated: timestamp
}
```

#### 3. `ranking/{userId}`
```javascript
{
  playerName: "Nome",
  score: 100,
  correctAnswers: 10,
  wrongAnswers: 0,
  precision: 100,
  gamesPlayed: 1,
  timestamp: timestamp
}
```

#### 4. `schoolRanking/{schoolId}/players/{userId}`
```javascript
{
  playerName: "Nome",
  schoolId: "escola-id",
  schoolName: "Nome da Escola",
  score: 100,
  correctAnswers: 10,
  wrongAnswers: 0,
  timestamp: timestamp
}
```

#### 5. `config/game`
```javascript
{
  version: "1.0.0",
  maxPlayersPerRoom: 4,
  questionTimeLimit: 30,
  diceRollDelay: 1000,
  moveAnimationSpeed: 500,
  enableMultiplayer: true,
  enableRanking: true,
  enableSchoolRanking: true,
  maintenanceMode: false
}
```

---

## 🚀 COMO USAR

### 1. Inicializar Banco de Dados

```bash
# Executar script de inicialização
node scripts/initFirebase.js
```

Isso cria:
- ✅ Estatísticas globais
- ✅ Exemplos de ranking
- ✅ Sala demo
- ✅ Configurações do jogo

### 2. Criar Sala

```javascript
import { createRoom } from './firebase/multiplayerService';

const room = await createRoom(userId, playerName, 4);
// Retorna: { roomId, roomCode, ...roomData }
```

### 3. Entrar na Sala

```javascript
import { joinRoom } from './firebase/multiplayerService';

const room = await joinRoom(roomCode, userId, playerName);
// Retorna: { roomId, ...roomData }
```

### 4. Observar Mudanças em Tempo Real

```javascript
import { subscribeToRoom } from './firebase/multiplayerService';

const unsubscribe = subscribeToRoom(roomId, (updatedRoom) => {
  if (updatedRoom) {
    console.log('Sala atualizada:', updatedRoom);
    // Atualizar UI
  } else {
    console.log('Sala foi deletada');
  }
});

// Cleanup
unsubscribe();
```

### 5. Marcar como Pronto

```javascript
import { setPlayerReady } from './firebase/multiplayerService';

await setPlayerReady(roomId, userId, true);
```

### 6. Iniciar Jogo (Host)

```javascript
import { startGame } from './firebase/multiplayerService';

await startGame(roomId, hostId);
// Todos os jogadores devem estar prontos
```

### 7. Atualizar Estado do Jogo

```javascript
import { updateGameState } from './firebase/multiplayerService';

await updateGameState(roomId, {
  currentPlayerIndex: 1,
  diceValue: 6,
  canRoll: false
});
```

### 8. Atualizar Posição do Jogador

```javascript
import { updatePlayerPosition } from './firebase/multiplayerService';

await updatePlayerPosition(roomId, userId, newPosition, newScore);
```

### 9. Sair da Sala

```javascript
import { leaveRoom } from './firebase/multiplayerService';

await leaveRoom(roomId, userId);
// Se for host e houver outros jogadores, host é transferido
// Se for último jogador, sala é deletada
```

---

## 🎯 FLUXO DO JOGO

```
1. MENU
   ↓
2. LOGIN
   ↓
3. ESCOLHER MODO
   ├─→ SOLO (IA)
   └─→ MULTIPLAYER ONLINE
       ↓
4. MULTIPLAYER LOBBY
   ├─→ CRIAR SALA
   │   ├─→ Gerar código
   │   ├─→ Aguardar jogadores
   │   ├─→ Todos prontos
   │   └─→ Iniciar jogo
   └─→ ENTRAR NA SALA
       ├─→ Digitar código
       ├─→ Ou escolher da lista
       ├─→ Marcar pronto
       └─→ Aguardar início
       ↓
5. GAMEPLAY (Sincronizado)
   ├─→ Turno do jogador
   ├─→ Rolar dado
   ├─→ Mover peão
   ├─→ Quiz (se cair)
   ├─→ Atualizar pontuação
   └─→ Próximo turno
   ↓
6. GAME OVER
   ├─→ Mostrar vencedor
   ├─→ Salvar ranking
   └─→ Voltar ao menu
```

---

## 🔒 REGRAS DE SEGURANÇA

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Salas - leitura pública, escrita autenticada
    match /rooms/{roomId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (request.auth.uid == resource.data.hostId || 
         request.auth.uid in resource.data.players[*].id);
      allow delete: if request.auth != null && 
        request.auth.uid == resource.data.hostId;
    }
    
    // Ranking - leitura pública, escrita própria
    match /ranking/{userId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.uid == userId;
    }
    
    // Configurações - apenas leitura
    match /config/{doc} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

---

## 🎨 COMPONENTES

### MultiplayerLobby.jsx

**Estados:**
- `menu` - Escolher criar/entrar
- `create` - Criando sala
- `join` - Entrando em sala
- `lobby` - Dentro da sala

**Funcionalidades:**
- ✅ Criar sala com código único
- ✅ Listar salas disponíveis
- ✅ Entrar por código
- ✅ Ver jogadores em tempo real
- ✅ Sistema de pronto
- ✅ Copiar código da sala
- ✅ Host controls
- ✅ Sair da sala

---

## 🐛 TRATAMENTO DE ERROS

### Erros Comuns

**"Sala não encontrada"**
- Código inválido
- Sala já iniciada
- Sala foi deletada

**"Sala cheia"**
- Máximo de jogadores atingido

**"Você já está nesta sala"**
- Tentando entrar novamente

**"Apenas o host pode iniciar"**
- Jogador não-host tentou iniciar

**"Nem todos estão prontos"**
- Host tentou iniciar sem todos prontos

### Tratamento

```javascript
try {
  await joinRoom(code, userId, name);
} catch (error) {
  if (error.message === 'Sala não encontrada') {
    // Mostrar mensagem
  } else if (error.message === 'Sala cheia') {
    // Mostrar mensagem
  }
  // etc...
}
```

---

## 📊 MONITORAMENTO

### Ver Salas Ativas

```javascript
import { listAvailableRooms } from './firebase/multiplayerService';

const rooms = await listAvailableRooms();
console.log(`${rooms.length} salas disponíveis`);
```

### Estatísticas

```javascript
import { getDoc, doc } from 'firebase/firestore';
import { db } from './firebase/config';

const statsDoc = await getDoc(doc(db, 'stats', 'global'));
const stats = statsDoc.data();
console.log('Total de jogos:', stats.totalGames);
```

---

## 🚀 PERFORMANCE

### Otimizações

- ✅ Listeners em tempo real (onSnapshot)
- ✅ Cleanup automático de listeners
- ✅ Persistência offline habilitada
- ✅ Queries otimizadas com índices
- ✅ Batch writes quando possível

### Limites Firebase (Free Tier)

- **Leituras**: 50,000/dia
- **Escritas**: 20,000/dia
- **Deletes**: 20,000/dia
- **Conexões simultâneas**: 100

Para jogo escolar, isso é suficiente!

---

## 🎓 EXEMPLO COMPLETO

```javascript
import { 
  createRoom, 
  joinRoom, 
  subscribeToRoom,
  setPlayerReady,
  startGame,
  leaveRoom
} from './firebase/multiplayerService';

// Host cria sala
const room = await createRoom(hostId, 'Host', 4);
console.log('Código da sala:', room.roomCode);

// Observar mudanças
const unsub = subscribeToRoom(room.roomId, (updated) => {
  console.log('Jogadores:', updated.players.length);
  if (updated.status === 'playing') {
    // Iniciar gameplay
  }
});

// Outro jogador entra
const joined = await joinRoom(room.roomCode, playerId, 'Player 2');

// Marcar pronto
await setPlayerReady(room.roomId, playerId, true);

// Host inicia (quando todos prontos)
await startGame(room.roomId, hostId);

// Cleanup
unsub();
await leaveRoom(room.roomId, playerId);
```

---

## 🎉 PRONTO!

Agora você tem um sistema multiplayer completo e funcional!

**Características:**
- ✅ Tempo real com Firebase
- ✅ Salas com códigos únicos
- ✅ Sistema de pronto
- ✅ Host controls
- ✅ Sincronização automática
- ✅ Tratamento de desconexões
- ✅ Interface AAA

**Para testar:**
1. Execute `npm run dev`
2. Abra 2 abas do navegador
3. Crie uma sala em uma aba
4. Entre com o código na outra
5. Jogue!

---

**🎮 Multiplayer Online Funcionando! 🔥**
