import React, { useState, useEffect } from 'react';
import MouseTrainer from './components/MouseTrainer';
import TypingTrainer from './components/TypingTrainer';
import FileExplorer from './components/FileExplorer';
import RightClickTrainer from './components/RightClickTrainer';
import MemoryGame from './components/MemoryGame';

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
  const [userProgress, setUserProgress] = useLocalStorage('userProgress', {
    mouseCompleted: false,
    typingCompleted: false,
    filesCompleted: false,
    rightClickCompleted: false,
    memoryCompleted: false,
    totalScore: 0
  });

  const tabs = [
    { id: 'mouse', label: '🖱️', icon: '🖱️' },
    { id: 'typing', label: '⌨️', icon: '⌨️' },
    { id: 'files', label: '📁', icon: '📁' },
    { id: 'right', label: '🖱️', icon: '🖱️' },
    { id: 'memory', label: '🧠', icon: '🧠' }
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleModuleComplete = (module) => {
    setUserProgress(prev => ({
      ...prev,
      [module]: true,
      totalScore: prev.totalScore + 20
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
    return (completed / 5) * 100; // Atualizado para 5 módulos
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
      case 'memory':
        return <MemoryGame onComplete={() => handleModuleComplete('memoryCompleted')} />;
      default:
        return null;
    }
  };

  return (
    <div className="container">
      {/* Navegação minimalista */}
      <nav className="nav">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isCompleted = userProgress[`${tab.id}Completed`];
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`nav-button ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              title={tab.id}
            >
              <span>{tab.icon}</span>
            </button>
          );
        })}
      </nav>

      {/* Conteúdo principal - OCUPA TODO O ESPAÇO RESTANTE */}
      <main className="main-content">
        {renderTabContent()}
      </main>
    </div>
  );
}

export default App;
