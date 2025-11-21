import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { Clients } from './components/Clients';
import { Contact } from './components/Contact';
import { CasesPage } from './components/CasesPage';
import { ScrollToTop } from './components/ScrollToTop';
import { LoadingScreen } from './components/LoadingScreen';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('inicio');
  const [currentPage, setCurrentPage] = useState<'home' | 'cases'>('home');

  // Detectar a rota inicial
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/cases') {
      setCurrentPage('cases');
      setActiveSection('cases');
    } else {
      setCurrentPage('home');
      // Scroll para a seção baseada na URL
      const sectionMap: { [key: string]: string } = {
        '/': 'inicio',
        '/quem-somos': 'quem-somos',
        '/o-que-fazemos': 'servicos',
        '/contato': 'contato',
      };
      const section = sectionMap[path] || 'inicio';
      setActiveSection(section);
      
      // Scroll após o loading
      if (!isLoading && section !== 'inicio') {
        setTimeout(() => {
          const element = document.getElementById(section);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  }, [isLoading]);

  // Atualizar URL baseado no scroll
  useEffect(() => {
    if (currentPage === 'home') {
      const handleScroll = () => {
        const sections = ['inicio', 'quem-somos', 'servicos', 'contato'];
        const scrollPosition = window.scrollY + 100;

        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const { offsetTop, offsetHeight } = element;
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              setActiveSection(section);
              
              // Atualizar URL sem recarregar a página
              const pathMap: { [key: string]: string } = {
                'inicio': '/',
                'quem-somos': '/quem-somos',
                'servicos': '/o-que-fazemos',
                'contato': '/contato',
              };
              const newPath = pathMap[section];
              if (window.location.pathname !== newPath) {
                window.history.pushState({}, '', newPath);
              }
              break;
            }
          }
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [currentPage]);

  // Gerenciar navegação do histórico (botão voltar/avançar)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/cases') {
        setCurrentPage('cases');
        setActiveSection('cases');
      } else {
        setCurrentPage('home');
        const sectionMap: { [key: string]: string } = {
          '/': 'inicio',
          '/quem-somos': 'quem-somos',
          '/o-que-fazemos': 'servicos',
          '/contato': 'contato',
        };
        const section = sectionMap[path] || 'inicio';
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToPage = (page: 'home' | 'cases') => {
    setCurrentPage(page);
    if (page === 'cases') {
      setActiveSection('cases');
      window.history.pushState({}, '', '/cases');
    } else {
      setActiveSection('inicio');
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <div className="bg-black text-white min-h-screen">
          <Header activeSection={activeSection} currentPage={currentPage} onNavigate={navigateToPage} />
          <main>
            {currentPage === 'home' ? (
              <>
                <Hero />
                <About />
                <Services />
                <Clients />
                <Contact />
              </>
            ) : (
              <CasesPage />
            )}
          </main>
          <ScrollToTop />
          <Toaster />
        </div>
      )}
    </>
  );
}
