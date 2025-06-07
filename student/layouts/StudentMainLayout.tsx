
import React from 'react';
import StudentSidebar from '../components/StudentSidebar';
import StudentHeader from '../components/StudentHeader';
import { useAuth } from '../../App'; // Import useAuth to get sidebar state

interface StudentMainLayoutProps {
  children: React.ReactNode;
}

const StudentMainLayout: React.FC<StudentMainLayoutProps> = ({ children }) => {
  const { isMobileSidebarOpen, toggleMobileSidebar } = useAuth();

  return (
    <div className="flex h-screen bg-light-bg-main text-dark-text dark:bg-dark-bg dark:text-light-text overflow-hidden">
      <StudentSidebar />
      {/* Overlay for mobile */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 md:hidden" 
          onClick={toggleMobileSidebar}
          aria-hidden="true"
        ></div>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <StudentHeader />
        <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-light-bg-main dark:bg-dark-bg p-4 sm:p-6 md:p-8 ${isMobileSidebarOpen ? 'md:ml-64' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default StudentMainLayout;