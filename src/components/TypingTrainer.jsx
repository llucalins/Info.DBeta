import React, { useState, useEffect, useRef } from 'react';

function TypingTrainer({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [gameTime, setGameTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [completedWords, setCompletedWords] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('');

  const inputRef = useRef(null);

  const exercises = [
    {
      id: 0,
      title: "Conceitos Básicos",
      description: "Digite termos importantes de informática",
      type: 'words',
      content: [
        "mouse", "teclado", "monitor", "cpu", "internet", "arquivo", "pasta", "software", "hardware", "navegador",
        "email", "download", "upload", "senha", "usuário", "programa", "aplicativo", "tela", "cursor", "clique"
      ],
      targetWpm: 20,
      timeLimit: 120
    },
    {
      id: 1,
      title: "Frases de Tecnologia",
      description: "Digite frases sobre computadores e internet",
      type: 'sentences',
      content: [
        "O computador é uma ferramenta essencial.",
        "A internet conecta pessoas do mundo todo.",
        "O mouse controla o cursor na tela.",
        "O teclado permite digitar textos rapidamente.",
        "Os arquivos são organizados em pastas.",
        "O software executa as tarefas do computador.",
        "A senha protege suas informações pessoais.",
        "O navegador acessa sites da internet.",
        "O email envia mensagens eletrônicas.",
        "O download baixa arquivos da internet."
      ],
      targetWpm: 25,
      timeLimit: 180
    },
    {
      id: 2,
      title: "Comandos e Atalhos",
      description: "Pratique comandos úteis do computador",
      type: 'mixed',
      content: [
        "Ctrl + C = Copiar",
        "Ctrl + V = Colar",
        "Ctrl + Z = Desfazer",
        "Ctrl + A = Selecionar tudo",
        "F5 = Atualizar página",
        "Alt + Tab = Trocar janelas",
        "Windows + D = Área de trabalho",
        "Ctrl + F = Buscar texto",
        "Ctrl + S = Salvar arquivo",
        "Ctrl + P = Imprimir documento"
      ],
      targetWpm: 30,
      timeLimit: 150
    },
    {
      id: 3,
      title: "Texto Informativo",
      description: "Digite um texto completo sobre tecnologia",
      type: 'paragraph',
      content: [
        "A informática revolucionou a forma como trabalhamos e nos comunicamos. Com o computador, podemos realizar tarefas que antes levavam dias em apenas alguns minutos. A internet nos permite acessar informações de qualquer lugar do mundo e conectar com pessoas de diferentes culturas. É fundamental aprender a usar essas ferramentas para se adaptar ao mundo moderno.",
        "O mouse e o teclado são os principais dispositivos de entrada do computador. O mouse permite navegar pela interface gráfica de forma intuitiva, enquanto o teclado é essencial para digitar textos e comandos. Dominar esses dispositivos é o primeiro passo para se tornar um usuário eficiente de computador."
      ],
      targetWpm: 35,
      timeLimit: 300
    }
  ];

  const currentExercise = exercises[currentStep];

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
    if (isGameActive && startTime) {
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      const currentWpm = Math.round(completedWords / elapsedMinutes);
      setWpm(currentWpm || 0);
    }
  }, [completedWords, startTime, isGameActive]);

  const startExercise = () => {
    setIsGameActive(true);
    setShowInstructions(false);
    setStartTime(Date.now());
    setUserInput('');
    setCurrentWordIndex(0);
    setCompletedWords(0);
    setErrors(0);
    setAccuracy(100);
    setGameTime(0);
    setStreak(0);
    
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
    }, 2000);
  };

  const handleInputChange = (e) => {
    if (!isGameActive) return;

    const input = e.target.value;
    setUserInput(input);

    if (currentExercise.type === 'words') {
      handleWordTyping(input);
    } else if (currentExercise.type === 'sentences') {
      handleSentenceTyping(input);
    } else if (currentExercise.type === 'mixed') {
      handleMixedTyping(input);
    } else if (currentExercise.type === 'paragraph') {
      handleParagraphTyping(input);
    }
  };

  const handleWordTyping = (input) => {
    const words = currentExercise.content;
    const currentWord = words[currentWordIndex];
    
    if (input.endsWith(' ')) {
      const typedWord = input.trim();
      if (typedWord === currentWord) {
        setCompletedWords(prev => prev + 1);
        setCurrentWordIndex(prev => prev + 1);
        setUserInput('');
        setStreak(prev => prev + 1);
        
        // Feedback positivo
        if (streak >= 3) {
          showTemporaryFeedback(`🔥 Sequência de ${streak + 1}! Excelente!`, 'success');
        } else {
          showTemporaryFeedback('✅ Correto!', 'success');
        }
        
        if (currentWordIndex + 1 >= words.length) {
          handleExerciseComplete();
        }
      } else {
        setErrors(prev => prev + 1);
        setAccuracy(prev => Math.max(0, prev - 5));
        setStreak(0);
        showTemporaryFeedback('❌ Incorreto. Tente novamente!', 'error');
      }
    }
  };

  const handleSentenceTyping = (input) => {
    const sentences = currentExercise.content;
    const currentSentence = sentences[currentWordIndex];
    
    if (input === currentSentence) {
      setCompletedWords(prev => prev + 1);
      setCurrentWordIndex(prev => prev + 1);
      setUserInput('');
      setStreak(prev => prev + 1);
      
      showTemporaryFeedback('✅ Frase completa!', 'success');
      
      if (currentWordIndex + 1 >= sentences.length) {
        handleExerciseComplete();
      }
    }
  };

  const handleMixedTyping = (input) => {
    const mixedContent = currentExercise.content;
    const currentItem = mixedContent[currentWordIndex];
    
    if (input === currentItem) {
      setCompletedWords(prev => prev + 1);
      setCurrentWordIndex(prev => prev + 1);
      setUserInput('');
      setStreak(prev => prev + 1);
      
      showTemporaryFeedback('✅ Comando correto!', 'success');
      
      if (currentWordIndex + 1 >= mixedContent.length) {
        handleExerciseComplete();
      }
    }
  };

  const handleParagraphTyping = (input) => {
    const paragraphs = currentExercise.content;
    const currentParagraph = paragraphs[currentWordIndex];
    
    if (input === currentParagraph) {
      setCompletedWords(prev => prev + 1);
      setCurrentWordIndex(prev => prev + 1);
      setUserInput('');
      setStreak(prev => prev + 1);
      
      showTemporaryFeedback('✅ Parágrafo completo!', 'success');
      
      if (currentWordIndex + 1 >= paragraphs.length) {
        handleExerciseComplete();
      }
    }
  };

  const handleExerciseComplete = () => {
    const finalAccuracy = Math.max(0, 100 - (errors * 2));
    setAccuracy(finalAccuracy);
    
    showTemporaryFeedback(`🎉 Exercício completo! ${wpm} WPM, ${finalAccuracy}% precisão!`, 'success');
    
    setTimeout(() => {
      if (currentStep < exercises.length - 1) {
        setCurrentStep(prev => prev + 1);
        resetExercise();
      } else {
        showTemporaryFeedback("🏆 Todos os exercícios completos!", 'success');
        setTimeout(() => {
          onComplete?.();
        }, 2000);
      }
    }, 2000);
  };

  const resetExercise = () => {
    setIsGameActive(false);
    setShowInstructions(true);
    setUserInput('');
    setCurrentWordIndex(0);
    setCompletedWords(0);
    setErrors(0);
    setAccuracy(100);
    setWpm(0);
    setGameTime(0);
    setStartTime(null);
    setStreak(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentTarget = () => {
    if (currentExercise.type === 'words') {
      return currentExercise.content[currentWordIndex];
    } else if (currentExercise.type === 'sentences') {
      return currentExercise.content[currentWordIndex];
    } else if (currentExercise.type === 'mixed') {
      return currentExercise.content[currentWordIndex];
    } else if (currentExercise.type === 'paragraph') {
      return currentExercise.content[currentWordIndex];
    }
    return '';
  };

  const renderTarget = () => {
    const target = getCurrentTarget();
    
    if (currentExercise.type === 'words') {
      return (
        <div className="typing-target">
          <div className="text-center mb-4">
            <span className="text-2xl font-bold text-primary">
              {currentWordIndex + 1} / {currentExercise.content.length}
            </span>
          </div>
          <div className="text-center">
            <span className="text-4xl font-bold">{target}</span>
          </div>
        </div>
      );
    } else if (currentExercise.type === 'sentences') {
      return (
        <div className="typing-target">
          <div className="text-center mb-4">
            <span className="text-lg text-muted">
              Frase {currentWordIndex + 1} de {currentExercise.content.length}
            </span>
          </div>
          <div className="text-center">
            <span className="text-2xl">{target}</span>
          </div>
        </div>
      );
    } else if (currentExercise.type === 'mixed') {
      return (
        <div className="typing-target">
          <div className="text-center mb-4">
            <span className="text-lg text-muted">
              Comando {currentWordIndex + 1} de {currentExercise.content.length}
            </span>
          </div>
          <div className="text-center">
            <span className="text-2xl font-mono">{target}</span>
          </div>
        </div>
      );
    } else if (currentExercise.type === 'paragraph') {
      return (
        <div className="typing-target">
          <div className="text-center mb-4">
            <span className="text-lg text-muted">
              Parágrafo {currentWordIndex + 1} de {currentExercise.content.length}
            </span>
          </div>
          <div className="text-justify">
            <span className="text-lg leading-relaxed">{target}</span>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="card">
      {/* Header do exercício */}
      <div className="flex flex-between mb-4">
        <div className="flex flex-center gap-4">
          <span className="badge badge-primary">
            Exercício {currentStep + 1} - {currentExercise.title}
          </span>
          <div className="progress-container" style={{ width: '150px' }}>
            <div 
              className="progress-bar" 
              style={{ width: `${((currentStep + 1) / exercises.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="button button-secondary" onClick={resetExercise}>
            🔄 Reiniciar
          </button>
          {!isGameActive && (
            <button className="button button-primary" onClick={startExercise}>
              ▶️ Iniciar
            </button>
          )}
        </div>
      </div>

      {/* Área de digitação */}
      <div className="typing-game-area">
        {showInstructions ? (
          <div className="text-center">
            <div className="text-6xl mb-4">⌨️</div>
            <h3 className="text-2xl font-bold mb-2">{currentExercise.title}</h3>
            <p className="text-lg text-muted mb-6">{currentExercise.description}</p>
            
            <div className="grid grid-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">{currentExercise.targetWpm}</div>
                <p className="text-sm">Palavras/min</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning mb-2">{formatTime(currentExercise.timeLimit)}</div>
                <p className="text-sm">Tempo limite</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success mb-2">{currentExercise.content.length}</div>
                <p className="text-sm">Itens</p>
              </div>
            </div>
            
            <button className="button button-primary text-lg" onClick={startExercise}>
              Começar Exercício
            </button>
          </div>
        ) : (
          <>
            {/* Texto alvo */}
            {renderTarget()}
            
            {/* Área de entrada */}
            <textarea
              ref={inputRef}
              value={userInput}
              onChange={handleInputChange}
              className={`typing-input ${userInput && userInput !== getCurrentTarget() ? 'incorrect-typing' : userInput === getCurrentTarget() ? 'correct-typing' : ''}`}
              placeholder="Digite aqui..."
              disabled={!isGameActive}
            />
            
            {/* Feedback temporário */}
            {showFeedback && (
              <div className={`feedback-message ${feedbackType}`}>
                {feedbackMessage}
              </div>
            )}
            
            {/* Estatísticas em tempo real */}
            <div className="typing-stats">
              <div className="stat-card">
                <div className="stat-value">{wpm}</div>
                <div className="stat-label">Palavras/min</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{accuracy}%</div>
                <div className="stat-label">Precisão</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{formatTime(gameTime)}</div>
                <div className="stat-label">Tempo</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{streak}</div>
                <div className="stat-label">Sequência</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Indicadores de progresso */}
      <div className="flex flex-center gap-2 mt-4">
        {exercises.map((exercise, index) => (
          <div
            key={exercise.id}
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

export default TypingTrainer;
