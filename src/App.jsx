import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Header from './components/layout/Header';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Spinner from './components/common/Spinner';

import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import UserDashboard from './pages/UserDashboard';
import BookingPage from './pages/BookingPage';
import SeatSelection from "./pages/SeatSelection";

// This is the main content of your app. It now correctly sits inside the Router.
const AppContent = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <Spinner />;
    }

    return (
        <>
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={user ? <HomePage /> : <LandingPage />} />
                    <Route path="/landing" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/seats/:eventId" element={<SeatSelection />} />

                    <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/manager" element={<ProtectedRoute allowedRoles={['MANAGER']}><ManagerDashboard /></ProtectedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['USER']}><UserDashboard /></ProtectedRoute>} />
                    <Route path="/book/:eventId" element={<ProtectedRoute allowedRoles={['USER', 'ADMIN', 'MANAGER']}><BookingPage /></ProtectedRoute>} />
                </Routes>
            </main>
        </>
    );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;