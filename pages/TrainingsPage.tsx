import React, { useState, useMemo } from 'react';
import { trainingsData as initialTrainingsData, objectiveSuggestions } from '../data/mockData'; 
import { Training, TrainingSplit, Exercise } from '../types'; 
import { IconPlus, IconEdit, IconTrash, IconUsers, IconActivity, IconWeightLiftingUp, IconEye, IconClock, IconFire, IconListUl, IconPlay } from '../constants.tsx'; 
import Modal from '../components/Modal';
import TagInput from '../components/TagInput';

const TrainingCard: React.FC<{ 
  training: Training; 
  onEdit: (training: Training) => void; 
  onDelete: (id: string) => void; 
  onAssociate: (id: string) => void; 
  onViewExercises: (training: Training) => void;
}> = ({ training, onEdit, onDelete, onAssociate, onViewExercises }) => {
  
  const totalExercises = useMemo(() => {
    return training.splits.reduce((sum, split) => sum + split.exercises.length, 0);
  }, [training.splits]);

  const placeholderUrl = 'https://source.unsplash.com/500x300/?fitness,gym,workout';

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (event.currentTarget.src !== placeholderUrl) {
      event.currentTarget.src = placeholderUrl;
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('.image-area-clickable')) {
      return;
    }
    onViewExercises(training);
  };

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation(); 
    action();
  };

  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const target = e.target as HTMLElement;
      if (target.closest('button')) return;
      e.preventDefault();
      onViewExercises(training);
    }
  };

  return (
    <div 
      className="bg-light-bg-card dark:bg-dark-card rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl dark:hover:shadow-brand-orange/20 cursor-pointer"
      role="button" 
      tabIndex={0} 
      aria-label={`Treino: ${training.name}`}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
    >
      <div 
        className="relative h-48 w-full image-area-clickable"
        onClick={(e) => handleButtonClick(e, () => onViewExercises(training))}
      >
        <img 
          src={training.imageUrl || placeholderUrl} 
          alt={training.name} 
          className="absolute inset-0 w-full h-full object-cover" 
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4 flex flex-col justify-end">
          <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">{training.name}</h3>
          <div className="flex items-center space-x-3 text-xs text-gray-200">
            {training.duration && (
              <span className="flex items-center"><IconClock className="w-3.5 h-3.5 mr-1" /> {training.duration}</span>
            )}
            {training.calories && (
              <span className="flex items-center"><IconFire className="w-3.5 h-3.5 mr-1" /> {training.calories}</span>
            )}
            <span className="flex items-center"><IconListUl className="w-3.5 h-3.5 mr-1" /> {training.splits.length} Divisões</span>
          </div>
        </div>
      </div>

      <div className="p-5 flex-grow flex flex-col justify-between">
        <div> 
          <div className="mb-3">
            <p className="text-xs text-medium-text-light dark:text-medium-text flex items-center mb-0.5">
                <IconActivity className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" strokeWidth={2} /> Objetivos:
            </p>
            <div className="flex flex-wrap gap-1 mt-1">
                {(Array.isArray(training.objective) ? training.objective : []).slice(0, 2).map(obj => (
                    <span key={obj} className="px-2 py-0.5 text-xs bg-brand-orange/10 dark:bg-brand-orange/20 text-brand-orange rounded-full border border-brand-orange/20 dark:border-brand-orange/30">
                        {obj}
                    </span>
                ))}
                {Array.isArray(training.objective) && training.objective.length > 2 && (
                    <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-full">
                        +{training.objective.length - 2}
                    </span>
                )}
            </div>
        </div>
          <p className="text-xs text-medium-text-light dark:text-medium-text mb-1">Total de Exercícios: {totalExercises}</p>
        </div>

        <div className="mt-4">
          <button 
            onClick={(e) => handleButtonClick(e, () => onViewExercises(training))}
            className="w-full bg-brand-orange hover:bg-orange-600 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm shadow-sm hover:shadow-md"
            aria-label={`Ver detalhes do treino ${training.name}`}
          >
             <IconEye className="w-4 h-4" /> <span>Detalhes</span>
          </button>
        </div>
         <div className="mt-3 flex justify-end space-x-1">
             <button 
                onClick={(e) => handleButtonClick(e, () => onEdit(training))} 
                className="text-xs text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-500/10 dark:hover:bg-blue-500/20"
                title="Editar Treino"
            >
              <IconEdit className="w-4 h-4" />
            </button>
            <button 
                onClick={(e) => handleButtonClick(e, () => onDelete(training.id))} 
                className="text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-500/10 dark:hover:bg-red-500/20"
                title="Excluir Treino"
            >
              <IconTrash className="w-4 h-4" />
            </button>
         </div>
      </div>
    </div>
  );
};

const inputBaseClassesModal = "mt-1 block w-full p-2 bg-gray-50 dark:bg-gray-800 border border-light-border dark:border-dark-border rounded-md text-dark-text dark:text-light-text focus:ring-brand-orange focus:border-brand-orange placeholder-gray-400 dark:placeholder-gray-500";
const smallInputBaseClassesModal = `${inputBaseClassesModal} text-xs p-1.5`;

const TrainingsPage: React.FC = () => {
  const [trainings, setTrainings] = useState<Training[]>(initialTrainingsData);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);
  const [viewingTraining, setViewingTraining] = useState<Training | null>(null);
  
  const initialExerciseState: Partial<Exercise> = { name: '', series: '', repetitions: '', carga: '', restTime: '', observation: '' };
  const [currentExerciseData, setCurrentExerciseData] = useState<Partial<Exercise>>(initialExerciseState);
  
  const initialFormData: Partial<Training> = {
    name: '', 
    objective: [], 
    associatedStudents: 0, 
    splits: [],
    imageUrl: '',
    duration: '',
    calories: '',
  };
  const [formData, setFormData] = useState<Partial<Training>>(initialFormData);
  const [activeSplitId, setActiveSplitId] = useState<string | null>(null);
  const [newSplitNameInput, setNewSplitNameInput] = useState('');


  const handleOpenFormModal = (training: Training | null = null) => {
    setEditingTraining(training);
    if (training) {
      setFormData({
        ...training,
        objective: Array.isArray(training.objective) ? [...training.objective] : [],
        splits: training.splits.map(split => ({
          ...split,
          exercises: split.exercises.map(ex => ({...ex})) 
        }))
      });
      if (training.splits.length > 0) setActiveSplitId(training.splits[0].id);
      else setActiveSplitId(null);
    } else {
      const defaultSplitId = `split-${Date.now()}`;
      setFormData({ 
        ...initialFormData, 
        objective: [], 
        splits: [{ id: defaultSplitId, customName: 'Treino A', exercises: [] }]
      });
      setActiveSplitId(defaultSplitId);
    }
    setCurrentExerciseData(initialExerciseState);
    setNewSplitNameInput('');
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false); setEditingTraining(null); setFormData(initialFormData); setActiveSplitId(null); setCurrentExerciseData(initialExerciseState); setNewSplitNameInput('');
  };

  const handleOpenViewModal = (training: Training) => { setViewingTraining(training); setIsViewModalOpen(true); };
  const handleCloseViewModal = () => { setIsViewModalOpen(false); setViewingTraining(null); };

  const handleMainFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const val = name === 'associatedStudents' ? parseInt(value, 10) : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };
  
  const handleObjectiveChange = (newObjectives: string[]) => {
    setFormData(prev => ({ ...prev, objective: newObjectives }));
  };

  const handleAddSplit = () => {
    if (!newSplitNameInput.trim()) { alert("Por favor, insira um nome para a divisão."); return; }
    const newSplitId = `split-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newSplit: TrainingSplit = { id: newSplitId, customName: newSplitNameInput.trim(), exercises: [] };
    setFormData(prev => ({ ...prev, splits: [...(prev.splits || []), newSplit] }));
    setActiveSplitId(newSplitId); setNewSplitNameInput('');
  };

  const handleRemoveSplit = (splitIdToRemove: string) => {
    if (!window.confirm("Tem certeza que deseja remover esta divisão de treino e todos os seus exercícios?")) return;
    let newActiveSplitIdCache = activeSplitId;
    setFormData(prev => {
      const updatedSplits = (prev.splits || []).filter(split => split.id !== splitIdToRemove);
      if (activeSplitId === splitIdToRemove) newActiveSplitIdCache = updatedSplits.length > 0 ? updatedSplits[0].id : null;
      return { ...prev, splits: updatedSplits };
    });
    setActiveSplitId(newActiveSplitIdCache); 
  };
  
  const handleExerciseFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentExerciseData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddExerciseToSplit = () => {
    if (!activeSplitId || !currentExerciseData.name?.trim()) { alert("Selecione uma divisão e preencha o nome do exercício."); return; }
    const newExercise: Exercise = {
      id: `ex-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: currentExerciseData.name.trim(), series: currentExerciseData.series?.trim() || '', repetitions: currentExerciseData.repetitions?.trim() || '',
      carga: currentExerciseData.carga?.trim(), restTime: currentExerciseData.restTime?.trim(), observation: currentExerciseData.observation?.trim(),
    };
    setFormData(prev => ({ ...prev, splits: (prev.splits || []).map(split => split.id === activeSplitId ? { ...split, exercises: [...split.exercises, newExercise] } : split) }));
    setCurrentExerciseData(initialExerciseState);
  };

  const handleRemoveExerciseFromSplit = (exerciseIdToRemove: string) => {
     if (!activeSplitId) return;
     setFormData(prev => ({ ...prev, splits: (prev.splits || []).map(split => split.id === activeSplitId ? { ...split, exercises: split.exercises.filter(ex => ex.id !== exerciseIdToRemove) } : split) }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.objective || formData.objective.length === 0 || !formData.splits || formData.splits.length === 0) {
        alert("Preencha o nome, pelo menos um objetivo e adicione ao menos uma divisão."); return;
    }
    const trainingToSave: Training = {
      id: editingTraining ? editingTraining.id : `t${Date.now()}`,
      name: formData.name!, objective: formData.objective!, associatedStudents: formData.associatedStudents || 0, splits: formData.splits!,
      imageUrl: formData.imageUrl, duration: formData.duration, calories: formData.calories,
    };
    if (editingTraining) setTrainings(trainings.map(t => t.id === editingTraining.id ? trainingToSave : t));
    else setTrainings([trainingToSave, ...trainings]);
    handleCloseFormModal();
  };

  const handleDeleteTraining = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este treino?')) setTrainings(trainings.filter(t => t.id !== id));
  };
  const handleAssociateStudents = (id: string) => { alert(`Associar Alunos (ID: ${id}) - Em desenvolvimento.`); };

  const activeSplitExercises = useMemo(() => {
    if (!activeSplitId || !formData.splits) return [];
    const currentSplit = formData.splits.find(s => s.id === activeSplitId);
    return currentSplit ? currentSplit.exercises : [];
  }, [activeSplitId, formData.splits]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-dark-text dark:text-light-text flex items-center">
          <IconWeightLiftingUp className="w-8 h-8 mr-3 text-brand-orange" /> Gerenciamento de Treinos
        </h2>
        <button onClick={() => handleOpenFormModal()} className="bg-brand-orange hover:bg-orange-600 text-white font-semibold py-2.5 px-5 rounded-lg flex items-center space-x-2 transition-colors shadow-sm hover:shadow-md">
          <IconPlus className="w-5 h-5" /> <span>Novo Treino</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {trainings.length > 0 ? (
          trainings.map(training => (
            <TrainingCard key={training.id} training={training} onEdit={handleOpenFormModal} onDelete={handleDeleteTraining} onAssociate={handleAssociateStudents} onViewExercises={handleOpenViewModal} />
          ))
        ) : ( <p className="text-medium-text-light dark:text-medium-text col-span-full text-center p-10">Nenhum treino cadastrado.</p> )}
      </div>

      <Modal isOpen={isFormModalOpen} onClose={handleCloseFormModal} title={editingTraining ? 'Editar Treino' : 'Adicionar Novo Treino'}>
        <form onSubmit={handleFormSubmit} className="space-y-4 text-sm">
          <div>
            <label htmlFor="form-name" className="block text-xs font-medium text-medium-text-light dark:text-medium-text">Nome do Treino</label>
            <input type="text" name="name" id="form-name" value={formData.name || ''} onChange={handleMainFormChange} required className={inputBaseClassesModal}/>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="form-duration" className="block text-xs font-medium text-medium-text-light dark:text-medium-text">Duração (Ex: 45min)</label>
              <input type="text" name="duration" id="form-duration" value={formData.duration || ''} onChange={handleMainFormChange} className={inputBaseClassesModal}/>
            </div>
            <div>
              <label htmlFor="form-calories" className="block text-xs font-medium text-medium-text-light dark:text-medium-text">Calorias (Ex: 300kcal)</label>
              <input type="text" name="calories" id="form-calories" value={formData.calories || ''} onChange={handleMainFormChange} className={inputBaseClassesModal}/>
            </div>
             <div>
                <label htmlFor="form-associatedStudents" className="block text-xs font-medium text-medium-text-light dark:text-medium-text">Alunos Associados</label>
                <input type="number" name="associatedStudents" id="form-associatedStudents" value={formData.associatedStudents || 0} onChange={handleMainFormChange} min="0" className={inputBaseClassesModal}/>
            </div>
          </div>
           <div>
            <label htmlFor="form-imageUrl" className="block text-xs font-medium text-medium-text-light dark:text-medium-text">URL da Imagem do Treino</label>
            <input type="url" name="imageUrl" id="form-imageUrl" value={formData.imageUrl || ''} onChange={handleMainFormChange} placeholder="https://exemplo.com/imagem.jpg" className={inputBaseClassesModal}/>
          </div>
          <TagInput id="form-objective" label="Objetivos do Treino" value={formData.objective || []} onChange={handleObjectiveChange} suggestions={objectiveSuggestions} placeholder="Adicione objetivos" />
          
          <div className="space-y-3 pt-3 border-t border-light-border dark:border-dark-border">
            <h4 className="text-base font-semibold text-dark-text dark:text-light-text">Divisões do Treino</h4>
            <div className="flex items-center gap-2">
              <input type="text" value={newSplitNameInput} onChange={(e) => setNewSplitNameInput(e.target.value)} placeholder="Nome da Divisão (Ex: Treino A)" className={`${inputBaseClassesModal} flex-grow`}/>
              <button type="button" onClick={handleAddSplit} className="p-2 bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-md text-xs font-medium shadow-sm">+ Adicionar</button>
            </div>
            
            {formData.splits && formData.splits.length > 0 && (
              <div className="flex space-x-1 border-b border-light-border dark:border-dark-border pb-0">
                {formData.splits.map(split => (
                  <button
                    key={split.id}
                    type="button"
                    onClick={() => setActiveSplitId(split.id)}
                    className={`py-2 px-4 text-xs font-medium rounded-t-md focus:outline-none transition-colors
                      ${activeSplitId === split.id 
                        ? 'bg-brand-orange text-white border-b-2 border-brand-orange' 
                        : 'text-medium-text-light dark:text-medium-text hover:text-brand-orange dark:hover:text-orange-400 hover:bg-orange-500/10 dark:hover:bg-orange-500/20 border-b-2 border-transparent'}`}
                  >
                    {split.customName}
                  </button>
                ))}
              </div>
            )}
             {(!formData.splits || formData.splits.length === 0) && ( <p className="text-xs text-medium-text-light dark:text-medium-text text-center py-2">Adicione sua primeira divisão.</p> )}
          </div>
          
          {activeSplitId && formData.splits?.find(s => s.id === activeSplitId) && (
            <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-light-border dark:border-dark-border">
              <h5 className="text-sm font-medium text-brand-orange">Exercícios para: {formData.splits.find(s => s.id === activeSplitId)?.customName}</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2 p-2 border border-light-border dark:border-dark-border rounded-md bg-white dark:bg-gray-800">
                <input type="text" name="name" value={currentExerciseData.name || ''} onChange={handleExerciseFormChange} placeholder="Nome do Exercício" className={`${smallInputBaseClassesModal} col-span-2`}/>
                <input type="text" name="series" value={currentExerciseData.series || ''} onChange={handleExerciseFormChange} placeholder="Séries" className={smallInputBaseClassesModal}/>
                <input type="text" name="repetitions" value={currentExerciseData.repetitions || ''} onChange={handleExerciseFormChange} placeholder="Repetições" className={smallInputBaseClassesModal}/>
                <input type="text" name="carga" value={currentExerciseData.carga || ''} onChange={handleExerciseFormChange} placeholder="Carga" className={smallInputBaseClassesModal}/>
                <input type="text" name="restTime" value={currentExerciseData.restTime || ''} onChange={handleExerciseFormChange} placeholder="Descanso" className={smallInputBaseClassesModal}/>
                <textarea name="observation" value={currentExerciseData.observation || ''} onChange={handleExerciseFormChange} placeholder="Observações" rows={1} className={`${smallInputBaseClassesModal} col-span-2 min-h-[30px] resize-y`}></textarea>
                <button type="button" onClick={handleAddExerciseToSplit} className="col-span-2 mt-1 p-1.5 bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 text-white rounded-md text-xs font-medium shadow-sm">+ Adicionar Exercício</button>
              </div>
              {activeSplitExercises.length > 0 ? (
                <ul className="space-y-1 text-xs max-h-32 overflow-y-auto pr-1">
                  {activeSplitExercises.map(ex => (
                    <li key={ex.id} className="flex justify-between items-start p-1.5 bg-gray-100 dark:bg-gray-700 rounded-md border border-light-border dark:border-dark-border">
                      <div>
                        <strong className="text-dark-text dark:text-light-text">{ex.name}</strong>
                        <span className="text-medium-text-light dark:text-medium-text"> ({ex.series} {ex.repetitions}, C: {ex.carga || 'N/A'}, D: {ex.restTime || 'N/A'})</span>
                        {ex.observation && <p className="text-xs text-gray-500 dark:text-gray-400 italic ml-2">- {ex.observation}</p>}
                      </div>
                      <button type="button" onClick={() => handleRemoveExerciseFromSplit(ex.id)} className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-base p-0.5 leading-none">&times;</button>
                    </li>
                  ))}
                </ul>
              ) : ( <p className="text-xs text-medium-text-light dark:text-medium-text text-center py-1">Nenhum exercício adicionado.</p> )}
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-light-border dark:border-dark-border">
            <button type="button" onClick={handleCloseFormModal} className="py-2 px-4 border border-light-border dark:border-dark-border rounded-lg text-medium-text-light dark:text-medium-text hover:bg-gray-100 dark:hover:bg-gray-700 transition text-xs">Cancelar</button>
            <button type="submit" className="py-2 px-4 bg-brand-orange hover:bg-orange-600 text-white rounded-lg font-medium transition text-xs shadow-sm hover:shadow-md">Salvar Treino</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={handleCloseViewModal} title={viewingTraining ? `Detalhes: ${viewingTraining.name}` : 'Detalhes do Treino'}>
        {viewingTraining && (
          <div className="space-y-4 text-sm">
            <div className="mb-1">
                <strong className="text-medium-text-light dark:text-medium-text">Objetivos:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                    {(Array.isArray(viewingTraining.objective) ? viewingTraining.objective : []).map(obj => (
                        <span key={obj} className="px-2 py-1 text-xs bg-brand-orange/10 dark:bg-brand-orange/20 text-brand-orange rounded-full border border-brand-orange/30 dark:border-brand-orange/40">
                            {obj}
                        </span>
                    ))}
                    {(!Array.isArray(viewingTraining.objective) || viewingTraining.objective.length === 0) && ( <span className="text-xs text-dark-text dark:text-light-text italic">Nenhum</span> )}
                </div>
            </div>
            <p><strong className="text-medium-text-light dark:text-medium-text">Alunos Associados:</strong> <span className="text-dark-text dark:text-light-text">{viewingTraining.associatedStudents}</span></p>
            <p><strong className="text-medium-text-light dark:text-medium-text">Duração Estimada:</strong> <span className="text-dark-text dark:text-light-text">{viewingTraining.duration || 'N/A'}</span></p>
            <p><strong className="text-medium-text-light dark:text-medium-text">Calorias Estimadas:</strong> <span className="text-dark-text dark:text-light-text">{viewingTraining.calories || 'N/A'}</span></p>
            
            <div className="space-y-3 pt-3 border-t border-light-border dark:border-dark-border">
              <h4 className="text-base font-semibold text-brand-orange">Divisões e Exercícios:</h4>
              {viewingTraining.splits.length > 0 ? (
                viewingTraining.splits.map(split => (
                  <div key={split.id} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-light-border dark:border-dark-border">
                    <h5 className="text-sm font-medium text-dark-text dark:text-light-text mb-2">{split.customName}</h5>
                    {split.exercises.length > 0 ? (
                      <ul className="space-y-1.5 text-xs">
                        {split.exercises.map(ex => (
                          <li key={ex.id} className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
                            <strong className="text-dark-text dark:text-light-text">{ex.name}</strong>
                            <p className="text-medium-text-light dark:text-medium-text">
                              S: {ex.series || 'N/A'} &bull; R: {ex.repetitions || 'N/A'} &bull; C: {ex.carga || 'N/A'} &bull; D: {ex.restTime || 'N/A'}
                            </p>
                            {ex.observation && <p className="text-xs text-gray-500 dark:text-gray-400 italic ml-2">- {ex.observation}</p>}
                          </li>
                        ))}
                      </ul>
                    ) : ( <p className="text-xs text-medium-text-light dark:text-medium-text text-center py-1">Nenhum exercício.</p> )}
                  </div>
                ))
              ) : ( <p className="text-xs text-medium-text-light dark:text-medium-text text-center py-2">Nenhuma divisão cadastrada.</p> )}
            </div>
             <div className="flex justify-end pt-4">
                <button onClick={handleCloseViewModal} className="py-2 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-dark-text dark:text-light-text rounded-lg transition text-xs">Fechar</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TrainingsPage;