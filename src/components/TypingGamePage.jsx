import React, { useState, useEffect } from 'react';
import TypingTrainer from './TypingTrainer';
import GradientText from './GradientText';

function TypingGamePage({ onBack, players = [], setPlayers }) {
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [gameState, setGameState] = useState('menu'); // menu, playing, finished

  console.log('TypingGamePage: Recebeu players:', players);

  const addPlayer = () => {
    if (!newPlayerName.trim()) {
      alert('Por favor, digite um nome!');
      return;
    }

    const playerExists = players.some(player => 
      player.name.toLowerCase() === newPlayerName.toLowerCase()
    );

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

    if (setPlayers) {
      setPlayers([...players, newPlayer]);
    }
    setNewPlayerName('');
    setShowAddPlayer(false);
  };

  const deletePlayer = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este jogador?')) {
      if (setPlayers) {
        setPlayers(players.filter(player => player.id !== id));
      }
    }
  };

  const clearAllData = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados? Isso irá remover todos os jogadores e pontuações.')) {
      if (setPlayers) {
        setPlayers([]);
      }
      localStorage.removeItem('typingPlayers');
    }
  };

  const startGame = (player) => {
    setCurrentPlayer(player);
    setGameState('playing');
  };

  const handleGameComplete = (time) => {
    if (!currentPlayer) return;

    const updatedPlayers = players.map(player => {
      if (player.id === currentPlayer.id) {
        const newBestTime = player.bestTime === null || time < player.bestTime 
          ? time 
          : player.bestTime;

        return {
          ...player,
          bestTime: newBestTime,
          lastPlayed: new Date().toISOString(),
          gamesPlayed: (player.gamesPlayed || 0) + 1
        };
      }
      return player;
    });

    if (setPlayers) {
      setPlayers(updatedPlayers);
    }
    setGameState('finished');

    // Voltar ao menu após 3 segundos
    setTimeout(() => {
      setGameState('menu');
      setCurrentPlayer(null);
    }, 3000);
  };

  const getSortedPlayers = () => {
    return [...players].sort((a, b) => {
      if (a.bestTime === null && b.bestTime === null) return 0;
      if (a.bestTime === null) return 1;
      if (b.bestTime === null) return 1;
      return a.bestTime - b.bestTime;
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(2);
    return `${mins}:${secs.padStart(5, '0')}`;
  };

  if (gameState === 'playing') {
    return (
      <div className="game-page">
        <div className="game-header">
          <button onClick={() => { setGameState('menu'); setCurrentPlayer(null); }} className="back-button">
            ← Voltar
          </button>
          <div className="game-title">
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
        </div>
        <TypingTrainer onComplete={handleGameComplete} playerName={currentPlayer.name} />
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="game-page">
        <div className="finish-screen">
          <div className="finish-content">
            <div className="finish-icon">🏆</div>
            <h2>Jogo Concluído!</h2>
            <p>Voltando ao menu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-page">
      {/* Header */}
      <div className="page-header">
        <button onClick={onBack} className="back-button">
          ← Voltar ao Menu
        </button>
        <div className="page-title">
          <h1>⌨️ Corrida de Digitação</h1>
          <p>Teste sua velocidade e precisão na digitação</p>
        </div>
      </div>

      {/* Adicionar jogador */}
      <div className="add-player-section">
        <div className="button-group">
          <button 
            onClick={() => setShowAddPlayer(!showAddPlayer)}
            className="add-player-button"
          >
            {showAddPlayer ? 'Cancelar' : '+ Adicionar Jogador'}
          </button>
          
          {players.length > 0 && (
            <button 
              onClick={clearAllData}
              className="clear-data-button"
            >
              🗑️ Limpar Dados
            </button>
          )}
        </div>
        
        {showAddPlayer && (
          <div className="add-player-form">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Nome do jogador"
              className="player-input"
              onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
            />
            <button onClick={addPlayer} className="confirm-button">
              Adicionar
            </button>
          </div>
        )}
      </div>

      {/* Ranking */}
      <div className="ranking-section">
        <h2>🏆 Ranking de Velocidade</h2>
        <div className="ranking-table">
          <div className="table-header">
            <div className="header-cell">Posição</div>
            <div className="header-cell">Nome</div>
            <div className="header-cell">Melhor Tempo</div>
            <div className="header-cell">Última Jogada</div>
            <div className="header-cell">Jogadas</div>
            <div className="header-cell">Ações</div>
          </div>
          
          {getSortedPlayers().map((player, index) => (
            <div key={player.id} className="table-row">
              <div className="cell position">
                {index + 1}º
              </div>
              <div className="cell name">
                <strong>{player.name}</strong>
              </div>
              <div className="cell time">
                {player.bestTime ? (
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
              </div>
              <div className="cell date">
                {player.lastPlayed ? 
                  new Date(player.lastPlayed).toLocaleDateString('pt-BR') : 
                  'Nunca'
                }
              </div>
              <div className="cell games">
                {player.gamesPlayed || 0}
              </div>
              <div className="cell actions">
                <button
                  onClick={() => startGame(player)}
                  className="play-button"
                >
                  ⌨️ Jogar
                </button>
                <button
                  onClick={() => deletePlayer(player.id)}
                  className="delete-button"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
          
          {players.length === 0 && (
            <div className="empty-state">
              <p>Nenhum jogador cadastrado ainda.</p>
              <p>Adicione um jogador para começar!</p>
            </div>
          )}
        </div>
      </div>

      {/* Estilos CSS */}
      <style jsx>{`
        .game-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .page-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
          background: rgba(255, 255, 255, 0.9);
          padding: 20px;
          border-radius: 15px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 193, 7, 0.3);
        }

        .back-button {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 10px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .back-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .page-title h1 {
          font-size: 2.5rem;
          color: #333;
          margin: 0 0 5px 0;
          font-weight: bold;
        }

        .page-title p {
          color: #666;
          margin: 0;
          font-size: 1.1rem;
        }

        .add-player-section {
          margin-bottom: 30px;
          text-align: center;
        }

        .button-group {
          display: flex;
          gap: 15px;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
        }

        .add-player-button {
          background: linear-gradient(135deg, #4CAF50, #45a049);
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 10px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1.1rem;
        }

        .add-player-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .clear-data-button {
          background: linear-gradient(135deg, #f44336, #d32f2f);
          color: white;
          border: none;
          padding: 15px 25px;
          border-radius: 10px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .clear-data-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .add-player-form {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 15px;
        }

        .player-input {
          padding: 12px 15px;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .player-input:focus {
          border-color: #4CAF50;
        }

        .confirm-button {
          background: linear-gradient(135deg, #2196F3, #1976D2);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .confirm-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .ranking-section {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 15px;
          padding: 30px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 193, 7, 0.3);
        }

        .ranking-section h2 {
          text-align: center;
          color: #333;
          margin-bottom: 25px;
          font-size: 2rem;
        }

        .ranking-table {
          overflow-x: auto;
        }

        .table-header {
          display: grid;
          grid-template-columns: 80px 1fr 150px 120px 80px 150px;
          gap: 15px;
          padding: 15px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-radius: 10px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .table-row {
          display: grid;
          grid-template-columns: 80px 1fr 150px 120px 80px 150px;
          gap: 15px;
          padding: 15px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 10px;
          margin-bottom: 8px;
          align-items: center;
          transition: all 0.3s ease;
        }

        .table-row:hover {
          background: rgba(255, 255, 255, 1);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .cell {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .position {
          font-weight: bold;
          color: #667eea;
        }

        .name {
          justify-content: flex-start;
          color: #333;
        }

        .time {
          font-family: monospace;
        }

        .date {
          color: #666;
          font-size: 0.9rem;
        }

        .games {
          color: #666;
          font-weight: bold;
        }

        .actions {
          display: flex;
          gap: 8px;
          justify-content: center;
        }

        .play-button {
          background: linear-gradient(135deg, #FFC107, #FFD700);
          color: #333;
          border: none;
          padding: 8px 15px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .play-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .delete-button {
          background: linear-gradient(135deg, #f44336, #d32f2f);
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .delete-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .empty-state {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .finish-screen {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }

        .finish-content {
          text-align: center;
          background: rgba(255, 255, 255, 0.9);
          padding: 40px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 193, 7, 0.3);
        }

        .finish-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .finish-content h2 {
          color: #333;
          margin-bottom: 15px;
        }

        .finish-content p {
          color: #666;
        }

        @media (max-width: 768px) {
          .table-header,
          .table-row {
            grid-template-columns: 60px 1fr 100px 80px 60px 120px;
            gap: 10px;
            padding: 10px;
          }

          .page-title h1 {
            font-size: 2rem;
          }

          .add-player-form {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}

export default TypingGamePage;
