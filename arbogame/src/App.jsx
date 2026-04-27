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
    const preventGestureZoom = (event) => event.preventDefault();

    document.addEventListener('gesturestart', preventGestureZoom);
    document.addEventListener('gesturechange', preventGestureZoom);
    
    document.title = 'ArboGame - Ludo da Dengue';

    return () => {
      document.removeEventListener('gesturestart', preventGestureZoom);
      document.removeEventListener('gesturechange', preventGestureZoom);
    };
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
