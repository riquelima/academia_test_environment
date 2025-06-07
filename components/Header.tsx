import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { IconUserCircle } from '../constants.tsx'; 

const Header: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/alunos') && path.includes('/novo')) return 'Adicionar Novo Aluno';
    if (path.includes('/alunos')) return 'Gerenciamento de Alunos';
    if (path.includes('/treinos')) return 'Gerenciamento de Treinos';
    if (path.includes('/agenda')) return 'Agendamento de Aulas';
    return '12/8 Academia'; // Updated App Name
  };

  return (
    <header className="h-16 bg-light-bg-card shadow-sm flex items-center justify-between px-6 border-b border-light-border dark:bg-dark-card dark:border-dark-border">
      <h1 className="text-xl font-semibold text-dark-text dark:text-light-text">{getPageTitle()}</h1>
      <div className="flex items-center space-x-3">
        <span className="text-sm text-medium-text-light dark:text-medium-text">Olá, {user?.name || 'Administrador'}</span>
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full" />
        ) : (
          <IconUserCircle className="w-8 h-8 text-medium-text-light dark:text-medium-text" />
        )}
      </div>
    </header>
  );
};

export default Header;