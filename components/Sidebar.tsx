import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { NavItem } from '../types';
import { IconDashboard, IconUsers, IconWeightLiftingUp, IconCalendar, IconLogout } from '../constants.tsx';

const Sidebar: React.FC = () => {
  const { logout, isMobileSidebarOpen, toggleMobileSidebar } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (isMobileSidebarOpen) toggleMobileSidebar(); // Close sidebar if open
  };

  const handleNavLinkClick = () => {
    if (isMobileSidebarOpen) {
      toggleMobileSidebar();
    }
  };

  const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: <IconDashboard className="w-5 h-5" /> },
    { name: 'Alunos', path: '/alunos', icon: <IconUsers className="w-5 h-5" /> },
    { name: 'Treinos', path: '/treinos', icon: <IconWeightLiftingUp className="w-5 h-5" /> },
    { name: 'Agenda', path: '/agenda', icon: <IconCalendar className="w-5 h-5" /> },
  ];

  return (
    <div 
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-light-bg-card p-4 flex flex-col h-full border-r border-light-border shadow-lg 
                 dark:bg-dark-card dark:border-dark-border transform transition-transform duration-300 ease-in-out 
                 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                 md:relative md:translate-x-0 md:shadow-sm md:flex`}
    >
      <div className="text-2xl font-bold text-brand-orange mb-10 text-center pt-2">
        12/8 Academia
      </div>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2">
              <NavLink
                to={item.path}
                onClick={handleNavLinkClick}
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

export default Sidebar;