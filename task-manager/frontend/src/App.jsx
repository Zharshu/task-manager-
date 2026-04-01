import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useThemeStore } from './store/themeStore';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import TaskManagement from './pages/TaskManagement';

const App = () => {
  const { dark, init } = useThemeStore();
  const { token } = useAuthStore();

  useEffect(() => {
    init(dark);
  }, [dark, init]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Routes>
        {/* Public routes — no layout */}
        <Route path="/login"  element={token ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={token ? <Navigate to="/dashboard" /> : <Signup />} />

        {/* Protected routes — wrapped in AppLayout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <AppLayout>
                <TaskManagement />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={token ? '/dashboard' : '/login'} />} />
      </Routes>
    </div>
  );
};

export default App;
