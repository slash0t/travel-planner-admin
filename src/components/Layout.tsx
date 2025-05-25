import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Map, List, BarChart2, LogOut } from 'lucide-react';

const Layout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#e7e4dc]">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-black text-white flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-2xl font-bold tracking-wider">
            <span className="text-white">ПУТЕВОД</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">Панель администратора</p>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/" 
                className={`flex items-center p-2 rounded-md transition-colors hover:bg-gray-800 ${location.pathname === '/' ? 'bg-gray-800' : ''}`}
              >
                <BarChart2 size={20} className="mr-3" />
                <span>Дашборд</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/routes" 
                className={`flex items-center p-2 rounded-md transition-colors hover:bg-gray-800 ${location.pathname === '/routes' ? 'bg-gray-800' : ''}`}
              >
                <Map size={20} className="mr-3" />
                <span>Маршруты</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/reviews" 
                className={`flex items-center p-2 rounded-md transition-colors hover:bg-gray-800 ${location.pathname === '/reviews' ? 'bg-gray-800' : ''}`}
              >
                <List size={20} className="mr-3" />
                <span>Отзывы</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="flex items-center p-2 w-full text-left rounded-md transition-colors hover:bg-gray-800"
          >
            <LogOut size={20} className="mr-3" />
            <span>Выйти</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;