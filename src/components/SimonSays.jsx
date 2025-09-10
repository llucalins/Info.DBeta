import React, { useState, useEffect } from 'react';

const SimonSays = ({ onComplete }) => {
  const [gameState, setGameState] = useState('waiting'); // 'waiting', 'showing', 'userTurn', 'gameOver'
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [activeButton, setActiveButton] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('');

  const colors = [
    { id: 'red', name: 'Vermelho', color: '#ef4444' },
    { id: 'blue', name: 'Azul', color: '#3b82f6' },
    { id: 'green', name: 'Verde', color: '#22c55e' },
    { id: 'yellow', name: 'Amarelo', color: '#eab308' }
  ];

  const sounds = {
    red: () => playTone(261.63), // C4
    blue: () => playTone(349.23), // F4 (mais fácil de ouvir)
    green: () => playTone(392.00), // G4
    yellow: () => playTone(523.25) // C5
  };

  const playTone = (frequency) => {
    try {
      // Criar contexto de áudio se não existir
      if (!window.audioContext) {
        window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const audioContext = window.audioContext;
      
      // Retomar contexto se estiver suspenso
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      // Volume mais alto e duração mais longa para melhor audibilidade
      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);
    } catch (error) {
      console.log('Audio não suportado:', error);
    }
  };

  const showFeedbackMessage = (message, type) => {
    setFeedbackMessage(message);
    setFeedbackType(type);
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
    }, 1200);
  };

  const startNewGame = () => {
    setGameState('waiting');
    setSequence([]);
    setUserSequence([]);
    setCurrentStep(0);
    setScore(0);
    setActiveButton(null);
    
    // Adicionar primeira cor após um pequeno delay
    setTimeout(() => {
      addToSequence();
    }, 300);
  };

  const addToSequence = () => {
    const newColor = colors[Math.floor(Math.random() * colors.length)].id;
    const newSequence = [...sequence, newColor];
    setSequence(newSequence);
    setCurrentStep(currentStep + 1);
    setScore(currentStep + 1);
    setGameState('showing');
    
    // Mostrar sequência
    showSequence(newSequence);
  };

  const showSequence = async (seq) => {
    // Pausa inicial reduzida para mais fluidez
    await new Promise(resolve => setTimeout(resolve, 300));
    
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => {
        // Ativar visual primeiro
        setActiveButton(seq[i]);
        
        // Tocar som com pequeno delay para sincronização
        setTimeout(() => {
          sounds[seq[i]]();
        }, 30);
        
        // Tempo reduzido para mais fluidez
        setTimeout(() => {
          setActiveButton(null);
          // Pausa entre botões reduzida
          setTimeout(resolve, 250);
        }, 500);
      });
    }
    
    // Pausa final reduzida
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Após mostrar a sequência, é a vez do usuário
    setGameState('userTurn');
    setUserSequence([]);
  };

  const handleButtonClick = (colorId) => {
    if (gameState !== 'userTurn') return;

    setActiveButton(colorId);
    sounds[colorId]();
    
    setTimeout(() => {
      setActiveButton(null);
    }, 150);

    const newUserSequence = [...userSequence, colorId];
    setUserSequence(newUserSequence);

    // Verificar se a sequência está correta
    if (newUserSequence[newUserSequence.length - 1] === sequence[newUserSequence.length - 1]) {
      // Sequência correta até agora
      if (newUserSequence.length === sequence.length) {
        // Sequência completa - continuar para próxima rodada
        showFeedbackMessage('🎉 Correto! Próxima rodada!', 'success');
        
        // Continuar o jogo após o feedback (tempo reduzido)
        setTimeout(() => {
          addToSequence();
        }, 1000);
      }
    } else {
      // Erro - fim do jogo
      setGameState('gameOver');
      showFeedbackMessage('❌ Erro! Fim do jogo!', 'error');
      
      // Salvar pontuação
      setTimeout(() => {
        onComplete(score);
      }, 1000);
    }
  };

  const getButtonStyle = (color) => {
    const isActive = activeButton === color.id;
    const baseStyle = {
      opacity: isActive ? 0.8 : 1,
      transform: isActive 
        ? 'perspective(1000px) rotateX(10deg) scale(0.9) translateY(5px)' 
        : 'perspective(1000px) rotateX(0deg) scale(1)',
      transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: isActive 
        ? `0 0 40px ${color.color}80, 0 0 60px ${color.color}60, inset 0 0 20px rgba(255,255,255,0.5)`
        : `0 15px 35px rgba(0,0,0,0.3), inset 0 3px 15px rgba(255,255,255,0.3), 0 0 20px ${color.color}40`,
      filter: isActive ? 'brightness(1.3) contrast(1.2)' : 'brightness(1) contrast(1)'
    };
    
    return baseStyle;
  };

  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '30px',
        margin: '0 auto',
        maxWidth: '600px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ 
          color: 'white', 
          marginBottom: '30px',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          background: 'linear-gradient(45deg, #fff, #f0f0f0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>🎮 Jogo da Coordenação</h2>
        
        <div style={{ 
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '15px 25px',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <p style={{ fontSize: '1.4rem', margin: '0', fontWeight: 'bold' }}>
              🏆 Pontuação: {score}
            </p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '15px 25px',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <p style={{ fontSize: '1.4rem', margin: '0', fontWeight: 'bold' }}>
              📊 Nível: {currentStep + 1}
            </p>
          </div>
        </div>

        {showFeedback && (
          <div 
            style={{
              margin: '25px 0',
              padding: '20px 30px',
              borderRadius: '25px',
              fontWeight: 'bold',
              fontSize: '1.4rem',
              background: feedbackType === 'success' 
                ? 'linear-gradient(145deg, rgba(34, 197, 94, 0.9), rgba(22, 163, 74, 0.9))' 
                : 'linear-gradient(145deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))',
              color: 'white',
              animation: 'feedbackPop 0.3s ease-out',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {feedbackMessage}
          </div>
        )}

        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '25px',
            maxWidth: '450px',
            margin: '40px auto'
          }}
        >
          {colors.map((color) => (
            <button
              key={color.id}
              style={{
                ...getButtonStyle(color),
                aspectRatio: '1',
                borderRadius: '30px',
                cursor: gameState === 'userTurn' ? 'pointer' : 'not-allowed',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '1.3rem',
                color: 'white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                border: '5px solid rgba(255, 255, 255, 0.4)',
                boxShadow: `
                  0 15px 35px rgba(0,0,0,0.3), 
                  inset 0 3px 15px rgba(255,255,255,0.3),
                  0 0 20px ${color.color}40
                `,
                transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'perspective(1000px) rotateX(0deg)',
                background: `linear-gradient(145deg, ${color.color}, ${color.color}dd)`
              }}
            onClick={() => handleButtonClick(color.id)}
            disabled={gameState !== 'userTurn'}
            onMouseEnter={(e) => {
              if (gameState === 'userTurn') {
                e.target.style.transform = 'perspective(1000px) rotateX(-5deg) scale(1.05) translateY(-5px)';
                e.target.style.boxShadow = `
                  0 20px 40px rgba(0,0,0,0.4), 
                  inset 0 3px 20px rgba(255,255,255,0.4),
                  0 0 30px ${color.color}60
                `;
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.7)';
              }
            }}
            onMouseLeave={(e) => {
              if (gameState === 'userTurn') {
                e.target.style.transform = 'perspective(1000px) rotateX(0deg) scale(1)';
                e.target.style.boxShadow = `
                  0 15px 35px rgba(0,0,0,0.3), 
                  inset 0 3px 15px rgba(255,255,255,0.3),
                  0 0 20px ${color.color}40
                `;
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              }
            }}
            onMouseDown={(e) => {
              if (gameState === 'userTurn') {
                e.target.style.transform = 'perspective(1000px) rotateX(5deg) scale(0.95) translateY(2px)';
                e.target.style.boxShadow = `
                  0 8px 20px rgba(0,0,0,0.4), 
                  inset 0 3px 10px rgba(255,255,255,0.2),
                  0 0 15px ${color.color}30
                `;
              }
            }}
            onMouseUp={(e) => {
              if (gameState === 'userTurn') {
                e.target.style.transform = 'perspective(1000px) rotateX(-5deg) scale(1.05) translateY(-5px)';
                e.target.style.boxShadow = `
                  0 20px 40px rgba(0,0,0,0.4), 
                  inset 0 3px 20px rgba(255,255,255,0.4),
                  0 0 30px ${color.color}60
                `;
              }
            }}
          >
            <span style={{ fontSize: '2rem' }}>{color.name === 'Vermelho' ? '🔴' : color.name === 'Azul' ? '🔵' : color.name === 'Verde' ? '🟢' : '🟡'}</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{color.name}</span>
          </button>
        ))}
      </div>

        <div style={{ marginTop: '40px' }}>
          {gameState === 'waiting' && (
            <button
              onClick={startNewGame}
              style={{
                padding: '20px 40px',
                fontSize: '1.4rem',
                fontWeight: 'bold',
                background: 'linear-gradient(145deg, #4f46e5, #7c3aed)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '30px',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(79, 70, 229, 0.4)',
                transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px) scale(1.05)';
                e.target.style.boxShadow = '0 12px 35px rgba(79, 70, 229, 0.6)';
                e.target.style.background = 'linear-gradient(145deg, #5b52f0, #8b5cf6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 8px 25px rgba(79, 70, 229, 0.4)';
                e.target.style.background = 'linear-gradient(145deg, #4f46e5, #7c3aed)';
              }}
            >
              🎮 Iniciar Jogo
            </button>
          )}

          {gameState === 'showing' && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '20px 30px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              display: 'inline-block'
            }}>
              <p style={{ fontSize: '1.3rem', color: 'white', fontWeight: 'bold', margin: '0' }}>
                👀 Observe a sequência...
              </p>
            </div>
          )}

          {gameState === 'userTurn' && (
            <div style={{
              background: 'rgba(34, 197, 94, 0.2)',
              padding: '20px 30px',
              borderRadius: '20px',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              display: 'inline-block'
            }}>
              <p style={{ fontSize: '1.3rem', color: 'white', fontWeight: 'bold', margin: '0' }}>
                🎯 Sua vez! Repita a sequência
              </p>
            </div>
          )}

          {gameState === 'gameOver' && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '30px',
              borderRadius: '25px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '1.5rem', color: '#ff6b6b', fontWeight: 'bold', marginBottom: '20px' }}>
                🎮 Fim do Jogo!
              </p>
              <p style={{ fontSize: '1.2rem', color: 'white', marginBottom: '25px' }}>
                Pontuação Final: <strong>{score}</strong>
              </p>
              <button
                onClick={startNewGame}
                style={{
                  padding: '20px 40px',
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(145deg, #22c55e, #16a34a)',
                  color: 'white',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(34, 197, 94, 0.4)',
                  transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px) scale(1.05)';
                  e.target.style.boxShadow = '0 12px 35px rgba(34, 197, 94, 0.6)';
                  e.target.style.background = 'linear-gradient(145deg, #2dd55b, #22c55e)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 8px 25px rgba(34, 197, 94, 0.4)';
                  e.target.style.background = 'linear-gradient(145deg, #22c55e, #16a34a)';
                }}
              >
                🔄 Jogar Novamente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimonSays;