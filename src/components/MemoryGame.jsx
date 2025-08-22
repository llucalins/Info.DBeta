import React, { useState, useEffect } from 'react';

function MemoryGame({ onComplete }) {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem('memoryGameBestScore');
    return saved ? JSON.parse(saved) : { moves: Infinity, time: Infinity };
  });

  // Conceitos básicos de informática para o jogo
  const concepts = [
    { id: 1, term: 'Mouse', definition: 'Dispositivo para mover o cursor na tela', icon: '🖱️' },
    { id: 2, term: 'Teclado', definition: 'Dispositivo para digitar texto e comandos', icon: '⌨️' },
    { id: 3, term: 'Monitor', definition: 'Tela que mostra as informações do computador', icon: '🖥️' },
    { id: 4, term: 'CPU', definition: 'Cérebro do computador que processa informações', icon: '🧠' },
    { id: 5, term: 'Internet', definition: 'Rede mundial de computadores conectados', icon: '🌐' },
    { id: 6, term: 'Arquivo', definition: 'Documento ou programa salvo no computador', icon: '📄' },
    { id: 7, term: 'Pasta', definition: 'Local onde organizamos arquivos no computador', icon: '📁' },
    { id: 8, term: 'Software', definition: 'Programas que fazem o computador funcionar', icon: '💾' },
    { id: 9, term: 'Hardware', definition: 'Partes físicas do computador', icon: '🔧' },
    { id: 10, term: 'Navegador', definition: 'Programa para acessar a internet', icon: '🌍' },
    { id: 11, term: 'Email', definition: 'Mensagem eletrônica enviada pela internet', icon: '📧' },
    { id: 12, term: 'Download', definition: 'Baixar arquivos da internet para o computador', icon: '⬇️' }
  ];

  useEffect(() => {
    if (gameStarted) {
      const interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameStarted]);

  useEffect(() => {
    if (matchedPairs.length === concepts.length) {
      handleGameComplete();
    }
  }, [matchedPairs]);

  const initializeGame = () => {
    // Criar pares de cartas (termo + definição)
    const gameCards = [];
    
    concepts.forEach(concept => {
      // Carta com o termo
      gameCards.push({
        id: `term-${concept.id}`,
        type: 'term',
        content: concept.term,
        icon: concept.icon,
        conceptId: concept.id,
        matched: false
      });
      
      // Carta com a definição
      gameCards.push({
        id: `def-${concept.id}`,
        type: 'definition',
        content: concept.definition,
        icon: concept.icon,
        conceptId: concept.id,
        matched: false
      });
    });

    // Embaralhar as cartas
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setGameStarted(true);
    setTimer(0);
    setMoves(0);
    setMatchedPairs([]);
    setFlippedCards([]);
  };

  const handleCardClick = (cardId) => {
    if (flippedCards.length === 2 || flippedCards.includes(cardId) || matchedPairs.includes(cardId)) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstCardId);
      const secondCard = cards.find(c => c.id === secondCardId);

      if (firstCard.conceptId === secondCard.conceptId) {
        // Par encontrado!
        setMatchedPairs(prev => [...prev, firstCardId, secondCardId]);
        setFlippedCards([]);
      } else {
        // Par incorreto, virar de volta após 1.5 segundos
        setTimeout(() => {
          setFlippedCards([]);
        }, 1500);
      }
    }
  };

  const handleGameComplete = () => {
    const finalScore = { moves, time: timer };
    
    if (moves < bestScore.moves || (moves === bestScore.moves && timer < bestScore.time)) {
      setBestScore(finalScore);
      localStorage.setItem('memoryGameBestScore', JSON.stringify(finalScore));
    }
    
    setTimeout(() => {
      onComplete?.();
    }, 2000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isCardFlipped = (cardId) => {
    return flippedCards.includes(cardId) || matchedPairs.includes(cardId);
  };

  const getCardDisplay = (card) => {
    if (isCardFlipped(card.id)) {
      return (
        <div className="card-content">
          <div className="card-icon">{card.icon}</div>
          <div className="card-text">{card.content}</div>
        </div>
      );
    }
    return (
      <div className="card-back">
        <div className="card-back-icon">❓</div>
      </div>
    );
  };

  return (
    <div className="card">
      {/* Header do jogo */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">🧠 Jogo da Memória</h2>
        <p className="text-lg text-muted">Encontre os pares: Termo + Definição</p>
      </div>

      {/* Estatísticas do jogo */}
      <div className="flex flex-center gap-6 mb-6">
        <div className="stat-card">
          <div className="stat-value">{moves}</div>
          <div className="stat-label">Jogadas</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{formatTime(timer)}</div>
          <div className="stat-label">Tempo</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{matchedPairs.length / 2}</div>
          <div className="stat-label">Pares</div>
        </div>
      </div>

      {/* Melhor pontuação */}
      {bestScore.moves !== Infinity && (
        <div className="text-center mb-4">
          <span className="badge badge-success">
            🏆 Melhor: {bestScore.moves} jogadas em {formatTime(bestScore.time)}
          </span>
        </div>
      )}

      {/* Botão de início */}
      {!gameStarted && (
        <div className="text-center mb-6">
          <button className="button button-primary text-lg" onClick={initializeGame}>
            🎮 Iniciar Jogo
          </button>
        </div>
      )}

      {/* Grid de cartas */}
      {gameStarted && (
        <div className="memory-grid">
          {cards.map(card => (
            <div
              key={card.id}
              className={`memory-card ${isCardFlipped(card.id) ? 'flipped' : ''} ${
                matchedPairs.includes(card.id) ? 'matched' : ''
              }`}
              onClick={() => handleCardClick(card.id)}
            >
              {getCardDisplay(card)}
            </div>
          ))}
        </div>
      )}

      {/* Instruções */}
      <div className="text-center mt-6 text-sm text-muted">
        <p>💡 Dica: Encontre o termo e sua definição correspondente</p>
        <p>🎯 Objetivo: Completar todos os pares com o menor número de jogadas</p>
      </div>

      {/* Botão de reiniciar */}
      {gameStarted && (
        <div className="text-center mt-4">
          <button className="button button-secondary" onClick={initializeGame}>
            🔄 Reiniciar Jogo
          </button>
        </div>
      )}
    </div>
  );
}

export default MemoryGame;
