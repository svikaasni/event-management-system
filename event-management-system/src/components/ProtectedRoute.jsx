import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
    const { currentUser, userRole, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-galaxy-300">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-galaxy-500"></div>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/auth" />;
    }

    // If roles are specified, check if user has required role
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Redirect based on their actual role or to home
        if (userRole === 'organizer') return <Navigate to="/organizer" />;
        if (userRole === 'admin') return <Navigate to="/admin" />;
        return <Navigate to="/" />;
    }

    return children;
}
