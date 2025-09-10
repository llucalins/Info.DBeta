import React, { useState, useEffect, useRef } from 'react';

const OrganizeGame = ({ onComplete, playerName = "Jogador" }) => {
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, finished
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [draggedFile, setDraggedFile] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [mistakes, setMistakes] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);

  // Configuração do jogo - fase única com organização simples
  const gameConfig = {
    timeLimit: 180, // 3 minutos
    folders: ['Documentos', 'Música', 'Fotos', 'Vídeos'],
    files: [
      { id: 1, name: 'relatorio_anual.docx', type: 'document', correctFolder: 'Documentos' },
      { id: 2, name: 'video_apresentacao.mp4', type: 'video', correctFolder: 'Vídeos' },
      { id: 3, name: 'musica_relaxante.mp3', type: 'audio', correctFolder: 'Música' },
      { id: 4, name: 'foto_equipe.jpg', type: 'image', correctFolder: 'Fotos' },
      { id: 5, name: 'trabalho_matematica.pdf', type: 'document', correctFolder: 'Documentos' },
      { id: 6, name: 'tutorial_programacao.mp4', type: 'video', correctFolder: 'Vídeos' },
      { id: 7, name: 'playlist_trabalho.mp3', type: 'audio', correctFolder: 'Música' },
      { id: 8, name: 'documento_contrato.pdf', type: 'document', correctFolder: 'Documentos' },
      { id: 9, name: 'foto_projeto.png', type: 'image', correctFolder: 'Fotos' },
      { id: 10, name: 'video_aula.mp4', type: 'video', correctFolder: 'Vídeos' },
      { id: 11, name: 'estudo_ciencias.pdf', type: 'document', correctFolder: 'Documentos' },
      { id: 12, name: 'musica_estudo.mp3', type: 'audio', correctFolder: 'Música' },
      { id: 13, name: 'apresentacao_trabalho.pptx', type: 'document', correctFolder: 'Documentos' },
      { id: 14, name: 'foto_resultado.jpg', type: 'image', correctFolder: 'Fotos' },
      { id: 15, name: 'video_demonstracao.mp4', type: 'video', correctFolder: 'Vídeos' },
      { id: 16, name: 'trabalho_historia.pdf', type: 'document', correctFolder: 'Documentos' },
      { id: 17, name: 'musica_motivacional.mp3', type: 'audio', correctFolder: 'Música' },
      { id: 18, name: 'documento_final.docx', type: 'document', correctFolder: 'Documentos' },
      { id: 19, name: 'foto_sucesso.png', type: 'image', correctFolder: 'Fotos' },
      { id: 20, name: 'video_tutorial.mp4', type: 'video', correctFolder: 'Vídeos' }
    ]
  };

  // Tarefa única do jogo
  const gameTasks = [
    {
      id: 1,
      title: "Organize os arquivos por tipo",
      description: "Arraste todos os arquivos para suas pastas corretas",
      type: "organize",
      points: 100
    }
  ];

  // Carregar high score do localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('organizeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Inicializar áudio
  useEffect(() => {
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.log('Audio não suportado');
    }
  }, []);

  const playSound = (frequency, duration = 0.2) => {
    if (!audioContextRef.current) return;
    
    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration);
    } catch (error) {
      console.log('Erro ao tocar som:', error);
    }
  };

  const showFeedbackMessage = (message, type) => {
    setFeedbackMessage(message);
    setFeedbackType(type);
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
    }, 2000);
  };

  const startNewGame = () => {
    setGameState('waiting');
    setScore(0);
    setMistakes(0);
    setShowFeedback(false);
    setShowNewFolderModal(false);
    setNewFolderName('');
    setCurrentTask(0);
    setCompletedTasks(0);
    
    // Carregar configuração do jogo
    setTimeLeft(gameConfig.timeLimit);
    setFiles([...gameConfig.files]);
    setFolders(gameConfig.folders.map((name, index) => ({
      id: index + 1,
      name,
      files: []
    })));
    setTasks([...gameTasks]);
    
    // Iniciar timer após um pequeno delay
    setTimeout(() => {
      setGameState('playing');
      startTimer();
    }, 1000);
  };

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = (won) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setGameState('finished');
    
    // Salvar pontuação e chamar onComplete após mostrar a tela de conclusão
    setTimeout(() => {
      onComplete(score);
    }, 4000); // 4 segundos para mostrar a tela de conclusão
  };

  const checkTaskCompletion = () => {
    // Verificar se todos os arquivos foram organizados corretamente
    const allFilesOrganized = files.length === 0;
    const allFilesInCorrectFolders = folders.every(folder => 
      folder.files.every(file => file.correctFolder === folder.name)
    );

    if (allFilesOrganized && allFilesInCorrectFolders) {
      const newScore = score + 100; // Pontuação fixa por completar o jogo
      setScore(newScore);
      setCompletedTasks(1);
      showFeedbackMessage(`✅ Jogo concluído! +100 pontos`, 'success');
      
      // Atualizar high score se necessário
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('organizeHighScore', newScore.toString());
      }
      
      // Finalizar o jogo
      setTimeout(() => {
        endGame(true);
      }, 1000);
    }
  };

  const createNewFolder = () => {
    if (!newFolderName.trim()) {
      alert('Digite um nome para a pasta!');
      return;
    }
    
    const folderExists = folders.some(folder => 
      folder.name.toLowerCase() === newFolderName.toLowerCase()
    );
    
    if (folderExists) {
      alert('Já existe uma pasta com este nome!');
      return;
    }
    
    const newFolder = {
      id: Date.now(),
      name: newFolderName.trim(),
      files: []
    };
    
    setFolders([...folders, newFolder]);
    setNewFolderName('');
    setShowNewFolderModal(false);
  };

  const handleDragStart = (e, file) => {
    setDraggedFile(file);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetFolder) => {
    e.preventDefault();
    
    if (!draggedFile) return;
    
    const isCorrect = draggedFile.correctFolder === targetFolder.name;
    
    if (isCorrect) {
      // Mover arquivo para a pasta correta
      setFiles(files.filter(f => f.id !== draggedFile.id));
      setFolders(folders.map(folder => {
        if (folder.name === targetFolder.name) {
          return { ...folder, files: [...folder.files, draggedFile] };
        }
        return folder;
      }));
      
      setScore(score + 10);
      playSound(523.25); // C5 - som de sucesso
      showFeedbackMessage('✅ Correto! +10 pontos', 'success');
      
      // Verificar conclusão da tarefa atual
      setTimeout(() => {
        checkTaskCompletion();
      }, 500);
    } else {
      setScore(Math.max(0, score - 5));
      setMistakes(mistakes + 1);
      playSound(220); // A3 - som de erro
      showFeedbackMessage(`❌ Erro! -5 pontos. Dica: ${draggedFile.name} vai em "${draggedFile.correctFolder}"`, 'error');
    }
    
    setDraggedFile(null);
  };


  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return '🖼️';
      case 'document': return '📄';
      case 'audio': return '🎵';
      case 'video': return '🎬';
      default: return '📁';
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup do timer
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);


  if (gameState === 'waiting') {
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
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>📁 Organize a Bagunça</h2>
          
          <p style={{ fontSize: '1.2rem', marginBottom: '30px', opacity: 0.9 }}>
            Organize arquivos por tipo nas pastas corretas!<br/>
            Complete a organização em 3 minutos para vencer.
          </p>
          
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '15px' }}>🎯 Objetivo:</h3>
            <p style={{ textAlign: 'left', fontSize: '1rem', opacity: 0.9 }}>
              Arraste todos os 20 arquivos para suas pastas corretas baseado no tipo de arquivo.
            </p>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '15px' }}>📁 Regras:</h3>
            <ul style={{ textAlign: 'left', fontSize: '1rem', opacity: 0.9 }}>
              <li>🖼️ Imagens (png, jpg) → Pasta "Fotos"</li>
              <li>📄 Documentos (doc, pdf, pptx) → Pasta "Documentos"</li>
              <li>🎵 Músicas (mp3) → Pasta "Música"</li>
              <li>🎬 Vídeos (mp4) → Pasta "Vídeos"</li>
              <li>✅ +10 pontos por arquivo organizado corretamente</li>
              <li>❌ -5 pontos por erro</li>
              <li>🏆 +100 pontos por completar o jogo</li>
            </ul>
          </div>
          
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
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px) scale(1.05)';
              e.target.style.boxShadow = '0 12px 35px rgba(79, 70, 229, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 8px 25px rgba(79, 70, 229, 0.4)';
            }}
          >
            🎮 Iniciar Jogo
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    const isNewRecord = score > highScore;
    const finalHighScore = isNewRecord ? score : highScore;
    
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          margin: '0 auto',
          maxWidth: '700px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          animation: 'fadeIn 0.5s ease-in'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
            {isNewRecord ? '🏆' : '🎉'}
          </div>
          
          <h2 style={{ 
            color: 'white', 
            marginBottom: '20px',
            fontSize: '2.5rem',
            fontWeight: 'bold'
          }}>
            {isNewRecord ? 'Novo Recorde!' : 'Parabéns!'}
          </h2>
          
          <p style={{ fontSize: '1.3rem', marginBottom: '30px', opacity: 0.9 }}>
            {isNewRecord ? 'Você estabeleceu um novo recorde!' : 'Todas as tarefas foram concluídas!'}
          </p>
          
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '15px',
            padding: '25px',
            marginBottom: '30px'
          }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '10px' }}>
              {score} pontos
            </div>
            <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>
              Pontuação Final
            </div>
          </div>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '15px'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {completedTasks}/{tasks.length}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                Tarefas Concluídas
              </div>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '15px'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {mistakes}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                Erros
              </div>
            </div>
          </div>
          
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '30px'
          }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '5px' }}>
              Melhor Pontuação: {finalHighScore}
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              {isNewRecord ? 'Novo recorde estabelecido!' : 'Continue tentando para superar!'}
            </div>
          </div>
          
          <div style={{ 
            fontSize: '1rem', 
            opacity: 0.8,
            marginBottom: '20px'
          }}>
            Voltando para o ranking em alguns segundos...
          </div>
          
          <div style={{
            width: '100%',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, #22c55e, #16a34a)',
              borderRadius: '2px',
              animation: 'progressBar 4s linear forwards'
            }}></div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes progressBar {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    }}>
      {/* HUD */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '20px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 193, 7, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <strong>Pontuação: {score}</strong>
            </div>
            <div>
              <strong>Tempo: {formatTime(timeLeft)}</strong>
            </div>
            <div>
              <strong>Recorde: {highScore}</strong>
            </div>
            <div>
              <strong>Tarefas: {completedTasks}/{tasks.length}</strong>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setShowNewFolderModal(true)}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              📁 Criar Pasta
            </button>
            <button
              onClick={startNewGame}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #f44336, #d32f2f)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              🔄 Reiniciar
            </button>
          </div>
        </div>

        {/* Tarefa Atual */}
        {tasks[currentTask] && (
          <div style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '10px'
          }}>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>
              📋 Tarefa {currentTask + 1}: {tasks[currentTask].title}
            </h3>
            <p style={{ margin: '0', opacity: 0.9 }}>
              {tasks[currentTask].description} (+{tasks[currentTask].points} pontos)
            </p>
          </div>
        )}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: feedbackType === 'success' 
            ? 'linear-gradient(145deg, rgba(34, 197, 94, 0.9), rgba(22, 163, 74, 0.9))' 
            : 'linear-gradient(145deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))',
          color: 'white',
          padding: '20px 30px',
          borderRadius: '15px',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          zIndex: 1000,
          textAlign: 'center',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          {feedbackMessage}
        </div>
      )}

      {/* Workspace */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        minHeight: '500px'
      }}>
        {/* Arquivos */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '15px',
          padding: '20px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 193, 7, 0.3)'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>
            📂 Arquivos para Organizar ({files.length})
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: '10px'
          }}>
            {files.map(file => (
              <div
                key={file.id}
                draggable
                onDragStart={(e) => handleDragStart(e, file)}
                style={{
                  background: 'linear-gradient(145deg, #e3f2fd, #bbdefb)',
                  border: '2px solid #2196f3',
                  borderRadius: '10px',
                  padding: '15px',
                  textAlign: 'center',
                  cursor: 'grab',
                  transition: 'all 0.3s ease',
                  userSelect: 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 5px 15px rgba(33, 150, 243, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '5px' }}>
                  {getFileIcon(file.type)}
                </div>
                <div style={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 'bold',
                  wordBreak: 'break-word',
                  color: '#333'
                }}>
                  {file.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pastas */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '15px',
          padding: '20px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 193, 7, 0.3)'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>
            📁 Pastas ({folders.length})
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '15px'
          }}>
            {folders.map(folder => (
              <div
                key={folder.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, folder)}
                style={{
                  background: 'linear-gradient(145deg, #f3e5f5, #e1bee7)',
                  border: '3px dashed #9c27b0',
                  borderRadius: '15px',
                  padding: '20px',
                  textAlign: 'center',
                  minHeight: '120px',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#7b1fa2';
                  e.target.style.background = 'linear-gradient(145deg, #f8bbd9, #f48fb1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#9c27b0';
                  e.target.style.background = 'linear-gradient(145deg, #f3e5f5, #e1bee7)';
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📁</div>
                <div style={{ 
                  fontWeight: 'bold', 
                  marginBottom: '10px',
                  color: '#333'
                }}>
                  {folder.name}
                </div>
                <div style={{ 
                  fontSize: '0.9rem', 
                  color: '#666',
                  background: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '10px',
                  padding: '5px'
                }}>
                  {folder.files.length} arquivo(s)
                </div>
                
                {/* Arquivos na pasta */}
                {folder.files.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: '#4caf50',
                    color: 'white',
                    borderRadius: '50%',
                    width: '25px',
                    height: '25px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    {folder.files.length}
                  </div>
                )}

                {/* Lista de arquivos na pasta */}
                {folder.files.length > 0 && (
                  <div style={{
                    marginTop: '10px',
                    maxHeight: '60px',
                    overflowY: 'auto',
                    fontSize: '0.7rem'
                  }}>
                    {folder.files.map((file, index) => (
                      <div key={index} style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        padding: '2px 5px',
                        margin: '1px 0',
                        borderRadius: '3px',
                        color: '#333',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}>
                        <span>{getFileIcon(file.type)}</span>
                        <span>{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal para criar nova pasta */}
      {showNewFolderModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '30px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>
              📁 Criar Nova Pasta
            </h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Nome da pasta"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                marginBottom: '20px',
                outline: 'none'
              }}
              onKeyPress={(e) => e.key === 'Enter' && createNewFolder()}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowNewFolderModal(false);
                  setNewFolderName('');
                }}
                style={{
                  padding: '10px 20px',
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={createNewFolder}
                style={{
                  padding: '10px 20px',
                  background: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrganizeGame;
