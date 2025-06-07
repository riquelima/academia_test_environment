import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlunoForm from '../components/AlunoForm';
import { StudentFormData } from '../schemas/studentSchema';
import Toast from '../components/Toast'; 
import { NewStudentFormData as StoredStudentData, Student } from '../types';

const AddStudentPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  const [savedStudents, setSavedStudents] = useState<StoredStudentData[]>([]);

  const handleFormSubmit = async (data: StudentFormData) => {
    setIsSubmitting(true);
    console.log("Dados do formulário do aluno:", data);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const newStudentEntry: StoredStudentData = { ...data };
    setSavedStudents(prevStudents => [...prevStudents, newStudentEntry]);
    console.log("Aluno salvo localmente (simulado):", newStudentEntry);
    console.log("Todos os alunos salvos localmente:", [...savedStudents, newStudentEntry]);

    setToastMessage('Aluno salvo localmente com sucesso!');
    setToastType('success');
    setShowToast(true);
    setIsSubmitting(false);
    
    // navigate('/alunos'); // Consider navigating after success
  };

  const handleCancel = () => {
    navigate('/alunos'); 
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <Toast 
        message={toastMessage} 
        type={toastType} 
        show={showToast} 
        onClose={() => setShowToast(false)} 
      />
      <div className="bg-light-bg-card dark:bg-dark-card p-6 md:p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl md:text-3xl font-semibold text-brand-orange mb-8">
          Adicionar Novo Aluno
        </h1>
        <AlunoForm 
          onSubmit={handleFormSubmit} 
          onCancel={handleCancel}
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  );
};

export default AddStudentPage;