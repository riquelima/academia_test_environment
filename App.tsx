
import React, { useState, createContext, useContext, useMemo, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ThemeToggleButton from './components/ThemeToggleButton';
import { User } from './types';

// Admin imports
import AdminDashboardPage from './pages/DashboardPage';
import AdminStudentsPage from './pages/StudentsPage';
import AdminAddStudentPage from './pages/AddStudentPage';
import AdminTrainingsPage from './pages/TrainingsPage';
import AdminSchedulePage from './pages/SchedulePage';
import AdminSidebar from './components/Sidebar';
import AdminHeader from './components/Header';

// Student imports
import StudentMainLayout from './student/layouts/StudentMainLayout'; 
import StudentDashboardPage from './student/pages/StudentDashboardPage';
import StudentMyTrainingsPage from './student/pages/StudentMyTrainingsPage';
import StudentMyClassesPage from './student/pages/StudentMyClassesPage';
import StudentPerformancePage from './student/pages/StudentPerformancePage';


interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isMobileSidebarOpen: boolean;
  toggleMobileSidebar: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const htmlElement = document.documentElement;
    if (savedTheme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, []);

  const login = (loggedInUser: User) => {
    setIsAuthenticated(true);
    setUser(loggedInUser);
    setIsMobileSidebarOpen(false); // Close sidebar on login
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setIsMobileSidebarOpen(false); // Close sidebar on logout
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(prev => !prev);
  };
  
  const authContextValue = useMemo(
    () => ({ isAuthenticated, user, login, logout, isMobileSidebarOpen, toggleMobileSidebar }),
    [isAuthenticated, user, isMobileSidebarOpen]
  );

  if (!isAuthenticated) {
    return (
      <AuthContext.Provider value={authContextValue}>
        <ThemeToggleButton /> 
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthContext.Provider>
    );
  }

  // Render layout based on user role
  return (
    <AuthContext.Provider value={authContextValue}>
      <ThemeToggleButton />
      {user?.role === 'admin' && (
        <div className="flex h-screen bg-light-bg-main text-dark-text dark:bg-dark-bg dark:text-light-text overflow-hidden">
          <AdminSidebar />
          {isMobileSidebarOpen && <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={toggleMobileSidebar}></div>}
          <div className="flex-1 flex flex-col overflow-hidden">
            <AdminHeader />
            <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-light-bg-main dark:bg-dark-bg p-4 sm:p-6 md:p-8 ${isMobileSidebarOpen ? 'md:ml-64' : ''}`}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<AdminDashboardPage />} />
                <Route path="/alunos" element={<AdminStudentsPage />} />
                <Route path="/alunos/novo" element={<AdminAddStudentPage />} /> 
                <Route path="/treinos" element={<AdminTrainingsPage />} />
                <Route path="/agenda" element={<AdminSchedulePage />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </main>
          </div>
        </div>
      )}
      {user?.role === 'student' && (
         <StudentMainLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/aluno/dashboard" />} />
            <Route path="/aluno/dashboard" element={<StudentDashboardPage />} />
            <Route path="/aluno/meus-treinos" element={<StudentMyTrainingsPage />} />
            <Route path="/aluno/minhas-aulas" element={<StudentMyClassesPage />} />
            <Route path="/aluno/meu-desempenho" element={<StudentPerformancePage />} />
            <Route path="*" element={<Navigate to="/aluno/dashboard" />} />
          </Routes>
        </StudentMainLayout>
      )}
    </AuthContext.Provider>
  );
};

export default App;