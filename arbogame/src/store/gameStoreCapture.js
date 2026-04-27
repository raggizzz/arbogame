// Função de captura de peões para adicionar ao gameStore

export const checkCapture = (position, currentPlayerIndex, updatedPlayers) => {
  // Verificar se há peões adversários nesta posição
  updatedPlayers.forEach((player, playerIndex) => {
    if (playerIndex !== currentPlayerIndex) {
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
            
            // Mensagem de captura será mostrada
            console.log(`Peão do jogador ${playerIndex + 1} foi capturado!`);
          }
        }
      });
    }
  });
};
