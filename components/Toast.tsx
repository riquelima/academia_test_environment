import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  show: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, show, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, onClose, duration]);

  if (!show) return null;

  let bgColor = 'bg-brand-orange dark:bg-orange-600'; // Default for info
  let textColor = 'text-white';
  if (type === 'success') {
    bgColor = 'bg-green-500 dark:bg-green-600'; 
    textColor = 'text-white';
  }
  if (type === 'error') {
    bgColor = 'bg-red-500 dark:bg-red-600'; 
    textColor = 'text-white';
  }

  return (
    <div 
      className={`fixed top-5 right-5 ${bgColor} ${textColor} py-3 px-5 rounded-lg shadow-xl z-[100] flex items-center transition-all animate-fadeInRight`}
      role="alert"
      aria-live="assertive"
    >
      <span className="mr-3">{message}</span>
      <button 
        onClick={onClose} 
        className={`text-xl font-semibold hover:opacity-75 ${textColor === 'text-white' ? 'text-white dark:text-gray-200' : 'text-gray-600 dark:text-gray-300'}`}
        aria-label="Fechar notificação"
      >
        &times;
      </button>
      <style>{`
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeInRight { animation: fadeInRight 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default Toast;