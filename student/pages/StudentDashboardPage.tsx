
import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../../App';
import { studentsData, trainingsData, scheduledClassesData, motivationalMessages } from '../../data/mockData';
import { Student, Training, ScheduledClass } from '../../types';
import { IconWeightLiftingUp, IconCalendar, IconCheckCircle, IconListUl, IconSparkles, IconChevronRight } from '../../constants';
import { Link } from 'react-router-dom';

const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [currentMotivationalMsg, setCurrentMotivationalMsg] = useState('');

  const daysOfWeek = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

  useEffect(() => {
    setCurrentMotivationalMsg(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]);
  }, []);

  const studentData = useMemo(() => {
    return studentsData.find(s => s.id === user?.studentId);
  }, [user?.studentId]);

  const currentTraining = useMemo(() => {
    if (!studentData?.currentTrainingId) return null;
    return trainingsData.find(t => t.id === studentData.currentTrainingId);
  }, [studentData]);

  const nextClass = useMemo(() => {
    if (!studentData?.enrolledClassIds || studentData.enrolledClassIds.length === 0) return null;
    const enrolled = scheduledClassesData.filter(sc => studentData.enrolledClassIds.includes(sc.id));
    return enrolled.sort((a,b) => {
      const dayIndexA = daysOfWeek.indexOf(a.dayOfWeek);
      const dayIndexB = daysOfWeek.indexOf(b.dayOfWeek);
      if(dayIndexA !== dayIndexB) return dayIndexA - dayIndexB;
      return a.classTime.localeCompare(b.classTime);
    })[0];
  }, [studentData, daysOfWeek]); 
  
  const classesThisWeekCount = useMemo(() => {
    if (!studentData?.enrolledClassIds) return 0;
    return studentData.enrolledClassIds.length;
  }, [studentData]);

  const attendanceThisMonth = useMemo(() => {
    if (!studentData?.enrolledClassIds) return 0;
    return Math.floor(studentData.enrolledClassIds.length * 0.75);
  }, [studentData]);


  if (!studentData) {
    return <div className="text-center p-8">Carregando dados do aluno...</div>;
  }
  
  const firstName = studentData.name.split(' ')[0];

  return (
    <div className="space-y-6 sm:space-y-8">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-dark-text dark:text-light-text">
        Bem-vindo(a) de volta, <span className="text-brand-orange">{firstName}</span>! 👋
      </h2>

      <div className="bg-light-bg-card dark:bg-dark-card p-4 sm:p-5 rounded-xl shadow-lg flex items-center space-x-3 border border-brand-orange/30 dark:border-brand-orange/50">
        <IconSparkles className="w-7 h-7 sm:w-8 sm:h-8 text-brand-orange flex-shrink-0" />
        <p className="text-xs sm:text-sm text-dark-text dark:text-light-text italic">{currentMotivationalMsg}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Link to="/aluno/meus-treinos" className="bg-light-bg-card dark:bg-dark-card p-4 sm:p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center text-brand-orange mb-2 sm:mb-3">
              <IconWeightLiftingUp className="w-6 h-6 sm:w-7 sm:h-7 mr-2" />
              <h3 className="text-md sm:text-lg font-semibold">Seu Treino Atual</h3>
            </div>
            {currentTraining ? (
              <>
                <p className="text-lg sm:text-xl font-bold text-dark-text dark:text-light-text mb-1">{currentTraining.name}</p>
                <p className="text-xs text-medium-text-light dark:text-medium-text">
                  {currentTraining.objective.join(', ')}
                </p>
                <p className="text-xs text-medium-text-light dark:text-medium-text mt-1">
                  {currentTraining.splits.length} {currentTraining.splits.length > 1 ? 'divisões' : 'divisão'}
                </p>
              </>
            ) : (
              <p className="text-sm text-dark-text dark:text-light-text">Nenhum treino ativo.</p>
            )}
          </div>
          <div className="mt-3 sm:mt-4 text-xs text-brand-orange font-medium flex items-center">
            Ver meus treinos <IconChevronRight className="w-4 h-4 ml-1" />
          </div>
        </Link>

        <Link to="/aluno/minhas-aulas" className="bg-light-bg-card dark:bg-dark-card p-4 sm:p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center text-brand-orange mb-2 sm:mb-3">
              <IconCalendar className="w-6 h-6 sm:w-7 sm:h-7 mr-2" />
              <h3 className="text-md sm:text-lg font-semibold">Próxima Aula</h3>
            </div>
            {nextClass ? (
              <>
                <p className="text-lg sm:text-xl font-bold text-dark-text dark:text-light-text mb-1">{nextClass.name}</p>
                <p className="text-xs text-medium-text-light dark:text-medium-text">
                  {nextClass.dayOfWeek}, {nextClass.classTime} com {nextClass.teacher}
                </p>
              </>
            ) : (
              <p className="text-sm text-dark-text dark:text-light-text">Nenhuma aula agendada.</p>
            )}
          </div>
           <div className="mt-3 sm:mt-4 text-xs text-brand-orange font-medium flex items-center">
            Ver minhas aulas <IconChevronRight className="w-4 h-4 ml-1" />
          </div>
        </Link>

        <div className="bg-light-bg-card dark:bg-dark-card p-4 sm:p-5 rounded-xl shadow-lg">
          <div className="flex items-center text-green-500 dark:text-green-400 mb-2 sm:mb-3">
            <IconListUl className="w-6 h-6 sm:w-7 sm:h-7 mr-2" />
            <h3 className="text-md sm:text-lg font-semibold">Aulas na Semana</h3>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-dark-text dark:text-light-text">{classesThisWeekCount}</p>
          <p className="text-xs text-medium-text-light dark:text-medium-text">aulas agendadas (simulado)</p>
        </div>

        <div className="bg-light-bg-card dark:bg-dark-card p-4 sm:p-5 rounded-xl shadow-lg">
          <div className="flex items-center text-blue-500 dark:text-blue-400 mb-2 sm:mb-3">
            <IconCheckCircle className="w-6 h-6 sm:w-7 sm:h-7 mr-2" />
            <h3 className="text-md sm:text-lg font-semibold">Presenças no Mês</h3>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-dark-text dark:text-light-text">{attendanceThisMonth}</p>
          <p className="text-xs text-medium-text-light dark:text-medium-text">aulas participadas (simulado)</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;