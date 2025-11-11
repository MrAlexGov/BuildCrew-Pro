'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  Users, 
  ClipboardList, 
  Calendar, 
  DollarSign, 
  AlertTriangle,
  Plus,
  Eye
} from 'lucide-react';

interface DashboardStats {
  totalObjects: number;
  activeObjects: number;
  totalCrews: number;
  totalWorkers: number;
  overdueTasks: number;
  budgetUtilization: number;
}

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else {
      fetchDashboardStats();
    }
  }, [isAuthenticated, router]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // Здесь будет запрос к API
      const mockStats: DashboardStats = {
        totalObjects: 12,
        activeObjects: 8,
        totalCrews: 5,
        totalWorkers: 42,
        overdueTasks: 3,
        budgetUtilization: 67,
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Панель управления</h1>
              <p className="text-sm text-gray-500">Добро пожаловать, {user?.firstName}!</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => handleNavigation('/objects')}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Новый объект</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            <div className="card hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Всего объектов</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalObjects}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="card hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Активные объекты</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.activeObjects}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="card hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Бригады</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalCrews}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="card hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Работники</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalWorkers}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="card hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Просрочено задач</p>
                  <p className="text-2xl font-bold text-red-600">{stats?.overdueTasks}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="card hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Освоение бюджета</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.budgetUtilization}%</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div 
              className="card hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => handleNavigation('/objects')}
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Объекты</h3>
                  <p className="text-gray-600">Управление строительными объектами</p>
                </div>
                <Eye className="h-5 w-5 text-gray-400 ml-auto" />
              </div>
            </div>

            <div 
              className="card hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => handleNavigation('/crews')}
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Бригады</h3>
                  <p className="text-gray-600">Управление бригадами и сотрудниками</p>
                </div>
                <Eye className="h-5 w-5 text-gray-400 ml-auto" />
              </div>
            </div>

            <div 
              className="card hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => handleNavigation('/tasks')}
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <ClipboardList className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Задачи</h3>
                  <p className="text-gray-600">Планирование и контроль задач</p>
                </div>
                <Eye className="h-5 w-5 text-gray-400 ml-auto" />
              </div>
            </div>
          </div>

          {/* Calendar Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Календарь задач</h3>
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Фундаментные работы</p>
                    <p className="text-sm text-gray-500">15 января, 09:00</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Кладка стен</p>
                    <p className="text-sm text-gray-500">16 января, 10:00</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Электромонтаж</p>
                    <p className="text-sm text-gray-500">17 января, 14:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Последние события</h3>
                <AlertTriangle className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-gray-600">Задача "Фундамент" выполнена</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-gray-600">Новый объект "ЖК Северный" добавлен</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-gray-600">Бригада №3 назначена на объект</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}