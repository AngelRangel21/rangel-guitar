'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from './i18n-context';
import { updateLikeCountAction } from '@/app/favorites/actions';

// =================================================================
// ¡IMPORTANTE! INSERTA AQUÍ TUS CREDENCIALES DE FIREBASE
// 1. Ve a la consola de Firebase: https://console.firebase.google.com/
// 2. Entra a TU proyecto (el que tú creaste).
// 3. Haz clic en el ícono de engranaje (Configuración del proyecto).
// 4. En la pestaña "General", baja hasta "Tus apps".
// 5. Si no tienes una app web, créala (ícono </>).
// 6. En la configuración de tu app web, busca y copia el objeto `firebaseConfig`.
// 7. Pega ese objeto completo aquí, reemplazando el objeto de ejemplo de abajo.
// =================================================================
const firebaseConfig = {
  apiKey: "AIzaSyAh_jWzBmBaxOZjzfR4ewup6VIY_RqSEF8",
  authDomain: "rangel-guitar.firebaseapp.com",
  projectId: "rangel-guitar",
  storageBucket: "rangel-guitar.firebasestorage.app",
  messagingSenderId: "354082670866",
  appId: "1:354082670866:web:6bee882127bdeae5034bcb",
  measurementId: "G-8J82455QVE"
};

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}
const auth = getAuth(app);
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
  favorites: number[];
  isLoaded: boolean;
  signInWithGoogle: () => void;
  registerWithEmail: (credentials: AuthCredentials) => Promise<void>;
  signInWithEmail: (credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
  toggleFavorite: (songId: number) => Promise<void>;
  isFavorite: (songId: number) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define user roles based on email for this prototype
const ADMIN_EMAIL = "admin@example.com";
const PREMIUM_EMAIL = "premium@example.com";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useI18n();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userData: User = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email || 'Anonymous',
        };
        setUser(userData);
        setIsAdmin(firebaseUser.email === ADMIN_EMAIL);
        setIsPremium(firebaseUser.email === PREMIUM_EMAIL);

        const storedFavorites = localStorage.getItem(`favorites_${userData.uid}`);
        if (storedFavorites) {
          try {
             setFavorites(JSON.parse(storedFavorites));
          } catch(e) {
             console.error("Failed to parse favorites from localStorage", e);
             setFavorites([]);
          }
        } else {
          setFavorites([]);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        setIsPremium(false);
        setFavorites([]);
      }
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const isAuthPage = pathname === '/login' || pathname === '/register';

    if (user && isAuthPage) {
      router.push('/');
    }

  }, [isLoaded, user, pathname, router]);


  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .catch((error: any) => {
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
      });
  };

  const registerWithEmail = async ({ email, password, name }: AuthCredentials) => {
    if (!name) return;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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
    } catch (error: any)
      {
      console.error("Error signing in with email:", error);
       toast({
        variant: "destructive",
        title: t('loginErrorTitle'),
        description: t(error.code) || error.message,
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

  const toggleFavorite = async (songId: number) => {
    if (!user) return;
    
    const isCurrentlyFavorite = favorites.includes(songId);
    const delta = isCurrentlyFavorite ? -1 : 1;

    const newFavorites = isCurrentlyFavorite
      ? favorites.filter((id) => id !== songId)
      : [...favorites, songId];
      
    setFavorites(newFavorites);
    localStorage.setItem(`favorites_${user.uid}`, JSON.stringify(newFavorites));

    // Also update the global like count on the server
    await updateLikeCountAction(songId, delta);
  };

  const isFavorite = (songId: number) => {
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
