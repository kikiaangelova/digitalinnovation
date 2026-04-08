import { Navigate } from 'react-router-dom';
import { useAuth, AppRole } from '@/context/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowed: AppRole[];
  redirectTo?: string;
}

export default function RoleGuard({ children, allowed, redirectTo }: RoleGuardProps) {
  const { user, userRole, authLoading, roleLoading } = useAuth();

  // Wait for both auth and role resolution
  if (authLoading || roleLoading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (!userRole) return null;

  if (!allowed.includes(userRole)) {
    if (userRole === 'teacher_pending') {
      return <Navigate to="/pending" replace />;
    }
    return <Navigate to={redirectTo || '/dashboard'} replace />;
  }

  return <>{children}</>;
}
