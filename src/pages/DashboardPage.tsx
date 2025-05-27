import React, { useEffect, useState } from 'react';
import { Map, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';
import { getRoutes, getReviews } from '../services/api';

interface Author {
  id: number;
  username: string;
  avatarUrl: string | null;
}

interface Route {
  id: number;
  title: string;
  description: string;
  author: Author;
  countries: string[];
  cities: string[];
  duration: number;
  rating: number;
  reviewsCount: number;
  previewImageUrl: string;
  tags: string[];
  createdAt: string;
  status?: 'pending' | 'published';
}

interface Review {
  id: number;
  routeId: number;
  author: Author;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface PageResponse {
  content: Route[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
  };
  totalElements: number;
  totalPages: number;
  numberOfElements: number;
}

interface ReviewPageResponse {
  content: Review[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  empty: boolean;
}

const DashboardPage: React.FC = () => {
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [pendingRoutes, setPendingRoutes] = useState<Route[]>([]);

  const [stats, setStats] = useState({
    totalRoutes: 0,
    totalReviews: 0,
    pendingModeration: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  // Update stats whenever routes or pendingRoutes change
  useEffect(() => {
    setStats({
      totalRoutes: routes.length + pendingRoutes.length,
      totalReviews: recentReviews.length,
      pendingModeration: pendingRoutes.length,
    });
  }, [routes, pendingRoutes, recentReviews]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const routesResponse: PageResponse = await getRoutes(1, 9999999, {}, false);
      setRoutes(routesResponse.content);

      const perndingRoutesResponse: PageResponse = await getRoutes(1, 9999999, {}, true);
      setPendingRoutes(perndingRoutesResponse.content);

      const reviewsResponse: ReviewPageResponse = await getReviews();
      console.log('reviewsResponse', reviewsResponse);
      setRecentReviews(reviewsResponse.content);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
        {/*
        <StatCard 
          title="Недавно модерировано" 
          value={stats.recentlyModerated} 
          icon={<CheckCircle size={24} className="text-white" />}
          color="bg-[#ea2517]"
        />
        */}
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
                      <td className="px-4 py-3 text-sm text-gray-500">{route.author.username}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(route.createdAt).toLocaleDateString('ru-RU')}
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
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{routes.find(route => route.id === review.routeId)?.title || 'Неизвестный маршрут'}</td>
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