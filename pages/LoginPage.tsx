import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { mockUser } from '../data/mockData';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (email === 'admin@academia.com' && password === '1234') {
      login(mockUser);
      navigate('/dashboard');
    } else {
      setError('E-mail ou senha inválidos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg-main dark:bg-dark-bg p-4">
      <div className="bg-light-bg-card dark:bg-dark-card p-8 rounded-xl shadow-2xl w-full max-w-md">
        <img
          src="https://picsum.photos/seed/128logo/80/80" 
          alt="Logo da 12/8 Academia"
          className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
        />
        <h1 className="text-3xl font-bold text-brand-orange mb-2 text-center">12/8 Academia</h1>
        <p className="text-center text-medium-text-light dark:text-medium-text mb-8">Bem-vindo de volta!</p>
        
        {error && <p className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-medium-text-light dark:text-medium-text mb-1">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-light-border dark:border-dark-border rounded-lg text-dark-text dark:text-light-text focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="seuemail@exemplo.com"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-medium-text-light dark:text-medium-text mb-1">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-light-border dark:border-dark-border rounded-lg text-dark-text dark:text-light-text focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-brand-orange text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
          >
            Entrar
          </button>
        </form>
        <p className="mt-8 text-xs text-center text-medium-text-light dark:text-medium-text bg-gray-100 dark:bg-dark-border p-3 rounded-md">
          <strong>Senha de teste:</strong><br />
          Email: <code className="text-orange-600 dark:text-orange-400">admin@academia.com</code><br/>
          Senha: <code className="text-orange-600 dark:text-orange-400">1234</code>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;