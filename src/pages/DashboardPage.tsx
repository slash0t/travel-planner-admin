import React, { useEffect, useState } from 'react';
import { Map, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';
import { getRoutes, getReviews } from '../services/api';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalRoutes: 0,
    totalReviews: 0,
    pendingModeration: 0,
    recentlyModerated: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [pendingRoutes, setPendingRoutes] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [routesData, reviewsData] = await Promise.all([
          getRoutes(1, 1),
          getReviews(undefined, 1, 1)
        ]);
        
        setStats({
          totalRoutes: routesData.total,
          totalReviews: reviewsData.total,
          pendingModeration: Math.floor(Math.random() * 20) + 5, // Mock data
          recentlyModerated: Math.floor(Math.random() * 50) + 10 // Mock data
        });

        // Fetch pending routes and recent reviews
        setPendingRoutes(Array(5).fill(0).map((_, i) => ({
          id: `route-${i + 1}`,
          title: `Новый маршрут ${i + 1}`,
          author: `Пользователь ${i + 10}`,
          submittedAt: new Date(Date.now() - i * 86400000).toISOString(),
          status: 'pending'
        })));

        setRecentReviews(Array(5).fill(0).map((_, i) => ({
          id: `review-${i + 1}`,
          routeTitle: `Маршрут по Карелии ${i + 1}`,
          rating: Math.floor(Math.random() * 5) + 1,
          createdAt: new Date(Date.now() - i * 86400000).toISOString()
        })));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const StatCard = ({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 ${loading ? 'animate-pulse' : ''}`}>
      <div className="flex items-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold">{loading ? '-' : value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Дашборд</h1>
        <p className="text-gray-600">Обзор контента и задач модерации</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Всего маршрутов" 
          value={stats.totalRoutes} 
          icon={<Map size={24} className="text-white" />}
          color="bg-[#484dd3]"
        />
        <StatCard 
          title="Всего отзывов" 
          value={stats.totalReviews} 
          icon={<MessageSquare size={24} className="text-white" />}
          color="bg-[#84ba83]"
        />
        <StatCard 
          title="Ожидают модерации" 
          value={stats.pendingModeration} 
          icon={<AlertTriangle size={24} className="text-white" />}
          color="bg-[#f1c021]"
        />
        <StatCard 
          title="Недавно модерировано" 
          value={stats.recentlyModerated} 
          icon={<CheckCircle size={24} className="text-white" />}
          color="bg-[#ea2517]"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold mb-4">Маршруты на модерации</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Название</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Автор</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Отправлен</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded"></div></td>
                      <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded"></div></td>
                      <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded"></div></td>
                      <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded"></div></td>
                    </tr>
                  ))
                ) : (
                  pendingRoutes.map((route) => (
                    <tr key={route.id}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{route.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{route.author}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(route.submittedAt).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Ожидает проверки
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold mb-4">Последние отзывы</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Маршрут</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Оценка</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Добавлен</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded"></div></td>
                      <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded"></div></td>
                      <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded"></div></td>
                    </tr>
                  ))
                ) : (
                  recentReviews.map((review) => (
                    <tr key={review.id}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{review.routeTitle}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {review.rating} ★
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;