import React, { useState } from 'react';
import ScheduledClassItem from '../components/ScheduledClassItem';
import { scheduledClassesData as initialScheduledClassesData, daysOfWeek } from '../data/mockData'; 
import { ScheduledClass } from '../types';
import { IconCalendar, IconPlus } from '../constants.tsx'; 
import Modal from '../components/Modal';

const inputBaseClassesModal = "mt-1 block w-full p-2 bg-gray-50 dark:bg-gray-800 border border-light-border dark:border-dark-border rounded-md text-dark-text dark:text-light-text focus:ring-brand-orange focus:border-brand-orange placeholder-gray-400 dark:placeholder-gray-500";

const SchedulePage: React.FC = () => {
  const [scheduledClasses, setScheduledClasses] = useState<ScheduledClass[]>(initialScheduledClassesData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const initialFormState: Partial<ScheduledClass> = {
    name: '', teacher: '', dayOfWeek: daysOfWeek[0], classTime: '08:00', 
    spotsFilled: 0, totalSpots: 10, observations: ''
  };
  const [formData, setFormData] = useState<Partial<ScheduledClass>>(initialFormState);

  const handleOpenModal = () => { setFormData(initialFormState); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const val = (name === 'spotsFilled' || name === 'totalSpots') ? parseInt(value, 10) : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.teacher || !formData.dayOfWeek || !formData.classTime || formData.totalSpots === undefined || formData.totalSpots <= 0) {
        alert("Por favor, preencha todos os campos obrigatórios e verifique se o total de vagas é maior que zero."); return;
    }
    if (formData.spotsFilled !== undefined && formData.spotsFilled < 0) { alert("Vagas preenchidas não pode ser negativo."); return; }
    if (formData.spotsFilled !== undefined && formData.totalSpots !== undefined && formData.spotsFilled > formData.totalSpots) {
        alert("Vagas preenchidas não pode ser maior que o total de vagas."); return;
    }

    const newClass: ScheduledClass = {
      id: `c${Date.now()}`, name: formData.name!, teacher: formData.teacher!, dayOfWeek: formData.dayOfWeek!,
      classTime: formData.classTime!, spotsFilled: formData.spotsFilled || 0, totalSpots: formData.totalSpots!, observations: formData.observations,
    };
    setScheduledClasses(prev => [newClass, ...prev].sort((a, b) => {
      const dayIndexA = daysOfWeek.indexOf(a.dayOfWeek); const dayIndexB = daysOfWeek.indexOf(b.dayOfWeek);
      if (dayIndexA !== dayIndexB) return dayIndexA - dayIndexB;
      return a.classTime.localeCompare(b.classTime);
    }));
    handleCloseModal();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-dark-text dark:text-light-text flex items-center">
          <IconCalendar className="w-8 h-8 mr-3 text-brand-orange" />
          Agendamento de Aulas
        </h2>
        <button 
          onClick={handleOpenModal}
          className="bg-brand-orange hover:bg-orange-600 text-white font-semibold py-2.5 px-5 rounded-lg flex items-center space-x-2 transition-colors shadow-sm hover:shadow-md"
        >
          <IconPlus className="w-5 h-5" />
          <span>Nova Aula</span>
        </button>
      </div>
      
      <div className="bg-light-bg-card dark:bg-dark-card p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-dark-text dark:text-light-text mb-2">Agenda - {new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</h3>
        <p className="text-medium-text-light dark:text-medium-text mb-6">
          A funcionalidade de calendário visual para agendamento de aulas está em desenvolvimento. 
          Aqui você poderá marcar aulas, escolher professor, horário, alunos inscritos, confirmar presenças e enviar lembretes.
        </p>
        <div className="bg-gray-100 dark:bg-dark-border p-8 rounded-lg text-center text-medium-text-light dark:text-medium-text border border-light-border dark:border-gray-700">
          Visualização de Calendário (Em Breve)
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-dark-text dark:text-light-text mb-4">Próximas Aulas Agendadas</h3>
         <div className="bg-light-bg-card dark:bg-dark-card p-2 md:p-4 rounded-xl shadow-lg">
            {scheduledClasses.length > 0 ? (
            scheduledClasses.map((sClass) => (
                <ScheduledClassItem key={sClass.id} sClass={sClass} />
            ))
            ) : (
            <p className="text-medium-text-light dark:text-medium-text p-4 text-center">Nenhuma aula agendada no momento.</p>
            )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Adicionar Nova Aula">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-medium-text-light dark:text-medium-text">Nome da Aula</label>
            <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleFormChange} required className={inputBaseClassesModal}/>
          </div>
          <div>
            <label htmlFor="teacher" className="block text-sm font-medium text-medium-text-light dark:text-medium-text">Professor(a)</label>
            <input type="text" name="teacher" id="teacher" value={formData.teacher || ''} onChange={handleFormChange} required className={inputBaseClassesModal}/>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="dayOfWeek" className="block text-sm font-medium text-medium-text-light dark:text-medium-text">Dia da Semana</label>
              <select name="dayOfWeek" id="dayOfWeek" value={formData.dayOfWeek || daysOfWeek[0]} onChange={handleFormChange} required className={inputBaseClassesModal}>
                {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="classTime" className="block text-sm font-medium text-medium-text-light dark:text-medium-text">Horário da Aula</label>
              <input type="time" name="classTime" id="classTime" value={formData.classTime || '08:00'} onChange={handleFormChange} required className={inputBaseClassesModal}/>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="spotsFilled" className="block text-sm font-medium text-medium-text-light dark:text-medium-text">Vagas Preenchidas</label>
              <input type="number" name="spotsFilled" id="spotsFilled" value={formData.spotsFilled || 0} onChange={handleFormChange} min="0" className={inputBaseClassesModal}/>
            </div>
            <div>
              <label htmlFor="totalSpots" className="block text-sm font-medium text-medium-text-light dark:text-medium-text">Total de Vagas</label>
              <input type="number" name="totalSpots" id="totalSpots" value={formData.totalSpots || 10} onChange={handleFormChange} min="1" required className={inputBaseClassesModal}/>
            </div>
          </div>
          <div>
            <label htmlFor="observations" className="block text-sm font-medium text-medium-text-light dark:text-medium-text">Observações Adicionais</label>
            <textarea name="observations" id="observations" value={formData.observations || ''} onChange={handleFormChange} rows={2} className={inputBaseClassesModal} placeholder="Alguma observação sobre a aula? (opcional)"></textarea>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={handleCloseModal} className="py-2 px-4 border border-light-border dark:border-dark-border rounded-lg text-medium-text-light dark:text-medium-text hover:bg-gray-100 dark:hover:bg-gray-700 transition">Cancelar</button>
            <button type="submit" className="py-2 px-4 bg-brand-orange hover:bg-orange-600 text-white rounded-lg font-medium transition">Salvar Aula</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SchedulePage;