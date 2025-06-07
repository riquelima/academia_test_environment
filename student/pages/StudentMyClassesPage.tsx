
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
  
  // Local state for enrolled class IDs to simulate updates
  const initialEnrolledIds = useMemo(() => studentsData.find(s => s.id === user?.studentId)?.enrolledClassIds || [], [user?.studentId]);
  const [enrolledClassIds, setEnrolledClassIds] = useState<string[]>(initialEnrolledIds);

  const [toastInfo, setToastInfo] = useState({ show: false, message: '', type: 'info' as 'success' | 'error' | 'info' });


  const student = useMemo(() => {
    // Find the student and update their enrolledClassIds from local state
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
      .sort((a, b) => { // Sort by day then time
        const dayIndexA = getDayIndex(a.dayOfWeek);
        const dayIndexB = getDayIndex(b.dayOfWeek);
        if (dayIndexA !== dayIndexB) return dayIndexA - dayIndexB;
        return a.classTime.localeCompare(b.classTime);
      });
  }, [student]);
  
  const unbookedClasses = useMemo(() => {
    return availableClassesForScheduling.filter(ac => !enrolledClassIds.includes(ac.id) && 
        !(scheduledClassesData.find(sc => sc.name === ac.name && sc.teacher === ac.teacher && sc.dayOfWeek === ac.dayOfWeek && sc.classTime === ac.classTime)?.id)
    ); // Filter out already scheduled mock classes if they match perfectly
  }, [enrolledClassIds]);


  const handleScheduleClass = (classToSchedule: AvailableClass) => {
     // Check if there's an existing ScheduledClass that matches the AvailableClass
    let existingScheduledClass = scheduledClassesData.find(
      sc => sc.name === classToSchedule.name && 
            sc.teacher === classToSchedule.teacher &&
            sc.dayOfWeek === classToSchedule.dayOfWeek && 
            sc.classTime === classToSchedule.classTime
    );

    let classIdToEnroll = classToSchedule.id;

    if (existingScheduledClass) {
        // If it exists and student is not already enrolled
        if (!enrolledClassIds.includes(existingScheduledClass.id)) {
            classIdToEnroll = existingScheduledClass.id;
        } else {
             setToastInfo({ show: true, message: 'Você já está inscrito nesta aula.', type: 'info' });
            return; // Already enrolled
        }
    } else {
        // If it doesn't exist, we'd typically create a new ScheduledClass instance.
        // For this mock, we'll use the availableClass.id, assuming it can be directly used.
        // Or, if availableClass is distinct, add it to scheduledClassesData (mocking DB insert)
        // For simplicity, we'll assume availableClass.id can be used or we add it to scheduledClassesData
         const newMockScheduledClass: ScheduledClass = {
            id: classToSchedule.id, // Use available class ID
            name: classToSchedule.name,
            teacher: classToSchedule.teacher,
            dayOfWeek: classToSchedule.dayOfWeek || 'Não definido',
            classTime: classToSchedule.classTime || 'N/A',
            spotsFilled: 1, // Student is the first one
            totalSpots: classToSchedule.capacity,
            observations: classToSchedule.description
        };
        // This part is tricky in mock. In a real app, backend handles this.
        // Let's assume we can add to scheduledClassesData if it's not a perfect match.
        // For now, let's just use the classToSchedule.id
        if(!scheduledClassesData.find(sc => sc.id === classToSchedule.id)){
            // Add to mock scheduled classes if not already there by ID
            // scheduledClassesData.push(newMockScheduledClass); // This would modify global mock data, be careful
        }
    }


    setEnrolledClassIds(prev => [...prev, classIdToEnroll]);
    setToastInfo({ show: true, message: `Aula "${classToSchedule.name}" agendada com sucesso!`, type: 'success' });
    setIsScheduleModalOpen(false);
    setSelectedAvailableClass(null);
  };
  
  const handleCancelEnrollment = (classId: string) => {
    if (window.confirm("Tem certeza que deseja cancelar a inscrição nesta aula?")) {
      setEnrolledClassIds(prev => prev.filter(id => id !== classId));
      const aClass = scheduledClassesData.find(c => c.id === classId);
      setToastInfo({ show: true, message: `Inscrição na aula "${aClass?.name}" cancelada.`, type: 'info' });
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
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-dark-text dark:text-light-text flex items-center">
          <IconCalendar className="w-8 h-8 mr-3 text-brand-orange" />
          Minhas Aulas
        </h2>
        <button 
          onClick={() => setIsScheduleModalOpen(true)}
          className="bg-brand-orange hover:bg-orange-600 text-white font-semibold py-2.5 px-5 rounded-lg flex items-center space-x-2 transition-colors shadow-sm hover:shadow-md"
        >
          <IconPlus className="w-5 h-5" />
          <span>Agendar Nova Aula</span>
        </button>
      </div>

      {myScheduledClasses.length === 0 ? (
        <div className="bg-light-bg-card dark:bg-dark-card p-8 rounded-xl shadow-lg text-center">
          <IconCalendar className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-xl font-semibold text-dark-text dark:text-light-text mb-2">Você não está inscrito em nenhuma aula.</p>
          <p className="text-medium-text-light dark:text-medium-text">Clique em "Agendar Nova Aula" para ver as opções disponíveis.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-dark-text dark:text-light-text">Suas Aulas Agendadas:</h3>
          {myScheduledClasses.map(sClass => (
            <div key={sClass.id} className="bg-light-bg-card dark:bg-dark-card p-4 rounded-xl shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border border-light-border dark:border-dark-border">
              <div>
                <h4 className="font-semibold text-lg text-brand-orange">{sClass.name}</h4>
                <p className="text-sm text-medium-text-light dark:text-medium-text">
                  {sClass.teacher} - {formatClassTime(sClass.dayOfWeek, sClass.classTime)}
                </p>
                 {sClass.observations && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">{sClass.observations}</p>}
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="text-sm text-dark-text dark:text-light-text text-left sm:text-right">
                    <p>{sClass.spotsFilled}/{sClass.totalSpots} vagas</p>
                    <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                    <div 
                        className={`h-full rounded-full ${sClass.spotsFilled / sClass.totalSpots >= 0.8 ? (sClass.spotsFilled / sClass.totalSpots === 1 ? 'bg-red-500' : 'bg-yellow-500') : 'bg-green-500'}`}
                        style={{ width: `${(sClass.spotsFilled / sClass.totalSpots) * 100}%` }}
                    ></div>
                    </div>
                </div>
                <button 
                    onClick={() => handleCancelEnrollment(sClass.id)}
                    className="text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 py-1 px-2 rounded border border-red-500/50 hover:bg-red-500/10 transition-colors"
                >
                    Cancelar Inscrição
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal to Schedule New Class */}
      <Modal isOpen={isScheduleModalOpen} onClose={() => { setIsScheduleModalOpen(false); setSelectedAvailableClass(null);}} title="Agendar Nova Aula">
        <div className="space-y-3 max-h-[70vh] overflow-y-auto">
          {unbookedClasses.length === 0 ? (
            <p className="text-center text-medium-text-light dark:text-medium-text py-4">Todas as aulas disponíveis já foram agendadas ou você já está inscrito.</p>
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
              <div className="flex justify-between items-start">
                <div>
                  <h4 className={`font-semibold ${selectedAvailableClass?.id === aClass.id ? 'text-brand-orange' : 'text-dark-text dark:text-light-text'}`}>{aClass.name}</h4>
                  <p className="text-xs text-medium-text-light dark:text-medium-text">Com {aClass.teacher}</p>
                   {aClass.dayOfWeek && aClass.classTime && <p className="text-xs text-medium-text-light dark:text-medium-text">{aClass.dayOfWeek}, {aClass.classTime}</p>}
                </div>
                <div className="text-right text-xs">
                    <p className="flex items-center text-medium-text-light dark:text-medium-text"><IconClock className="w-3 h-3 mr-1"/> {aClass.duration}</p>
                    <p className="flex items-center text-medium-text-light dark:text-medium-text"><IconUsers className="w-3 h-3 mr-1"/> Cap: {aClass.capacity}</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{aClass.description}</p>
            </div>
          )))}
          
          {selectedAvailableClass && (
            <div className="mt-4 pt-4 border-t border-light-border dark:border-dark-border flex justify-end">
              <button 
                onClick={() => handleScheduleClass(selectedAvailableClass)}
                className="bg-brand-orange hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
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
