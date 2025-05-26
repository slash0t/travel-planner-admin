import React, { useState, useEffect } from 'react';
import { Search, Filter, Trash2, AlertCircle, CheckCircle, XCircle, Eye } from 'lucide-react';
import { getRoutes, deleteRoute, approveRoute, rejectRoute } from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';

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

const RoutesPage: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<number | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [showRouteDetails, setShowRouteDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all');
  
  const [filters, setFilters] = useState({
    country: '',
    city: '',
    minRating: '',
    maxDuration: ''
  });
  
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchRoutes();
  }, [page, filters, activeTab]);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const response: PageResponse = await getRoutes(page - 1, 10, {}, activeTab === 'pending');
      setRoutes(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRoutes();
  };

  const handleFilter = () => {
    setPage(1);
    fetchRoutes();
    setShowFilters(false);
  };

  const resetFilters = () => {
    setFilters({
      country: '',
      city: '',
      minRating: '',
      maxDuration: ''
    });
    setPage(1);
    fetchRoutes();
    setShowFilters(false);
  };

  const handleDeleteClick = (routeId: number) => {
    setRouteToDelete(routeId);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (routeToDelete) {
      try {
        await deleteRoute(routeToDelete.toString());
        setRoutes(routes.filter(route => route.id !== routeToDelete));
      } catch (error) {
        console.error('Error deleting route:', error);
      } finally {
        setShowConfirmDialog(false);
        setRouteToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setRouteToDelete(null);
  };

  const handleViewDetails = (route: Route) => {
    setSelectedRoute(route);
    setShowRouteDetails(true);
  };

  const handleApproveRoute = async (routeId: number) => {
    try {
      await approveRoute(routeId.toString());
      fetchRoutes();
      setShowRouteDetails(false);
    } catch (error) {
      console.error('Error approving route:', error);
    }
  };

  const handleRejectRoute = async (routeId: number) => {
    try {
      await rejectRoute(routeId.toString());
      fetchRoutes();
      setShowRouteDetails(false);
    } catch (error) {
      console.error('Error rejecting route:', error);
    }
  };

  const RouteDetailsModal = () => {
    if (!selectedRoute) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div 
            className="fixed inset-0 transition-opacity" 
            aria-hidden="true"
            onClick={() => setShowRouteDetails(false)}
          >
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Детали маршрута
                  </h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="font-medium mb-2">{selectedRoute.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Автор: {selectedRoute.author.username}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Локация: {selectedRoute.countries.join(', ')}, {selectedRoute.cities.join(', ')}
                    </p>
                    <p className="text-sm text-gray-600">
                      Длительность: {selectedRoute.duration} {selectedRoute.duration === 1 ? 'день' : selectedRoute.duration < 5 ? 'дня' : 'дней'}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Описание</h4>
                    <p className="text-sm text-gray-600">
                      {selectedRoute.description || 'Описание отсутствует'}
                    </p>
                  </div>
                  
                  {selectedRoute.tags && selectedRoute.tags.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Теги</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedRoute.tags.map((tag, index) => (
                          <span key={index} className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              {activeTab === 'pending' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleApproveRoute(selectedRoute.id)}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    <CheckCircle size={18} className="mr-2" />
                    Опубликовать
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRejectRoute(selectedRoute.id)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    <XCircle size={18} className="mr-2" />
                    Отклонить
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setShowRouteDetails(false)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Маршруты</h1>
          <p className="text-gray-600">Управление маршрутами пользователей</p>
        </div>
        
        {/* Search and filter */}
        {/*<div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-2">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Поиск маршрутов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ea2517] focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </form>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Filter size={18} />
            <span>Фильтры</span>
          </button>
        </div> */}
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`${
                activeTab === 'all'
                  ? 'border-[#ea2517] text-[#ea2517]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Все маршруты
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`${
                activeTab === 'pending'
                  ? 'border-[#ea2517] text-[#ea2517]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              На модерации
            </button>
          </nav>
        </div>
      </div>
      
      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 animate-fade-in">
          <h3 className="text-lg font-medium mb-3">Фильтры</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Страна</label>
              <input
                type="text"
                value={filters.country}
                onChange={(e) => setFilters({...filters, country: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ea2517] focus:border-transparent"
                placeholder="Любая страна"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Город</label>
              <input
                type="text"
                value={filters.city}
                onChange={(e) => setFilters({...filters, city: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ea2517] focus:border-transparent"
                placeholder="Любой город"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Мин. рейтинг</label>
              <select
                value={filters.minRating}
                onChange={(e) => setFilters({...filters, minRating: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ea2517] focus:border-transparent"
              >
                <option value="">Любой рейтинг</option>
                <option value="1">1 звезда и выше</option>
                <option value="2">2 звезды и выше</option>
                <option value="3">3 звезды и выше</option>
                <option value="4">4 звезды и выше</option>
                <option value="5">5 звезд</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Макс. длительность (дней)</label>
              <input
                type="number"
                value={filters.maxDuration}
                onChange={(e) => setFilters({...filters, maxDuration: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ea2517] focus:border-transparent"
                placeholder="Любая длительность"
                min="1"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Сбросить
            </button>
            <button
              onClick={handleFilter}
              className="px-4 py-2 bg-[#ea2517] text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Применить
            </button>
          </div>
        </div>
      )}
      
      {/* Routes table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Название</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Автор</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Страна/Город</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Длительность</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Рейтинг</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Создан</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                Array(10).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </td>
                  </tr>
                ))
              ) : routes && routes.length > 0 ? (
                routes.map((route) => (
                  <tr key={route.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {route.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {route.author.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {route.countries && route.cities ? 
                        `${route.countries.join(', ')}, ${route.cities.join(', ')}` : 
                        (route.countries || route.cities || '-')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {route.duration} {route.duration === 1 ? 'день' : route.duration < 5 ? 'дня' : 'дней'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">{route.rating.toFixed(1)}</span>
                        <span className="ml-1 text-yellow-400">★</span>
                        <span className="ml-1 text-sm text-gray-500">
                          ({route.reviewsCount})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(route.createdAt).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewDetails(route)}
                          className="text-blue-600 hover:text-blue-900 focus:outline-none"
                        >
                          <Eye size={18} />
                        </button>
                        {activeTab === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleApproveRoute(route.id)}
                              className="text-green-600 hover:text-green-900 focus:outline-none"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => handleRejectRoute(route.id)}
                              className="text-red-600 hover:text-red-900 focus:outline-none"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleDeleteClick(route.id)}
                            className="text-red-600 hover:text-red-900 focus:outline-none"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center justify-center py-6">
                      <AlertCircle size={24} className="text-gray-400 mb-2" />
                      <p>Маршрутов не найдено</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Назад
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Вперед
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Показано <span className="font-medium">{(page - 1) * 10 + 1}</span> - <span className="font-medium">{Math.min(page * 10, routes.length + (page - 1) * 10)}</span> из <span className="font-medium">{totalPages * 10}</span> результатов
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Предыдущая</span>
                    &laquo;
                  </button>
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <button
                        key={i}
                        onClick={() => setPage(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pageNumber === page
                            ? 'z-10 bg-[#ea2517] border-[#ea2517] text-white'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                      <button
                        onClick={() => setPage(totalPages)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          totalPages === page
                            ? 'z-10 bg-[#ea2517] border-[#ea2517] text-white'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Следующая</span>
                    &raquo;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Confirmation Dialog */}
      <ConfirmDialog 
        isOpen={showConfirmDialog}
        title="Удаление маршрута"
        message="Вы уверены, что хотите удалить этот маршрут? Это действие нельзя отменить."
        confirmLabel="Удалить"
        cancelLabel="Отмена"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      {/* Route Details Modal */}
      {showRouteDetails && <RouteDetailsModal />}
    </div>
  );
};

export default RoutesPage;