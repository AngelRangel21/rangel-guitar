'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string } | null;
  favorites: number[];
  login: (name: string) => void;
  logout: () => void;
  toggleFavorite: (songId: number) => void;
  isFavorite: (songId: number) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        const storedFavorites = localStorage.getItem(`favorites_${parsedUser.name}`);
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('user');
    }
    setIsLoaded(true);
  }, []);

  const login = (name: string) => {
    const userData = { name };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    const storedFavorites = localStorage.getItem(`favorites_${name}`);
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    } else {
      setFavorites([]);
    }
    router.push('/');
  };

  const logout = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        localStorage.removeItem('user');
    }
    setUser(null);
    setFavorites([]);
    router.push('/login');
  };

  const toggleFavorite = (songId: number) => {
    if (!user) return;
    const newFavorites = favorites.includes(songId)
      ? favorites.filter((id) => id !== songId)
      : [...favorites, songId];
    setFavorites(newFavorites);
    localStorage.setItem(`favorites_${user.name}`, JSON.stringify(newFavorites));
  };

  const isFavorite = (songId: number) => {
    return favorites.includes(songId);
  };

  const value = { 
    isAuthenticated: isLoaded && !!user, 
    user, 
    favorites, 
    login, 
    logout, 
    toggleFavorite, 
    isFavorite 
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoaded ? children : null}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
