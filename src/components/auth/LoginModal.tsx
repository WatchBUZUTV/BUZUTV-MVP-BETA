
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

const LoginModal = () => {
  const { showLoginModal, setShowLoginModal, login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || (isSignUp && !name)) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const result = await signup(email, password, name);
        if (result.success) {
          toast.success('Account created successfully!');
          setShowLoginModal(false);
          resetForm();
        } else {
          toast.error('User already exists');
        }
      } else {
        const result = await login(email, password);
        if (result.success) {
          toast.success('Logged in successfully!');
          setShowLoginModal(false);
          resetForm();
        } else {
          toast.error('Invalid credentials');
        }
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setIsSignUp(false);
  };

  const handleClose = () => {
    // Only allow closing if on home page
    if (location.pathname === '/') {
      setShowLoginModal(false);
      resetForm();
    } else {
      // Redirect to home if trying to close from protected route
      navigate('/');
      setShowLoginModal(false);
      resetForm();
    }
  };

  const handleGoToFullPage = () => {
    setShowLoginModal(false);
    navigate('/auth');
    resetForm();
  };

  return (
    <Dialog open={showLoginModal} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              {isSignUp ? 'Sign Up' : 'Sign In'} to{' '}
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 bg-clip-text text-transparent">BUZUTV</span>
            </DialogTitle>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleGoToFullPage}
                className="text-gray-400 hover:text-white transition-colors p-1"
                title="Open full page"
              >
                <ArrowUpRight className="w-5 h-5" />
              </button>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors p-1"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="Enter your password"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full disabled:opacity-50"
            style={{ backgroundColor: '#601EF9' }}
          >
            {isLoading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </Button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>

        {!isSignUp && (
          <div className="mt-4 p-3 bg-gray-700 rounded-lg">
            <p className="text-xs text-gray-300 text-center mb-2">Demo Credentials:</p>
            <p className="text-xs text-gray-400 text-center">
              User: user@example.com / password123<br />
              Admin: admin@example.com / admin123
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
