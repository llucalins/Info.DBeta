import React, { useState, useEffect } from 'react';
import TypingTrainer from './components/TypingTrainer';
import GradientText from './components/GradientText';
import ShinyText from './components/ShinyText';
import GlareHover from './components/GlareHover';
import AnimatedBackground from './components/AnimatedBackground';

// Hook para localStorage
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log('Erro ao salvar no localStorage:', error);
    }
  };

  return [storedValue, setValue];
};

function App() {
  const [players, setPlayers] = useLocalStorage('players', []);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [showGame, setShowGame] = useState(false);

 //verificar jogadores carregados
  useEffect(() => {
    console.log('App - Jogadores carregados:', players);
  }, [players]);

  const addPlayer = () => {
    console.log('Função addPlayer chamada!', newPlayerName);
    
    if (!newPlayerName.trim()) {
      alert('Por favor, digite um nome!');
      return;
    }

    const playerExists = players.find(p => p.name.toLowerCase() === newPlayerName.trim().toLowerCase());
    if (playerExists) {
      alert('Já existe um jogador com este nome!');
      return;
    }

    const newPlayer = {
      id: Date.now(),
      name: newPlayerName.trim(),
      bestTime: null,
      lastPlayed: null,
      gamesPlayed: 0
    };

    setPlayers([...players, newPlayer]);
    setNewPlayerName('');
    
    // Feedback visual - destacar o botão brevemente
    const button = document.getElementById('addPlayerBtn');
    if (button) {
      button.style.transform = 'scale(1.05)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 200);
    }
  };

  const startGame = (player) => {
    setCurrentPlayer(player);
    setShowGame(true);
  };

    const handleGameComplete = (timeInSeconds) => {
    console.log('handleGameComplete chamado com tempo:', timeInSeconds, 'para jogador:', currentPlayer?.name);
    
    if (!currentPlayer) {
      console.log('Erro: currentPlayer é null');
      return;
    }

    const updatedPlayers = players.map(player => {
      if (player.id === currentPlayer.id) {
        const newBestTime = player.bestTime === null || timeInSeconds < player.bestTime 
          ? timeInSeconds 
          : player.bestTime;
        
        console.log('Atualizando jogador:', player.name, 'tempo anterior:', player.bestTime, 'novo tempo:', newBestTime);
        
        return {
          ...player,
          bestTime: newBestTime,
          lastPlayed: new Date().toISOString(),
          gamesPlayed: player.gamesPlayed + 1
        };
      }
      return player;
    });

    console.log('Jogadores atualizados:', updatedPlayers);
    setPlayers(updatedPlayers);
    
    // Verificar se foi salvo no localStorage
    setTimeout(() => {
      const savedPlayers = JSON.parse(localStorage.getItem('players') || '[]');
      console.log('Jogadores salvos no localStorage:', savedPlayers);
    }, 100);
    
    // Mostrar estatísticas por 3 segundos antes de voltar ao menu
    setTimeout(() => {
      setShowGame(false);
      setCurrentPlayer(null);
    }, 3000);
  };

  const deletePlayer = (playerId) => {
    if (window.confirm('Tem certeza que deseja excluir este jogador?')) {
      setPlayers(players.filter(p => p.id !== playerId));
    }
  };

  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined || isNaN(seconds)) return 'N/A';
    
    // Garantir que é um número
    const timeInSeconds = parseFloat(seconds);
    if (isNaN(timeInSeconds)) return 'N/A';
    
    const mins = Math.floor(timeInSeconds / 60);
    const secs = (timeInSeconds % 60).toFixed(2);
    return `${mins}:${secs.padStart(5, '0')}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sortedPlayers = [...players].sort((a, b) => {
    if (a.bestTime === null && b.bestTime === null) return 0;
    if (a.bestTime === null) return 1;
    if (b.bestTime === null) return 1;
    return a.bestTime - b.bestTime;
  });

  // Garantir que o botão seja sempre clicável
  useEffect(() => {
    const addButton = document.getElementById('addPlayerBtn');
    if (addButton) {
      addButton.style.pointerEvents = 'auto';
      addButton.style.cursor = 'pointer';
      addButton.style.opacity = '1';
      addButton.style.visibility = 'visible';
    }
  }, [players]);

  if (showGame && currentPlayer) {
    return (
      <AnimatedBackground>
        <div className="container">
          <div className="card">
            <div className="text-center mb-6">
              <GradientText 
                colors={["#FFC107", "#FFD700", "#FFA500", "#FF8C00", "#FFC107"]}
                animationSpeed={4}
                className="text-4xl font-bold mb-3"
              >
                ⌨️ Corrida de Digitação
              </GradientText>
              <div className="text-lg text-gray-700 font-semibold">
                Jogador: {currentPlayer.name}
              </div>
            </div>
            
            <TypingTrainer onComplete={handleGameComplete} playerName={currentPlayer.name} />
            
            <div className="text-center mt-6">
              <button 
                onClick={() => {
                  setShowGame(false);
                  setCurrentPlayer(null);
                }}
                className="button bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg"
              >
                🏠 Voltar ao Ranking
              </button>
            </div>
          </div>
        </div>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground>
      <div className="container">
        <div className="card">
          {/* Header Fixo */}
          <div className="header-section">
            <div className="text-center mb-8">
              <GradientText 
                colors={["#FFC107", "#FFD700", "#FFA500", "#FF8C00", "#FFC107"]}
                animationSpeed={4}
                className="text-6xl font-bold mb-4"
              >
                ⌨️ Corrida de Digitação
              </GradientText>
            </div>

            {/* Adicionar Novo Jogador - SEMPRE VISÍVEL */}
            <GlareHover 
              glareColor="#FFC107" 
              glareOpacity={0.2} 
              className="add-player-section mb-8 p-4 sm:p-6 lg:p-8 bg-white/80 backdrop-blur-md rounded-2xl border border-yellow-300 shadow-xl"
            >
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 text-center">➕ Adicionar Novo Jogador</h3>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-lg mx-auto">
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Digite o nome do jogador..."
                  className="input flex-1 bg-white/90 border-yellow-300 text-gray-800 placeholder-gray-500 text-base sm:text-lg px-4 py-3 sm:px-6 sm:py-4"
                  maxLength={30}
                  onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                />
                <button 
                  id="addPlayerBtn"
                  onClick={addPlayer}
                  className="button bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg whitespace-nowrap"
                  style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                >
                  Adicionar
                </button>
              </div>
            </GlareHover>
          </div>

          {/* Área de Conteúdo Scrollável */}
          <div className="content-section">
            {/* Tabela de Ranking */}
            <div className="overflow-x-auto bg-white/90 backdrop-blur-md rounded-2xl border border-yellow-300 shadow-2xl">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
                    <th className="p-4 text-left font-bold text-lg">#</th>
                    <th className="p-4 text-left font-bold text-lg">Jogador</th>
                    <th className="p-4 text-center font-bold text-lg">Melhor Tempo</th>
                    <th className="p-4 text-center font-bold text-lg">Última Jogada</th>
                    <th className="p-4 text-center font-bold text-lg">Jogos</th>
                    <th className="p-4 text-center font-bold text-lg">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPlayers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-12 text-center text-gray-700">
                        <div className="text-6xl mb-4">👥</div>
                        <p className="text-2xl font-bold mb-2">Nenhum jogador cadastrado ainda</p>
                        <p className="text-lg font-semibold">Adicione jogadores para começar a competir!</p>
                      </td>
                    </tr>
                  ) : (
                    sortedPlayers.map((player, index) => (
                      <tr key={player.id} className="border-b border-yellow-200 bg-white/50">
                        <td className="p-4 font-bold text-gray-800 text-lg">
                          {index + 1}
                          {index < 3 && (
                            <span className="ml-2">
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                            </span>
                          )}
                        </td>
                        <td className="p-4 font-bold text-gray-800 text-lg">{player.name}</td>
                        <td className="p-4 text-center">
                          {player.bestTime !== null ? (
                            <GradientText 
                              colors={["#FFC107", "#FFD700", "#FFA500"]}
                              animationSpeed={2}
                              className="font-mono text-xl font-bold"
                            >
                              {formatTime(player.bestTime)}
                            </GradientText>
                          ) : (
                            <span className="text-gray-600 font-semibold text-lg">N/A</span>
                          )}
                        </td>
                        <td className="p-4 text-center text-base text-gray-700 font-semibold">
                          {formatDate(player.lastPlayed)}
                        </td>
                        <td className="p-4 text-center">
                          <span className="bg-yellow-100 px-4 py-2 rounded-full text-base text-gray-800 font-semibold">
                            {player.gamesPlayed}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex gap-3 justify-center">
                            <button
                              onClick={() => startGame(player)}
                              className="button bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-base px-6 py-3 rounded-xl font-bold shadow-lg"
                            >
                              🎮 Jogar
                            </button>
                            <button
                              onClick={() => deletePlayer(player.id)}
                              className="button bg-gradient-to-r from-red-400 to-red-500 text-white text-base px-4 py-3 rounded-xl font-bold shadow-lg"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Estatísticas */}
            {players.length > 0 && (
              <div className="mt-12">
                <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">📊 Estatísticas Gerais</h3>
                <div className="grid grid-3 gap-8">
                  <GlareHover glareColor="#FFC107" glareOpacity={0.2}>
                    <div className="stat-card bg-white/90 backdrop-blur-md border border-yellow-300 rounded-2xl p-10 text-center shadow-2xl">
                      <div className="text-5xl mb-4">👥</div>
                      <GradientText 
                        colors={["#FFC107", "#FFD700"]}
                        className="stat-value text-5xl font-bold mb-3"
                      >
                        {players.length}
                      </GradientText>
                      <div className="stat-label text-gray-800 text-xl font-bold">Jogadores</div>
                    </div>
                  </GlareHover>
                  <GlareHover glareColor="#FFD700" glareOpacity={0.2}>
                    <div className="stat-card bg-white/90 backdrop-blur-md border border-yellow-300 rounded-2xl p-10 text-center shadow-2xl">
                      <div className="text-5xl mb-4">🏆</div>
                      <GradientText 
                        colors={["#FFD700", "#FFA500"]}
                        className="stat-value text-5xl font-bold mb-3"
                      >
                        {players.filter(p => p.bestTime !== null).length}
                      </GradientText>
                      <div className="stat-label text-gray-800 text-xl font-bold">Completaram</div>
                    </div>
                  </GlareHover>
                  <GlareHover glareColor="#FFA500" glareOpacity={0.2}>
                    <div className="stat-card bg-white/90 backdrop-blur-md border border-yellow-300 rounded-2xl p-10 text-center shadow-2xl">
                      <div className="text-5xl mb-4">🎮</div>
                      <GradientText 
                        colors={["#FFA500", "#FFC107"]}
                        className="stat-value text-5xl font-bold mb-3"
                      >
                        {players.reduce((total, p) => total + p.gamesPlayed, 0)}
                      </GradientText>
                      <div className="stat-label text-gray-800 text-xl font-bold">Jogos Totais</div>
                    </div>
                  </GlareHover>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
}

export default App;
