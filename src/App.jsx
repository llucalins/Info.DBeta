import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import TypingGamePage from './components/TypingGamePage';
import CoordinationGamePage from './components/CoordinationGamePage';
import OrganizeGamePage from './components/OrganizeGamePage';
import AnimatedBackground from './components/AnimatedBackground';

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // home, typing, coordination, organize
  const [coordinationPlayers, setCoordinationPlayers] = useState([]);
  const [typingPlayers, setTypingPlayers] = useState([]);
  const [organizePlayers, setOrganizePlayers] = useState([]);

  // Carregar jogadores do localStorage no nível do App
  useEffect(() => {
    console.log('App: Carregando jogadores do localStorage...');
    
    // Carregar jogadores da coordenação
    const savedCoordinationPlayers = localStorage.getItem('coordinationPlayers');
    console.log('App: Dados de coordenação encontrados:', savedCoordinationPlayers);
    
    if (savedCoordinationPlayers) {
      try {
        const parsedPlayers = JSON.parse(savedCoordinationPlayers);
        console.log('App: Jogadores de coordenação parseados:', parsedPlayers);
        setCoordinationPlayers(parsedPlayers);
      } catch (error) {
        console.error('App: Erro ao carregar jogadores de coordenação:', error);
        setCoordinationPlayers([]);
      }
    }

    // Carregar jogadores da digitação
    const savedTypingPlayers = localStorage.getItem('typingPlayers');
    console.log('App: Dados de digitação encontrados:', savedTypingPlayers);
    
    if (savedTypingPlayers) {
      try {
        const parsedPlayers = JSON.parse(savedTypingPlayers);
        console.log('App: Jogadores de digitação parseados:', parsedPlayers);
        setTypingPlayers(parsedPlayers);
      } catch (error) {
        console.error('App: Erro ao carregar jogadores de digitação:', error);
        setTypingPlayers([]);
      }
    }

    // Carregar jogadores da organização
    const savedOrganizePlayers = localStorage.getItem('organizePlayers');
    console.log('App: Dados de organização encontrados:', savedOrganizePlayers);
    
    if (savedOrganizePlayers) {
      try {
        const parsedPlayers = JSON.parse(savedOrganizePlayers);
        console.log('App: Jogadores de organização parseados:', parsedPlayers);
        setOrganizePlayers(parsedPlayers);
      } catch (error) {
        console.error('App: Erro ao carregar jogadores de organização:', error);
        setOrganizePlayers([]);
      }
    }
  }, []);

  // Salvar jogadores no localStorage quando mudarem
  useEffect(() => {
    if (coordinationPlayers.length > 0 || localStorage.getItem('coordinationPlayers')) {
      console.log('App: Salvando jogadores de coordenação no localStorage:', coordinationPlayers);
      localStorage.setItem('coordinationPlayers', JSON.stringify(coordinationPlayers));
    }
  }, [coordinationPlayers]);

  useEffect(() => {
    if (typingPlayers.length > 0 || localStorage.getItem('typingPlayers')) {
      console.log('App: Salvando jogadores de digitação no localStorage:', typingPlayers);
      localStorage.setItem('typingPlayers', JSON.stringify(typingPlayers));
    }
  }, [typingPlayers]);

  useEffect(() => {
    if (organizePlayers.length > 0 || localStorage.getItem('organizePlayers')) {
      console.log('App: Salvando jogadores de organização no localStorage:', organizePlayers);
      localStorage.setItem('organizePlayers', JSON.stringify(organizePlayers));
    }
  }, [organizePlayers]);

  const navigateToPage = (page) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'typing':
        return (
          <TypingGamePage 
            onBack={() => setCurrentPage('home')}
            players={typingPlayers}
            setPlayers={setTypingPlayers}
          />
        );
      case 'coordination':
        return (
          <CoordinationGamePage 
            onBack={() => setCurrentPage('home')}
            players={coordinationPlayers}
            setPlayers={setCoordinationPlayers}
          />
        );
      case 'organize':
        return (
          <OrganizeGamePage 
            onBack={() => setCurrentPage('home')}
            players={organizePlayers}
            setPlayers={setOrganizePlayers}
          />
        );
      default:
        return <HomePage onNavigate={navigateToPage} />;
    }
  };

  return (
    <>
      <AnimatedBackground />
      {renderCurrentPage()}
    </>
  );
}

export default App;