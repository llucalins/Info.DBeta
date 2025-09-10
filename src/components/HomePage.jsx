import React from 'react';

function HomePage({ onNavigate }) {
  return (
    <div className="home-container">
      {/* Navigation Header */}
      <nav className="navbar">
        <div className="nav-brand">
          <div className="brand-icon">💻</div>
          <span className="brand-text">Info.DBeta</span>
        </div>
        <div className="nav-links">
          <a href="#about" className="nav-link">Sobre</a>
          <a href="#games" className="nav-link">Jogos</a>
          <a href="#contact" className="nav-link">Contato</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🎓 Plataforma Educacional</div>
          <h1 className="hero-title">
            Informática
            <span className="gradient-text"> Descomplicada</span>
          </h1>
          <p className="hero-description">
            Aprenda informática de forma divertida e interativa através de jogos educacionais 
            desenvolvidos especialmente para estudantes e profissionais.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">3</div>
              <div className="stat-label">Jogos Disponíveis</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Gratuito</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">∞</div>
              <div className="stat-label">Diversão</div>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-cards">
            <div className="floating-card card-1">⌨️</div>
            <div className="floating-card card-2">🎮</div>
            <div className="floating-card card-3">🏆</div>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="games-section" id="games">
        <div className="section-header">
          <h2 className="section-title">Nossos Jogos</h2>
          <p className="section-subtitle">
            Escolha um dos jogos abaixo e comece sua jornada de aprendizado
          </p>
        </div>

        <div className="games-grid">
          {/* Jogo de Digitação */}
          <div className="game-card typing-card" onClick={() => onNavigate('typing')}>
            <div className="card-header">
              <div className="game-icon typing-icon">⌨️</div>
              <div className="card-badge">Velocidade</div>
            </div>
            <div className="card-content">
              <h3 className="game-title">Corrida de Digitação</h3>
              <p className="game-description">
                Teste sua velocidade e precisão na digitação em uma corrida emocionante 
                contra o tempo. Melhore suas habilidades de digitação enquanto se diverte.
              </p>
              <div className="game-features">
                <div className="feature-item">
                  <span className="feature-icon">⚡</span>
                  <span>Corrida contra o tempo</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📊</span>
                  <span>Ranking de velocidade</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎯</span>
                  <span>Sistema de precisão</span>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button className="play-button typing-btn">
                <span>Começar Jogo</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Jogo da Coordenação */}
          <div className="game-card coordination-card" onClick={() => onNavigate('coordination')}>
            <div className="card-header">
              <div className="game-icon coordination-icon">🎮</div>
              <div className="card-badge">Memória</div>
            </div>
            <div className="card-content">
              <h3 className="game-title">Jogo da Coordenação</h3>
              <p className="game-description">
                Desenvolva sua memória e coordenação motora através de sequências 
                coloridas. Um jogo clássico reinventado para o aprendizado moderno.
              </p>
              <div className="game-features">
                <div className="feature-item">
                  <span className="feature-icon">🧠</span>
                  <span>Treino de memória</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎵</span>
                  <span>Sincronização áudio-visual</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🏆</span>
                  <span>Ranking de pontuação</span>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button className="play-button coordination-btn">
                <span>Começar Jogo</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Organize a Bagunça */}
          <div className="game-card organize-card" onClick={() => onNavigate('organize')}>
            <div className="card-header">
              <div className="game-icon organize-icon">📁</div>
              <div className="card-badge">Organização</div>
            </div>
            <div className="card-content">
              <h3 className="game-title">Organize a Bagunça</h3>
              <p className="game-description">
                Aprenda a organizar arquivos e pastas de forma eficiente. 
                Arraste arquivos para as pastas corretas e desenvolva habilidades de organização digital.
              </p>
              <div className="game-features">
                <div className="feature-item">
                  <span className="feature-icon">📂</span>
                  <span>Organização de arquivos</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎯</span>
                  <span>Drag & Drop interativo</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">⚡</span>
                  <span>Múltiplos níveis</span>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button className="play-button organize-btn">
                <span>Começar Jogo</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Por que escolher nossa plataforma?</h2>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Foco Educacional</h3>
            <p>Jogos desenvolvidos especificamente para o aprendizado de informática</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Progresso Rastreável</h3>
            <p>Acompanhe seu desenvolvimento através de rankings e estatísticas</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Interface Moderna</h3>
            <p>Design intuitivo e responsivo para uma experiência agradável</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="brand-icon">💻</div>
            <span className="brand-text">Info.DBeta</span>
          </div>
          <p className="footer-description">
            Desenvolvido para democratizar o acesso ao conhecimento em informática 
            através de jogos educacionais interativos e divertidos.
          </p>
          <div className="footer-links">
            <a href="#about" className="footer-link">Sobre</a>
            <a href="#games" className="footer-link">Jogos</a>
            <a href="#contact" className="footer-link">Contato</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Info.DBeta. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Estilos CSS */}
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .home-container {
          min-height: 100vh;
          background: #0a0a0a;
          color: #ffffff;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          overflow-x: hidden;
        }

        /* Navigation */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          font-size: 1.25rem;
        }

        .brand-icon {
          font-size: 1.5rem;
        }

        .brand-text {
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
        }

        .nav-link {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .nav-link:hover {
          color: #667eea;
        }

        /* Hero Section */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 8rem 2rem 4rem;
          max-width: 1200px;
          margin: 0 auto;
          gap: 4rem;
        }

        .hero-content {
          flex: 1;
          max-width: 600px;
        }

        .hero-badge {
          display: inline-block;
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(102, 126, 234, 0.2);
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          color: #ffffff;
        }

        .gradient-text {
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: 1.125rem;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .hero-stats {
          display: flex;
          gap: 2rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: #667eea;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .hero-visual {
          flex: 1;
          position: relative;
          height: 400px;
        }

        .floating-cards {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .floating-card {
          position: absolute;
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          backdrop-filter: blur(10px);
          animation: float 6s ease-in-out infinite;
        }

        .card-1 {
          top: 20%;
          left: 20%;
          animation-delay: 0s;
        }

        .card-2 {
          top: 50%;
          right: 20%;
          animation-delay: 2s;
        }

        .card-3 {
          bottom: 20%;
          left: 50%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        /* Sections */
        .games-section, .features-section {
          padding: 6rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #ffffff;
        }

        .section-subtitle {
          font-size: 1.125rem;
          color: rgba(255, 255, 255, 0.7);
          max-width: 600px;
          margin: 0 auto;
        }

        /* Games Grid */
        .games-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
        }

        .game-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1.5rem;
          padding: 2rem;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .game-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #667eea, #764ba2);
        }

        .game-card:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(102, 126, 234, 0.3);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .game-icon {
          font-size: 3rem;
          width: 80px;
          height: 80px;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(102, 126, 234, 0.2);
        }

        .card-badge {
          background: rgba(102, 126, 234, 0.2);
          color: #667eea;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .game-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #ffffff;
        }

        .game-description {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .game-features {
          margin-bottom: 2rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .feature-icon {
          font-size: 1.25rem;
        }

        .play-button {
          width: 100%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .play-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }

        /* Features Section */
        .features-section {
          background: rgba(255, 255, 255, 0.02);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          text-align: center;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-4px);
        }

        .feature-card .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #ffffff;
        }

        .feature-card p {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
        }

        /* Footer */
        .footer {
          background: rgba(0, 0, 0, 0.5);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 3rem 2rem 1rem;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-weight: 700;
          font-size: 1.25rem;
        }

        .footer-description {
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .footer-links {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .footer-link {
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-link:hover {
          color: #667eea;
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 1rem;
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.875rem;
        }

        /* Estilos para o jogo Organize a Bagunça */
        .organize-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: 1px solid rgba(102, 126, 234, 0.3);
        }

        .organize-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
        }

        .organize-icon {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .organize-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .organize-btn:hover {
          background: linear-gradient(135deg, #5a67d8, #6b46c1);
          transform: translateY(-2px);
        }

        /* Responsividade */
        @media (max-width: 768px) {
          .navbar {
            padding: 1rem;
          }

          .nav-links {
            display: none;
          }

          .hero {
            flex-direction: column;
            text-align: center;
            padding: 6rem 1rem 2rem;
            gap: 2rem;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-stats {
            justify-content: center;
          }

          .games-grid {
            grid-template-columns: 1fr;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .footer-links {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default HomePage;
