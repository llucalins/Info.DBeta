import React, { useState, useEffect } from 'react';
import SimonSays from './SimonSays';
import GradientText from './GradientText';

function CoordinationGamePage({ onBack, players = [], setPlayers }) {
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [gameState, setGameState] = useState('menu'); // menu, playing, finished
  const [gameStats, setGameStats] = useState(null); // Estatísticas da partida atual
  const [countdown, setCountdown] = useState(5); // Contador para voltar automaticamente

  console.log('CoordinationGamePage: Recebeu players:', players);

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
      bestScore: null,
      lastPlayed: null,
      gamesPlayed: 0
    };

    console.log('Adicionando novo jogador:', newPlayer);
    console.log('Lista atual de jogadores:', players);
    
    const updatedPlayers = [...players, newPlayer];
    console.log('Nova lista de jogadores:', updatedPlayers);
    
    if (setPlayers) {
      setPlayers(updatedPlayers);
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
      localStorage.removeItem('coordinationPlayers');
    }
  };

  const startGame = (player) => {
    setCurrentPlayer(player);
    setGameState('playing');
    setGameStats(null);
  };

  const handleGameComplete = (score, additionalStats = {}) => {
    if (!currentPlayer) return;

    const gameEndTime = new Date();
    const gameStartTime = additionalStats.startTime || new Date();
    const gameDuration = Math.round((gameEndTime - gameStartTime) / 1000); // em segundos
    const level = score;
    const accuracy = additionalStats.accuracy || 100; // Porcentagem de acertos
    const isNewRecord = !currentPlayer.bestScore || score > currentPlayer.bestScore;
    const previousBest = currentPlayer.bestScore || 0;
    const improvement = previousBest > 0 ? score - previousBest : score;

    // Criar estatísticas da partida
    const stats = {
      score,
      level,
      duration: gameDuration,
      accuracy,
      isNewRecord,
      previousBest,
      improvement,
      timestamp: gameEndTime.toISOString(),
      playerName: currentPlayer.name
    };

    setGameStats(stats);

    const updatedPlayers = players.map(player => {
      if (player.id === currentPlayer.id) {
        const newBestScore = player.bestScore === null || player.bestScore === undefined || score > player.bestScore 
          ? score 
          : player.bestScore;

        return {
          ...player,
          bestScore: newBestScore,
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
    setCountdown(5);

    // Iniciar contador para voltar automaticamente
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setGameState('menu');
          setCurrentPlayer(null);
          setGameStats(null);
          return 5;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const getSortedPlayers = () => {
    return [...players].sort((a, b) => {
      if (a.bestScore === null && b.bestScore === null) return 0;
      if (a.bestScore === null) return 1;
      if (b.bestScore === null) return 1;
      return b.bestScore - a.bestScore; // Maior pontuação primeiro
    });
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
              🎮 Jogo da Coordenação
            </GradientText>
            <div className="text-lg text-gray-700 font-semibold">
              Jogador: {currentPlayer.name}
            </div>
          </div>
        </div>
        <SimonSays onComplete={handleGameComplete} playerName={currentPlayer.name} />
      </div>
    );
  }

  if (gameState === 'finished' && gameStats) {
    return (
      <div className="game-page">
        <div className="finish-screen">
          <div className="finish-content">
            {/* Header com animação */}
            <div className="finish-header">
              <div className="finish-icon animated-trophy">🏆</div>
              <h2 className="finish-title">Jogo Concluído!</h2>
              <p className="finish-subtitle">Parabéns, {gameStats.playerName}!</p>
            </div>

            {/* Estatísticas principais */}
            <div className="stats-grid">
              <div className="stat-card main-score">
                <div className="stat-icon">🎯</div>
                <div className="stat-value">{gameStats.score}</div>
                <div className="stat-label">Pontuação Final</div>
                {gameStats.isNewRecord && (
                  <div className="new-record-badge">NOVO RECORDE!</div>
                )}
              </div>

              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-value">{gameStats.level}</div>
                <div className="stat-label">Nível Alcançado</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⏱️</div>
                <div className="stat-value">{gameStats.duration}s</div>
                <div className="stat-label">Tempo de Jogo</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-value">{gameStats.accuracy}%</div>
                <div className="stat-label">Precisão</div>
              </div>
            </div>

            {/* Comparação com recorde anterior */}
            {gameStats.previousBest > 0 && (
              <div className="comparison-section">
                <h3>Comparação com seu melhor:</h3>
                <div className="comparison-stats">
                  <div className="comparison-item">
                    <span className="comparison-label">Recorde Anterior:</span>
                    <span className="comparison-value previous">{gameStats.previousBest}</span>
                  </div>
                  <div className="comparison-item">
                    <span className="comparison-label">Pontuação Atual:</span>
                    <span className="comparison-value current">{gameStats.score}</span>
                  </div>
                  <div className="comparison-item improvement">
                    <span className="comparison-label">Melhoria:</span>
                    <span className={`comparison-value ${gameStats.improvement >= 0 ? 'positive' : 'negative'}`}>
                      {gameStats.improvement >= 0 ? '+' : ''}{gameStats.improvement}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Conquistas */}
            <div className="achievements-section">
              <h3>Conquistas Desbloqueadas:</h3>
              <div className="achievements-grid">
                {gameStats.score >= 5 && (
                  <div className="achievement unlocked">
                    <div className="achievement-icon">🥉</div>
                    <div className="achievement-text">Primeiro Passo</div>
                    <div className="achievement-desc">Alcance nível 5</div>
                  </div>
                )}
                {gameStats.score >= 10 && (
                  <div className="achievement unlocked">
                    <div className="achievement-icon">🥈</div>
                    <div className="achievement-text">Coordenador</div>
                    <div className="achievement-desc">Alcance nível 10</div>
                  </div>
                )}
                {gameStats.score >= 15 && (
                  <div className="achievement unlocked">
                    <div className="achievement-icon">🥇</div>
                    <div className="achievement-text">Mestre da Memória</div>
                    <div className="achievement-desc">Alcance nível 15</div>
                  </div>
                )}
                {gameStats.accuracy >= 95 && (
                  <div className="achievement unlocked">
                    <div className="achievement-icon">🎯</div>
                    <div className="achievement-text">Precisão Perfeita</div>
                    <div className="achievement-desc">95%+ de precisão</div>
                  </div>
                )}
                {gameStats.isNewRecord && (
                  <div className="achievement unlocked special">
                    <div className="achievement-icon">🏆</div>
                    <div className="achievement-text">Recorde Pessoal</div>
                    <div className="achievement-desc">Novo melhor resultado!</div>
                  </div>
                )}
              </div>
            </div>

            {/* Botões de ação */}
            <div className="finish-actions">
              <button 
                onClick={() => startGame(currentPlayer)} 
                className="action-button primary"
              >
                🔄 Jogar Novamente
              </button>
              <button 
                onClick={() => { setGameState('menu'); setCurrentPlayer(null); }} 
                className="action-button secondary"
              >
                🏠 Voltar ao Menu
              </button>
            </div>

            {/* Contador para voltar automaticamente */}
            <div className="auto-return">
              <p>Voltando ao menu em <span className="countdown">{countdown}</span> segundos...</p>
            </div>
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
          <h1>🎮 Jogo da Coordenação</h1>
          <p>Desenvolva sua memória e coordenação motora</p>
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
        <h2>🏆 Ranking de Pontuação</h2>
        <div className="ranking-table">
          <div className="table-header">
            <div className="header-cell">Posição</div>
            <div className="header-cell">Nome</div>
            <div className="header-cell">Melhor Pontuação</div>
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
              <div className="cell score">
                {player.bestScore !== null && player.bestScore !== undefined ? (
                  <GradientText 
                    colors={["#FFC107", "#FFD700", "#FFA500"]}
                    animationSpeed={2}
                    className="font-mono text-xl font-bold"
                  >
                    {player.bestScore}
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
                  🎮 Jogar
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
          position: relative;
        }

        /* Esconder qualquer badge que possa aparecer */
        .ranking-section::before,
        .ranking-section::after {
          display: none !important;
        }

        .ranking-section *::before,
        .ranking-section *::after {
          display: none !important;
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

        .score {
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
          padding: 20px;
        }

        .finish-content {
          text-align: center;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 248, 255, 0.95));
          padding: 50px 40px;
          border-radius: 25px;
          backdrop-filter: blur(15px);
          border: 2px solid rgba(59, 130, 246, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          max-width: 800px;
          width: 100%;
          position: relative;
          overflow: hidden;
        }

        .finish-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #1d4ed8, #3b82f6);
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .finish-header {
          margin-bottom: 40px;
        }

        .animated-trophy {
          font-size: 5rem;
          margin-bottom: 20px;
          animation: bounce 1s ease-in-out infinite alternate;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
        }

        @keyframes bounce {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-10px) scale(1.1); }
        }

        .finish-title {
          color: #1e40af;
          margin: 0 0 10px 0;
          font-size: 2.5rem;
          font-weight: bold;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .finish-subtitle {
          color: #64748b;
          margin: 0;
          font-size: 1.3rem;
          font-weight: 500;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
          padding: 25px 20px;
          border-radius: 15px;
          border: 2px solid rgba(59, 130, 246, 0.2);
          position: relative;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
        }

        .stat-card.main-score {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border-color: #1d4ed8;
          position: relative;
          overflow: hidden;
        }

        .stat-card.main-score::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          animation: shine 3s infinite;
        }

        @keyframes shine {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }

        .stat-icon {
          font-size: 2rem;
          margin-bottom: 10px;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 5px;
          color: #1e40af;
        }

        .stat-card.main-score .stat-value {
          color: white;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #64748b;
          font-weight: 500;
        }

        .stat-card.main-score .stat-label {
          color: rgba(255, 255, 255, 0.9);
        }

        .new-record-badge {
          position: absolute;
          top: -10px;
          right: -10px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: bold;
          animation: pulse 1s infinite;
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .comparison-section {
          background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
          padding: 25px;
          border-radius: 15px;
          margin-bottom: 30px;
          border: 2px solid rgba(59, 130, 246, 0.2);
        }

        .comparison-section h3 {
          color: #1e40af;
          margin: 0 0 20px 0;
          font-size: 1.3rem;
          font-weight: bold;
        }

        .comparison-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .comparison-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: white;
          border-radius: 10px;
          border: 1px solid rgba(59, 130, 246, 0.1);
        }

        .comparison-item.improvement {
          background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
          border-color: #0ea5e9;
        }

        .comparison-label {
          font-weight: 500;
          color: #64748b;
        }

        .comparison-value {
          font-weight: bold;
          font-size: 1.1rem;
        }

        .comparison-value.previous {
          color: #64748b;
        }

        .comparison-value.current {
          color: #1e40af;
        }

        .comparison-value.positive {
          color: #059669;
        }

        .comparison-value.negative {
          color: #dc2626;
        }

        .achievements-section {
          margin-bottom: 40px;
        }

        .achievements-section h3 {
          color: #1e40af;
          margin: 0 0 20px 0;
          font-size: 1.3rem;
          font-weight: bold;
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .achievement {
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
          padding: 20px;
          border-radius: 15px;
          border: 2px solid rgba(59, 130, 246, 0.2);
          text-align: center;
          transition: all 0.3s ease;
          opacity: 0.6;
        }

        .achievement.unlocked {
          opacity: 1;
          background: linear-gradient(135deg, #dbeafe, #bfdbfe);
          border-color: #3b82f6;
          animation: achievementUnlock 0.6s ease-out;
        }

        .achievement.special {
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          border-color: #f59e0b;
        }

        @keyframes achievementUnlock {
          0% { transform: scale(0.8) rotate(-5deg); opacity: 0; }
          50% { transform: scale(1.1) rotate(2deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        .achievement-icon {
          font-size: 2.5rem;
          margin-bottom: 10px;
        }

        .achievement-text {
          font-weight: bold;
          color: #1e40af;
          margin-bottom: 5px;
        }

        .achievement-desc {
          font-size: 0.9rem;
          color: #64748b;
        }

        .finish-actions {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .action-button {
          padding: 15px 30px;
          border: none;
          border-radius: 12px;
          font-weight: bold;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .action-button.primary {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .action-button.primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }

        .action-button.secondary {
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
          color: #1e40af;
          border: 2px solid #3b82f6;
        }

        .action-button.secondary:hover {
          transform: translateY(-3px);
          background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
        }

        .auto-return {
          color: #64748b;
          font-size: 0.9rem;
        }

        .countdown {
          color: #3b82f6;
          font-weight: bold;
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

          .finish-content {
            padding: 30px 20px;
            margin: 10px;
          }

          .finish-title {
            font-size: 2rem;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }

          .stat-card {
            padding: 20px 15px;
          }

          .stat-value {
            font-size: 2rem;
          }

          .comparison-stats {
            grid-template-columns: 1fr;
          }

          .achievements-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .finish-actions {
            flex-direction: column;
            align-items: center;
          }

          .action-button {
            width: 100%;
            max-width: 300px;
          }
        }
      `}</style>
    </div>
  );
}

export default CoordinationGamePage;
