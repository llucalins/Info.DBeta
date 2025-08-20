import React, { useState, useEffect } from 'react';
import MouseTrainer from './components/MouseTrainer';
import TypingTrainer from './components/TypingTrainer';
import FileExplorer from './components/FileExplorer';
import RightClickTrainer from './components/RightClickTrainer';

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

// Hook para localStorage
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log('Erro ao salvar no localStorage');
    }
  };

  return [storedValue, setValue];
};

function App() {
  const [activeTab, setActiveTab] = useLocalStorage('activeTab', 'mouse');
  const [soundEnabled, setSoundEnabled] = useLocalStorage('soundEnabled', true);
  const [userProgress, setUserProgress] = useLocalStorage('userProgress', {
    mouseCompleted: false,
    typingCompleted: false,
    filesCompleted: false,
    rightClickCompleted: false,
    totalScore: 0
  });

  const tabs = [
    { id: 'mouse', label: '🖱️ Mouse', icon: '🖱️' },
    { id: 'typing', label: '⌨️ Digitação', icon: '⌨️' },
    { id: 'files', label: '📁 Pastas', icon: '📁' },
    { id: 'right', label: '🖱️ Botão Direito', icon: '🖱️' }
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const tabInfo = tabs.find(t => t.id === tab);
    if (soundEnabled && tabInfo) {
      say(`Agora vamos treinar ${tabInfo.label.toLowerCase()}`);
    }
  };

  const handleModuleComplete = (module) => {
    setUserProgress(prev => ({
      ...prev,
      [module]: true,
      totalScore: prev.totalScore + 25
    }));
    
    // Avançar para o próximo módulo
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setTimeout(() => {
        const nextTab = tabs[currentIndex + 1].id;
        setActiveTab(nextTab);
      }, 2000);
    }
  };

  const getTotalProgress = () => {
    const completed = Object.values(userProgress).filter(Boolean).length - 1; // -1 para excluir totalScore
    return (completed / 4) * 100;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'mouse':
        return <MouseTrainer onComplete={() => handleModuleComplete('mouseCompleted')} />;
      case 'typing':
        return <TypingTrainer onComplete={() => handleModuleComplete('typingCompleted')} />;
      case 'files':
        return <FileExplorer onComplete={() => handleModuleComplete('filesCompleted')} />;
      case 'right':
        return <RightClickTrainer onComplete={() => handleModuleComplete('rightClickCompleted')} />;
      default:
        return null;
    }
  };

  return (
    <div className="container">
      {/* Header compacto */}
      <header className="header animate-fade-in">
        <h1>Informática Descomplica</h1>
        <p>Aprenda informática de forma simples e interativa</p>
        <div className="flex flex-center gap-4 text-sm">
          <span>📚 4 Módulos</span>
          <span>👥 Para todas as idades</span>
          <span>⭐ 100% Gratuito</span>
        </div>
      </header>

      {/* Controles */}
      <div className="flex flex-between mb-6">
        <div className="flex flex-center gap-4">
          <span className="badge badge-primary">
            Progresso: {Math.round(getTotalProgress())}%
          </span>
          <div className="progress-container" style={{ width: '200px' }}>
            <div 
              className="progress-bar" 
              style={{ width: `${getTotalProgress()}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            className={`button ${soundEnabled ? 'button-success' : 'button-secondary'}`}
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? '🔊 Som' : '🔇 Mudo'}
          </button>
        </div>
      </div>

      {/* Navegação */}
      <nav className="nav">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isCompleted = userProgress[`${tab.id}Completed`];
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`nav-button ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label.split(' ')[1]}</span>
              {isCompleted && <span>✅</span>}
            </button>
          );
        })}
      </nav>

      {/* Conteúdo principal - OCUPA TODO O ESPAÇO RESTANTE */}
      <main className="main-content animate-slide-in">
        {renderTabContent()}
      </main>

      {/* Footer compacto */}
      <footer className="footer">
        <div className="mb-4">
          <p>Desenvolvido com ❤️ por <strong>Lucas Virginio</strong></p>
        </div>
        <div className="flex flex-center gap-2 text-sm">
          <span>•</span>
          <span>Informática Descomplica</span>
          <span>•</span>
          <span>2024</span>
        </div>
        <p className="text-sm mt-2">
          Aprenda no seu próprio ritmo • Interface adaptativa • Acessibilidade total
        </p>
      </footer>
    </div>
  );
}

export default App;
