
import { StudentFormData } from './schemas/studentSchema'; 

export interface User {
  email: string;
  name: string;
  avatarUrl?: string;
  role: 'admin' | 'student'; // Added role
  studentId?: string; // Added studentId, optional for admin, required for student
}

export interface StatCardData {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactElement<React.SVGAttributes<SVGElement>>;
  details?: string;
}

export interface ScheduledClass {
  id: string;
  name: string;
  teacher: string;
  dayOfWeek: string; 
  classTime: string; 
  spotsFilled: number;
  totalSpots: number;
  observations?: string; 
}

// New type for classes available for scheduling by students
export interface AvailableClass {
  id: string;
  name: string;
  teacher: string;
  description: string;
  capacity: number;
  duration: string; // e.g., "60 min"
  dayOfWeek?: string; // Optional, if it's a recurring class with a fixed day
  classTime?: string; // Optional
}

export interface Student {
  id: string;
  photoUrl: string; 
  name: string; 
  cpf: string;
  phone?: string; 
  email: string; 
  dateOfBirth: string; 
  objectives: string[]; 
  paymentStatus: 'Em dia' | 'Atrasado' | 'Pendente'; 
  observations?: string; 
  assignedTrainingIds?: string[]; // IDs of trainings assigned to this student
  enrolledClassIds?: string[]; // IDs of classes this student is enrolled in
  currentTrainingId?: string; // Optional: ID of the current active training
}

export enum TrainingObjective {
  HIPERTROFIA = 'Hipertrofia',
  RESISTENCIA = 'Resistência',
  FORCA = 'Força',
  PERDA_PESO = 'Perda de Peso',
}

export interface Exercise {
  id: string;
  name: string;
  series: string; 
  repetitions: string; 
  carga?: string; 
  restTime?: string; 
  observation?: string;
}

export interface TrainingSplit {
  id: string;
  customName: string; 
  exercises: Exercise[];
}

export interface Training {
  id: string;
  name: string; 
  associatedStudents: number; // This might be less relevant for student view of a single training
  objective: string[]; 
  splits: TrainingSplit[]; 
  imageUrl?: string; 
  duration?: string; 
  calories?: string; 
}

export interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export type NewStudentFormData = StudentFormData;
