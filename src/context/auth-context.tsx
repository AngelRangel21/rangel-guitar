
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
import { revalidateAfterLike } from '@/app/favorites/actions';
import { auth, db } from '@/lib/firebase';
import { updateLikeCount } from '@/lib/client/songs';

// Proveedor de autenticación de Google.
const googleProvider = new GoogleAuthProvider();

// Lista de correos electrónicos que recibirán el rol de administrador al registrarse.
const ADMIN_EMAILS = ['angel145256@gmail.com'];

// Interfaz para el objeto de usuario simplificado que se usa en la aplicación.
interface User {
  uid: string;
  name: string;
}

// Interfaz para las credenciales de autenticación por correo electrónico.
interface AuthCredentials {
  email: string;
  password: string;
  name?: string;
}

// Define la forma del contexto de autenticación.
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  favorites: string[];
  isLoaded: boolean;
  signInWithGoogle: () => void;
  registerWithEmail: (credentials: AuthCredentials) => Promise<void>;
  signInWithEmail: (credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
  toggleFavorite: (songId: string, songSlug: string) => Promise<void>;
  isFavorite: (songId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Proveedor de contexto de autenticación.
 * Maneja todo el estado y la lógica relacionados con la autenticación de usuarios.
 * @param {{ children: ReactNode }} props - Los componentes hijos que consumirán el contexto.
 * @returns {JSX.Element} El proveedor de contexto.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useI18n();
  const { toast } = useToast();

  // Efecto que se suscribe a los cambios de estado de autenticación de Firebase.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          let appUser: User;
          let userIsAdmin = false;

          if (userDoc.exists()) {
            // Si el usuario ya existe en Firestore, carga sus datos.
            const userData = userDoc.data();
            appUser = { uid: firebaseUser.uid, name: userData.name || firebaseUser.displayName || 'Anonymous' };
            userIsAdmin = userData.isAdmin || false;
          } else {
            // Si es un usuario nuevo, crea un documento para él en Firestore.
            const newName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Anonymous';
            appUser = { uid: firebaseUser.uid, name: newName };
            userIsAdmin = ADMIN_EMAILS.includes(firebaseUser.email || ''); // Asigna rol de admin si el email coincide.
            
            await setDoc(userDocRef, {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: appUser.name,
              isAdmin: userIsAdmin,
              createdAt: new Date(),
            });
          }
          
          setUser(appUser);
          setIsAdmin(userIsAdmin);

          // Carga los favoritos del usuario desde el almacenamiento local.
          const storedFavorites = localStorage.getItem(`favorites_${appUser.uid}`);
          setFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
        } else {
          // Si no hay usuario, resetea todos los estados.
          setUser(null);
          setIsAdmin(false);
          setFavorites([]);
        }
      } catch (error) {
        console.error("Error in onAuthStateChanged: ", error);
        toast({ variant: "destructive", title: "Error de Sesión", description: "No se pudo cargar tu perfil." });
      } finally {
        setIsLoaded(true); // Marca que la carga inicial ha terminado.
      }
    });

    return () => unsubscribe(); // Limpia la suscripción al desmontar.
  }, [toast]);

  // Redirige al usuario si está en una página de autenticación (login/register) pero ya está logueado.
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
      toast({ variant: "destructive", title: t('loginErrorTitle'), description: t(error.code) || error.message });
    }
  };

  const registerWithEmail = async ({ email, password, name }: AuthCredentials) => {
    if (!name) return;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      toast({ title: t('accountCreatedTitle'), description: t('accountCreatedDescription') });
    } catch (error: any) {
      console.error("Error signing up", error);
      toast({ variant: "destructive", title: t('registerErrorTitle'), description: t(error.code) || error.message });
    }
  };
  
  const signInWithEmail = async ({ email, password }: AuthCredentials) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: t('loggedInTitle'), description: t('loggedInDescription') });
    } catch (error: any) {
      console.error("Error signing in with email:", error);
      toast({ variant: "destructive", title: t('loginErrorTitle'), description: t('auth/invalid-credential') });
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

  const toggleFavorite = async (songId: string, songSlug: string) => {
    if (!user) return;
    
    const isCurrentlyFavorite = favorites.includes(songId);
    const delta = isCurrentlyFavorite ? -1 : 1;

    // Actualización optimista de la UI para una respuesta inmediata.
    const newFavorites = isCurrentlyFavorite ? favorites.filter((id) => id !== songId) : [...favorites, songId];
    setFavorites(newFavorites);
    localStorage.setItem(`favorites_${user.uid}`, JSON.stringify(newFavorites));
    
    // Escritura en la base de datos y revalidación del lado del servidor.
    try {
      await updateLikeCount(songId, delta);
      await revalidateAfterLike(songSlug);
    } catch (error) {
      console.error("Failed to update like count:", error);
      // Revierte la UI si hay un error.
      localStorage.setItem(`favorites_${user.uid}`, JSON.stringify(favorites));
      setFavorites(favorites);
      toast({ variant: "destructive", title: "Error", description: "No se pudo actualizar el estado de favorito." });
    }
  };

  const isFavorite = (songId: string) => {
    return favorites.includes(songId);
  };
  
  const value = { 
    isAuthenticated: !!user, 
    user, 
    isAdmin,
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

/**
 * Hook personalizado para acceder al contexto de autenticación.
 * @returns {AuthContextType} - El valor del contexto de autenticación.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
