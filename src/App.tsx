import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mouse, 
  Keyboard, 
  FolderOpen, 
  MousePointer2, 
  Settings, 
  Volume2, 
  VolumeX,
  Sun,
  Moon,
  Trophy,
  BookOpen,
  Users,
  Star
} from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { say } from './utils/speech';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import ProgressBar from './components/ui/ProgressBar';
import MouseTrainer from './components/modules/MouseTrainer';
import TypingTrainer from './components/modules/TypingTrainer';
import FileExplorer from './components/modules/FileExplorer';
import RightClickTrainer from './components/modules/RightClickTrainer';
import toast from 'react-hot-toast';

type TabType = 'mouse' | 'typing' | 'files' | 'right';

interface UserProgress {
  mouseCompleted: boolean;
  typingCompleted: boolean;
  filesCompleted: boolean;
  rightClickCompleted: boolean;
  totalScore: number;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useLocalStorage<TabType>('activeTab', 'mouse');
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [soundEnabled, setSoundEnabled] = useLocalStorage('soundEnabled', true);
  const [userProgress, setUserProgress] = useLocalStorage<UserProgress>('userProgress', {
    mouseCompleted: false,
    typingCompleted: false,
    filesCompleted: false,
    rightClickCompleted: false,
    totalScore: 0
  });

  useEffect(() => {
    // Aplicar tema escuro
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Configurar síntese de voz
    if (!soundEnabled) {
      // Desabilitar síntese de voz
    }
  }, [soundEnabled]);

  const tabs = [
    { id: 'mouse', label: 'Mouse', icon: Mouse, color: 'primary' },
    { id: 'typing', label: 'Digitação', icon: Keyboard, color: 'success' },
    { id: 'files', label: 'Pastas', icon: FolderOpen, color: 'warning' },
    { id: 'right', label: 'Botão Direito', icon: MousePointer2, color: 'danger' }
  ];

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    const tabInfo = tabs.find(t => t.id === tab);
    if (soundEnabled && tabInfo) {
      say(`Agora vamos treinar ${tabInfo.label.toLowerCase()}`);
    }
  };

  const handleModuleComplete = (module: keyof UserProgress) => {
    setUserProgress(prev => ({
      ...prev,
      [module]: true,
      totalScore: prev.totalScore + 25
    }));
    
    toast.success(`Módulo ${module} concluído! +25 pontos`);
    
    // Avançar para o próximo módulo
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setTimeout(() => {
        const nextTab = tabs[currentIndex + 1].id as TabType;
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
        return <TypingTrainer />;
      case 'files':
        return <FileExplorer onComplete={() => handleModuleComplete('filesCompleted')} />;
      case 'right':
        return <RightClickTrainer onComplete={() => handleModuleComplete('rightClickCompleted')} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 transition-colors duration-300">
      {/* Partículas de fundo */}
      <div className="particles">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 3}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="text-center lg:text-left">
              <motion.h1 
                className="text-4xl lg:text-6xl font-black gradient-text mb-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Informática Descomplica
              </motion.h1>
              <motion.p 
                className="text-lg lg:text-xl text-zinc-600 dark:text-zinc-400 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Aprenda informática de forma simples e interativa
              </motion.p>
              <motion.div
                className="flex items-center justify-center lg:justify-start gap-4 text-sm text-zinc-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>4 Módulos</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>Para todas as idades</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span>100% Gratuito</span>
                </div>
              </motion.div>
            </div>

            {/* Controles */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Progresso geral */}
              <Card className="p-4 min-w-[200px]">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-warning-600" />
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      Progresso Geral
                    </span>
                  </div>
                  <ProgressBar 
                    progress={getTotalProgress()} 
                    color="primary"
                    showPercentage={true}
                  />
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    {userProgress.totalScore} pontos
                  </p>
                </div>
              </Card>

              {/* Botões de configuração */}
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setDarkMode(!darkMode)}
                  icon={darkMode ? Sun : Moon}
                >
                  {darkMode ? 'Claro' : 'Escuro'}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  icon={soundEnabled ? Volume2 : VolumeX}
                >
                  {soundEnabled ? 'Som' : 'Mudo'}
                </Button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Navegação por abas */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isCompleted = userProgress[`${tab.id}Completed` as keyof UserProgress];
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as TabType)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                    isActive
                      ? `bg-${tab.color}-600 text-white shadow-lg scale-105`
                      : `bg-white/80 hover:bg-white dark:bg-zinc-800/80 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:scale-105`
                  } ${isCompleted ? 'ring-2 ring-success-500' : ''}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {isCompleted && (
                    <div className="w-2 h-2 bg-success-500 rounded-full" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.nav>

        {/* Conteúdo principal */}
        <motion.main
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          {renderTabContent()}
        </motion.main>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center text-zinc-500 dark:text-zinc-400"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <p className="text-sm">
              Desenvolvido com ❤️ por <strong>Lucas Virginio</strong>
            </p>
            <div className="flex items-center gap-2 text-xs">
              <span>•</span>
              <span>Informática Descomplica</span>
              <span>•</span>
              <span>2024</span>
            </div>
          </div>
          <p className="text-xs">
            Aprenda no seu próprio ritmo • Interface adaptativa • Acessibilidade total
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default App;
