import { create } from 'zustand';
import perguntasData from '../data/perguntas.json';

// Função de captura de peões - COM BLOQUEIO!
const checkCapture = (position, currentPlayerIndex, updatedPlayers) => {
  let captured = false;
  let capturedPlayer = -1;
  let blocked = false;
  
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
      
      // Se há 2 peões da mesma cor, BLOQUEIO! Não pode capturar nem passar
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
            if (!safeCells.includes(position)) {
              // CAPTURAR PEÃO!
              updatedPlayers[playerIndex].pawns[pawnIndex] = {
                ...pawn,
                location: 'base',
                position: pawnIndex, // Volta para posição na base
                inFinalPath: false
              };
              captured = true;
              capturedPlayer = playerIndex;
            }
          }
        });
      }
    }
  });
  
  return { captured, capturedPlayer, blocked };
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
    home: 8          // Centro (vitória)
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
      // Distribuir casas especiais
      else if (i % 5 === 0) {
        type = BOARD_CONFIG.cellTypes.quiz;
        label = '❓';
      } else if (i % 7 === 0) {
        type = BOARD_CONFIG.cellTypes.criadouro;
        label = '💧';
      } else if (i % 9 === 0) {
        type = BOARD_CONFIG.cellTypes.mutirao;
        label = '💪';
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
  
  // Ações
  setGameState: (state) => set({ gameState: state }),
  
  setUser: (user, name, schoolId = '') => set({ 
    user, 
    playerName: name,
    schoolId 
  }),
  
  // Iniciar jogo
  startGame: (numPlayers = 1) => {
    const players = [];
    for (let i = 0; i < numPlayers; i++) {
      players.push({
        id: i,
        name: i === 0 ? get().playerName : `Jogador ${i + 1}`,
        color: PLAYER_COLORS[i],
        isAI: i > 0,
        score: 0,
        // Cada jogador tem 4 peões
        pawns: [
          { id: 0, location: 'base', position: 0, inFinalPath: false, finished: false },
          { id: 1, location: 'base', position: 1, inFinalPath: false, finished: false },
          { id: 2, location: 'base', position: 2, inFinalPath: false, finished: false },
          { id: 3, location: 'base', position: 3, inFinalPath: false, finished: false }
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
      message: 'Boa sorte! 🍀',
      showMessage: true
    });
    
    setTimeout(() => set({ showMessage: false }), 2000);
  },
  
  // Rolar dado
  rollDice: () => {
    if (!get().canRoll || get().isRolling) return;
    
    set({ isRolling: true, canRoll: false });
    
    // Animação do dado
    let rolls = 0;
    const interval = setInterval(() => {
      set({ diceValue: Math.floor(Math.random() * 6) + 1 });
      rolls++;
      
      if (rolls >= 10) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        set({ diceValue: finalValue, isRolling: false });
        get().movePlayer(finalValue);
      }
    }, 100);
  },
  
  // Mover jogador (Ludo) - REGRAS OFICIAIS
  movePlayer: (steps, isBackward = false) => {
    const { players, currentPlayerIndex, diceValue } = get();
    const player = players[currentPlayerIndex];
    const pawn = player.pawns[player.selectedPawn];
    
    // Se peão está na base, precisa tirar 1 ou 6 para sair
    if (pawn.location === 'base') {
      if ((diceValue === 1 || diceValue === 6) && !isBackward) {
        // Sair da base para posição inicial no caminho principal
        const startPos = BOARD_CONFIG.startPositions[currentPlayerIndex];
        const updatedPlayers = [...players];
        updatedPlayers[currentPlayerIndex].pawns[player.selectedPawn] = {
          ...pawn,
          location: 'main',
          position: startPos
        };
        
        // Verificar captura na casa de saída
        const captureResult = checkCapture(startPos, currentPlayerIndex, updatedPlayers);
        
        set({ players: updatedPlayers });
        
        // Só joga novamente se tirou 6
        if (diceValue === 6) {
          get().showMessageWithEffect('🎉 Peão saiu da base! Tirou 6, jogue novamente!', () => {
            set({ canRoll: true });
          });
        } else {
          get().showMessageWithEffect('🎉 Peão saiu da base com 1!', () => {
            get().nextTurn();
          });
        }
      } else {
        get().showMessageWithEffect(isBackward ? '❌ Erro! Peão na base não pode voltar' : '🎲 Precisa tirar 1 ou 6 para sair!', () => {
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
        
        get().showMessageWithEffect(`⬅️ Voltou ${steps} casas!`, () => {
          get().nextTurn();
        });
        return;
      }
      
      // Movimento normal para frente
      const entryPosition = BOARD_CONFIG.finalEntryPositions[currentPlayerIndex];
      
      // Verificar se deve entrar no caminho final
      if (pawn.position <= entryPosition && (pawn.position + steps) > entryPosition) {
        const stepsIntoFinal = (pawn.position + steps) - entryPosition - 1;
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
          
          setTimeout(() => {
            get().handleCellEffect(newPosition);
          }, 500);
          return;
        }
      }
      
      // Movimento normal no caminho principal
      newPosition = (pawn.position + steps) % 52;
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex].pawns[player.selectedPawn] = {
        ...pawn,
        position: newPosition
      };
      
      // Verificar bloqueio e captura
      const captureResult = checkCapture(newPosition, currentPlayerIndex, updatedPlayers);
      
      if (captureResult.blocked) {
        // BLOQUEADO! Não pode mover para casa com 2 peões adversários
        get().showMessageWithEffect('🚫 Casa BLOQUEADA! 2 peões adversários impedem passagem!', () => {
          get().nextTurn();
        });
        return;
      }
      
      if (captureResult.captured) {
        updatedPlayers[currentPlayerIndex].score += 20; // Bônus por captura
      }
      
      set({ players: updatedPlayers });
      
      // Mensagem e próxima ação
      if (captureResult.captured) {
        get().showMessageWithEffect(`⚔️ CAPTUROU peão do Jogador ${captureResult.capturedPlayer + 1}! +20 pts!`, () => {
          get().nextTurn();
        });
      } else {
        setTimeout(() => {
          get().handleCellEffect(newPosition);
        }, 500);
      }
      return;
    }
    
    // Peão está no caminho final - NÚMERO EXATO!
    if (pawn.location === 'final') {
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
        set({ players: updatedPlayers });
        
        // Verificar vitória (todos os 4 peões finalizados)
        const allFinished = updatedPlayers[currentPlayerIndex].pawns.every(p => p.finished);
        if (allFinished) {
          get().showMessageWithEffect('🎉🏆 VITÓRIA! Todos os peões chegaram!', () => {
            get().finishGame();
          });
        } else {
          const finishedCount = updatedPlayers[currentPlayerIndex].pawns.filter(p => p.finished).length;
          get().showMessageWithEffect(`🏆 Peão finalizado! ${finishedCount}/4 completos! +50 pts!`, () => {
            get().nextTurn();
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
        get().nextTurn();
      } else {
        // Número muito alto! Vai até o fim e VOLTA!
        const overshoot = newPosition - 5;
        const finalPosition = 5 - overshoot;
        
        if (finalPosition >= 0) {
          const updatedPlayers = [...players];
          updatedPlayers[currentPlayerIndex].pawns[player.selectedPawn] = {
            ...pawn,
            position: finalPosition
          };
          set({ players: updatedPlayers });
          
          get().showMessageWithEffect(`↩️ Passou do fim! Voltou para casa ${finalPosition}`, () => {
            get().nextTurn();
          });
        } else {
          // Voltou demais, não move
          get().showMessageWithEffect(`❌ Número muito alto! Aguarde próxima jogada`, () => {
            get().nextTurn();
          });
        }
      }
    }
  },
  
  // Lidar com efeito da casa
  handleCellEffect: (position) => {
    const { board, players, currentPlayerIndex } = get();
    const cell = board.mainPath[position];
    const player = players[currentPlayerIndex];
    
    if (!cell) {
      get().nextTurn();
      return;
    }
    
    switch (cell.type) {
      case BOARD_CONFIG.cellTypes.criadouro:
        get().showMessageWithEffect(
          '💧 Ops! Você encontrou um criadouro! Volte 3 casas.',
          () => {
            const newPosition = Math.max(player.position - 3, 0);
            const updatedPlayers = [...players];
            updatedPlayers[currentPlayerIndex].position = newPosition;
            set({ players: updatedPlayers });
            get().nextTurn();
          }
        );
        break;
        
      case BOARD_CONFIG.cellTypes.mutirao:
        get().showMessageWithEffect(
          '💪 Parabéns! Mutirão de limpeza! Avance 2 casas!',
          () => {
            const newPosition = Math.min(player.position + 2, board.length - 1);
            const updatedPlayers = [...players];
            updatedPlayers[currentPlayerIndex].position = newPosition;
            set({ players: updatedPlayers });
            get().nextTurn();
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
        get().nextTurn();
        break;
    }
  },
  
  // Mostrar mensagem com efeito
  showMessageWithEffect: (msg, callback) => {
    set({ message: msg, showMessage: true });
    setTimeout(() => {
      set({ showMessage: false });
      if (callback) callback();
    }, 3000);
  },
  
  // Mostrar pergunta do quiz
  showQuizQuestion: () => {
    const { usedQuestions } = get();
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
  },
  
  // Responder quiz - COM PENALIDADE
  answerQuiz: (answerIndex) => {
    const { currentQuestion, players, currentPlayerIndex, score, correctAnswers, wrongAnswers, diceValue } = get();
    const isCorrect = answerIndex === currentQuestion.resposta;
    
    if (isCorrect) {
      // Resposta correta - AVANÇA
      const newScore = score + 10;
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex].score += 10;
      
      set({
        score: newScore,
        correctAnswers: correctAnswers + 1,
        players: updatedPlayers,
        message: `✅ Correto! +10 pontos!\n\n💡 ${currentQuestion.curiosidade}`,
        showMessage: true,
        showQuiz: false
      });
      
      setTimeout(() => {
        set({ showMessage: false });
        get().nextTurn();
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
    const nextIndex = (currentPlayerIndex + 1) % players.length;
    
    set({
      currentPlayerIndex: nextIndex,
      canRoll: true
    });
    
    // Se for IA, jogar automaticamente
    if (players[nextIndex].isAI) {
      setTimeout(() => {
        get().rollDice();
      }, 1500);
    }
  },
  
  // Finalizar jogo
  finishGame: () => {
    const { players, currentPlayerIndex, score } = get();
    const winner = players[currentPlayerIndex];
    
    set({
      gameState: 'gameOver',
      message: `🏆 ${winner.name} venceu!\n\nPontuação final: ${score} pontos`
    });
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
      message: '',
      showMessage: false
    });
  }
}));

export default useGameStore;
