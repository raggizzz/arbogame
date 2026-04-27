import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';

const BoardLudo = () => {
  const { board, players, currentPlayerIndex } = useGameStore();
  
  // Renderizar peões em uma posição
  const renderPawns = (location, position, playerFilter = null) => {
    const pawnsToRender = [];
    
    players
      .filter(player => playerFilter === null || player.id === playerFilter)
      .forEach(player => {
        player.pawns
          .filter(pawn => pawn.location === location && pawn.position === position && !pawn.finished)
          .forEach((pawn, idx) => {
            pawnsToRender.push(
              <motion.div
                key={`${player.id}-${pawn.id}`}
                className="w-3 h-3 rounded-full border border-white shadow-md"
                style={{ 
                  backgroundColor: player.color,
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: `translate(${(idx % 2) * 6 - 3}px, ${Math.floor(idx / 2) * 6 - 3}px)`
                }}
                whileHover={{ scale: 1.3 }}
                animate={player.id === currentPlayerIndex ? { 
                  scale: [1, 1.2, 1]
                } : {}}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            );
          });
      });
    
    return pawnsToRender;
  };

  // Renderizar uma casa do caminho
  const renderCell = (cell, isArrow = false, arrowColor = null) => {
    const isStart = cell.type === 5;
    const isSafe = cell.type === 4;
    
    let bgColor = 'bg-white';
    if (isArrow && arrowColor) {
      bgColor = arrowColor;
    } else if (isStart) {
      bgColor = 'bg-white';
    } else if (isSafe) {
      bgColor = 'bg-white';
    }
    
    const showStar = isStart || isSafe;
    
    return (
      <div
        key={cell.id}
        className={`relative ${bgColor} border border-gray-400 flex items-center justify-center aspect-square`}
      >
        {showStar && <span className="text-xs">⭐</span>}
        {cell.label && !showStar && <span className="text-xs">{cell.label}</span>}
        <div className="absolute inset-0 flex items-center justify-center">
          {renderPawns('main', cell.position)}
        </div>
      </div>
    );
  };

  // Renderizar base de um jogador
  const renderBase = (playerIndex) => {
    const player = players[playerIndex];
    if (!player) return null;
    
    return (
      <div 
        className="w-full h-full p-2 relative"
        style={{ backgroundColor: player.color }}
      >
        {/* Triângulo central branco */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-16 h-16 bg-white transform rotate-45 border-2 border-gray-400"
            style={{
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
            }}
          />
        </div>
        
        {/* Grid 2x2 para os peões */}
        <div className="relative z-10 grid grid-cols-2 gap-2 p-4 h-full">
          {[0, 1, 2, 3].map(pos => (
            <div
              key={pos}
              className="rounded-full border-2 border-white bg-white/30 flex items-center justify-center relative aspect-square"
            >
              {renderPawns('base', pos, playerIndex)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar caminho final (setas coloridas)
  const renderFinalPath = (playerIndex, direction) => {
    const finalPath = board.finalPaths[playerIndex];
    if (!finalPath) return null;
    
    const player = players[playerIndex];
    if (!player) return null;
    
    return finalPath.map((cell, idx) => (
      <div
        key={cell.id}
        className="relative border border-gray-400 flex items-center justify-center aspect-square"
        style={{ backgroundColor: player.color }}
      >
        {idx === 5 && <span className="text-lg">⭐</span>}
        <div className="absolute inset-0 flex items-center justify-center">
          {renderPawns('final', idx, playerIndex)}
        </div>
      </div>
    ));
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <div className="aspect-square w-full max-w-3xl">
        {/* Grid Principal 15x15 - Formato Cruz Ludo */}
        <div className="grid grid-cols-15 grid-rows-15 gap-0 w-full h-full bg-white border-4 border-gray-800">
          
          {/* LINHA 1-6: Topo */}
          {/* Base Verde (Canto Superior Esquerdo) */}
          <div className="col-span-6 row-span-6 border-r-2 border-b-2 border-gray-800">
            {renderBase(0)}
          </div>
          
          {/* Caminho Vertical Esquerdo (Descendo) */}
          <div className="col-span-3 row-span-6 grid grid-rows-6 border-b-2 border-gray-800">
            {board.mainPath.slice(45, 51).reverse().map(cell => renderCell(cell))}
          </div>
          
          {/* Base Amarela (Canto Superior Direito) */}
          <div className="col-span-6 row-span-6 border-l-2 border-b-2 border-gray-800">
            {renderBase(1)}
          </div>

          {/* LINHA 7-9: Meio Superior */}
          {/* Caminho Horizontal Esquerdo */}
          <div className="col-span-6 row-span-3 grid grid-cols-6 border-r-2 border-gray-800">
            {board.mainPath.slice(0, 6).map(cell => renderCell(cell))}
          </div>
          
          {/* Caminho Final Verde (Setas Verdes) */}
          <div className="col-span-3 row-span-3 grid grid-cols-3">
            {renderFinalPath(0, 'up')}
          </div>
          
          {/* Caminho Horizontal Direito */}
          <div className="col-span-6 row-span-3 grid grid-cols-6 border-l-2 border-gray-800">
            {board.mainPath.slice(13, 19).map(cell => renderCell(cell))}
          </div>

          {/* LINHA 10-12: Centro */}
          {/* Caminho Esquerdo */}
          <div className="col-span-6 row-span-3 grid grid-cols-6 border-r-2 border-gray-800">
            {board.mainPath.slice(51, 52).concat(board.mainPath.slice(0, 5)).map(cell => renderCell(cell))}
          </div>
          
          {/* Centro - Triângulo Amarelo */}
          <div className="col-span-3 row-span-3 relative">
            <motion.div
              className="w-full h-full bg-yellow-400 flex items-center justify-center relative"
              animate={{ 
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity
              }}
            >
              {/* Triângulos apontando para cada canto */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Triângulo Verde (Cima) */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-12 border-transparent border-b-green-600" />
                  {/* Triângulo Amarelo (Direita) */}
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-yellow-600" />
                  {/* Triângulo Azul (Baixo) */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-12 border-transparent border-t-blue-600" />
                  {/* Triângulo Vermelho (Esquerda) */}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-12 border-transparent border-r-red-600" />
                </div>
              </div>
              <span className="text-4xl z-10">⭐</span>
            </motion.div>
          </div>
          
          {/* Caminho Direito */}
          <div className="col-span-6 row-span-3 grid grid-cols-6 border-l-2 border-gray-800">
            {board.mainPath.slice(19, 25).map(cell => renderCell(cell))}
          </div>

          {/* LINHA 13-15: Meio Inferior */}
          {/* Caminho Horizontal Esquerdo */}
          <div className="col-span-6 row-span-3 grid grid-cols-6 border-r-2 border-gray-800">
            {board.mainPath.slice(6, 12).map(cell => renderCell(cell))}
          </div>
          
          {/* Caminho Final Azul (Setas Azuis) */}
          <div className="col-span-3 row-span-3 grid grid-cols-3">
            {renderFinalPath(2, 'down')}
          </div>
          
          {/* Caminho Horizontal Direito */}
          <div className="col-span-6 row-span-3 grid grid-cols-6 border-l-2 border-gray-800">
            {board.mainPath.slice(25, 31).map(cell => renderCell(cell))}
          </div>

          {/* LINHA 16-21: Base Inferior */}
          {/* Base Azul (Canto Inferior Esquerdo) */}
          <div className="col-span-6 row-span-6 border-r-2 border-t-2 border-gray-800">
            {renderBase(2)}
          </div>
          
          {/* Caminho Vertical Direito (Subindo) */}
          <div className="col-span-3 row-span-6 grid grid-rows-6 border-t-2 border-gray-800">
            {board.mainPath.slice(19, 25).map(cell => renderCell(cell))}
          </div>
          
          {/* Base Vermelha (Canto Inferior Direito) */}
          <div className="col-span-6 row-span-6 border-l-2 border-t-2 border-gray-800">
            {renderBase(3)}
          </div>

        </div>
      </div>
    </div>
  );
};

export default BoardLudo;
