import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [showBefore, setShowBefore] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState('projetos');
  const projectsRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  // Array de projetos - você pode adicionar até 50 projetos aqui
  const projects = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    title: `Projeto ${i + 1}`,
    description: 'Adesivagem automotiva completa',
    beforeImage: `/images/antes${i + 1}.jpg`,
    afterImage: `/images/depois${i + 1}.jpg`,
  }));

  // Scroll spy para ativar menu
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);

      const sections = [
        { ref: projectsRef, name: 'projetos' },
        { ref: aboutRef, name: 'sobre' },
        { ref: contactRef, name: 'contato' },
      ];

      const current = sections.find(section => {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom > 100;
        }
        return false;
      });

      if (current) {
        setActiveSection(current.name);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animação de fade-in ao scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const openModal = (project) => {
    setCurrentProject(project);
    setShowBefore(true);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentProject(null);
    document.body.style.overflow = 'auto';
  };

  const nextProject = () => {
    const currentIndex = projects.findIndex(p => p.id === currentProject.id);
    const nextIndex = (currentIndex + 1) % projects.length;
    setCurrentProject(projects[nextIndex]);
    setShowBefore(true);
  };

  const prevProject = () => {
    const currentIndex = projects.findIndex(p => p.id === currentProject.id);
    const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
    setCurrentProject(projects[prevIndex]);
    setShowBefore(true);
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="App" data-testid="negao-adesivos-app">
      {/* Header */}
      <header className="header" data-testid="main-header">
        <div className="header-content">
          <div className="logo" data-testid="company-logo">
            <img src="/images/logo-negao-adesivo.png" alt="Negão Adesivos" onError={(e) => {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="50" viewBox="0 0 150 50"%3E%3Ctext x="10" y="35" font-family="Poppins, sans-serif" font-size="24" font-weight="bold" fill="%23ffeb3b"%3ENegão Adesivos%3C/text%3E%3C/svg%3E';
            }} />
          </div>
          <nav className="nav" data-testid="main-navigation">
            <a
              href="#projetos"
              className={activeSection === 'projetos' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(projectsRef);
              }}
              data-testid="nav-projetos"
            >
              Projetos
            </a>
            <a
              href="#sobre"
              className={activeSection === 'sobre' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(aboutRef);
              }}
              data-testid="nav-sobre"
            >
              Sobre Nós
            </a>
            <a
              href="#contato"
              className={activeSection === 'contato' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(contactRef);
              }}
              data-testid="nav-contato"
            >
              Contato
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero" data-testid="hero-section">
        <div className="hero-content fade-in">
          <h1 className="hero-title" data-testid="hero-title">
            Transformamos Ideias em Adesivos Incríveis
          </h1>
          <p className="hero-subtitle" data-testid="hero-subtitle">
            Especialistas em adesivagem automotiva, envelopamento e comunicação visual em Rio Largo - AL
          </p>
          <button
            className="cta-button"
            onClick={() => scrollToSection(projectsRef)}
            data-testid="cta-ver-projetos"
          >
            Ver Projetos
          </button>
        </div>
      </section>

      {/* Galeria de Projetos */}
      <section className="projects-section" ref={projectsRef} id="projetos" data-testid="projects-section">
        <div className="container">
          <h2 className="section-title fade-in" data-testid="projects-title">Nossos Projetos</h2>
          <p className="section-subtitle fade-in" data-testid="projects-subtitle">
            Confira alguns dos trabalhos que realizamos com excelência
          </p>
          <div className="projects-grid">
            {projects.map((project) => (
              <div
                key={project.id}
                className="project-card fade-in"
                onClick={() => openModal(project)}
                data-testid={`project-card-${project.id}`}
              >
                <div className="project-image-wrapper">
                  <img
                    src={project.beforeImage}
                    alt={project.title}
                    className="project-image"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/400x300/1a1a1a/ffeb3b?text=Projeto+${project.id}`;
                    }}
                  />
                  <div className="project-overlay">
                    <div className="overlay-content">
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      <span className="view-more">Ver Antes & Depois →</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Sobre Nós */}
      <section className="about-section" ref={aboutRef} id="sobre" data-testid="about-section">
        <div className="container">
          <h2 className="section-title fade-in" data-testid="about-title">Sobre Nós</h2>
          <div className="about-content fade-in">
            <p data-testid="about-text">
              A Negão Adesivos é referência em adesivagem automotiva e comunicação visual em Rio Largo - AL.
              Com anos de experiência no mercado, oferecemos serviços de alta qualidade em envelopamento,
              plotagem e personalização de veículos.
            </p>
            <p data-testid="about-text-2">
              Nossa equipe especializada utiliza os melhores materiais e técnicas do mercado para garantir
              resultados impecáveis e duradouros. Transformamos seu veículo em uma verdadeira obra de arte!
            </p>
          </div>
        </div>
      </section>

      {/* Seção Contato */}
      <section className="contact-section" ref={contactRef} id="contato" data-testid="contact-section">
        <div className="container">
          <h2 className="section-title fade-in" data-testid="contact-title">Entre em Contato</h2>
          <div className="contact-content fade-in">
            <p data-testid="contact-text">
              Endereço: Rio Largo - AL<br />
              Telefone: (82) 98006-9929<br />
              Email: contato@negaoadesivos.com.br
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" data-testid="main-footer">
        <div className="container">
          <p>© 2025 Negão Adesivos. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Back to Top */}
      {showBackToTop && (
        <button className="back-to-top" onClick={scrollToTop} data-testid="back-to-top">
          ↑
        </button>
      )}

      {/* Modal Antes & Depois */}
      {showModal && currentProject && (
        <div className="modal-overlay" onClick={closeModal} data-testid="project-modal">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal} data-testid="modal-close">×</button>
            <h3>{currentProject.title}</h3>
            <div className="modal-images">
              <img
                src={showBefore ? currentProject.beforeImage : currentProject.afterImage}
                alt={currentProject.title}
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/600x400/1a1a1a/ffeb3b?text=${showBefore ? 'Antes' : 'Depois'}`;
                }}
              />
              <button
                className="toggle-btn"
                onClick={() => setShowBefore(!showBefore)}
                data-testid="toggle-before-after"
              >
                {showBefore ? 'Ver Depois' : 'Ver Antes'}
              </button>
            </div>
            <div className="modal-navigation">
              <button onClick={prevProject} data-testid="modal-prev">← Anterior</button>
              <button onClick={nextProject} data-testid="modal-next">Próximo →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
