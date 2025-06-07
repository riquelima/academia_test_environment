
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../App';
import { IconUserCircle } from '../../constants';

const StudentHeader: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/aluno/dashboard')) return 'Meu Dashboard';
    if (path.includes('/aluno/meus-treinos')) return 'Meus Treinos';
    if (path.includes('/aluno/minhas-aulas')) return 'Minhas Aulas';
    if (path.includes('/aluno/meu-desempenho')) return 'Meu Desempenho';
    return 'Área do Aluno';
  };

  const firstName = user?.name?.split(' ')[0] || 'Aluno(a)';

  return (
    <header className="h-16 bg-light-bg-card shadow-sm flex items-center justify-between px-6 border-b border-light-border dark:bg-dark-card dark:border-dark-border">
      <h1 className="text-xl font-semibold text-dark-text dark:text-light-text">{getPageTitle()}</h1>
      <div className="flex items-center space-x-3">
        <span className="text-sm text-medium-text-light dark:text-medium-text hidden sm:inline">Olá, {firstName}! 👋</span>
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
