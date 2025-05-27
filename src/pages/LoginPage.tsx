import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader, Map } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Пожалуйста, введите имя пользователя и пароль');
      return;
    }
    
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Неверное имя пользователя или пароль');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Произошла ошибка при входе. Пожалуйста, попробуйте позже.');
      } else {
        setError('Произошла ошибка при входе. Пожалуйста, попробуйте позже.');
      }
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e7e4dc] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Logo and header */}
          <div className="p-6 bg-black text-white text-center">
            <div className="flex justify-center items-center mb-2">
              <Map size={28} className="text-[#ea2517] mr-2" />
            </div>
            <h1 className="text-2xl font-bold tracking-wider">
              <span className="text-white">ПУТЕВОД</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">Панель администратора</p>
          </div>
          
          {/* Login form */}
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Почта пользователя
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ea2517] focus:border-transparent"
                  placeholder="Введите почту пользователя"
                  disabled={loading}
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Пароль
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ea2517] focus:border-transparent"
                  placeholder="Введите пароль"
                  disabled={loading}
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-[#ea2517] text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-70 flex justify-center items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader size={20} className="animate-spin mr-2" />
                    Вход...
                  </>
                ) : (
                  'Войти'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;