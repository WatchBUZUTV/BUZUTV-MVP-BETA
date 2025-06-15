
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedContentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedContent = ({ children, fallback }: ProtectedContentProps) => {
  const { isLoggedIn, setShowLoginModal } = useAuth();

  if (!isLoggedIn) {
    return (
      <div 
        onClick={() => setShowLoginModal(true)}
        className="cursor-pointer"
      >
        {fallback || children}
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedContent;
