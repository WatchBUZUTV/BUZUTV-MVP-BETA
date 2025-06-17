
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthUser extends User {
  isAdmin?: boolean;
  name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          // Check if this is a demo admin user
          const isDemoAdmin = session.user.email === 'admin@example.com';
          const userName = session.user.user_metadata?.full_name || 
                          session.user.user_metadata?.name || 
                          session.user.email?.split('@')[0] || 'User';
          
          setUser({ 
            ...session.user, 
            isAdmin: isDemoAdmin,
            name: userName
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const isDemoAdmin = session.user.email === 'admin@example.com';
        const userName = session.user.user_metadata?.full_name || 
                        session.user.user_metadata?.name || 
                        session.user.email?.split('@')[0] || 'User';
        
        setUser({ 
          ...session.user, 
          isAdmin: isDemoAdmin,
          name: userName
        });
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: name,
          name: name,
        }
      }
    });

    setIsLoading(false);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const value: AuthContextType = {
    user,
    isLoggedIn: !!user,
    isLoading,
    showLoginModal,
    setShowLoginModal,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
