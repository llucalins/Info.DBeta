import React, { useState, useEffect } from 'react';

function MouseTrainer({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [mazeLevel, setMazeLevel] = useState(1);
  const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 });
  const [collectedItems, setCollectedItems] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const steps = [
    {
      id: 1,
      title: "Navegação Básica",
      description: "Use as setas do teclado para mover o jogador",
      maze: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
      ],
      collectibles: [{ x: 8, y: 8 }],
      traps: [],
      goal: { x: 8, y: 8 }
    },
    {
      id: 2,
      title: "Coleta de Itens",
      description: "Colete todos os itens antes de chegar ao objetivo",
      maze: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
      ],
      collectibles: [{ x: 3, y: 3 }, { x: 6, y: 6 }],
      traps: [],
      goal: { x: 8, y: 8 }
    },
    {
      id: 3,
      title: "Evitando Armadilhas",
      description: "Navegue evitando as armadilhas vermelhas",
      maze: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
      ],
      collectibles: [{ x: 4, y: 4 }],
      traps: [{ x: 5, y: 5 }, { x: 6, y: 6 }],
      goal: { x: 8, y: 8 }
    }
  ];

  const currentStepData = steps[currentStep];

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted) return;

      const newPosition = { ...playerPosition };

      switch (e.key) {
        case 'ArrowUp':
          newPosition.y = Math.max(1, newPosition.y - 1);
          break;
        case 'ArrowDown':
          newPosition.y = Math.min(8, newPosition.y + 1);
          break;
        case 'ArrowLeft':
          newPosition.x = Math.max(1, newPosition.x - 1);
          break;
        case 'ArrowRight':
          newPosition.x = Math.min(8, newPosition.x + 1);
          break;
        default:
          return;
      }

      // Verificar se caiu em uma armadilha
      const isTrap = currentStepData.traps.some(trap => 
        trap.x === newPosition.x && trap.y === newPosition.y
      );

      if (isTrap) {
        // Resetar posição
        setPlayerPosition({ x: 1, y: 1 });
        return;
      }

      // Verificar se coletou um item
      const collectibleIndex = currentStepData.collectibles.findIndex(item => 
        item.x === newPosition.x && item.y === newPosition.y
      );

      if (collectibleIndex !== -1) {
        const newCollectibles = [...currentStepData.collectibles];
        newCollectibles.splice(collectibleIndex, 1);
        setCollectedItems(prev => prev + 1);
        
        // Atualizar o labirinto removendo o item coletado
        const updatedStep = { ...currentStepData };
        updatedStep.collectibles = newCollectibles;
        steps[currentStep] = updatedStep;
      }

      setPlayerPosition(newPosition);

      // Verificar se chegou ao objetivo
      if (newPosition.x === currentStepData.goal.x && newPosition.y === currentStepData.goal.y) {
        if (collectedItems >= currentStepData.collectibles.length) {
          // Nível completo
          if (currentStep < steps.length - 1) {
            setTimeout(() => {
              setCurrentStep(prev => prev + 1);
              setMazeLevel(prev => prev + 1);
              resetLevel();
            }, 1000);
          } else {
            // Todos os níveis completos
            setTimeout(() => {
              onComplete?.();
            }, 1000);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playerPosition, gameStarted, currentStep, collectedItems]);

  const startGame = () => {
    setGameStarted(true);
    setShowInstructions(false);
    setPlayerPosition({ x: 1, y: 1 });
    setCollectedItems(0);
  };

  const resetLevel = () => {
    setPlayerPosition({ x: 1, y: 1 });
    setCollectedItems(0);
  };

  const renderMaze = () => {
    const maze = currentStepData.maze;
    const cells = [];

    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        const isWall = maze[y][x] === 1;
        const isPlayer = playerPosition.x === x && playerPosition.y === y;
        const isGoal = currentStepData.goal.x === x && currentStepData.goal.y === y;
        const isCollectible = currentStepData.collectibles.some(item => item.x === x && item.y === y);
        const isTrap = currentStepData.traps.some(trap => trap.x === x && trap.y === y);

        let cellClass = 'maze-cell';
        let cellContent = '';

        if (isWall) {
          cellClass += ' maze-wall';
        } else if (isPlayer) {
          cellClass += ' maze-player';
          cellContent = '😀';
        } else if (isGoal) {
          cellClass += ' maze-goal';
          cellContent = '🎯';
        } else if (isCollectible) {
          cellClass += ' maze-collectible';
          cellContent = '⭐';
        } else if (isTrap) {
          cellClass += ' maze-trap';
          cellContent = '💥';
        } else {
          cellClass += ' maze-path';
        }

        cells.push(
          <div key={`${x}-${y}`} className={cellClass}>
            {cellContent}
          </div>
        );
      }
    }

    return cells;
  };

  if (showInstructions) {
    return (
      <div className="card">
        <div className="text-center">
          <div className="text-6xl mb-4">🖱️</div>
          <h3 className="text-2xl font-bold mb-2">{currentStepData.title}</h3>
          <p className="text-lg text-muted mb-6">{currentStepData.description}</p>
          
          <div className="grid grid-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">{mazeLevel}</div>
              <p className="text-sm">Nível</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning mb-2">{currentStepData.collectibles.length}</div>
              <p className="text-sm">Itens</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-danger mb-2">{currentStepData.traps.length}</div>
              <p className="text-sm">Armadilhas</p>
            </div>
          </div>
          
          <button className="button button-primary text-lg" onClick={startGame}>
            Iniciar Jogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="maze-container">
        <div className="maze-grid" style={{ 
          gridTemplateColumns: `repeat(${currentStepData.maze[0].length}, 1fr)` 
        }}>
          {renderMaze()}
        </div>
        
        <div className="timer">
          Nível {mazeLevel}
        </div>
        
        <div className="score">
          Itens: {collectedItems}/{currentStepData.collectibles.length}
        </div>
        
        <div className="instructions">
          Use as setas do teclado para navegar
        </div>
      </div>
      
      <div className="text-center mt-4">
        <button className="button button-secondary" onClick={resetLevel}>
          🔄 Reiniciar Nível
        </button>
      </div>
    </div>
  );
}

export default MouseTrainer;
