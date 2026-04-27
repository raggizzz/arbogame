import { create } from 'zustand';
import perguntasData from '../data/perguntas.json';
import { updateGameState as updateRemoteGameState, finishGame as finishRemoteGame } from '../firebase/multiplayerService';

// Função de captura de peões e colisão - COM MECÂNICA DE DENGUE
const checkCaptureAndCollision = (position, currentPlayerIndex, updatedPlayers) => {
  let captured = false;
  let capturedPlayer = -1;
  let blocked = false;
  let dengueTransmitted = false;

  const currentPlayer = updatedPlayers[currentPlayerIndex];

  // Contar quantos peões da mesma cor estão nesta posição
  const countPawnsAtPosition = (playerIdx) => {
    return updatedPlayers[playerIdx].pawns.filter(
      p => p.location === 'main' && p.position === position && !p.finished
    ).length;
  };

  // Verificar se há peões adversários nesta posição
  updatedPlayers.forEach((player, playerIndex) => {
    if (playerIndex !== currentPlayerIndex) {
      const enemyPawnsHere = countPawnsAtPosition(playerIndex);

      // Se há 2 peões da mesma cor, BLOQUEIO! (Regra Ludo)
      if (enemyPawnsHere >= 2) {
        blocked = true;
        return;
      }

      // Se há apenas 1 peão adversário
      if (enemyPawnsHere === 1) {
        player.pawns.forEach((pawn, pawnIndex) => {
          if (pawn.location === 'main' && pawn.position === position && !pawn.finished) {
            // Verificar se não é casa segura
            const safeCells = [0, 8, 13, 21, 26, 34, 39, 47]; // Casas de início e seguras

            // MECÂNICA DE DENGUE: Transmissão
            // Se o peão adversário tem dengue OU o peão atual tem dengue -> AMBOS pegam e perdem a vez
            const currentPawn = currentPlayer.pawns.find(p => p.position === position && p.location === 'main');

            if (currentPawn && (pawn.hasDengue || currentPawn.hasDengue)) {
              // Transmissão!
              pawn.hasDengue = true;
              currentPawn.hasDengue = true;

              // Penalidade: Perdem a vez (skipTurn)
              updatedPlayers[playerIndex].skipTurn = true;
              updatedPlayers[currentPlayerIndex].skipTurn = true;

              dengueTransmitted = true;
            }

            if (!safeCells.includes(position)) {
              // CAPTURAR PEÃO!
              updatedPlayers[playerIndex].pawns[pawnIndex] = {
                ...pawn,
                location: 'base',
                position: pawnIndex, // Volta para posição na base
                inFinalPath: false,
                hasDengue: false // Cura dengue ao voltar pra base? Sim, reset.
              };
              captured = true;
              capturedPlayer = playerIndex;
            }
          }
        });
      }
    }
  });

  return { captured, capturedPlayer, blocked, dengueTransmitted };
};

// Configuração do tabuleiro Ludo
const BOARD_CONFIG = {
  mainPath: 52,      // Caminho circular principal
  finalPath: 6,      // Casas do caminho final
  basePositions: 4,  // Posições na base
  cellTypes: {
    normal: 0,
    criadouro: 1,    // Volta 3 casas
    mutirao: 2,      // Avança 2 casas
    quiz: 3,         // Pergunta sobre dengue
    safe: 4,         // Casa segura (não pode ser capturado)
    start: 5,        // Casa de saída
    base: 6,         // Base inicial
    final: 7,        // Caminho final
    home: 8,         // Centro (vitória)
    foco_dengue: 9   // NOVA CASA: Pega dengue!
  },
  // Posições de saída de cada jogador no caminho principal
  startPositions: {
    0: 0,   // Verde
    1: 13,  // Amarelo
    2: 26,  // Azul
    3: 39   // Vermelho
  },
  // Posições de entrada no caminho final
  finalEntryPositions: {
    0: 51,  // Verde entra no final após casa 51
    1: 12,  // Amarelo
    2: 25,  // Azul
    3: 38   // Vermelho
  }
};

// Gerar tabuleiro Ludo completo
const generateBoard = () => {
  const board = {
    // Bases (4 posições cada)
    bases: [
      // Base Verde (Jogador 0)
      Array(4).fill(null).map((_, i) => ({
        id: `base-0-${i}`,
        type: BOARD_CONFIG.cellTypes.base,
        player: 0,
        position: i,
        color: '#00E65C'
      })),
      // Base Amarela (Jogador 1)
      Array(4).fill(null).map((_, i) => ({
        id: `base-1-${i}`,
        type: BOARD_CONFIG.cellTypes.base,
        player: 1,
        position: i,
        color: '#F59E0B'
      })),
      // Base Azul (Jogador 2)
      Array(4).fill(null).map((_, i) => ({
        id: `base-2-${i}`,
        type: BOARD_CONFIG.cellTypes.base,
        player: 2,
        position: i,
        color: '#0BA5E9'
      })),
      // Base Vermelha (Jogador 3)
      Array(4).fill(null).map((_, i) => ({
        id: `base-3-${i}`,
        type: BOARD_CONFIG.cellTypes.base,
        player: 3,
        position: i,
        color: '#EF4444'
      }))
    ],

    // Caminho principal circular (52 casas)
    mainPath: Array(52).fill(null).map((_, i) => {
      let type = BOARD_CONFIG.cellTypes.normal;
      let label = '';

      // Casas de saída (seguras)
      if ([0, 13, 26, 39].includes(i)) {
        type = BOARD_CONFIG.cellTypes.start;
        label = '🏁';
      }
      // Casas seguras (uma antes de cada saída)
      else if ([8, 21, 34, 47].includes(i)) {
        type = BOARD_CONFIG.cellTypes.safe;
        label = '🛡️';
      }
      // Distribuir casas especiais (MAIS FREQUENTES AGORA)
      else if (i % 4 === 0) { // A cada 4 casas (antes era 5)
        type = BOARD_CONFIG.cellTypes.quiz;
        label = '❓';
      } else if (i % 6 === 0) { // A cada 6 casas (antes era 7)
        type = BOARD_CONFIG.cellTypes.criadouro; // Poça d'água
        label = '💧';
      } else if (i % 9 === 0) {
        type = BOARD_CONFIG.cellTypes.mutirao;
        label = '💪';
      } else if (i % 11 === 0) { // Nova casa Foco Dengue
        type = BOARD_CONFIG.cellTypes.foco_dengue;
        label = '🦟';
      }

      return {
        id: `main-${i}`,
        type,
        label,
        position: i
      };
    }),

    // Caminhos finais (6 casas cada cor)
    finalPaths: [
      // Caminho final Verde
      Array(6).fill(null).map((_, i) => ({
        id: `final-0-${i}`,
        type: BOARD_CONFIG.cellTypes.final,
        player: 0,
        position: i,
        color: '#00E65C',
        label: i === 5 ? '🏆' : ''
      })),
      // Caminho final Amarelo
      Array(6).fill(null).map((_, i) => ({
        id: `final-1-${i}`,
        type: BOARD_CONFIG.cellTypes.final,
        player: 1,
        position: i,
        color: '#F59E0B',
        label: i === 5 ? '🏆' : ''
      })),
      // Caminho final Azul
      Array(6).fill(null).map((_, i) => ({
        id: `final-2-${i}`,
        type: BOARD_CONFIG.cellTypes.final,
        player: 2,
        position: i,
        color: '#0BA5E9',
        label: i === 5 ? '🏆' : ''
      })),
      // Caminho final Vermelho
      Array(6).fill(null).map((_, i) => ({
        id: `final-3-${i}`,
        type: BOARD_CONFIG.cellTypes.final,
        player: 3,
        position: i,
        color: '#EF4444',
        label: i === 5 ? '🏆' : ''
      }))
    ],

    // Centro (casa de vitória)
    home: {
      id: 'home',
      type: BOARD_CONFIG.cellTypes.home,
      label: '👑'
    }
  };

  return board;
};

// Cores dos jogadores (Ludo tradicional)
const PLAYER_COLORS = ['#00E65C', '#F59E0B', '#0BA5E9', '#EF4444']; // Verde, Amarelo, Azul, Vermelho

const isPawnMovable = (pawn, steps, playerIndex) => {
  if (!pawn || pawn.finished) return false;

  if (pawn.location === 'base') {
    return steps === 6;
  }

  if (pawn.location === 'final') {
    return pawn.position + steps <= BOARD_CONFIG.finalPath - 1;
  }

  if (pawn.location === 'main') {
    const entryPosition = BOARD_CONFIG.finalEntryPositions[playerIndex];
    let distanceToEntry = entryPosition - pawn.position;
    if (distanceToEntry < 0) distanceToEntry += BOARD_CONFIG.mainPath;

    if (steps > distanceToEntry) {
      const stepsIntoFinal = steps - distanceToEntry - 1;
      return stepsIntoFinal < BOARD_CONFIG.finalPath;
    }

    return true;
  }

  return false;
};

const getMovablePawnIndex = (player, steps, playerIndex) => {
  const selectedPawn = player.pawns[player.selectedPawn];
  if (isPawnMovable(selectedPawn, steps, playerIndex)) {
    return player.selectedPawn;
  }

  return player.pawns.findIndex((pawn) => isPawnMovable(pawn, steps, playerIndex));
};

const isLocalOnlineTurn = (state) => {
  if (!state.isOnlineMultiplayer) return true;
  return state.players[state.currentPlayerIndex]?.id === state.localPlayerId;
};

const createRemoteSnapshot = (state) => ({
  players: state.players,
  currentPlayerIndex: state.currentPlayerIndex,
  diceValue: state.diceValue,
  isRolling: state.isRolling,
  canRoll: state.canRoll,
  consecutiveSixes: state.consecutiveSixes,
  currentQuestion: state.currentQuestion,
  usedQuestions: state.usedQuestions,
  showQuiz: state.showQuiz,
  score: state.score,
  correctAnswers: state.correctAnswers,
  wrongAnswers: state.wrongAnswers,
  message: state.message,
  showMessage: state.showMessage,
  version: Date.now()
});

const useGameStore = create((set, get) => ({
  // Estado do jogo
  gameState: 'menu', // menu, login, playing, quiz, gameOver
  board: generateBoard(),

  // Jogadores
  players: [],
  currentPlayerIndex: 0,
  maxPlayers: 4,

  // Dados e movimento
  diceValue: 1,
  isRolling: false,
  canRoll: true,
  consecutiveSixes: 0, // Contador para 3 seis consecutivos

  // Quiz
  currentQuestion: null,
  usedQuestions: [],
  showQuiz: false,

  // Pontuação
  score: 0,
  correctAnswers: 0,
  wrongAnswers: 0,

  // Mensagens e animações
  message: '',
  showMessage: false,

  // Firebase
  user: null,
  playerName: '',
  schoolId: '',

  // Multiplayer online
  isOnlineMultiplayer: false,
  multiplayerRoomId: null,
  localPlayerId: null,
  lastRemoteVersion: 0,
  isApplyingRemoteState: false,

  // Ações
  setGameState: (state) => set({ gameState: state }),

  setUser: (user, name, schoolId = '') => set({
    user,
    playerName: name,
    schoolId
  }),

  startOnlineGame: (room, localPlayerId) => {
    const remoteState = room.gameState || {};
    const players = remoteState.players || [];
    const localPlayer = players.find(player => player.id === localPlayerId);

    set({
      ...remoteState,
      players,
      gameState: 'playing',
      isOnlineMultiplayer: true,
      multiplayerRoomId: room.roomId,
      localPlayerId,
      lastRemoteVersion: remoteState.version || Date.now(),
      isApplyingRemoteState: false,
      score: localPlayer?.score || 0
    });
  },

  applyOnlineRoomState: (room) => {
    const { localPlayerId, lastRemoteVersion } = get();
    const remoteState = room?.gameState;
    if (!remoteState || !remoteState.players) return;

    const remoteVersion = remoteState.version || 0;
    if (remoteVersion && remoteVersion < lastRemoteVersion) return;

    const localPlayer = remoteState.players.find(player => player.id === localPlayerId);

    set({
      ...remoteState,
      players: remoteState.players,
      gameState: room.status === 'finished' ? 'gameOver' : 'playing',
      multiplayerRoomId: room.roomId,
      lastRemoteVersion: remoteVersion || Date.now(),
      isApplyingRemoteState: false,
      score: localPlayer?.score || remoteState.score || 0
    });
  },

  syncOnlineGame: () => {
    const state = get();
    if (!state.isOnlineMultiplayer || !state.multiplayerRoomId || state.isApplyingRemoteState) return;

    updateRemoteGameState(state.multiplayerRoomId, createRemoteSnapshot(state)).catch((error) => {
      console.error('Erro ao sincronizar partida online:', error);
    });
  },

  selectPawn: (pawnIndex) => {
    if (!isLocalOnlineTurn(get())) return;

    const { players, currentPlayerIndex } = get();
    const currentPlayer = players[currentPlayerIndex];
    if (!currentPlayer || !currentPlayer.pawns[pawnIndex]) return;

    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex] = {
      ...currentPlayer,
      selectedPawn: pawnIndex
    };

    set({ players: updatedPlayers });
    get().syncOnlineGame();
  },

  grantExtraTurn: (message = '🎲 Tirou 6! Jogue novamente!') => {
    set({ canRoll: true });
    get().syncOnlineGame();

    get().showMessageWithEffect(message, () => {
      const { players, currentPlayerIndex, canRoll, isRolling, showQuiz } = get();
      const currentPlayer = players[currentPlayerIndex];

      if (currentPlayer?.isAI && canRoll && !isRolling && !showQuiz) {
        setTimeout(() => get().rollDice(), 500);
      }
    }, 1200);
  },

  // Iniciar jogo
  startGame: (numPlayers = 1, isLocalMultiplayer = false) => {
    const players = [];
    for (let i = 0; i < numPlayers; i++) {
      players.push({
        id: i,
        name: i === 0 ? get().playerName : `Jogador ${i + 1}`,
        color: PLAYER_COLORS[i],
        isAI: isLocalMultiplayer ? false : i > 0,
        score: 0,
        skipTurn: false, // Novo estado: perde a vez (dengue)
        // Cada jogador tem 4 peões
        pawns: [
          { id: 0, location: 'base', position: 0, inFinalPath: false, finished: false, hasDengue: false },
          { id: 1, location: 'base', position: 1, inFinalPath: false, finished: false, hasDengue: false },
          { id: 2, location: 'base', position: 2, inFinalPath: false, finished: false, hasDengue: false },
          { id: 3, location: 'base', position: 3, inFinalPath: false, finished: false, hasDengue: false }
        ],
        selectedPawn: 0 // Peão atualmente selecionado
      });
    }

    set({
      players,
      currentPlayerIndex: 0,
      gameState: 'playing',
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      usedQuestions: [],
      isOnlineMultiplayer: false,
      multiplayerRoomId: null,
      localPlayerId: null,
      lastRemoteVersion: 0,
      message: 'Boa sorte! 🍀',
      showMessage: true
    });

    setTimeout(() => set({ showMessage: false }), 2000);
  },

  // Rolar dado
  rollDice: () => {
    if (!get().canRoll || get().isRolling) return;

    if (!isLocalOnlineTurn(get())) {
      get().showMessageWithEffect('Aguarde sua vez para rolar o dado.', null, 1200);
      return;
    }

    // Verificar se jogador perdeu a vez (Dengue)
    const { players, currentPlayerIndex } = get();
    if (players[currentPlayerIndex].skipTurn) {
      get().showMessageWithEffect('🤒 Você está com Dengue! Perdeu a vez. Repouse!', () => {
        const updatedPlayers = [...players];
        updatedPlayers[currentPlayerIndex].skipTurn = false; // Recupera para próxima
        set({ players: updatedPlayers });
        get().syncOnlineGame();
        get().nextTurn();
      });
      return;
    }

    set({ isRolling: true, canRoll: false });
    get().syncOnlineGame();

    // Animação do dado
    let rolls = 0;
    const interval = setInterval(() => {
      set({ diceValue: Math.floor(Math.random() * 6) + 1 });
      rolls++;

      if (rolls >= 10) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        set({ diceValue: finalValue, isRolling: false });
        get().syncOnlineGame();

        // Gerenciar contador de 6s consecutivos
        if (finalValue === 6) {
          const newConsecutiveSixes = get().consecutiveSixes + 1;
          set({ consecutiveSixes: newConsecutiveSixes });

          // REGRA: 3 sixes consecutivos = Perde a vez!
          if (newConsecutiveSixes >= 3) {
            get().showMessageWithEffect('⚠️ Três 6 seguidos! Você PERDE a vez!', () => {
              set({ consecutiveSixes: 0 });
              get().nextTurn();
            });
            return;
          }
        } else {
          // Resetar contador se não tirou 6
          set({ consecutiveSixes: 0 });
        }

        get().movePlayer(finalValue);
      }
    }, 100);
  },

  // Mover jogador (Ludo) - REGRAS OFICIAIS
  movePlayer: (steps, isBackward = false) => {
    const state = get();
    let { players } = state;
    const { currentPlayerIndex, diceValue } = state;
    let player = players[currentPlayerIndex];

    if (!player) return;

    if (!isBackward) {
      const movablePawnIndex = getMovablePawnIndex(player, steps, currentPlayerIndex);

      if (movablePawnIndex === -1) {
        get().showMessageWithEffect(
          steps === 6
            ? 'Nenhum peão pode se mover agora. Passe a vez.'
            : 'Você precisa tirar 6 para colocar um peão no tabuleiro.',
          () => get().nextTurn()
        );
        return;
      }

      if (movablePawnIndex !== player.selectedPawn) {
        players = [...players];
        players[currentPlayerIndex] = {
          ...player,
          selectedPawn: movablePawnIndex
        };
        set({ players });
        get().syncOnlineGame();
        player = players[currentPlayerIndex];
      }
    }

    const pawn = player.pawns[player.selectedPawn];

    // VERIFICAÇÃO CRÍTICA: Se peão já finalizou, não pode mover!
    if (pawn.finished) {
      // Tentar selecionar outro peão automaticamente
      const activePawnIndex = player.pawns.findIndex(p => !p.finished);
      if (activePawnIndex !== -1) {
        // Trocar seleção
        const updatedPlayers = [...players];
        updatedPlayers[currentPlayerIndex].selectedPawn = activePawnIndex;
        set({ players: updatedPlayers });
        get().syncOnlineGame();
        // Chamar movePlayer novamente com o novo peão
        get().movePlayer(steps, isBackward);
        return;
      } else {
        // Todos finalizados? (Já deveria ter ganho, mas por segurança)
        get().finishGame();
        return;
      }
    }

    // Se peão está na base, precisa tirar 6 para sair (REGRA LUDO CLÁSSICO)
    if (pawn.location === 'base') {
      if (diceValue === 6 && !isBackward) {
        // Sair da base para posição inicial no caminho principal
        const startPos = BOARD_CONFIG.startPositions[currentPlayerIndex];
        const updatedPlayers = [...players];
        updatedPlayers[currentPlayerIndex].pawns[player.selectedPawn] = {
          ...pawn,
          location: 'main',
          position: startPos
        };

        // Verificar captura e colisão
        const result = checkCaptureAndCollision(startPos, currentPlayerIndex, updatedPlayers);

        set({ players: updatedPlayers });
        get().syncOnlineGame();

        if (result.dengueTransmitted) {
          get().showMessageWithEffect('🦟 CONTÁGIO! Dengue transmitida! Ambos perdem a vez!', () => {
            get().nextTurn(); // Perde a jogada extra do 6 pois pegou dengue
          });
          return;
        }

        // Tirou 6, joga novamente
        get().grantExtraTurn('🎉 Peão saiu da base! Tirou 6, jogue novamente!');
      } else {
        get().showMessageWithEffect(isBackward ? '❌ Erro! Peão na base não pode voltar' : '🎲 Precisa tirar 6 para sair da base!', () => {
          get().nextTurn();
        });
      }
      return;
    }

    // Peão está no caminho principal
    if (pawn.location === 'main') {
      let newPosition;

      if (isBackward) {
        // Movimento para trás (penalidade)
        newPosition = pawn.position - steps;
        if (newPosition < 0) {
          newPosition = 52 + newPosition; // Volta circular
        }

        const updatedPlayers = [...players];
        updatedPlayers[currentPlayerIndex].pawns[player.selectedPawn] = {
          ...pawn,
          position: newPosition
        };
        set({ players: updatedPlayers });
        get().syncOnlineGame();

        get().showMessageWithEffect(`⬅️ Voltou ${steps} casas!`, () => {
          get().nextTurn();
        });
        return;
      }

      // Movimento normal para frente
      const entryPosition = BOARD_CONFIG.finalEntryPositions[currentPlayerIndex];

      // Verificar se deve entrar no caminho final
      // Lógica: se posição atual <= entrada E (posição + passos) > entrada
      // Mas cuidado com o loop (0-51). 
      // Para Verde (0->51): OK.
      // Para outros que cruzam o 0: Precisamos de lógica circular.
      // Solução simplificada: Calcular distância até a entrada. Se steps > distância, entra.

      let distanceToEntry = entryPosition - pawn.position;
      if (distanceToEntry < 0) distanceToEntry += 52; // Circular

      // Se steps > distanceToEntry, ele passa da entrada.
      // Mas só se ele estiver "perto" da entrada (ex: no mesmo ciclo).
      // A verificação simples de distanceToEntry funciona bem.

      if (steps > distanceToEntry && distanceToEntry < 52) { // < 52 check is redundant but safe
        const stepsIntoFinal = steps - distanceToEntry - 1;

        if (stepsIntoFinal < 6) {
          // Entrar no caminho final
          const updatedPlayers = [...players];
          updatedPlayers[currentPlayerIndex].pawns[player.selectedPawn] = {
            ...pawn,
            location: 'final',
            position: stepsIntoFinal,
            inFinalPath: true
          };
          set({ players: updatedPlayers });
          get().syncOnlineGame();

          setTimeout(() => {
            if (diceValue === 6) {
              get().grantExtraTurn();
            } else {
              get().nextTurn();
            }
          }, 500);
          return;
        }

        const needed = distanceToEntry + 1 + (BOARD_CONFIG.finalPath - 1);
        get().showMessageWithEffect(`Número ${diceValue} é demais! Precisa de ${needed} ou menos para entrar no caminho final.`, () => {
          if (diceValue === 6) {
            get().grantExtraTurn();
          } else {
            get().nextTurn();
          }
        });
        return;
      }

      // Movimento normal no caminho principal
      newPosition = (pawn.position + steps) % 52;
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex].pawns[player.selectedPawn] = {
        ...pawn,
        position: newPosition
      };

      // Verificar bloqueio, captura e dengue
      const result = checkCaptureAndCollision(newPosition, currentPlayerIndex, updatedPlayers);

      if (result.blocked) {
        // BLOQUEADO! Não pode mover para casa com 2 peões adversários
        get().showMessageWithEffect('🚫 Casa BLOQUEADA! 2 peões adversários impedem passagem!', () => {
          get().nextTurn();
        });
        return;
      }

      if (result.captured) {
        updatedPlayers[currentPlayerIndex].score += 20; // Bônus por captura
      }

      set({
        players: updatedPlayers,
        score: updatedPlayers[0]?.score || get().score
      });
      get().syncOnlineGame();

      if (result.dengueTransmitted) {
        get().showMessageWithEffect('🦟 CONTÁGIO! Dengue transmitida! Ambos perdem a vez!', () => {
          get().nextTurn();
        });
        return;
      }

      // Mensagem e próxima ação
      if (result.captured) {
        get().showMessageWithEffect(`⚔️ CAPTUROU peão do Jogador ${result.capturedPlayer + 1}! +20 pts! Jogue novamente!`, () => {
          if (diceValue === 6) {
            get().grantExtraTurn();
          } else {
            get().nextTurn(); // Captura não dá jogada extra se não for 6 (regra simplificada)
          }
        });
      } else {
        setTimeout(() => {
          // Efeitos especiais apenas no caminho principal
          get().handleCellEffect(newPosition);
        }, 500);
      }
      return;
    }

    // Peão está no caminho final - NÚMERO EXATO!
    if (pawn.location === 'final') {
      if (isBackward) {
        const updatedPlayers = [...players];
        const newFinalPosition = pawn.position - steps;

        if (newFinalPosition >= 0) {
          updatedPlayers[currentPlayerIndex].pawns[player.selectedPawn] = {
            ...pawn,
            position: newFinalPosition
          };
        } else {
          const entryPosition = BOARD_CONFIG.finalEntryPositions[currentPlayerIndex];
          const remainingSteps = Math.abs(newFinalPosition) - 1;
          updatedPlayers[currentPlayerIndex].pawns[player.selectedPawn] = {
            ...pawn,
            location: 'main',
            position: (entryPosition - remainingSteps + BOARD_CONFIG.mainPath) % BOARD_CONFIG.mainPath,
            inFinalPath: false
          };
        }

        set({
          players: updatedPlayers,
          score: updatedPlayers[0]?.score || get().score
        });
        get().syncOnlineGame();
        get().showMessageWithEffect(`Voltou ${steps} casas!`, () => {
          get().nextTurn();
        });
        return;
      }

      const newPosition = pawn.position + steps;

      if (newPosition === 5) {
        // Peão chegou ao fim COM NÚMERO EXATO!
        const updatedPlayers = [...players];
        updatedPlayers[currentPlayerIndex].pawns[player.selectedPawn] = {
          ...pawn,
          position: 5,
          finished: true
        };
        updatedPlayers[currentPlayerIndex].score += 50; // Bônus por finalizar peão
        set({
          players: updatedPlayers,
          score: updatedPlayers[0]?.score || get().score
        });
        get().syncOnlineGame();

        // Verificar vitória (todos os 4 peões finalizados)
        const allFinished = updatedPlayers[currentPlayerIndex].pawns.every(p => p.finished);
        if (allFinished) {
          get().showMessageWithEffect('🎉🏆 VITÓRIA! Todos os peões chegaram!', () => {
            get().finishGame();
          });
        } else {
          const finishedCount = updatedPlayers[currentPlayerIndex].pawns.filter(p => p.finished).length;
          get().showMessageWithEffect(`🏆 Peão finalizado! ${finishedCount}/4 completos! +50 pts!`, () => {
            if (diceValue === 6) {
              get().grantExtraTurn();
            } else {
              get().nextTurn();
            }
          });
        }
      } else if (newPosition < 6) {
        // Movimento normal no caminho final
        const updatedPlayers = [...players];
        updatedPlayers[currentPlayerIndex].pawns[player.selectedPawn] = {
          ...pawn,
          position: newPosition
        };
        set({ players: updatedPlayers });
        get().syncOnlineGame();

        if (diceValue === 6) {
          get().grantExtraTurn();
        } else {
          get().nextTurn();
        }
      } else {
        // NÚMERO MAIOR QUE O NECESSÁRIO - NÃO MOVE! (REGRA LUDO CLÁSSICO)
        const needed = 5 - pawn.position;
        get().showMessageWithEffect(`❌ Número ${diceValue} é demais! Precisa de ${needed} exato. Aguarde próxima jogada.`, () => {
          if (diceValue === 6) {
            get().grantExtraTurn();
          } else {
            get().nextTurn();
          }
        });
      }
    }
  },

  // Lidar com efeito da casa
  handleCellEffect: (position) => {
    const { board, players, currentPlayerIndex, diceValue } = get();
    if (position === undefined) return;

    const cell = board.mainPath[position];
    const player = players[currentPlayerIndex];

    if (!cell) {
      if (diceValue === 6) {
        get().grantExtraTurn();
      } else {
        get().nextTurn();
      }
      return;
    }

    switch (cell.type) {
      case BOARD_CONFIG.cellTypes.criadouro:
        get().showMessageWithEffect(
          '💧 Ops! Poça d\'água (Criadouro)! Volte 3 casas.',
          () => {
            const pawn = player.pawns[player.selectedPawn];
            let backPos = pawn.position - 3;
            if (backPos < 0) backPos = 52 + backPos;

            const updatedPlayers = [...players];
            updatedPlayers[currentPlayerIndex].pawns[player.selectedPawn].position = backPos;
            set({ players: updatedPlayers });
            get().syncOnlineGame();

            if (diceValue === 6) {
              get().grantExtraTurn();
            } else {
              get().nextTurn();
            }
          }
        );
        break;

      case BOARD_CONFIG.cellTypes.mutirao:
        get().showMessageWithEffect(
          '💪 Parabéns! Mutirão de limpeza! Avance 2 casas!',
          () => {
            const pawn = player.pawns[player.selectedPawn];
            let fwdPos = (pawn.position + 2) % 52;

            const updatedPlayers = [...players];
            updatedPlayers[currentPlayerIndex].pawns[player.selectedPawn].position = fwdPos;
            set({ players: updatedPlayers });
            get().syncOnlineGame();

            if (diceValue === 6) {
              get().grantExtraTurn();
            } else {
              get().nextTurn();
            }
          }
        );
        break;

      case BOARD_CONFIG.cellTypes.foco_dengue:
        get().showMessageWithEffect(
          '🦟 FOCO DE DENGUE! Você foi picado! Cuidado para não transmitir!',
          () => {
            const updatedPlayers = [...players];
            updatedPlayers[currentPlayerIndex].pawns[player.selectedPawn].hasDengue = true;
            set({ players: updatedPlayers });
            get().syncOnlineGame();

            if (diceValue === 6) {
              get().grantExtraTurn();
            } else {
              get().nextTurn();
            }
          }
        );
        break;

      case BOARD_CONFIG.cellTypes.quiz:
        get().showQuizQuestion();
        break;

      case BOARD_CONFIG.cellTypes.finish:
        get().finishGame();
        break;

      default:
        if (diceValue === 6) {
          get().grantExtraTurn();
        } else {
          get().nextTurn();
        }
        break;
    }
  },

  // Mostrar mensagem com efeito
  showMessageWithEffect: (msg, callback, duration = 3000) => {
    set({ message: msg, showMessage: true });
    get().syncOnlineGame();
    setTimeout(() => {
      set({ showMessage: false });
      get().syncOnlineGame();
      if (callback) callback();
    }, duration);
  },

  // Mostrar pergunta do quiz
  showQuizQuestion: () => {
    const { usedQuestions, players, currentPlayerIndex } = get();
    const availableQuestions = perguntasData.filter(
      q => !usedQuestions.includes(q.id)
    );

    if (availableQuestions.length === 0) {
      // Resetar perguntas se todas foram usadas
      set({ usedQuestions: [] });
      get().showQuizQuestion();
      return;
    }

    const randomQuestion = availableQuestions[
      Math.floor(Math.random() * availableQuestions.length)
    ];

    set({
      currentQuestion: randomQuestion,
      showQuiz: true,
      usedQuestions: [...usedQuestions, randomQuestion.id]
    });
    get().syncOnlineGame();

    if (players[currentPlayerIndex]?.isAI) {
      setTimeout(() => {
        const { currentQuestion, showQuiz } = get();
        if (!showQuiz || currentQuestion?.id !== randomQuestion.id) return;

        const shouldAnswerCorrectly = Math.random() < 0.65;
        const wrongAnswer = randomQuestion.alternativas.findIndex((_, index) => index !== randomQuestion.resposta);
        get().answerQuiz(shouldAnswerCorrectly ? randomQuestion.resposta : wrongAnswer);
      }, 900);
    }
  },

  // Responder quiz - COM PENALIDADE
  answerQuiz: (answerIndex) => {
    if (!isLocalOnlineTurn(get())) return;

    const { currentQuestion, players, currentPlayerIndex, score, correctAnswers, wrongAnswers, diceValue } = get();
    const isCorrect = answerIndex === currentQuestion.resposta;

    if (isCorrect) {
      // Resposta correta - AVANÇA
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex].score += 10;
      const newScore = currentPlayerIndex === 0 ? updatedPlayers[0].score : score;

      set({
        score: newScore,
        correctAnswers: correctAnswers + 1,
        players: updatedPlayers,
        message: `✅ Correto! +10 pontos!\n\n💡 ${currentQuestion.curiosidade}`,
        showMessage: true,
        showQuiz: false
      });
      get().syncOnlineGame();

      setTimeout(() => {
        set({ showMessage: false });
        if (diceValue === 6) {
          get().grantExtraTurn();
        } else {
          get().nextTurn();
        }
      }, 4000);
    } else {
      // Resposta errada - VOLTA O NÚMERO DO DADO!
      const penalty = diceValue || 1;

      set({
        wrongAnswers: wrongAnswers + 1,
        message: `❌ ERRO! Volte ${penalty} casas!\n\nResposta certa: ${currentQuestion.alternativas[currentQuestion.resposta]}\n\n💡 ${currentQuestion.curiosidade}`,
        showMessage: true,
        showQuiz: false
      });
      get().syncOnlineGame();

      setTimeout(() => {
        set({ showMessage: false });
        // APLICAR PENALIDADE - Voltar casas
        get().movePlayer(penalty, true); // true = movimento para trás
      }, 4000);
    }
  },

  // Próximo turno
  nextTurn: () => {
    const { players, currentPlayerIndex } = get();
    if (players.length === 0) return;
    const nextIndex = (currentPlayerIndex + 1) % players.length;

    set({
      currentPlayerIndex: nextIndex,
      canRoll: true,
      consecutiveSixes: 0
    });
    get().syncOnlineGame();

    // Se for IA, jogar automaticamente
    if (players[nextIndex].isAI) {
      setTimeout(() => {
        get().rollDice();
      }, 1500);
    }
  },

  // Finalizar jogo
  finishGame: () => {
    const { players, currentPlayerIndex } = get();
    const winner = players[currentPlayerIndex];

    set({
      gameState: 'gameOver',
      score: winner.score,
      message: `🏆 ${winner.name} venceu!\n\nPontuação final: ${winner.score} pontos`
    });

    if (get().isOnlineMultiplayer && get().multiplayerRoomId) {
      finishRemoteGame(get().multiplayerRoomId, winner.id).catch((error) => {
        console.error('Erro ao finalizar partida online:', error);
      });
    }
  },

  // Resetar jogo
  resetGame: () => {
    set({
      gameState: 'menu',
      players: [],
      currentPlayerIndex: 0,
      diceValue: 1,
      isRolling: false,
      canRoll: true,
      currentQuestion: null,
      usedQuestions: [],
      showQuiz: false,
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      consecutiveSixes: 0,
      message: '',
      showMessage: false,
      isOnlineMultiplayer: false,
      multiplayerRoomId: null,
      localPlayerId: null,
      lastRemoteVersion: 0,
      isApplyingRemoteState: false
    });
  }
}));

export default useGameStore;
