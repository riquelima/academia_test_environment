
import React from 'react';
import StudentSidebar from '../components/StudentSidebar';
import StudentHeader from '../components/StudentHeader';

interface StudentMainLayoutProps {
  children: React.ReactNode;
}

const StudentMainLayout: React.FC<StudentMainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-light-bg-main text-dark-text dark:bg-dark-bg dark:text-light-text">
      <StudentSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <StudentHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-light-bg-main dark:bg-dark-bg p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StudentMainLayout;
