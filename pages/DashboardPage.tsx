import React from 'react';
import StatCard from '../components/StatCard';
import ScheduledClassItem from '../components/ScheduledClassItem';
import { dashboardStats, scheduledClassesData } from '../data/mockData';
import { useAuth } from '../App';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 sm:space-y-8">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-dark-text dark:text-light-text mb-4 sm:mb-6">
        Bem-vindo(a), <span className="text-brand-orange">{user?.name?.split(' ')[0] || 'Admin'}</span>! 👋
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-dark-text dark:text-light-text mb-3 sm:mb-4">Próximas Aulas Agendadas</h3>
        <div className="bg-light-bg-card dark:bg-dark-card p-2 sm:p-4 rounded-xl shadow-lg">
            {scheduledClassesData.length > 0 ? (
            scheduledClassesData.map((sClass) => (
                <ScheduledClassItem key={sClass.id} sClass={sClass} />
            ))
            ) : (
            <p className="text-medium-text-light dark:text-medium-text p-4 text-center">Nenhuma aula agendada no momento.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;