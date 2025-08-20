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

  const inputRef = useRef(null);

  const exercises = [
    {
      id: 0,
      title: "Digitação Básica",
      description: "Digite as palavras exatamente como aparecem na tela",
      type: 'words',
      content: [
        "casa", "bola", "mesa", "livro", "porta", "janela", "carro", "árvore", "sol", "lua",
        "água", "fogo", "terra", "ar", "tempo", "espaço", "amigo", "família", "trabalho", "estudo"
      ],
      targetWpm: 20,
      timeLimit: 120
    },
    {
      id: 1,
      title: "Frases Completas",
      description: "Digite frases completas com pontuação",
      type: 'sentences',
      content: [
        "O sol brilha no céu azul.",
        "A criança brinca no parque.",
        "O gato dorme no sofá.",
        "A música toca suavemente.",
        "O livro está na estante.",
        "A comida está na mesa.",
        "O carro está na garagem.",
        "A flor cresce no jardim.",
        "O pássaro canta na árvore.",
        "A água corre no rio."
      ],
      targetWpm: 25,
      timeLimit: 180
    },
    {
      id: 2,
      title: "Números e Símbolos",
      description: "Pratique digitando números e símbolos especiais",
      type: 'mixed',
      content: [
        "123 + 456 = 579",
        "R$ 50,00 - R$ 25,00 = R$ 25,00",
        "10% de 100 = 10",
        "2 x 3 = 6",
        "15 ÷ 3 = 5",
        "7² = 49",
        "√16 = 4",
        "3.14 x 2 = 6.28",
        "1/2 + 1/2 = 1",
        "100% - 25% = 75%"
      ],
      targetWpm: 30,
      timeLimit: 150
    },
    {
      id: 3,
      title: "Texto Longo",
      description: "Digite um texto completo com parágrafos",
      type: 'paragraph',
      content: [
        "A tecnologia tem transformado a forma como vivemos e trabalhamos. Cada dia surgem novas ferramentas que facilitam nossas tarefas diárias. É importante estar sempre atualizado com as novidades para aproveitar ao máximo os benefícios que a informática oferece.",
        "O computador é uma ferramenta essencial nos dias de hoje. Ele nos permite comunicar com pessoas do mundo todo, acessar informações instantaneamente e realizar tarefas que antes levavam muito mais tempo. Aprender a usar o computador é fundamental para o sucesso pessoal e profissional."
      ],
      targetWpm: 35,
      timeLimit: 300
    }
  ];

  const currentExercise = exercises[currentStep];

  useEffect(() => {
    say("Vamos treinar a digitação! Você vai melhorar sua velocidade e precisão.");
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
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    say(`Iniciando exercício: ${currentExercise.title}`);
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
        
        if (currentWordIndex + 1 >= words.length) {
          handleExerciseComplete();
        }
      } else {
        setErrors(prev => prev + 1);
        setAccuracy(prev => Math.max(0, prev - 5));
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
      
      if (currentWordIndex + 1 >= paragraphs.length) {
        handleExerciseComplete();
      }
    }
  };

  const handleExerciseComplete = () => {
    const finalAccuracy = Math.max(0, 100 - (errors * 2));
    setAccuracy(finalAccuracy);
    
    say(`Parabéns! Você completou o exercício com ${wpm} palavras por minuto e ${finalAccuracy}% de precisão!`);
    
    setTimeout(() => {
      if (currentStep < exercises.length - 1) {
        setCurrentStep(prev => prev + 1);
        resetExercise();
        say(`Agora vamos para o próximo exercício: ${exercises[currentStep + 1].title}`);
      } else {
        say("Parabéns! Você completou todos os exercícios de digitação!");
        onComplete?.();
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
              Expressão {currentWordIndex + 1} de {currentExercise.content.length}
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
