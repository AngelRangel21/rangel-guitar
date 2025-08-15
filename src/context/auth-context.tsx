"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { type User as SupabaseUser } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "./i18n-context";
import { revalidateAfterLike } from "@/app/favorites/actions";
import { supabase } from "@/lib/supabase";
import { updateLikeCount } from "@/lib/client/songs";

const ADMIN_EMAILS = ["angel145256@gmail.com"];

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useI18n();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    // Función para cargar el estado inicial más rápido
    const initializeAuth = async () => {
      try {
        // 1. Verificar sesión actual de Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          if (mounted) {
            setIsLoaded(true); // ✅ CRÍTICO: Marcar como cargado aunque haya error
          }
          return;
        }

        if (session?.user) {
          // Procesar usuario autenticado inmediatamente
          await processUser(session.user);
        }
        
        if (mounted) {
          setIsLoaded(true); // ✅ CRÍTICO: Marcar como cargado
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (mounted) {
          setIsLoaded(true); // ✅ CRÍTICO: Marcar como cargado incluso con error
        }
      }
    };

    // Función optimizada para procesar usuario
    const processUser = async (supabaseUser: SupabaseUser) => {
      try {
        // Cargar favoritos del localStorage inmediatamente (sin esperar DB)
        const storedFavorites = localStorage.getItem(`favorites_${supabaseUser.id}`);
        if (mounted && storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }

        // Consulta optimizada a la base de datos
        const { data: userDoc, error } = await supabase
          .from("users")
          .select("name, isAdmin")
          .eq("uid", supabaseUser.id)
          .single();

        if (error && error.code !== "PGRST116") {
          throw error;
        }

        let appUser: User;
        let userIsAdmin = false;

        if (userDoc) {
          // Usuario existente
          appUser = {
            uid: supabaseUser.id,
            name: userDoc.name || supabaseUser.user_metadata.full_name || "Anonymous",
          };
          userIsAdmin = userDoc.isAdmin || false;
        } else {
          // Usuario nuevo
          const newName = 
            supabaseUser.user_metadata.full_name ||
            supabaseUser.email?.split("@")[0] ||
            "Anonymous";
          
          appUser = { uid: supabaseUser.id, name: newName };
          userIsAdmin = ADMIN_EMAILS.includes(supabaseUser.email || "");

          // Insertar usuario en background (no bloqueante)
          supabase
            .from("users")
            .upsert({
              uid: supabaseUser.id,
              email: supabaseUser.email,
              name: appUser.name,
              isAdmin: userIsAdmin,
              createdAt: new Date().toISOString(),
            })
            .then(({ error }) => {
              if (error) console.error("Error inserting user:", error);
            });
        }

        if (mounted) {
          setUser(appUser);
          setIsAdmin(userIsAdmin);
          
          // Cargar favoritos si no se cargaron antes
          if (!storedFavorites) {
            setFavorites([]);
          }
        }
      } catch (error) {
        console.error("Error processing user:", error);
        if (mounted) {
          toast({
            variant: "destructive",
            title: "Error de Sesión",
            description: "No se pudo cargar tu perfil completamente.",
          });
        }
      }
    };

    // Inicializar inmediatamente
    initializeAuth();

    // Suscribirse a cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      try {
        if (session?.user) {
          await processUser(session.user);
        } else {
          // Usuario deslogueado
          setUser(null);
          setIsAdmin(false);
          setFavorites([]);
        }
      } catch (error) {
        console.error("Error in onAuthStateChange:", error);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  // Redirigir desde páginas de auth si ya está logueado
  useEffect(() => {
    if (!isLoaded) return;
    
    const isAuthPage = pathname === "/login" || pathname === "/register";
    if (user && isAuthPage) {
      router.push("/");
    }
  }, [isLoaded, user, pathname, router]);

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Error signing in with Google", error);
      toast({
        variant: "destructive",
        title: t("loginErrorTitle"),
        description: error.message,
      });
    }
  };

  const registerWithEmail = async ({ email, password, name }: AuthCredentials) => {
    if (!name) return;
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });
      if (error) throw error;
      
      toast({
        title: t("accountCreatedTitle"),
        description: t("accountCreatedDescription"),
      });
    } catch (error: any) {
      console.error("Error signing up", error);
      toast({
        variant: "destructive",
        title: t("registerErrorTitle"),
        description: error.message,
      });
    }
  };

  const signInWithEmail = async ({ email, password }: AuthCredentials) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      toast({
        title: t("loggedInTitle"),
        description: t("loggedInDescription"),
      });
    } catch (error: any) {
      console.error("Error signing in with email:", error);
      toast({
        variant: "destructive",
        title: t("loginErrorTitle"),
        description: error.message,
      });
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
      setFavorites([]);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const toggleFavorite = async (songId: string, songSlug: string) => {
    if (!user) return;

    const isCurrentlyFavorite = favorites.includes(songId);
    const delta = isCurrentlyFavorite ? 1 : -1;

    // Actualización optimista
    const newFavorites = isCurrentlyFavorite
      ? favorites.filter((id) => id !== songId)
      : [...favorites, songId];
    
    setFavorites(newFavorites);
    localStorage.setItem(`favorites_${user.uid}`, JSON.stringify(newFavorites));

    try {
      await Promise.all([
        updateLikeCount(songId, delta),
        revalidateAfterLike(songSlug)
      ]);
    } catch (error) {
      console.error("Failed to update like count:", error);
      // Revertir en caso de error
      setFavorites(favorites);
      localStorage.setItem(`favorites_${user.uid}`, JSON.stringify(favorites));
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el estado de favorito.",
      });
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
    isFavorite,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}