import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, authLoading, roleLoading } = useAuth();

  console.log('[AdminRoute] evaluating:', { userId: user?.id, isAdmin, authLoading, roleLoading });

  // Wait for BOTH auth and role to fully resolve before making any decision
  if (authLoading || roleLoading) {
    console.log('[AdminRoute] Still loading — rendering placeholder');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    console.log('[AdminRoute] No user — redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    console.log('[AdminRoute] User is not admin — redirecting to /dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('[AdminRoute] Access granted');
  return <>{children}</>;
}
