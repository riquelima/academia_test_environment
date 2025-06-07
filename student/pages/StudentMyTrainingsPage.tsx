
import React, { useState, useMemo } from 'react';
import { useAuth } from '../../App';
import { studentsData, trainingsData } from '../../data/mockData';
import { Training, Exercise } from '../../types';
import Modal from '../../components/Modal';
import { IconWeightLiftingUp, IconEye, IconChevronRight, IconListUl, IconFire, IconClock, IconPlay } from '../../constants';

const TrainingDetailModal: React.FC<{ training: Training | null; onClose: () => void }> = ({ training, onClose }) => {
  if (!training) return null;

  return (
    <Modal isOpen={!!training} onClose={onClose} title={`Detalhes: ${training.name}`}>
      <div className="space-y-4 text-sm">
        <div className="relative h-40 w-full rounded-lg overflow-hidden mb-3">
            <img 
                src={training.imageUrl || 'https://source.unsplash.com/500x300/?fitness,gym'} 
                alt={training.name} 
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-3 flex flex-col justify-end">
                <h3 className="text-md font-semibold text-white">{training.name}</h3>
            </div>
        </div>

        <div className="mb-1">
            <strong className="text-medium-text-light dark:text-medium-text">Objetivos:</strong>
            <div className="flex flex-wrap gap-1 mt-1">
                {training.objective.map(obj => (
                    <span key={obj} className="px-2 py-1 text-xs bg-brand-orange/10 dark:bg-brand-orange/20 text-brand-orange rounded-full border border-brand-orange/30 dark:border-brand-orange/40">
                        {obj}
                    </span>
                ))}
            </div>
        </div>
         <div className="flex items-center space-x-4 text-xs text-medium-text-light dark:text-medium-text">
            {training.duration && <span className="flex items-center"><IconClock className="w-3.5 h-3.5 mr-1" /> {training.duration}</span>}
            {training.calories && <span className="flex items-center"><IconFire className="w-3.5 h-3.5 mr-1" /> {training.calories}</span>}
            <span className="flex items-center"><IconListUl className="w-3.5 h-3.5 mr-1" /> {training.splits.length} Divisões</span>
        </div>
        
        <div className="space-y-3 pt-3 border-t border-light-border dark:border-dark-border">
          <h4 className="text-base font-semibold text-brand-orange">Divisões e Exercícios:</h4>
          {training.splits.map(split => (
            <div key={split.id} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-light-border dark:border-dark-border">
              <h5 className="text-sm font-medium text-dark-text dark:text-light-text mb-2">{split.customName}</h5>
              {split.exercises.length > 0 ? (
                <ul className="space-y-1.5 text-xs">
                  {split.exercises.map(ex => (
                    <li key={ex.id} className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
                      <strong className="text-dark-text dark:text-light-text">{ex.name}</strong>
                      <p className="text-medium-text-light dark:text-medium-text">
                        Séries: {ex.series || 'N/A'} &bull; Reps: {ex.repetitions || 'N/A'}
                      </p>
                      <p className="text-medium-text-light dark:text-medium-text">
                        Carga: {ex.carga || 'N/A'} &bull; Descanso: {ex.restTime || 'N/A'}
                      </p>
                      {ex.observation && <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-0.5">- {ex.observation}</p>}
                    </li>
                  ))}
                </ul>
              ) : ( <p className="text-xs text-medium-text-light dark:text-medium-text text-center py-1">Nenhum exercício nesta divisão.</p> )}
            </div>
          ))}
        </div>
         <div className="flex justify-end pt-4">
            <button onClick={onClose} className="py-2 px-4 bg-brand-orange hover:bg-orange-600 text-white rounded-lg transition text-xs">Fechar</button>
        </div>
      </div>
    </Modal>
  );
};


const StudentMyTrainingsPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);

  const student = useMemo(() => {
    return studentsData.find(s => s.id === user?.studentId);
  }, [user?.studentId]);

  const assignedTrainings = useMemo(() => {
    if (!student?.assignedTrainingIds) return [];
    return trainingsData.filter(t => student.assignedTrainingIds.includes(t.id));
  }, [student]);

  const currentTrainingId = student?.currentTrainingId;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-semibold text-dark-text dark:text-light-text flex items-center">
          <IconWeightLiftingUp className="w-8 h-8 mr-3 text-brand-orange" />
          Meus Treinos
        </h2>
      </div>

      {assignedTrainings.length === 0 ? (
        <div className="bg-light-bg-card dark:bg-dark-card p-8 rounded-xl shadow-lg text-center">
          <IconWeightLiftingUp className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-xl font-semibold text-dark-text dark:text-light-text mb-2">Nenhum treino atribuído.</p>
          <p className="text-medium-text-light dark:text-medium-text">Entre em contato com seu instrutor para receber um plano de treino.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignedTrainings.map(training => (
            <div 
              key={training.id} 
              className={`bg-light-bg-card dark:bg-dark-card rounded-xl shadow-lg overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl dark:hover:shadow-brand-orange/20 
                          ${training.id === currentTrainingId ? 'border-2 border-brand-orange dark:border-orange-400' : 'border border-transparent'}`}
            >
              <div className="relative h-40 w-full">
                <img 
                    src={training.imageUrl || 'https://source.unsplash.com/500x300/?workout,gym'} 
                    alt={training.name} 
                    className="absolute inset-0 w-full h-full object-cover" 
                />
                 {training.id === currentTrainingId && (
                    <span className="absolute top-2 right-2 bg-brand-orange text-white text-xs font-semibold px-2 py-1 rounded">
                        Atual
                    </span>
                 )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 flex flex-col justify-end">
                    <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">{training.name}</h3>
                    <div className="flex items-center space-x-3 text-xs text-gray-200">
                        {training.duration && <span className="flex items-center"><IconClock className="w-3 h-3 mr-1" /> {training.duration}</span>}
                        <span className="flex items-center"><IconListUl className="w-3 h-3 mr-1" /> {training.splits.length} divisões</span>
                    </div>
                </div>
              </div>
              
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <p className="text-xs text-medium-text-light dark:text-medium-text mb-1">Objetivos:</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {training.objective.slice(0, 2).map(obj => (
                      <span key={obj} className="px-1.5 py-0.5 text-[11px] bg-brand-orange/10 dark:bg-brand-orange/20 text-brand-orange rounded-full border border-brand-orange/20 dark:border-brand-orange/30">
                        {obj}
                      </span>
                    ))}
                    {training.objective.length > 2 && <span className="px-1.5 py-0.5 text-[11px] bg-gray-200 dark:bg-gray-700 rounded-full">+ {training.objective.length - 2}</span>}
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedTraining(training)}
                  className="w-full mt-2 bg-brand-orange hover:bg-orange-600 text-white font-semibold py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition-colors text-sm"
                >
                  <IconEye className="w-4 h-4" /> <span>Detalhes</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <TrainingDetailModal training={selectedTraining} onClose={() => setSelectedTraining(null)} />
    </div>
  );
};

export default StudentMyTrainingsPage;
