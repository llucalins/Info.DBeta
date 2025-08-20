import React, { useState, useEffect, useRef } from 'react';

// Utilitário para síntese de voz
const say = (text) => {
  try {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'pt-BR';
    msg.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  } catch (error) {
    console.log('Síntese de voz não disponível');
  }
};

function MouseTrainer({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 });
  const [collectedItems, setCollectedItems] = useState([]);
  const [gameTime, setGameTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [mazeLevel, setMazeLevel] = useState(1);
  const [showInstructions, setShowInstructions] = useState(true);

  const steps = [
    {
      id: 0,
      title: "Navegação Básica",
      description: "Use as setas do teclado para mover o círculo azul até o objetivo verde",
      type: 'maze'
    },
    {
      id: 1,
      title: "Coleta de Itens",
      description: "Colete os itens amarelos antes de chegar ao objetivo",
      type: 'maze'
    },
    {
      id: 2,
      title: "Evite Obstáculos",
      description: "Evite as armadilhas vermelhas e chegue ao objetivo",
      type: 'maze'
    },
    {
      id: 3,
      title: "Labirinto Completo",
      description: "Complete o labirinto final com todos os desafios",
      type: 'maze'
    }
  ];

  // Labirintos para cada nível
  const mazes = {
    1: {
      size: 8,
      layout: [
        "WWWWWWWW",
        "W      W",
        "W WWWW W",
        "W W  W W",
        "W W  W W",
        "W WWWW W",
        "W      W",
        "WWWWWWWW"
      ],
      player: { x: 1, y: 1 },
      goal: { x: 6, y: 6 },
      collectibles: [],
      traps: []
    },
    2: {
      size: 10,
      layout: [
        "WWWWWWWWWW",
        "W        W",
        "W WWWWW W",
        "W W   W W",
        "W W W W W",
        "W W W W W",
        "W W   W W",
        "W WWWWW W",
        "W        W",
        "WWWWWWWWWW"
      ],
      player: { x: 1, y: 1 },
      goal: { x: 8, y: 8 },
      collectibles: [{ x: 4, y: 4 }, { x: 5, y: 5 }],
      traps: []
    },
    3: {
      size: 12,
      layout: [
        "WWWWWWWWWWWW",
        "W          W",
        "W WWWWWWW W",
        "W W     W W",
        "W W WWW W W",
        "W W W W W W",
        "W W W W W W",
        "W W WWW W W",
        "W W     W W",
        "W WWWWWWW W",
        "W          W",
        "WWWWWWWWWWWW"
      ],
      player: { x: 1, y: 1 },
      goal: { x: 10, y: 10 },
      collectibles: [{ x: 5, y: 5 }],
      traps: [{ x: 6, y: 6 }, { x: 7, y: 7 }]
    },
    4: {
      size: 15,
      layout: [
        "WWWWWWWWWWWWWWW",
        "W             W",
        "W WWWWWWWWWWW W",
        "W W         W W",
        "W W WWWWWWW W W",
        "W W W     W W W",
        "W W W WWW W W W",
        "W W W W W W W W",
        "W W W WWW W W W",
        "W W W     W W W",
        "W W WWWWWWW W W",
        "W W         W W",
        "W WWWWWWWWWWW W",
        "W             W",
        "WWWWWWWWWWWWWWW"
      ],
      player: { x: 1, y: 1 },
      goal: { x: 13, y: 13 },
      collectibles: [{ x: 7, y: 7 }, { x: 8, y: 8 }, { x: 9, y: 9 }],
      traps: [{ x: 6, y: 6 }, { x: 10, y: 10 }, { x: 11, y: 11 }]
    }
  };

  const currentMaze = mazes[mazeLevel];
  const currentStepData = steps[currentStep];

  useEffect(() => {
    say("Vamos treinar o mouse com labirintos interativos! Use as setas do teclado para navegar.");
  }, []);

  useEffect(() => {
    let interval;
    if (isGameActive) {
      interval = setInterval(() => {
        setGameTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGameActive]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isGameActive) return;

      const newPosition = { ...playerPosition };

      switch (e.key) {
        case 'ArrowUp':
          newPosition.y = Math.max(0, newPosition.y - 1);
          break;
        case 'ArrowDown':
          newPosition.y = Math.min(currentMaze.size - 1, newPosition.y + 1);
          break;
        case 'ArrowLeft':
          newPosition.x = Math.max(0, newPosition.x - 1);
          break;
        case 'ArrowRight':
          newPosition.x = Math.min(currentMaze.size - 1, newPosition.x + 1);
          break;
        default:
          return;
      }

      // Verificar se a nova posição é válida
      if (currentMaze.layout[newPosition.y][newPosition.x] === ' ') {
        // Verificar se caiu em uma armadilha
        const isTrap = currentMaze.traps.some(trap => trap.x === newPosition.x && trap.y === newPosition.y);
        if (isTrap) {
          say("Ops! Você caiu em uma armadilha. Tente novamente!");
          resetMaze();
          return;
        }

        setPlayerPosition(newPosition);

        // Verificar se coletou um item
        const collectibleIndex = currentMaze.collectibles.findIndex(
          item => item.x === newPosition.x && item.y === newPosition.y
        );
        if (collectibleIndex !== -1) {
          const newCollectibles = [...collectedItems, currentMaze.collectibles[collectibleIndex]];
          setCollectedItems(newCollectibles);
          say("Item coletado! Continue explorando.");
        }

        // Verificar se chegou ao objetivo
        if (newPosition.x === currentMaze.goal.x && newPosition.y === currentMaze.goal.y) {
          const allItemsCollected = currentMaze.collectibles.length === collectedItems.length + 1;
          if (allItemsCollected) {
            handleStepComplete();
          } else {
            say("Você precisa coletar todos os itens primeiro!");
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playerPosition, isGameActive, currentMaze, collectedItems]);

  const handleStepComplete = () => {
    say(`Parabéns! Você completou o nível ${mazeLevel}!`);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setMazeLevel(prev => prev + 1);
      resetMaze();
      say(`Agora vamos para o próximo desafio: ${steps[currentStep + 1].title}`);
    } else {
      say("Parabéns! Você completou todos os desafios do labirinto!");
      onComplete?.();
    }
  };

  const resetMaze = () => {
    setPlayerPosition(currentMaze.player);
    setCollectedItems([]);
    setGameTime(0);
    setIsGameActive(false);
  };

  const startGame = () => {
    setIsGameActive(true);
    setShowInstructions(false);
    say("Jogo iniciado! Use as setas do teclado para navegar.");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderMaze = () => {
    const maze = [];
    
    for (let y = 0; y < currentMaze.size; y++) {
      const row = [];
      for (let x = 0; x < currentMaze.size; x++) {
        let cellClass = 'maze-cell ';
        
        if (currentMaze.layout[y][x] === 'W') {
          cellClass += 'maze-wall';
        } else {
          cellClass += 'maze-path';
          
          // Verificar se é o jogador
          if (x === playerPosition.x && y === playerPosition.y) {
            cellClass += ' maze-player';
          }
          // Verificar se é o objetivo
          else if (x === currentMaze.goal.x && y === currentMaze.goal.y) {
            cellClass += ' maze-goal';
          }
          // Verificar se é um item coletável
          else if (currentMaze.collectibles.some(item => item.x === x && item.y === y) &&
                   !collectedItems.some(item => item.x === x && item.y === y)) {
            cellClass += ' maze-collectible';
          }
          // Verificar se é uma armadilha
          else if (currentMaze.traps.some(trap => trap.x === x && trap.y === y)) {
            cellClass += ' maze-trap';
          }
        }
        
        row.push(
          <div key={`${x}-${y}`} className={cellClass}></div>
        );
      }
      maze.push(<div key={y} className="flex">{row}</div>);
    }
    
    return maze;
  };

  return (
    <div className="card">
      {/* Header do jogo */}
      <div className="flex flex-between mb-4">
        <div className="flex flex-center gap-4">
          <span className="badge badge-primary">
            Nível {mazeLevel} - {currentStepData.title}
          </span>
          <div className="progress-container" style={{ width: '150px' }}>
            <div 
              className="progress-bar" 
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="button button-secondary" onClick={resetMaze}>
            🔄 Reiniciar
          </button>
          {!isGameActive && (
            <button className="button button-primary" onClick={startGame}>
              ▶️ Iniciar
            </button>
          )}
        </div>
      </div>

      {/* Área do labirinto */}
      <div className="maze-container">
        {showInstructions ? (
          <div className="text-center">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-2xl font-bold mb-2">{currentStepData.title}</h3>
            <p className="text-lg text-muted mb-6">{currentStepData.description}</p>
            
            <div className="grid grid-3 gap-4 mb-6">
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-2"></div>
                <p className="text-sm">Você</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 animate-pulse"></div>
                <p className="text-sm">Objetivo</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-yellow-500 rounded-full mx-auto mb-2 animate-bounce"></div>
                <p className="text-sm">Coletar</p>
              </div>
            </div>
            
            <button className="button button-primary text-lg" onClick={startGame}>
              Começar Desafio
            </button>
          </div>
        ) : (
          <div className="maze-grid">
            {renderMaze()}
          </div>
        )}
      </div>

      {/* Informações do jogo */}
      {isGameActive && (
        <div className="flex flex-between mt-4">
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">⏱️ {formatTime(gameTime)}</div>
              <div className="text-sm text-muted">Tempo</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-warning">
                📦 {collectedItems.length}/{currentMaze.collectibles.length}
              </div>
              <div className="text-sm text-muted">Itens</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-success">
              🎯 Nível {mazeLevel}
            </div>
            <div className="text-sm text-muted">Progresso</div>
          </div>
        </div>
      )}

      {/* Instruções flutuantes */}
      {isGameActive && (
        <div className="instructions">
          Use as setas do teclado para mover • Colete os itens amarelos • Evite as armadilhas vermelhas • Chegue ao objetivo verde
        </div>
      )}

      {/* Indicadores de progresso */}
      <div className="flex flex-center gap-2 mt-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`w-3 h-3 rounded-full transition-colors ${
              index < currentStep 
                ? 'bg-green-500' 
                : index === currentStep 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default MouseTrainer;
