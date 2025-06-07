
import { StudentFormData } from './schemas/studentSchema'; 

export interface User {
  email: string;
  name: string;
  avatarUrl?: string;
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
  associatedStudents: number;
  objective: string[]; 
  splits: TrainingSplit[]; 
  imageUrl?: string; // New: For training card image
  duration?: string; // New: For training card info (e.g., "58min")
  calories?: string; // New: For training card info (e.g., "254kcal")
  // "Sets" can be inferred from splits.length or total exercises for the card
}

export interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export type NewStudentFormData = StudentFormData;