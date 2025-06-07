import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { studentsData as initialStudentsData, objectiveSuggestions } from '../data/mockData';
import { Student } from '../types';
import { IconSearch, IconPlus, IconEdit, IconTrash } from '../constants.tsx'; 
import Modal from '../components/Modal';
import TagInput from '../components/TagInput';
import { Controller, useForm, FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'; 
import { z } from 'zod'; 
import { studentFormSchema } from '../schemas/studentSchema'; 
import { maskCPF, maskPhone } from '../utils/maskUtils'; 

const StudentRow: React.FC<{ student: Student; onEdit: (student: Student) => void; onDelete: (id: string) => void }> = ({ student, onEdit, onDelete }) => {
  const paymentStatusColor = 
    student.paymentStatus === 'Em dia' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
    student.paymentStatus === 'Atrasado' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';

  return (
    <tr className="border-b border-light-border dark:border-dark-border hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
      <td className="p-3 whitespace-nowrap">
        <img src={student.photoUrl} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
      </td>
      <td className="p-3"> 
        <div className="font-medium text-dark-text dark:text-light-text">{student.name}</div>
        <div className="flex flex-wrap gap-1 mt-1">
          {student.objectives.slice(0, 3).map(objective => ( 
            <span key={objective} className="px-1.5 py-0.5 text-xs bg-brand-orange/10 dark:bg-brand-orange/20 text-brand-orange rounded-full border border-brand-orange/30 dark:border-brand-orange/40">
              {objective}
            </span>
          ))}
          {student.objectives.length > 3 && (
            <span className="px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
              +{student.objectives.length - 3}
            </span>
          )}
        </div>
      </td>
      <td className="p-3 whitespace-nowrap text-medium-text-light dark:text-medium-text">{student.cpf}</td>
      <td className="p-3 whitespace-nowrap text-medium-text-light dark:text-medium-text">{student.phone}</td>
      <td className="p-3 whitespace-nowrap">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${paymentStatusColor}`}>
          {student.paymentStatus}
        </span>
      </td>
      <td className="p-3 whitespace-nowrap space-x-2">
        <button onClick={() => onEdit(student)} className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-1" title="Editar Aluno">
          <IconEdit className="w-5 h-5" />
        </button>
        <button onClick={() => onDelete(student.id)} className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1" title="Excluir Aluno">
          <IconTrash className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
};

const studentEditSchema = studentFormSchema.omit({ password: true, email: true }); 
type StudentEditFormData = z.infer<typeof studentEditSchema>;

const inputBaseClassesModal = "mt-1 block w-full p-2 bg-gray-50 dark:bg-gray-800 border border-light-border dark:border-dark-border rounded-md text-dark-text dark:text-light-text focus:ring-brand-orange focus:border-brand-orange placeholder-gray-400 dark:placeholder-gray-500";


const StudentsPage: React.FC = () => {
  const navigate = useNavigate(); 
  const [students, setStudents] = useState<Student[]>(initialStudentsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  
  const { control: editControl, handleSubmit: handleEditSubmit, reset: resetEditForm, formState: { errors: editErrors } } = useForm<StudentEditFormData>({
    resolver: zodResolver(studentEditSchema),
  });


  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.cpf.includes(searchTerm) ||
      student.objectives.some(obj => obj.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [students, searchTerm]);

  const handleOpenEditModal = (student: Student) => {
    setEditingStudent(student);
    resetEditForm({
        fullName: student.name,
        cpf: student.cpf,
        phone: student.phone,
        dateOfBirth: student.dateOfBirth,
        objectives: student.objectives,
        observations: student.observations,
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingStudent(null);
    resetEditForm();
  };
  
  const onEditFormSubmit = (data: StudentEditFormData) => {
    if (editingStudent) {
      const updatedStudent: Student = {
        ...editingStudent,
        name: data.fullName,
        cpf: data.cpf,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        objectives: data.objectives,
        observations: data.observations,
      };
      setStudents(students.map(s => s.id === editingStudent.id ? updatedStudent : s));
    }
    handleCloseEditModal();
  };


  const handleDeleteStudent = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const handleAddNewStudent = () => {
    navigate('/alunos/novo'); 
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-dark-text dark:text-light-text">Gerenciamento de Alunos</h2>
        <button 
          onClick={handleAddNewStudent} 
          className="bg-brand-orange hover:bg-orange-600 text-white font-semibold py-2.5 px-5 rounded-lg flex items-center space-x-2 transition-colors shadow-sm hover:shadow-md"
        >
          <IconPlus className="w-5 h-5" />
          <span>Novo Aluno</span>
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <IconSearch className="w-5 h-5 text-medium-text-light dark:text-medium-text" />
        </div>
        <input
          type="text"
          placeholder="Buscar por nome, CPF ou objetivo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pl-10 bg-light-bg-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg text-dark-text dark:text-light-text focus:ring-2 focus:ring-brand-orange outline-none placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>

      <div className="bg-light-bg-card dark:bg-dark-card shadow-lg rounded-xl overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-light-border dark:border-dark-border">
            <tr>
              <th className="p-3 text-left text-xs font-semibold text-medium-text-light dark:text-medium-text uppercase tracking-wider">Foto</th>
              <th className="p-3 text-left text-xs font-semibold text-medium-text-light dark:text-medium-text uppercase tracking-wider">Nome / Objetivos</th>
              <th className="p-3 text-left text-xs font-semibold text-medium-text-light dark:text-medium-text uppercase tracking-wider">CPF</th>
              <th className="p-3 text-left text-xs font-semibold text-medium-text-light dark:text-medium-text uppercase tracking-wider">Telefone</th>
              <th className="p-3 text-left text-xs font-semibold text-medium-text-light dark:text-medium-text uppercase tracking-wider">Status Pag.</th>
              <th className="p-3 text-left text-xs font-semibold text-medium-text-light dark:text-medium-text uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light-border dark:divide-dark-border">
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                <StudentRow key={student.id} student={student} onEdit={handleOpenEditModal} onDelete={handleDeleteStudent} />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-6 text-medium-text-light dark:text-medium-text">Nenhum aluno encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal} title={'Editar Aluno'}>
        <form onSubmit={handleEditSubmit(onEditFormSubmit)} className="space-y-4">
           <div>
            <label htmlFor="edit-fullName" className="block text-sm font-medium text-medium-text-light dark:text-medium-text">Nome Completo</label>
            <Controller
                name="fullName"
                control={editControl}
                render={({ field }) => <input type="text" id="edit-fullName" {...field} required className={inputBaseClassesModal}/>}
            />
            {editErrors.fullName?.message && typeof editErrors.fullName.message === 'string' && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{editErrors.fullName.message}</p>}
          </div>
          <div>
            <label htmlFor="edit-cpf" className="block text-sm font-medium text-medium-text-light dark:text-medium-text">CPF</label>
             <Controller
                name="cpf"
                control={editControl}
                render={({ field }) => <input type="text" id="edit-cpf" {...field} onChange={e => field.onChange(maskCPF(e.target.value))} required className={inputBaseClassesModal}/>}
            />
            {editErrors.cpf?.message && typeof editErrors.cpf.message === 'string' && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{editErrors.cpf.message}</p>}
          </div>
          <div>
            <label htmlFor="edit-phone" className="block text-sm font-medium text-medium-text-light dark:text-medium-text">Telefone</label>
            <Controller
                name="phone"
                control={editControl}
                render={({ field }) => <input type="tel" id="edit-phone" {...field} onChange={e => field.onChange(maskPhone(e.target.value))} className={inputBaseClassesModal}/>}
            />
            {editErrors.phone?.message && typeof editErrors.phone.message === 'string' && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{editErrors.phone.message}</p>}
          </div>
           <div>
            <label htmlFor="edit-dateOfBirth" className="block text-sm font-medium text-medium-text-light dark:text-medium-text">Data de Nascimento</label>
            <Controller
                name="dateOfBirth"
                control={editControl}
                render={({ field }) => <input type="date" id="edit-dateOfBirth" {...field} required className={inputBaseClassesModal}/>}
            />
            {editErrors.dateOfBirth?.message && typeof editErrors.dateOfBirth.message === 'string' && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{editErrors.dateOfBirth.message}</p>}
          </div>
          
          <div>
            <Controller
              name="objectives"
              control={editControl}
              render={({ field }) => (
                <TagInput
                  id="edit-objectives"
                  label="Objetivos"
                  value={field.value || []}
                  onChange={field.onChange}
                  suggestions={objectiveSuggestions}
                  placeholder="Adicione objetivos"
                  error={typeof editErrors.objectives?.message === 'string' ? editErrors.objectives.message : undefined}
                />
              )}
            />
          </div>
           <div>
            <label htmlFor="edit-observations" className="block text-sm font-medium text-medium-text-light dark:text-medium-text">Observações</label>
            <Controller
                name="observations"
                control={editControl}
                render={({ field }) => <textarea id="edit-observations" {...field} rows={3} className={inputBaseClassesModal}/>}
            />
            {editErrors.observations?.message && typeof editErrors.observations.message === 'string' && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{editErrors.observations.message}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={handleCloseEditModal} className="py-2 px-4 border border-light-border dark:border-dark-border rounded-lg text-medium-text-light dark:text-medium-text hover:bg-gray-100 dark:hover:bg-gray-700 transition">Cancelar</button>
            <button type="submit" className="py-2 px-4 bg-brand-orange hover:bg-orange-600 text-white rounded-lg transition">Salvar Alterações</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentsPage;