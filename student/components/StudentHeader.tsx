
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../App';
import { IconUserCircle } from '../../constants';

// Basic Hamburger Icon SVG (re-declared for standalone component, or import from constants if moved there)
const IconMenu = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const StudentHeader: React.FC = () => {
  const { user, toggleMobileSidebar } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/aluno/dashboard')) return 'Dashboard';
    if (path.includes('/aluno/meus-treinos')) return 'Meus Treinos';
    if (path.includes('/aluno/minhas-aulas')) return 'Minhas Aulas';
    if (path.includes('/aluno/meu-desempenho')) return 'Desempenho';
    return 'Área do Aluno';
  };

  const firstName = user?.name?.split(' ')[0] || 'Aluno(a)';

  return (
    <header className="h-16 bg-light-bg-card shadow-sm flex items-center justify-between px-4 sm:px-6 border-b border-light-border dark:bg-dark-card dark:border-dark-border sticky top-0 z-10">
      <div className="flex items-center">
        <button 
          onClick={toggleMobileSidebar} 
          className="md:hidden text-dark-text dark:text-light-text mr-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Abrir menu"
        >
          <IconMenu className="w-6 h-6" />
        </button>
        <h1 className="text-lg sm:text-xl font-semibold text-dark-text dark:text-light-text">{getPageTitle()}</h1>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-3">
        <span className="text-xs sm:text-sm text-medium-text-light dark:text-medium-text hidden xs:inline">Olá, {firstName}! 👋</span>
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full" />
        ) : (
          <IconUserCircle className="w-8 h-8 text-medium-text-light dark:text-medium-text" />
        )}
      </div>
    </header>
  );
};

export default StudentHeader;