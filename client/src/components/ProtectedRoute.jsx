import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './DashboardLayout';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    return user ? (
        <DashboardLayout>
            <Outlet />
        </DashboardLayout>
    ) : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
