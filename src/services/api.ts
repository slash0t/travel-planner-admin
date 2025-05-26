// API service for connecting to the Java Spring backend

// Declare environment variables for Vite
interface ImportMetaEnv {
  VITE_API_BASE_URL: string;
  VITE_AUTH_API_URL: string;
  VITE_LIBRARY_API_URL: string;
  VITE_EXTERNAL_API_URL: string;
  VITE_PLANNER_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Базовые URL для разных сервисов
const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'https://putevod-app.ru/auth/api/v1';
const LIBRARY_API_URL = import.meta.env.VITE_LIBRARY_API_URL || 'https://putevod-app.ru/library/api/v1';
const EXTERNAL_API_URL = import.meta.env.VITE_EXTERNAL_API_URL || 'https://putevod-app.ru/external/api/v1';
const PLANNER_API_URL = import.meta.env.VITE_PLANNER_API_URL || 'https://putevod-app.ru/planner/api/v1';

// Функция для определения URL API в зависимости от сервиса
const getApiUrl = (service: 'auth' | 'library' | 'external' | 'planner'): string => {
  switch (service) {
    case 'auth':
      return AUTH_API_URL;
    case 'library':
      return LIBRARY_API_URL;
    case 'external':
      return EXTERNAL_API_URL;
    case 'planner':
      return PLANNER_API_URL;
    default:
      return AUTH_API_URL;
  }
};

// Helper function for API requests
const apiRequest = async (url: string, options: RequestInit = {}, service: 'auth' | 'library' | 'external' | 'planner' = 'auth') => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const baseUrl = getApiUrl(service);
  const response = await fetch(`${baseUrl}${url}`, {
    ...options,
    headers,
    body: options.body
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Ошибка запроса: ${response.status}`);
  }
  
  return response.json();
};

// Auth APIs
export const loginApi = async (username: string, password: string) => {
  const response = await apiRequest('/login', {
    method: 'POST',
    body: JSON.stringify({
      email: username,
      password: password,
      deviceId: 'admin site'
    })
  }, 'auth');
  
  return {
    token: response.accessToken,
    refreshToken: response.refreshToken,
    user: {
      id: response.user.id,
      username: response.user.email
    }
  };
};

export const refreshTokenApi = async (refreshToken: string) => {
  return apiRequest('/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken })
  }, 'auth');
};

export const logoutApi = async (refreshToken: string) => {
  return apiRequest('/logout', {
    method: 'POST',
    body: JSON.stringify({ refreshToken })
  }, 'auth');
};

// Routes APIs
export const getRoutes = async (page = 1, limit = 10, filters = {}, pending = false) => {
  const queryParams = new URLSearchParams({
    page: (page - 1).toString(),
    size: limit.toString(),
    ...Object.entries(filters).reduce((acc, [key, value]) => {
      if (value) acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>)
  });

  var requestUrl;
  if (pending) {
    requestUrl = `/routes/pending?${queryParams}`;
  } else {
    requestUrl = `/routes?${queryParams}`;
  }

  // console.log('requestUrl', requestUrl);
  return apiRequest(requestUrl, {}, 'library');
};

export const deleteRoute = async (routeId: string) => {
  return apiRequest(`/routes/${routeId}`, {
    method: 'DELETE'
  }, 'planner');
};

export const approveRoute = async (routeId: string) => {
  return apiRequest(`/routes/approve/${routeId}`, {
    method: 'PUT'
  }, 'library');
};

export const rejectRoute = async (routeId: string) => {
  return apiRequest(`/routes/${routeId}`, {
    method: 'DELETE'
  }, 'library');
};

// Reviews APIs
export const getReviews = async () => {
  return apiRequest(`/admin/reviews`, {}, 'library');
};

export const deleteReview = async (reviewId: string) => {
  return apiRequest(`/routes/${reviewId}/reviews`, {
    method: 'DELETE'
  }, 'library');
};
