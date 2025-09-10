import React, { useState, useEffect, useRef } from 'react';

function TypingTrainer({ onComplete, playerName = "Jogador" }) {
  const [gameState, setGameState] = useState('waiting'); // waiting, racing, finished
  const [userInput, setUserInput] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [completedWords, setCompletedWords] = useState(0);
  const [playerPosition, setPlayerPosition] = useState(0);
  const [opponentPosition, setOpponentPosition] = useState(0);
  const [raceProgress, setRaceProgress] = useState(0);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [streak, setStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [playerAnimation, setPlayerAnimation] = useState('idle');
  const [opponentAnimation, setOpponentAnimation] = useState('idle');
  const [lastWordTime, setLastWordTime] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  const inputRef = useRef(null);

  const raceWords = [
    "mouse", "teclado", "monitor", "cpu", "internet", "arquivo", "pasta", "software", 
    "hardware", "navegador", "email", "download", "upload", "senha", "usuário", "programa"
  ];

  const totalWords = raceWords.length;
  const finishLine = 100; // 100% da pista

  useEffect(() => {
    if (gameState === 'waiting') {
      setShowCountdown(true);
      let count = 3;
      const countdownInterval = setInterval(() => {
        setCountdown(count);
        count--;
        if (count < 0) {
          clearInterval(countdownInterval);
          setShowCountdown(false);
          startRace();
        }
      }, 1000);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'racing' && startTime) {
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      const currentWpm = Math.round(completedWords / elapsedMinutes);
      setWpm(currentWpm || 0);
    }
  }, [completedWords, startTime, gameState]);

  // Atualizar posições dos personagens baseado no progresso
  useEffect(() => {
    if (gameState === 'racing') {
      // Calcular progresso do jogador
      const playerProgress = (completedWords / totalWords) * 100;
      setPlayerPosition(Math.min(playerProgress, finishLine));
      setRaceProgress(playerProgress);

      // Calcular progresso do oponente (dinâmico baseado na performance)
      const currentTime = Date.now();
      const timeSinceLastWord = currentTime - lastWordTime;
      
      // Oponente fica mais próximo quando o jogador está lento
      let opponentSpeed = 0.7; // Base 70% da velocidade do jogador
      
      if (timeSinceLastWord > 3000) { // Mais de 3 segundos por palavra
        opponentSpeed = 0.9; // Oponente fica mais próximo
      } else if (timeSinceLastWord < 1000) { // Menos de 1 segundo por palavra
        opponentSpeed = 0.5; // Oponente fica mais atrás
      }
      
      const opponentProgress = (completedWords * opponentSpeed / totalWords) * 100;
      setOpponentPosition(Math.min(opponentProgress, finishLine));
      
      // Animações baseadas na velocidade
      if (timeSinceLastWord < 1500) {
        setPlayerAnimation('running');
        setOpponentAnimation('running');
      } else {
        setPlayerAnimation('walking');
        setOpponentAnimation('walking');
      }
    }
  }, [completedWords, gameState, totalWords, lastWordTime]);

  const startRace = () => {
    const now = Date.now();
    setGameState('racing');
    setStartTime(now);
    setLastWordTime(now);
    setUserInput('');
    setCurrentWordIndex(0);
    setCompletedWords(0);
    setErrors(0);
    setAccuracy(100);
    setPlayerPosition(0);
    setOpponentPosition(0);
    setStreak(0);
    setPlayerAnimation('idle');
    setOpponentAnimation('idle');
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const showTemporaryFeedback = (message, type) => {
    setFeedbackMessage(message);
    setFeedbackType(type);
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
    }, 1000);
  };

  const handleInputChange = (e) => {
    if (gameState !== 'racing') return;

    const input = e.target.value.trim(); // Remover espaços extras
    setUserInput(input);

    const currentWord = raceWords[currentWordIndex];
    
    // Detecção automática: quando a palavra está completa
    // Normalizar para comparação (remover acentos e converter para minúsculas)
    const normalizedInput = input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const normalizedWord = currentWord.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    if (normalizedInput === normalizedWord) {
      // Palavra correta - avançar automaticamente
      setCompletedWords(prev => prev + 1);
      setStreak(prev => prev + 1);
      setLastWordTime(Date.now());
      
      // Animações de sucesso
      setPlayerAnimation('success');
      setTimeout(() => setPlayerAnimation('running'), 300);
      
      // Feedback positivo
      if (streak >= 3) {
        showTemporaryFeedback(`🔥 ${streak + 1}x Combo!`, 'success');
      } else {
        showTemporaryFeedback('✅', 'success');
      }
      
      // Limpar input e avançar para próxima palavra
      setUserInput('');
      
      // Verificar se chegou ao final ANTES de atualizar o índice
      if (currentWordIndex + 1 >= totalWords) {
        finishRace();
      } else {
        setCurrentWordIndex(prev => prev + 1);
      }
    } else if (input.length > currentWord.length) {
      // Palavra muito longa - erro
      setErrors(prev => prev + 1);
      setAccuracy(prev => Math.max(0, prev - 3));
      setStreak(0);
      
      // Animações de erro
      setPlayerAnimation('error');
      setTimeout(() => setPlayerAnimation('walking'), 500);
      
      showTemporaryFeedback('❌', 'error');
      setUserInput('');
    } else if (input.length > 0) {
      // Verificar se há caracteres incorretos na palavra atual (usando normalização)
      const normalizedInput = input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const normalizedWord = currentWord.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const isCorrectSoFar = normalizedWord.startsWith(normalizedInput);
      
      if (!isCorrectSoFar) {
        // Caractere incorreto detectado
        setErrors(prev => prev + 1);
        setAccuracy(prev => Math.max(0, prev - 3));
        setStreak(0);
        
        // Animações de erro
        setPlayerAnimation('error');
        setTimeout(() => setPlayerAnimation('walking'), 500);
        
        showTemporaryFeedback('❌', 'error');
        setUserInput('');
      }
    }
    // Se a palavra está incompleta e correta, apenas continua digitando
  };

  const finishRace = () => {
    setGameState('finished');
    const finalAccuracy = Math.max(0, 100 - (errors * 3));
    setAccuracy(finalAccuracy);
    
    // Calcular o tempo total em segundos
    const totalTimeInSeconds = (Date.now() - startTime) / 1000;
    
    console.log('TypingTrainer - finishRace chamado com tempo:', totalTimeInSeconds);
    console.log('TypingTrainer - onComplete existe?', !!onComplete);
    
    // Chamar onComplete imediatamente
    if (onComplete) {
      onComplete(totalTimeInSeconds);
    } else {
      console.log('Erro: onComplete não foi passado para TypingTrainer');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(2);
    return `${mins}:${secs.padStart(5, '0')}`;
  };

  const getCurrentWord = () => {
    return raceWords[currentWordIndex] || '';
  };

  return (
    <div className="race-container">
      {/* Header da corrida */}
      <div className="race-header">
        <div className="race-title">
          <h2>🏁 Corrida de Digitação</h2>
          <p>Digite rápido e vença a corrida!</p>
        </div>
        
        <div className="race-stats">
          <div className="stat">
            <span className="stat-value">{wpm}</span>
            <span className="stat-label">WPM</span>
          </div>
          <div className="stat">
            <span className="stat-value">{accuracy}%</span>
            <span className="stat-label">Precisão</span>
          </div>
          <div className="stat">
            <span className="stat-value">{streak}</span>
            <span className="stat-label">Combo</span>
          </div>
        </div>
      </div>

      {/* Pista de corrida */}
      <div className="race-track">
        <div className="track-background">
          {/* Linhas da pista superior (oponente) */}
          <div className="track-lines track-lines-top">
            {[...Array(10)].map((_, i) => (
              <div key={`top-${i}`} className="track-line" style={{ left: `${i * 10}%` }}></div>
            ))}
          </div>
          
          {/* Linha divisória central */}
          <div className="track-divider"></div>
          
          {/* Linhas da pista inferior (jogador) */}
          <div className="track-lines track-lines-bottom">
            {[...Array(10)].map((_, i) => (
              <div key={`bottom-${i}`} className="track-line" style={{ left: `${i * 10}%` }}></div>
            ))}
          </div>
          
          {/* Linha de chegada */}
          <div className="finish-line"></div>
          
          {/* Oponente (pista superior) */}
          <div 
            className={`opponent-character ${opponentAnimation}`}
            style={{ left: `${opponentPosition}%` }}
          >
            <div className="character-avatar">🤖</div>
            <div className="character-name">Oponente</div>
            <div className="character-speed">💨</div>
          </div>
          
          {/* Jogador (pista inferior) */}
          <div 
            className={`player-character ${playerAnimation}`}
            style={{ left: `${playerPosition}%` }}
          >
            <div className="character-avatar">🏃</div>
            <div className="character-name">{playerName}</div>
            <div className="character-speed">💨</div>
          </div>
        </div>
      </div>

      {/* Área de digitação */}
      <div className="typing-area">
        {showCountdown ? (
          <div className="countdown">
            <div className="countdown-number">{countdown}</div>
            <div className="countdown-text">Preparar...</div>
          </div>
        ) : gameState === 'waiting' ? (
          <div className="waiting-screen">
            <div className="waiting-icon">⏳</div>
            <h3>Preparando a corrida...</h3>
            <p>Aguarde enquanto configuramos a pista</p>
          </div>
        ) : gameState === 'finished' ? (
          <div className="finish-screen">
            <div className="finish-header">
              <div className="finish-icon">🏆</div>
              <h3>Corrida Concluída!</h3>
              <p className="finish-subtitle">Excelente performance!</p>
            </div>
            
            <div className="final-stats">
              <div className="final-stat">
                <div className="stat-icon">⚡</div>
                <span className="final-value">{wpm}</span>
                <span className="final-label">Palavras/min</span>
              </div>
              <div className="final-stat">
                <div className="stat-icon">🎯</div>
                <span className="final-value">{accuracy}%</span>
                <span className="final-label">Precisão</span>
              </div>
              <div className="final-stat">
                <div className="stat-icon">⏱️</div>
                <span className="final-value">{formatTime((Date.now() - startTime) / 1000)}</span>
                <span className="final-label">Tempo Total</span>
              </div>
            </div>
            
            <div className="finish-message">
              <p>Parabéns! Você completou a corrida com sucesso!</p>
              <p className="finish-note">Voltando ao ranking em alguns segundos...</p>
              <div className="trophy-animation">🎉</div>
            </div>
          </div>
        ) : (
          <>
            {/* Palavra atual */}
            <div className="current-word">
              <div className="word-display">{getCurrentWord()}</div>
              <div className="word-progress">
                {currentWordIndex + 1} / {totalWords}
              </div>
            </div>
            
            {/* Campo de digitação */}
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              className="typing-input"
              placeholder="Digite a palavra..."
              autoFocus
            />
            
            {/* Feedback */}
            {showFeedback && (
              <div className={`feedback ${feedbackType}`}>
                {feedbackMessage}
              </div>
            )}
          </>
        )}
      </div>

      {/* Progresso da corrida */}
      <div className="race-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${raceProgress}%` }}
          ></div>
        </div>
        <div className="progress-text">
          {Math.round(raceProgress)}% completo
        </div>
      </div>

      {/* Estilos CSS inline para o design moderno */}
      <style jsx>{`
        .race-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-blur: 10px;
          border: 1px solid rgba(255, 193, 7, 0.3);
          border-radius: 20px;
          color: #333;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .race-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .race-title h2 {
          margin: 0;
          font-size: 2rem;
          font-weight: bold;
        }

        .race-title p {
          margin: 5px 0 0 0;
          opacity: 0.8;
        }

        .race-stats {
          display: flex;
          gap: 20px;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .stat-label {
          font-size: 0.8rem;
          opacity: 0.8;
        }

        .race-track {
          height: 250px;
          background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
          border: 2px solid rgba(255, 193, 7, 0.3);
          border-radius: 15px;
          position: relative;
          overflow: hidden;
          margin-bottom: 30px;
        }

        .track-background {
          position: relative;
          height: 100%;
        }

        .track-lines {
          position: absolute;
          left: 0;
          right: 0;
        }

        .track-lines-top {
          top: 0;
          height: 40%;
        }

        .track-lines-bottom {
          bottom: 0;
          height: 40%;
        }

        .track-divider {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(255, 193, 7, 0.5);
          transform: translateY(-50%);
        }

        .track-line {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 2px;
          background: rgba(255, 193, 7, 0.3);
          animation: moveLines 2s linear infinite;
        }

        @keyframes moveLines {
          from { transform: translateY(0); }
          to { transform: translateY(100%); }
        }

        .finish-line {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 20px;
          background: repeating-linear-gradient(
            45deg,
            #fff,
            #fff 5px,
            #000 5px,
            #000 10px
          );
        }

        .player-character,
        .opponent-character {
          position: absolute;
          transition: left 0.5s ease-out;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }

        .player-character {
          bottom: 20px;
          z-index: 10;
        }

        .opponent-character {
          top: 20px;
          z-index: 5;
        }

        .character-avatar {
          font-size: 2rem;
          text-align: center;
          margin-bottom: 5px;
        }

        .character-name {
          font-size: 0.8rem;
          text-align: center;
          background: rgba(255, 193, 7, 0.9);
          color: #333;
          padding: 2px 8px;
          border-radius: 10px;
          white-space: nowrap;
          font-weight: bold;
        }

        .character-speed {
          font-size: 0.6rem;
          opacity: 0.7;
          animation: speedEffect 0.5s ease-in-out;
        }

        /* Animações dos personagens */
        .player-character.running .character-avatar,
        .opponent-character.running .character-avatar {
          animation: running 0.3s ease-in-out infinite;
        }

        .player-character.walking .character-avatar,
        .opponent-character.walking .character-avatar {
          animation: walking 0.6s ease-in-out infinite;
        }

        .player-character.success .character-avatar {
          animation: success 0.5s ease-in-out;
        }

        .player-character.error .character-avatar {
          animation: error 0.5s ease-in-out;
        }

        @keyframes running {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-3px) scale(1.05); }
        }

        @keyframes walking {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-1px); }
        }

        @keyframes success {
          0% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.2) rotate(-5deg); }
          50% { transform: scale(1.1) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }

        @keyframes error {
          0% { transform: translateX(0px); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
          100% { transform: translateX(0px); }
        }

        @keyframes speedEffect {
          0% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0.7; transform: scale(1); }
        }

        .typing-area {
          text-align: center;
          margin-bottom: 30px;
        }

        .countdown {
          font-size: 4rem;
          font-weight: bold;
        }

        .countdown-number {
          font-size: 6rem;
          color: #f59e0b;
        }

        .countdown-text {
          font-size: 1.5rem;
          opacity: 0.8;
        }

        .waiting-screen,
        .finish-screen {
          padding: 40px;
        }

        .waiting-icon,
        .finish-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .current-word {
          margin-bottom: 20px;
        }

        .word-display {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 10px;
          color: #f59e0b;
        }

        .word-progress {
          font-size: 1rem;
          opacity: 0.8;
        }

        .typing-input {
          width: 100%;
          max-width: 400px;
          padding: 15px 20px;
          font-size: 1.2rem;
          border: 2px solid rgba(255, 193, 7, 0.4);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.9);
          color: #333;
          text-align: center;
          outline: none;
        }

        .typing-input:focus {
          box-shadow: 0 0 20px rgba(255, 193, 7, 0.5);
          border-color: rgba(255, 193, 7, 0.8);
        }

        .feedback {
          margin-top: 15px;
          padding: 10px 20px;
          border-radius: 20px;
          font-weight: bold;
          animation: feedbackPop 0.3s ease-out;
        }

        .feedback.success {
          background: rgba(46, 204, 113, 0.8);
        }

        .feedback.error {
          background: rgba(231, 76, 60, 0.8);
        }

        @keyframes feedbackPop {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        .race-progress {
          margin-top: 20px;
        }

        .progress-bar {
          height: 10px;
          background: rgba(255, 193, 7, 0.2);
          border-radius: 5px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #f59e0b, #fbbf24);
          transition: width 0.3s ease-out;
        }

        .progress-text {
          text-align: center;
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .final-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin: 30px 0;
        }

        .final-stat {
          text-align: center;
          background: rgba(255, 255, 255, 0.9);
          padding: 20px;
          border-radius: 15px;
          border: 1px solid rgba(255, 193, 7, 0.3);
          backdrop-filter: blur(5px);
          transition: transform 0.3s ease;
        }

        .final-stat:hover {
          transform: translateY(-5px);
        }

        .stat-icon {
          font-size: 2rem;
          margin-bottom: 10px;
          display: block;
        }

        .final-value {
          display: block;
          font-size: 2.5rem;
          font-weight: bold;
          color: #f59e0b;
          margin-bottom: 5px;
        }

        .final-label {
          font-size: 0.9rem;
          opacity: 0.8;
          color: #333;
        }

        .finish-screen {
          padding: 40px;
          text-align: center;
          animation: finishSlideIn 0.8s ease-out;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 193, 7, 0.3);
        }

        .finish-header {
          margin-bottom: 30px;
        }

        .finish-icon {
          font-size: 4rem;
          margin-bottom: 15px;
          animation: trophyBounce 1s ease-in-out infinite;
        }

        .finish-screen h3 {
          font-size: 2.5rem;
          margin-bottom: 10px;
          color: #f59e0b;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }

        .finish-subtitle {
          font-size: 1.2rem;
          color: #333;
          margin: 0;
        }

        .finish-message {
          margin-top: 30px;
          padding: 25px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 15px;
          border: 2px solid rgba(255, 193, 7, 0.3);
          backdrop-filter: blur(5px);
        }

        .finish-message p {
          font-size: 1.2rem;
          margin-bottom: 10px;
          color: #f59e0b;
          font-weight: 600;
        }

        .finish-note {
          font-size: 1rem !important;
          color: rgba(255, 255, 255, 0.7) !important;
          font-weight: normal !important;
          margin-top: 15px !important;
        }

        .trophy-animation {
          font-size: 3rem;
          animation: celebration 2s ease-in-out infinite;
        }

        @keyframes finishSlideIn {
          0% { 
            transform: translateY(50px); 
            opacity: 0; 
          }
          100% { 
            transform: translateY(0); 
            opacity: 1; 
          }
        }

        @keyframes trophyBounce {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(5deg); }
        }

        @keyframes celebration {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.2) rotate(-10deg); }
          50% { transform: scale(1.1) rotate(0deg); }
          75% { transform: scale(1.2) rotate(10deg); }
        }
      `}</style>
    </div>
  );
}

export default TypingTrainer;
