import { Navigate } from 'react-router-dom';
import { useAuth, AppRole } from '@/context/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowed: AppRole[];
  redirectTo?: string;
}

export default function RoleGuard({ children, allowed, redirectTo }: RoleGuardProps) {
  const { user, userRole, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  if (!userRole) return null; // still loading role

  if (!allowed.includes(userRole)) {
    // Role-based redirect
    if (userRole === 'teacher_pending') {
      return <Navigate to="/pending" replace />;
    }
    return <Navigate to={redirectTo || '/dashboard'} replace />;
  }

  return <>{children}</>;
}
