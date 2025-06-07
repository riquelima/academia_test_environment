
import { StatCardData, ScheduledClass, Student, Training, TrainingObjective, Exercise, TrainingSplit, User, AvailableClass } from '../types';
import { IconUsers, IconTrendingUp, IconTrendingDown, IconSparkles, IconCheckCircle, IconDollar, IconActivity } from '../constants.tsx'; 
import React from 'react';

export const mockAdminUser: User = {
  email: 'admin@academia.com',
  name: 'Administrador', 
  avatarUrl: 'https://picsum.photos/seed/admin/40/40',
  role: 'admin',
};

export const mockStudentUser: User = {
  email: 'aluno@academia.com',
  name: 'Aluno Teste',
  avatarUrl: 'https://picsum.photos/seed/alunoteste/40/40',
  role: 'student',
  studentId: 's_aluno01' 
};


export const objectiveSuggestions: string[] = [
  'Hipertrofia',
  'Perda de peso',
  'Definição muscular',
  'Força',
  'Resistência',
  'Reabilitação',
  'Flexibilidade',
  'Condicionamento físico',
  'Ganho de peso',
  'Preparação para competição',
  'Mobilidade',
  'Melhora cardiovascular',
  'Redução de gordura localizada'
];

export const daysOfWeek: string[] = [
  'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'
];

export const dashboardStats: StatCardData[] = [
  {
    title: 'Alunos Ativos',
    value: '152',
    change: '+5 desde mês passado',
    changeType: 'positive',
    icon: React.createElement(IconUsers, { className: 'w-8 h-8' }),
  },
  {
    title: 'Novos Alunos (Mês)',
    value: '18',
    change: '+12% vs mês anterior',
    changeType: 'positive',
    icon: React.createElement(IconTrendingUp, { className: 'w-8 h-8' }),
  },
  {
    title: 'Cancelamentos (Mês)',
    value: '4',
    change: '-2 vs mês anterior',
    changeType: 'negative',
    icon: React.createElement(IconTrendingDown, { className: 'w-8 h-8' }),
  },
  {
    title: 'Aulas Hoje', 
    value: '3',
    details: 'Spinning, Funcional, Yoga', 
    icon: React.createElement(IconActivity, { className: 'w-8 h-8', strokeWidth: 1.5 }),
  },
  {
    title: 'Presenças Hoje',
    value: '78',
    change: '+8% vs ontem',
    changeType: 'positive',
    icon: React.createElement(IconCheckCircle, { className: 'w-8 h-8' }),
  },
  {
    title: 'Receita (Mês)', 
    value: 'R$ 12.3K', 
    change: '+7% vs mês anterior',
    changeType: 'positive',
    icon: React.createElement(IconDollar, { className: 'w-8 h-8' }),
  },
];

export const scheduledClassesData: ScheduledClass[] = [
  { id: '1', name: 'Aula de Spinning', teacher: 'Prof. João', dayOfWeek: 'Terça-feira', classTime: '18:00', spotsFilled: 15, totalSpots: 20, observations: 'Aula intensa, trazer toalha e água.' },
  { id: '2', name: 'Yoga Restaurativa', teacher: 'Prof. Maria', dayOfWeek: 'Quarta-feira', classTime: '09:00', spotsFilled: 8, totalSpots: 12 },
  { id: '3', name: 'Treinamento Funcional', teacher: 'Prof. Lucas', dayOfWeek: 'Sexta-feira', classTime: '07:00', spotsFilled: 10, totalSpots: 15, observations: 'Foco em core e mobilidade.' },
  { id: '4', name: 'Pilates Solo', teacher: 'Prof. Ana', dayOfWeek: 'Segunda-feira', classTime: '19:00', spotsFilled: 5, totalSpots: 10, observations: 'Para iniciantes e intermediários.' },
  { id: '5', name: 'HIIT Intenso', teacher: 'Prof. Carlos', dayOfWeek: 'Quinta-feira', classTime: '17:30', spotsFilled: 18, totalSpots: 20, observations: 'Prepare-se para suar!' },
];

export const studentsData: Student[] = [
  { 
    id: 's_aluno01', 
    photoUrl: 'https://picsum.photos/seed/alunoteste/60/60', 
    name: 'Aluno Teste', 
    cpf: '100.000.000-01', 
    phone: '(11) 90000-0001', 
    email: 'aluno@academia.com', 
    dateOfBirth: '1995-08-15', 
    objectives: ['Hipertrofia', 'Condicionamento físico'], 
    paymentStatus: 'Em dia', 
    assignedTrainingIds: ['t1', 't3'], 
    enrolledClassIds: ['1', '3'],
    currentTrainingId: 't1',
    observations: 'Aluno dedicado, focado em resultados.'
  },
  { id: 's1', photoUrl: 'https://picsum.photos/seed/andromeda/40/40', name: 'Andromeda Ximenes', cpf: '048.689.068-54', phone: '(85) 85441-2345', paymentStatus: 'Em dia', objectives: ['Hipertrofia', 'Definição muscular'], email: 'andromeda.ximenes@example.com', dateOfBirth: '1990-05-15', observations: 'Prefere treinos pela manhã.', assignedTrainingIds: ['t2'], enrolledClassIds: ['2'] },
  { id: 's2', photoUrl: 'https://picsum.photos/seed/azvdo/40/40', name: 'Azvdo Pereira', cpf: '454.754.545-47', phone: '(45) 47545-4747', paymentStatus: 'Em dia', objectives: ['Perda de peso', 'Condicionamento físico'], email: 'azvdo.pereira@example.com', dateOfBirth: '1985-11-20', assignedTrainingIds: ['t4'], enrolledClassIds: [] },
  { id: 's3', photoUrl: 'https://picsum.photos/seed/henrique/40/40', name: 'Henrique Lima', cpf: '123.456.789-00', phone: '(98) 76489-4321', paymentStatus: 'Em dia', objectives: ['Força', 'Preparação para competição'], email: 'henrique.lima@example.com', dateOfBirth: '1998-02-10', observations: 'Foco em hipertrofia.', assignedTrainingIds: ['t3'], enrolledClassIds: ['1', '5'] },
  { id: 's4', photoUrl: 'https://picsum.photos/seed/carla/40/40', name: 'Carla Souza', cpf: '111.222.333-44', phone: '(99) 88776-6554', paymentStatus: 'Atrasado', objectives: ['Reabilitação', 'Flexibilidade'], email: 'carla.souza@example.com', dateOfBirth: '1992-07-30', assignedTrainingIds: [], enrolledClassIds: ['4'] },
  { id: 's5', photoUrl: 'https://picsum.photos/seed/bruno/40/40', name: 'Bruno Alves', cpf: '555.666.777-88', phone: '(91) 23456-7890', paymentStatus: 'Pendente', objectives: ['Ganho de peso'], email: 'bruno.alves@example.com', dateOfBirth: '2000-12-01', observations: 'Iniciante.', assignedTrainingIds: ['t1'], enrolledClassIds: [] },
];

const sampleExercises: Exercise[] = [
    { id: 'ex1', name: 'Supino Reto', series: '3x', repetitions: '10-12', carga: '30kg', restTime: '60s', observation: 'Foco na execução lenta.' },
    { id: 'ex2', name: 'Agachamento Livre', series: '4x', repetitions: '8-10', carga: '50kg', restTime: '90s' },
    { id: 'ex3', name: 'Puxada Frontal', series: '3x', repetitions: '12-15', carga: '25kg', restTime: '60s' },
    { id: 'ex4', name: 'Corrida Esteira', series: '1x', repetitions: '20min', restTime: 'N/A', observation: 'Manter ritmo constante.' },
    { id: 'ex5', name: 'Rosca Direta', series: '3x', repetitions: '10', carga: '10kg/lado', restTime: '45s' },
];

export const trainingsData: Training[] = [
  { 
    id: 't1', 
    name: 'Back Workout', 
    associatedStudents: 12, 
    objective: ['Hipertrofia', 'Força'], 
    splits: [
      { id: 'ts1a', customName: 'Pull Day', exercises: [sampleExercises[0], sampleExercises[2]] },
      { id: 'ts1b', customName: 'Accessory Lifts', exercises: [sampleExercises[4]] },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFjayUyMHdvcmtvdXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    duration: '58min',
    calories: '254kcal',
  },
  { 
    id: 't2', 
    name: 'Cardio Blast', 
    associatedStudents: 15, 
    objective: ['Perda de Peso', 'Condicionamento Físico'], 
    splits: [
        { id: 'ts2a', customName: 'HIIT Session', exercises: [sampleExercises[3], {id: 'ex6', name: 'Bicicleta Ergométrica', series: '1x', repetitions: '25min', carga: 'Leve'}] },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FyZGlvJTIwd29ya291dHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    duration: '45min',
    calories: '350kcal',
  },
  { 
    id: 't3', 
    name: 'Strength Foundation', 
    associatedStudents: 8, 
    objective: ['Força'], 
    splits: [
        { id: 'ts3a', customName: 'Compound Lifts', exercises: [sampleExercises[1], sampleExercises[0]] },
        { id: 'ts3b', customName: 'Isolation Work', exercises: [sampleExercises[2], sampleExercises[4]] },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c3RyZW5ndGglMjB0cmFpbmluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    duration: '60min',
    calories: '300kcal',
  },
   { 
    id: 't4', 
    name: 'Muscle Endurance', 
    associatedStudents: 5, 
    objective: ['Resistência'], 
    splits: [
      { id: 'ts4a', customName: 'Full Body Circuit', exercises: [sampleExercises[0], sampleExercises[1], sampleExercises[2], sampleExercises[3], sampleExercises[4]] },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d2576993484c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZW5kdXJhbmNlJTIwdHJhaW5pbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    duration: '50min',
    calories: '280kcal',
  },
];


export const availableClassesForScheduling: AvailableClass[] = [
  { id: 'av1', name: 'Yoga Flow Matinal', teacher: 'Prof. Sofia', description: 'Comece o dia com energia e flexibilidade.', capacity: 15, duration: '60 min', dayOfWeek: 'Segunda-feira', classTime: '07:00'},
  { id: 'av2', name: 'Boxe Fitness', teacher: 'Prof. Ricardo', description: 'Queime calorias e alivie o estresse com socos e esquivas.', capacity: 12, duration: '50 min', dayOfWeek: 'Terça-feira', classTime: '19:00' },
  { id: 'av3', name: 'Alongamento e Mobilidade', teacher: 'Prof. Laura', description: 'Melhore sua postura e previna lesões.', capacity: 20, duration: '45 min', dayOfWeek: 'Quarta-feira', classTime: '10:00' },
  { id: 'av4', name: 'Zumba Party', teacher: 'Prof. Gabriela', description: 'Dance, divirta-se e entre em forma!', capacity: 25, duration: '55 min', dayOfWeek: 'Quinta-feira', classTime: '18:30' },
  { id: 'av5', name: 'Cross Training Challenge', teacher: 'Prof. Bruno', description: 'Desafie seus limites com um treino completo e dinâmico.', capacity: 10, duration: '75 min', dayOfWeek: 'Sexta-feira', classTime: '17:00' },
];

export const motivationalMessages: string[] = [
  "Acredite em você, cada gota de suor te aproxima do seu objetivo!",
  "A jornada é longa, mas a vista do topo vale a pena. Não desista!",
  "Hoje é um novo dia para superar seus limites. Vamos nessa!",
  "Seu corpo é seu templo. Cuide bem dele!",
  "Pequenos progressos diários levam a grandes resultados. Continue firme!",
  "A dor é temporária, o orgulho é para sempre. Força!",
  "Você é mais forte do que imagina. Supere-se!",
  "Não espere por motivação, crie o hábito. Você consegue!",
  "Lembre-se do porquê você começou. Isso te dará forças!",
  "Cada treino é um investimento na sua saúde e bem-estar."
];
