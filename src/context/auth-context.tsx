'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from './i18n-context';
import { updateLikeCountAction } from '@/app/favorites/actions';
import { auth, db } from '@/lib/firebase';

const googleProvider = new GoogleAuthProvider();

interface User {
  uid: string;
  name: string;
}

interface AuthCredentials {
  email: string;
  password: string;
  name?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  isPremium: boolean;
  favorites: string[];
  isLoaded: boolean;
  signInWithGoogle: () => void;
  registerWithEmail: (credentials: AuthCredentials) => Promise<void>;
  signInWithEmail: (credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
  toggleFavorite: (songId: string) => Promise<void>;
  isFavorite: (songId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useI18n();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          let appUser: User;
          let userIsAdmin = false;
          let userIsPremium = false;

          if (userDoc.exists()) {
            const userData = userDoc.data();
            appUser = {
              uid: firebaseUser.uid,
              name: userData.name || firebaseUser.displayName || 'Anonymous',
            };
            userIsAdmin = userData.isAdmin || false;
            userIsPremium = userData.isPremium || false;
          } else {
            const newName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Anonymous';
            appUser = {
              uid: firebaseUser.uid,
              name: newName,
            };
            await setDoc(userDocRef, {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: appUser.name,
              isAdmin: false,
              isPremium: false,
              createdAt: new Date(),
            });
          }
          
          setUser(appUser);
          setIsAdmin(userIsAdmin);
          setIsPremium(userIsPremium);

          const storedFavorites = localStorage.getItem(`favorites_${appUser.uid}`);
          if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
          } else {
            setFavorites([]);
          }
        } else {
          setUser(null);
          setIsAdmin(false);
          setIsPremium(false);
          setFavorites([]);
        }
      } catch (error) {
        console.error("Error in onAuthStateChanged: ", error);
        setUser(null);
        setIsAdmin(false);
        setIsPremium(false);
        setFavorites([]);
        toast({
          variant: "destructive",
          title: "Error de Sesión",
          description: "No se pudo cargar tu perfil. Intenta de nuevo.",
        });
      } finally {
        setIsLoaded(true);
      }
    });

    return () => unsubscribe();
  }, [toast]);

  useEffect(() => {
    if (!isLoaded) return;
    const isAuthPage = pathname === '/login' || pathname === '/register';
    if (user && isAuthPage) {
      router.push('/');
    }
  }, [isLoaded, user, pathname, router]);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Error signing in with Google", error);
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
        toast({
          variant: "destructive",
          title: t('popupBlockedTitle'),
          description: t('popupBlockedDescription'),
        });
      } else {
        toast({
          variant: "destructive",
          title: t('loginErrorTitle'),
          description: t(error.code) || error.message,
        });
      }
    }
  };

  const registerWithEmail = async ({ email, password, name }: AuthCredentials) => {
    if (!name) return;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Directly create the user document in Firestore to ensure data consistency
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userDocRef, {
        uid: userCredential.user.uid,
        email: email,
        name: name,
        isAdmin: false,
        isPremium: false,
        createdAt: new Date(),
      });
      
      // Also update the Firebase Auth profile
      await updateProfile(userCredential.user, { displayName: name });
      
      toast({
        title: t('accountCreatedTitle'),
        description: t('accountCreatedDescription'),
      });
    } catch (error: any) {
      console.error("Error signing up", error);
      toast({
        variant: "destructive",
        title: t('registerErrorTitle'),
        description: t(error.code) || error.message,
      });
    }
  };
  
  const signInWithEmail = async ({ email, password }: AuthCredentials) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
       toast({
        title: t('loggedInTitle'),
        description: t('loggedInDescription'),
      });
    } catch (error: any) {
      console.error("Error signing in with email:", error);
       toast({
        variant: "destructive",
        title: t('loginErrorTitle'),
        description: t('auth/invalid-credential'),
      });
    }
  };

  const logout = async () => {
    try {
        await signOut(auth);
        router.push('/login');
    } catch (error) {
        console.error("Error signing out", error);
    }
  };

  const toggleFavorite = async (songId: string) => {
    if (!user) return;
    
    const isCurrentlyFavorite = favorites.includes(songId);
    const delta = isCurrentlyFavorite ? -1 : 1;

    const newFavorites = isCurrentlyFavorite
      ? favorites.filter((id) => id !== songId)
      : [...favorites, songId];
      
    setFavorites(newFavorites);
    localStorage.setItem(`favorites_${user.uid}`, JSON.stringify(newFavorites));
    
    await updateLikeCountAction(songId, delta);
  };

  const isFavorite = (songId: string) => {
    return favorites.includes(songId);
  };
  
  const value = { 
    isAuthenticated: !!user, 
    user, 
    isAdmin,
    isPremium,
    favorites, 
    isLoaded,
    signInWithGoogle, 
    registerWithEmail,
    signInWithEmail,
    logout, 
    toggleFavorite, 
    isFavorite 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
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
