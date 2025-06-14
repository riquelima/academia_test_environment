
import React, { useMemo } from 'react';
import { useAuth } from '../../App';
import { studentsData } from '../../data/mockData';
import { IconTrendingUp, IconCheckCircle, IconWeightLiftingUp, IconInfo } from '../../constants';

const StudentPerformancePage: React.FC = () => {
  const { user } = useAuth();

  const student = useMemo(() => {
    return studentsData.find(s => s.id === user?.studentId);
  }, [user?.studentId]);

  const trainingsCompleted = useMemo(() => {
    return student?.assignedTrainingIds ? Math.floor(student.assignedTrainingIds.length * 0.5) : 0;
  }, [student]);

  const classesAttended = useMemo(() => {
    return student?.enrolledClassIds ? Math.floor(student.enrolledClassIds.length * 0.75) : 0;
  }, [student]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-dark-text dark:text-light-text flex items-center">
        <IconTrendingUp className="w-7 h-7 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-brand-orange" />
        Meu Desempenho
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-light-bg-card dark:bg-dark-card p-4 sm:p-6 rounded-xl shadow-lg">
          <div className="flex items-center text-brand-orange mb-2 sm:mb-3">
            <IconWeightLiftingUp className="w-6 h-6 sm:w-7 sm:h-7 mr-2" />
            <h3 className="text-md sm:text-lg font-semibold">Treinos Completados</h3>
          </div>
          <p className="text-3xl sm:text-4xl font-bold text-dark-text dark:text-light-text">{trainingsCompleted}</p>
          <p className="text-xs sm:text-sm text-medium-text-light dark:text-medium-text">treinos finalizados (simulado)</p>
        </div>

        <div className="bg-light-bg-card dark:bg-dark-card p-4 sm:p-6 rounded-xl shadow-lg">
          <div className="flex items-center text-green-500 dark:text-green-400 mb-2 sm:mb-3">
            <IconCheckCircle className="w-6 h-6 sm:w-7 sm:h-7 mr-2" />
            <h3 className="text-md sm:text-lg font-semibold">Aulas Frequentadas</h3>
          </div>
          <p className="text-3xl sm:text-4xl font-bold text-dark-text dark:text-light-text">{classesAttended}</p>
          <p className="text-xs sm:text-sm text-medium-text-light dark:text-medium-text">aulas participadas (simulado)</p>
        </div>
      </div>

      <div className="bg-light-bg-card dark:bg-dark-card p-4 sm:p-6 rounded-xl shadow-lg">
        <h3 className="text-lg sm:text-xl font-semibold text-dark-text dark:text-light-text mb-3 sm:mb-4">Frequência Semanal</h3>
        <div className="bg-gray-100 dark:bg-dark-border p-6 sm:p-8 rounded-lg text-center">
          <IconInfo className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
          <p className="text-sm text-medium-text-light dark:text-medium-text">
            Gráficos detalhados de frequência e progresso estarão disponíveis em breve!
          </p>
        </div>
      </div>
       <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 dark:border-blue-400 rounded-md">
            <div className="flex">
                <div className="flex-shrink-0">
                    <IconInfo className="h-5 w-5 text-blue-500 dark:text-blue-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                        Os dados de desempenho apresentados são simulados para fins de demonstração.
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default StudentPerformancePage;