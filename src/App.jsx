import { useEffect } from 'react';
import useGameStore from './store/gameStore';
import MenuAAA from './components/MenuAAA';
import Login from './components/Login';
import MultiplayerLobby from './components/MultiplayerLobby';
import Game from './components/Game';
import GameOver from './components/GameOver';
import Ranking from './components/Ranking';
import HowToPlay from './components/HowToPlay';
import About from './components/About';

function App() {
  const { gameState } = useGameStore();
  
  useEffect(() => {
    // Prevenir zoom em dispositivos móveis
    document.addEventListener('gesturestart', (e) => e.preventDefault());
    document.addEventListener('gesturechange', (e) => e.preventDefault());
    
    // Título dinâmico
    document.title = '🦟 ArboGame - Ludo da Dengue';
  }, []);
  
  // Renderizar tela baseada no estado
  const renderScreen = () => {
    switch (gameState) {
      case 'menu':
        return <MenuAAA />;
      case 'login':
        return <Login />;
      case 'multiplayer':
        return <MultiplayerLobby />;
      case 'playing':
        return <Game />;
      case 'gameOver':
        return <GameOver />;
      case 'ranking':
        return <Ranking />;
      case 'howToPlay':
        return <HowToPlay />;
      case 'about':
        return <About />;
      default:
        return <MenuAAA />;
    }
  };
  
  return (
    <div className="w-full min-h-screen overflow-x-hidden font-game">
      {renderScreen()}
    </div>
  );
}

export default App;
