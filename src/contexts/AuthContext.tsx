
import React, { createContext, useContext, useState } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { 
    user: supabaseUser, 
    userProfile, 
    isLoading, 
    isLoggedIn, 
    signIn, 
    signUp, 
    signOut 
  } = useSupabaseAuth();

  // Transform Supabase user to our User interface
  const user: User | null = supabaseUser && userProfile ? {
    id: supabaseUser.id,
    email: userProfile.email,
    name: userProfile.name,
    isAdmin: userProfile.role === 'admin'
  } : null;

  const login = async (email: string, password: string) => {
    const result = await signIn(email, password);
    return result;
  };

  const signup = async (email: string, password: string, name: string) => {
    const result = await signUp(email, password, name);
    return result;
  };

  const logout = () => {
    signOut();
  };

  const value: AuthContextType = {
    user,
    isLoggedIn,
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
