
import React, { useState, useMemo } from 'react';
import { useAuth } from '../../App';
import { studentsData, scheduledClassesData, availableClassesForScheduling } from '../../data/mockData';
import { ScheduledClass, AvailableClass, Student } from '../../types';
import Modal from '../../components/Modal';
import { IconCalendar, IconPlus, IconUsers, IconChevronRight, IconClock, IconInfo } from '../../constants';
import Toast from '../../components/Toast';

// Helper to get day of week index (0 for Domingo, 1 for Segunda, etc.)
const getDayIndex = (dayName: string): number => {
  const lowerDayName = dayName.toLowerCase();
  const days = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  return days.indexOf(lowerDayName);
};

// Helper to format class time for display
const formatClassTime = (dayOfWeek: string, time: string): string => {
  return `${dayOfWeek}, ${time}`;
};

const StudentMyClassesPage: React.FC = () => {
  const { user } = useAuth();
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedAvailableClass, setSelectedAvailableClass] = useState<AvailableClass | null>(null);
  
  const initialEnrolledIds = useMemo(() => studentsData.find(s => s.id === user?.studentId)?.enrolledClassIds || [], [user?.studentId]);
  const [enrolledClassIds, setEnrolledClassIds] = useState<string[]>(initialEnrolledIds);

  const [toastInfo, setToastInfo] = useState({ show: false, message: '', type: 'info' as 'success' | 'error' | 'info' });


  const student = useMemo(() => {
    const baseStudent = studentsData.find(s => s.id === user?.studentId);
    if (baseStudent) {
      return { ...baseStudent, enrolledClassIds: enrolledClassIds };
    }
    return undefined;
  }, [user?.studentId, enrolledClassIds]);


  const myScheduledClasses = useMemo(() => {
    if (!student?.enrolledClassIds) return [];
    return scheduledClassesData
      .filter(sc => student.enrolledClassIds.includes(sc.id))
      .sort((a, b) => { 
        const dayIndexA = getDayIndex(a.dayOfWeek);
        const dayIndexB = getDayIndex(b.dayOfWeek);
        if (dayIndexA !== dayIndexB) return dayIndexA - dayIndexB;
        return a.classTime.localeCompare(b.classTime);
      });
  }, [student]);
  
  const unbookedClasses = useMemo(() => {
    return availableClassesForScheduling.filter(ac => !enrolledClassIds.includes(ac.id) && 
        !(scheduledClassesData.find(sc => sc.name === ac.name && sc.teacher === ac.teacher && sc.dayOfWeek === ac.dayOfWeek && sc.classTime === ac.classTime)?.id)
    );
  }, [enrolledClassIds]);


  const handleScheduleClass = (classToSchedule: AvailableClass) => {
    let existingScheduledClass = scheduledClassesData.find(
      sc => sc.name === classToSchedule.name && 
            sc.teacher === classToSchedule.teacher &&
            sc.dayOfWeek === classToSchedule.dayOfWeek && 
            sc.classTime === classToSchedule.classTime
    );

    let classIdToEnroll = classToSchedule.id;

    if (existingScheduledClass) {
        if (!enrolledClassIds.includes(existingScheduledClass.id)) {
            classIdToEnroll = existingScheduledClass.id;
        } else {
             setToastInfo({ show: true, message: 'Você já está inscrito nesta aula.', type: 'info' });
            return; 
        }
    } else {
         const newMockScheduledClass: ScheduledClass = {
            id: classToSchedule.id, 
            name: classToSchedule.name,
            teacher: classToSchedule.teacher,
            dayOfWeek: classToSchedule.dayOfWeek || 'Não definido',
            classTime: classToSchedule.classTime || 'N/A',
            spotsFilled: 1, 
            totalSpots: classToSchedule.capacity,
            observations: classToSchedule.description
        };
    }

    setEnrolledClassIds(prev => [...prev, classIdToEnroll]);
    setToastInfo({ show: true, message: `Aula "${classToSchedule.name}" agendada!`, type: 'success' });
    setIsScheduleModalOpen(false);
    setSelectedAvailableClass(null);
  };
  
  const handleCancelEnrollment = (classId: string) => {
    if (window.confirm("Tem certeza que deseja cancelar a inscrição nesta aula?")) {
      setEnrolledClassIds(prev => prev.filter(id => id !== classId));
      const aClass = scheduledClassesData.find(c => c.id === classId);
      setToastInfo({ show: true, message: `Inscrição em "${aClass?.name}" cancelada.`, type: 'info' });
    }
  };


  return (
    <div className="space-y-6">
       <Toast 
        message={toastInfo.message} 
        type={toastInfo.type} 
        show={toastInfo.show} 
        onClose={() => setToastInfo(prev => ({ ...prev, show: false }))} 
      />
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-dark-text dark:text-light-text flex items-center">
          <IconCalendar className="w-7 h-7 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-brand-orange" />
          Minhas Aulas
        </h2>
        <button 
          onClick={() => setIsScheduleModalOpen(true)}
          className="w-full sm:w-auto bg-brand-orange hover:bg-orange-600 text-white font-semibold py-2.5 px-4 sm:px-5 rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-sm hover:shadow-md"
        >
          <IconPlus className="w-5 h-5" />
          <span>Agendar Nova Aula</span>
        </button>
      </div>

      {myScheduledClasses.length === 0 ? (
        <div className="bg-light-bg-card dark:bg-dark-card p-6 sm:p-8 rounded-xl shadow-lg text-center">
          <IconCalendar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-lg sm:text-xl font-semibold text-dark-text dark:text-light-text mb-2">Você não está inscrito em nenhuma aula.</p>
          <p className="text-sm text-medium-text-light dark:text-medium-text">Clique em "Agendar Nova Aula" para ver as opções.</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold text-dark-text dark:text-light-text">Suas Aulas Agendadas:</h3>
          {myScheduledClasses.map(sClass => (
            <div key={sClass.id} className="bg-light-bg-card dark:bg-dark-card p-3 sm:p-4 rounded-xl shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 border border-light-border dark:border-dark-border">
              <div className="flex-grow">
                <h4 className="font-semibold text-base sm:text-lg text-brand-orange">{sClass.name}</h4>
                <p className="text-xs sm:text-sm text-medium-text-light dark:text-medium-text">
                  {sClass.teacher} - {formatClassTime(sClass.dayOfWeek, sClass.classTime)}
                </p>
                 {sClass.observations && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">{sClass.observations}</p>}
              </div>
              <div className="flex flex-col items-start sm:items-end gap-2 sm:gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                <div className="text-xs sm:text-sm text-dark-text dark:text-light-text text-left sm:text-right">
                    <p>{sClass.spotsFilled}/{sClass.totalSpots} vagas</p>
                    <div className="w-20 sm:w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                    <div 
                        className={`h-full rounded-full ${sClass.spotsFilled / sClass.totalSpots >= 0.8 ? (sClass.spotsFilled / sClass.totalSpots === 1 ? 'bg-red-500' : 'bg-yellow-500') : 'bg-green-500'}`}
                        style={{ width: `${(sClass.spotsFilled / sClass.totalSpots) * 100}%` }}
                    ></div>
                    </div>
                </div>
                <button 
                    onClick={() => handleCancelEnrollment(sClass.id)}
                    className="text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 py-1 px-2 rounded border border-red-500/50 hover:bg-red-500/10 transition-colors self-start sm:self-auto"
                >
                    Cancelar Inscrição
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isScheduleModalOpen} onClose={() => { setIsScheduleModalOpen(false); setSelectedAvailableClass(null);}} title="Agendar Nova Aula">
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
          {unbookedClasses.length === 0 ? (
            <p className="text-center text-medium-text-light dark:text-medium-text py-4">Nenhuma aula nova disponível no momento.</p>
          ) : (
             unbookedClasses.map(aClass => (
            <div 
                key={aClass.id} 
                className={`p-3 rounded-lg border cursor-pointer transition-all
                            ${selectedAvailableClass?.id === aClass.id 
                                ? 'bg-brand-orange/20 border-brand-orange shadow-md' 
                                : 'bg-gray-50 dark:bg-gray-800/60 border-light-border dark:border-dark-border hover:border-brand-orange/50 dark:hover:border-brand-orange/70'}`}
                onClick={() => setSelectedAvailableClass(aClass)}
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-1 sm:gap-2">
                <div className="flex-grow">
                  <h4 className={`font-semibold text-sm sm:text-base ${selectedAvailableClass?.id === aClass.id ? 'text-brand-orange' : 'text-dark-text dark:text-light-text'}`}>{aClass.name}</h4>
                  <p className="text-xs text-medium-text-light dark:text-medium-text">Com {aClass.teacher}</p>
                   {aClass.dayOfWeek && aClass.classTime && <p className="text-xs text-medium-text-light dark:text-medium-text">{aClass.dayOfWeek}, {aClass.classTime}</p>}
                </div>
                <div className="text-left sm:text-right text-xs mt-1 sm:mt-0 flex-shrink-0">
                    <p className="flex items-center text-medium-text-light dark:text-medium-text"><IconClock className="w-3 h-3 mr-1"/> {aClass.duration}</p>
                    <p className="flex items-center text-medium-text-light dark:text-medium-text"><IconUsers className="w-3 h-3 mr-1"/> Cap: {aClass.capacity}</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{aClass.description}</p>
            </div>
          )))}
          
          {selectedAvailableClass && (
            <div className="mt-4 pt-4 border-t border-light-border dark:border-dark-border flex flex-col sm:flex-row justify-end">
              <button 
                onClick={() => handleScheduleClass(selectedAvailableClass)}
                className="w-full sm:w-auto bg-brand-orange hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <IconCalendar className="w-4 h-4" />
                <span>Confirmar Agendamento</span>
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default StudentMyClassesPage;