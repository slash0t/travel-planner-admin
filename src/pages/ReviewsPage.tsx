import React, { useState, useEffect } from 'react';
import { Search, Filter, Trash2, AlertCircle, MessageSquare } from 'lucide-react';
import { getReviews, deleteReview } from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';


interface Author {
  id: number;
  username: string;
  avatarUrl: string | null;
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


type DeleteAction = 'full' | 'comment';

const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const [deleteAction, setDeleteAction] = useState<DeleteAction>('full');
  
  const [filters, setFilters] = useState({
    routeId: '',
    minRating: '',
    maxRating: '',
  });
  
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [page, filters]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const reviewsResponse: ReviewPageResponse = await getReviews();
      console.log('reviewsResponse', reviewsResponse);
      setReviews(reviewsResponse.content);
      setTotalPages(Math.ceil(reviewsResponse.totalElements / 10));
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReviews();
  };

  const handleFilter = () => {
    setPage(1);
    fetchReviews();
    setShowFilters(false);
  };

  const resetFilters = () => {
    setFilters({
      routeId: '',
      minRating: '',
      maxRating: '',
    });
    setPage(1);
    fetchReviews();
    setShowFilters(false);
  };

  const handleDeleteClick = (reviewId: string, action: DeleteAction) => {
    setReviewToDelete(reviewId);
    setDeleteAction(action);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (reviewToDelete) {
      try {
        if (deleteAction === 'full') {
          await deleteReview(reviewToDelete);
          setReviews(reviews.filter(review => review.id !== reviewToDelete));
        } else if (deleteAction === 'comment') {
          await deleteReviewComment(reviewToDelete);
          setReviews(reviews.map(review => 
            review.id === reviewToDelete 
              ? { ...review, comment: '[Комментарий удален модератором]' } 
              : review
          ));
        }
      } catch (error) {
        console.error('Error deleting review:', error);
      } finally {
        setShowConfirmDialog(false);
        setReviewToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setReviewToDelete(null);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>★</span>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Отзывы</h1>
          <p className="text-gray-600">Управление отзывами пользователей</p>
        </div>
        
        {/* Search and filter */}
        {/* <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-2">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Поиск отзывов..."
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
      
      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 animate-fade-in">
          <h3 className="text-lg font-medium mb-3">Фильтры</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID маршрута</label>
              <input
                type="text"
                value={filters.routeId}
                onChange={(e) => setFilters({...filters, routeId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ea2517] focus:border-transparent"
                placeholder="Введите ID маршрута"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Макс. рейтинг</label>
              <select
                value={filters.maxRating}
                onChange={(e) => setFilters({...filters, maxRating: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ea2517] focus:border-transparent"
              >
                <option value="">Любой рейтинг</option>
                <option value="1">1 звезда</option>
                <option value="2">2 звезды и ниже</option>
                <option value="3">3 звезды и ниже</option>
                <option value="4">4 звезды и ниже</option>
                <option value="5">5 звезд и ниже</option>
              </select>
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
      
      {/* Reviews list */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-6 animate-pulse space-y-6">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded mb-4 w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-1/5"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {reviews.map((review) => (
              <div key={review.id} className="p-6 hover:bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Отзыв на маршрут: {review.routeTitle}
                    </h3>
                    <div className="flex items-center mt-1">
                      <p className="text-sm text-gray-500 mr-4">
                        Автор: {review.author}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 md:mt-0 flex items-center">
                    {renderStars(review.rating)}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-4 flex items-start">
                  <MessageSquare size={18} className="text-gray-400 mr-2 mt-1 shrink-0" />
                  <p className="text-gray-700">{review.comment}</p>
                </div>
                
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleDeleteClick(review.id, 'comment')}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ea2517]"
                  >
                    Удалить текст
                  </button>
                  <button
                    onClick={() => handleDeleteClick(review.id, 'full')}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-[#ea2517] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ea2517]"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Удалить отзыв
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center">
            <AlertCircle size={40} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Отзывы не найдены</h3>
            <p className="text-gray-500">Попробуйте изменить параметры поиска или фильтры</p>
          </div>
        )}
        
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
                  Показано <span className="font-medium">{(page - 1) * 10 + 1}</span> - <span className="font-medium">{Math.min(page * 10, reviews.length + (page - 1) * 10)}</span> из <span className="font-medium">{totalPages * 10}</span> результатов
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
        title={deleteAction === 'full' ? "Удаление отзыва" : "Удаление комментария"}
        message={
          deleteAction === 'full' 
            ? "Вы уверены, что хотите удалить этот отзыв полностью? Это действие нельзя отменить."
            : "Вы уверены, что хотите удалить только текст комментария? Рейтинг останется. Это действие нельзя отменить."
        }
        confirmLabel="Удалить"
        cancelLabel="Отмена"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default ReviewsPage;