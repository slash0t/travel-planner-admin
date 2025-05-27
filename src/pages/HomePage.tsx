import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAccessClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleAccessClick}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          {isAuthenticated ? 'Перейти в панель администратора' : 'Войти в админ панель'}
        </button>
      </div>

      <div className="mb-6 text-center">
        <img 
          src="/logo.png" 
          alt="Путевод логотип" 
          className="mx-auto mb-4 w-24 h-24"
        />
        <h2 className="text-4xl font-bold mt-4">Путевод</h2>
        <h1 className="text-3xl font-bold text-gray-800">Проект команды 9.3</h1>
        <p className="text-xl text-gray-600 italic mt-2">Мобильное приложение для организации путешествий</p>
      </div>

      <div className="flex justify-center mt-4 mb-6">
        <div className="flex flex-wrap justify-center gap-2">
          <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white" alt="Java" />
          <img src="https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Spring Boot" />
          <img src="https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white" alt="Flutter" />
          <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
          <img src="https://img.shields.io/badge/Dart-0175C2?style=for-the-badge&logo=dart&logoColor=white" alt="Dart" />
          <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="border-t border-b border-gray-300 py-4 my-6 text-center">
          <p className="text-gray-700 italic">Путевод - это инновационная платформа для планирования и организации путешествий, которая помогает создавать незабываемые приключения.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">👥 Команда разработчиков</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Роль</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Участник</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-4 text-sm">
                    <span className="font-medium">🚀 Team Lead & Fullstack Developer <br />& Технический писатель</span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">Шульженко Даниил</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 text-sm">
                    <span className="font-medium">⚙️ DevOps & Fullstack Developer</span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">Едрышов Артем</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 text-sm">
                    <span className="font-medium">📊 Project Manager</span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">Сторожев Иван</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 text-sm">
                    <span className="font-medium">🔧 Backend Developer & Тестировщик</span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">Ткачук Матвей</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🛠️ Технологический стек</h2>
          
          <div className="flex flex-col md:flex-row justify-between">
            <div className="w-full md:w-1/2 text-center mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-3">Backend</h3>
              <div className="flex justify-center gap-2 flex-wrap">
                <img src="https://img.shields.io/badge/Java-ED8B00?style=flat-square&logo=java&logoColor=white" alt="Java" />
                <img src="https://img.shields.io/badge/Spring%20Boot-6DB33F?style=flat-square&logo=spring&logoColor=white" alt="Spring Boot" />
                <img src="https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
              </div>
            </div>

            <div className="w-full md:w-1/2 text-center">
              <h3 className="text-xl font-bold mb-3">Frontend</h3>
              <div className="flex justify-center gap-2 flex-wrap">
                <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
                <img src="https://img.shields.io/badge/Flutter-02569B?style=flat-square&logo=flutter&logoColor=white" alt="Flutter" />
                <img src="https://img.shields.io/badge/Dart-0175C2?style=flat-square&logo=dart&logoColor=white" alt="Dart" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🔗 Полезные сервисы</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сервис</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Описание</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ссылка</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-4 text-sm font-medium">📋 YouGile</td>
                  <td className="px-4 py-4 text-sm text-gray-700">Управление проектом</td>
                  <td className="px-4 py-4 text-sm">
                    <a href="https://ru.yougile.com/board/omhvp9x1qyhi" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Доска проекта</a>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 text-sm font-medium">🎯 Miro</td>
                  <td className="px-4 py-4 text-sm text-gray-700">Диаграммы и планирование</td>
                  <td className="px-4 py-4 text-sm">
                    <a href="https://miro.com/app/board/uXjVIYva4nE=/?share_link_id=394660775732" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Рабочая доска</a>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 text-sm font-medium">🎨 Figma</td>
                  <td className="px-4 py-4 text-sm text-gray-700">Дизайн интерфейса</td>
                  <td className="px-4 py-4 text-sm">
                    <a href="https://www.figma.com/design/i1XMvFY416x6mRHShnTiae/%D0%9C%D0%B0%D0%BA%D0%B5%D1%82%D1%8B-%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%BE%D0%B2?node-id=0-1&t=V7XbBXds7FWrAqtp-1" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Макеты экранов</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🏗️ Архитектура проекта</h2>
          
          <h3 className="text-xl font-bold mb-3">📦 Модули проекта</h3>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Компонент</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Технологии</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Репозиторий</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-4 text-sm font-medium">📝 Документация</td>
                  <td className="px-4 py-4 text-sm text-gray-700">-</td>
                  <td className="px-4 py-4 text-sm">
                    <a href="https://github.com/slash0t/travel-planner" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Перейти к репозиторию</a>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 text-sm font-medium">🔧 Backend API</td>
                  <td className="px-4 py-4 text-sm text-gray-700">Java, Spring Boot, PostgreSQL</td>
                  <td className="px-4 py-4 text-sm">
                    <a href="https://github.com/slash0t/travel-planner-backend" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Перейти к репозиторию</a>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 text-sm font-medium">📱 Android приложение</td>
                  <td className="px-4 py-4 text-sm text-gray-700">Flutter, Dart</td>
                  <td className="px-4 py-4 text-sm">
                    <a href="https://github.com/slash0t/travel-planner-android" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Перейти к репозиторию</a>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 text-sm font-medium">💻 Админ панель</td>
                  <td className="px-4 py-4 text-sm text-gray-700">React</td>
                  <td className="px-4 py-4 text-sm">
                    <a href="https://github.com/slash0t/travel-planner-admin" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Перейти к репозиторию</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold mb-3">📚 API контракты (Swagger)</h3>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сервис</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Описание</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ссылка</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-4 text-sm font-medium">🔐 Auth Service</td>
                  <td className="px-4 py-4 text-sm text-gray-700">Сервис аутентификации и авторизации</td>
                  <td className="px-4 py-4 text-sm">
                    <a href="https://www.putevod-app.ru/auth/swagger-ui/index.html#/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Swagger UI</a>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 text-sm font-medium">📝 Planner Service</td>
                  <td className="px-4 py-4 text-sm text-gray-700">Сервис планирования путешествий</td>
                  <td className="px-4 py-4 text-sm">
                    <a href="https://www.putevod-app.ru/planner/swagger-ui/index.html#/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Swagger UI</a>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 text-sm font-medium">🌐 External Service</td>
                  <td className="px-4 py-4 text-sm text-gray-700">Интеграция с внешними сервисами</td>
                  <td className="px-4 py-4 text-sm">
                    <a href="https://www.putevod-app.ru/external/swagger-ui/index.html#/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Swagger UI</a>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 text-sm font-medium">📚 Library Service</td>
                  <td className="px-4 py-4 text-sm text-gray-700">Сервис хранения информации</td>
                  <td className="px-4 py-4 text-sm">
                    <a href="https://www.putevod-app.ru/library/swagger-ui/index.html#/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Swagger UI</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 