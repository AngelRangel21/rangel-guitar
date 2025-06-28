
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
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

// =================================================================
// IMPORTANTE: REEMPLAZA ESTO CON TUS PROPIAS CREDENCIALES DE FIREBASE
// 1. Ve a la consola de Firebase: https://console.firebase.google.com/
// 2. Entra a tu proyecto (o créalo).
// 3. Haz clic en el ícono de engranaje (Configuración del proyecto).
// 4. En la pestaña "General", baja hasta "Tus apps".
// 5. Selecciona "Configuración" y copia el objeto `firebaseConfig`.
// =================================================================
const firebaseConfig = {
  apiKey: "AIzaSyAh_jWzBmBaxOZjzfR4ewup6VIY_RqSEF8", // REEMPLAZAR
  authDomain: "rangel-guitar.firebaseapp.com", // REEMPLAZAR
  projectId: "guitarra-rangel", // REEMPLAZAR
  storageBucket: "rangel-guitar.firebasestorage.app", // REEMPLAZAR
  messagingSenderId: "354082670866", // REEMPLAZAR
  appId: "1:354082670866:web:6bee882127bdeae5034bcb" // REEMPLAZAR
};

// --- PASO DE DEPURACIÓN ---
// Esta línea imprimirá el ID de tu proyecto en la consola del navegador.
// Abre las herramientas de desarrollador (F12) y comprueba que este ID
// coincide con el de tu proyecto en Firebase.
console.log('Firebase Project ID Initializing:', firebaseConfig.projectId);
// --------------------------


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
  favorites: number[];
  signInWithGoogle: () => Promise<void>;
  registerWithEmail: (credentials: AuthCredentials) => Promise<void>;
  signInWithEmail: (credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
  toggleFavorite: (songId: number) => void;
  isFavorite: (songId: number) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();
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
        setIsAdmin(firebaseUser.email === "admin@example.com");

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
        setFavorites([]);
      }
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/');
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const registerWithEmail = async ({ email, password, name }: AuthCredentials) => {
    if (!name) return;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      const updatedUser = { uid: userCredential.user.uid, name: name };
      setUser(updatedUser);
      router.push('/');
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
      router.push('/');
       toast({
        title: t('loggedInTitle'),
        description: t('loggedInDescription'),
      });
    } catch (error: any) {
      console.error("Error signing in", error);
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

  const toggleFavorite = (songId: number) => {
    if (!user) return;
    const newFavorites = favorites.includes(songId)
      ? favorites.filter((id) => id !== songId)
      : [...favorites, songId];
    setFavorites(newFavorites);
    localStorage.setItem(`favorites_${user.uid}`, JSON.stringify(newFavorites));
  };

  const isFavorite = (songId: number) => {
    return favorites.includes(songId);
  };
  
  const value = { 
    isAuthenticated: isLoaded && !!user, 
    user, 
    isAdmin,
    favorites, 
    signInWithGoogle, 
    registerWithEmail,
    signInWithEmail,
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
