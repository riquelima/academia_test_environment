import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 dark:bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-light-bg-card dark:bg-dark-card p-4 sm:p-6 rounded-xl shadow-xl w-full max-w-md md:max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold text-dark-text dark:text-light-text">{title}</h2>
          <button
            onClick={onClose}
            className="text-medium-text-light dark:text-medium-text hover:text-dark-text dark:hover:text-light-text text-2xl sm:text-3xl p-1 -mr-2"
            aria-label="Fechar modal"
          >
            &times;
          </button>
        </div>
        <div className="overflow-y-auto flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;