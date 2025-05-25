import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginApi, refreshTokenApi, logoutApi } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

interface User {
  id: string;
  username: string;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  logout: async () => {},
  loading: true
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const userInfo = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (userInfo && token && refreshToken) {
          // Проверяем валидность токена или обновляем его при необходимости
          try {
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            const expiryTime = tokenData.exp * 1000; // Преобразуем в миллисекунды
            
            if (Date.now() >= expiryTime) {
              // Токен истек, пробуем обновить
              try {
                const response = await refreshTokenApi(refreshToken);
                localStorage.setItem('token', response.accessToken);
                localStorage.setItem('refreshToken', response.refreshToken);
                setUser(JSON.parse(userInfo));
                setIsAuthenticated(true);
              } catch (error) {
                console.error('Ошибка при обновлении токена:', error);
                clearAuthData();
              }
            } else {
              // Токен действителен
              setUser(JSON.parse(userInfo));
              setIsAuthenticated(true);
            }
          } catch (error) {
            console.error('Ошибка при проверке токена:', error);
            clearAuthData();
          }
        }
      } catch (error) {
        console.error('Ошибка аутентификации:', error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await loginApi(username, password);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken || '');
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        setIsAuthenticated(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Ошибка входа:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        // Вызываем API для выхода, чтобы инвалидировать refresh token
        try {
          await logoutApi(refreshToken);
        } catch (error) {
          console.error('Ошибка при вызове API выхода:', error);
          // Продолжаем выход даже при ошибке API
        }
      }
    } catch (error) {
      console.error('Ошибка выхода:', error);
    } finally {
      clearAuthData();
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};