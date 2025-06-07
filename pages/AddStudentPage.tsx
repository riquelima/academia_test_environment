
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlunoForm from '../components/AlunoForm';
import { StudentFormData } from '../schemas/studentSchema';
import Toast from '../components/Toast'; 
import { Student } from '../types';
import { studentsData, mockAdminUser } from '../data/mockData'; // Import studentsData to modify

const AddStudentPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  const handleFormSubmit = async (data: StudentFormData) => {
    setIsSubmitting(true);
    
    const emailExistsInStudents = studentsData.some(student => student.email === data.email);
    const emailIsAdmin = mockAdminUser.email === data.email;

    if (emailExistsInStudents || emailIsAdmin) {
      setToastMessage('Este e-mail já está em uso. Por favor, utilize outro.');
      setToastType('error');
      setShowToast(true);
      setIsSubmitting(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    const newStudentId = `s_new_${Date.now()}`;
    const newStudent: Student = {
      id: newStudentId,
      photoUrl: data.avatar || `https://picsum.photos/seed/${newStudentId}/60/60`, 
      name: data.fullName,
      cpf: data.cpf,
      phone: data.phone,
      email: data.email, 
      dateOfBirth: data.dateOfBirth,
      objectives: data.objectives,
      paymentStatus: 'Pendente', 
      observations: data.observations,
      assignedTrainingIds: [],
      enrolledClassIds: [],
    };

    studentsData.push(newStudent); 

    console.log("Novo aluno adicionado (simulado):", newStudent);
    console.log("Todos os alunos (após adição):", studentsData);


    setToastMessage('Aluno cadastrado com sucesso! Credenciais de acesso criadas.');
    setToastType('success');
    setShowToast(true);
    setIsSubmitting(false);
    
    setTimeout(() => {
       // navigate('/alunos'); 
    }, 1500);
  };

  const handleCancel = () => {
    navigate('/alunos'); 
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <Toast 
        message={toastMessage} 
        type={toastType} 
        show={showToast} 
        onClose={() => setShowToast(false)} 
      />
      <div className="bg-light-bg-card dark:bg-dark-card p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-brand-orange mb-1 sm:mb-2">
          Adicionar Novo Aluno
        </h1>
        <p className="text-xs sm:text-sm text-medium-text-light dark:text-medium-text mb-6 sm:mb-8">
          Preencha os dados abaixo para cadastrar um novo aluno. O e-mail e senha informados serão utilizados para o login do aluno no sistema.
        </p>
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