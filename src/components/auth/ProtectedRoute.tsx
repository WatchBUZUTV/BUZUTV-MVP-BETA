
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoggedIn, setShowLoginModal } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      // Store the current path before redirecting
      sessionStorage.setItem('previousPath', location.pathname);
      setShowLoginModal(true);
    }
  }, [isLoggedIn, setShowLoginModal, location.pathname]);

  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
