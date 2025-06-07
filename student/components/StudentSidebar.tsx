
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../App';
import { NavItem } from '../../types';
import { IconHome, IconWeightLiftingUp, IconCalendar, IconTrendingUp, IconLogout } from '../../constants';

const StudentSidebar: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/aluno/dashboard', icon: <IconHome className="w-5 h-5" /> },
    { name: 'Meus Treinos', path: '/aluno/meus-treinos', icon: <IconWeightLiftingUp className="w-5 h-5" /> },
    { name: 'Minhas Aulas', path: '/aluno/minhas-aulas', icon: <IconCalendar className="w-5 h-5" /> },
    { name: 'Meu Desempenho', path: '/aluno/meu-desempenho', icon: <IconTrendingUp className="w-5 h-5" /> },
  ];

  return (
    <div className="w-64 bg-light-bg-card p-4 flex flex-col h-full border-r border-light-border shadow-sm dark:bg-dark-card dark:border-dark-border">
      <div className="text-2xl font-bold text-brand-orange mb-6 text-center pt-2">
        Aluno
      </div>
       <div className="mb-8 text-center">
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name} className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-brand-orange" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mx-auto border-2 border-light-border dark:border-dark-border">
            <IconHome className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
        )}
        <p className="mt-2 text-sm font-medium text-dark-text dark:text-light-text">{user?.name}</p>
      </div>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors ${
                    isActive 
                      ? 'bg-brand-orange text-white shadow-md' 
                      : 'text-medium-text-light dark:text-medium-text hover:text-dark-text dark:hover:text-light-text'
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/60 text-medium-text-light dark:text-medium-text hover:text-dark-text dark:hover:text-light-text w-full transition-colors"
        >
          <IconLogout className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default StudentSidebar;
