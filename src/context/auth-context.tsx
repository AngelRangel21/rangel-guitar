"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "./i18n-context";
import { revalidateAfterLike } from "@/app/favorites/actions";
import { updateLikeCount } from "@/lib/client/songs";
import { supabase } from "@/lib/supabase";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth"; // 👈 el hook nuevo
import { toast } from "sonner";

const ADMIN_EMAILS = [ "angel145256@gmail.com" ];

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
  const { user: supabaseUser, loading } = useSupabaseAuth(); // 👈 centralizado
  const [ user, setUser ] = useState<User | null>(null);
  const [ isAdmin, setIsAdmin ] = useState(false);
  const [ favorites, setFavorites ] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useI18n();

  // 🟢 Procesar el user cada vez que cambie el de supabase
  useEffect(() => {
    if (!supabaseUser) {
      setUser(null);
      setIsAdmin(false);
      setFavorites([]);
      return;
    }

    const processUser = async () => {
      try {
        // Cargar favoritos de localStorage
        const storedFavorites = localStorage.getItem(
          `favorites_${supabaseUser.id}`
        );
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }

        // Consultar datos extra de la tabla users
        const { data: userDoc } = await supabase
          .from("users")
          .select("name, isAdmin")
          .eq("uid", supabaseUser.id)
          .single();

        const appUser: User = {
          uid: supabaseUser.id,
          name:
            userDoc?.name || supabaseUser.email?.split("@")[ 0 ] || "Anonymous",
        };

        const userIsAdmin =
          userDoc?.isAdmin || ADMIN_EMAILS.includes(supabaseUser.email || "");

        setUser(appUser);
        setIsAdmin(userIsAdmin);
      } catch (error) {
        console.error("Error procesando usuario:", error);
        toast.error("No se pudo cargar tu perfil.");
      }
    };

    processUser();
  }, [ supabaseUser, toast ]);

  // 🔀 Redirección si ya está logueado
  useEffect(() => {
    if (loading) return;
    const isAuthPage = pathname === "/login" || pathname === "/register";
    if (user && isAuthPage) {
      router.push("/");
    }
  }, [ loading, user, pathname, router ]);

  const signInWithGoogle = async () => {
    try {
      const { data } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (!data) throw new Error;
    } catch (error) {
      toast.error(t("loginErrorTitle"));
      console.error(t("loginErrorTitle"), error)
    }
  };

  const registerWithEmail = async ({
    email,
    password,
    name,
  }: AuthCredentials) => {
    if (!name) return;
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) throw error;
      toast.success(t("accountCreatedDescription"));
    } catch (err) {
      toast.error(t("registerErrorTitle"));
      console.error(t("registerErrorTitle"), err)
    }
  };

  const signInWithEmail = async ({ email, password }: AuthCredentials) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success(t("loggedInDescription"));
    } catch (error) {
      toast.error(t("loginErrorTitle"));
      console.error(t("loginErrorTitle"), error);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
      setFavorites([]);
      router.push("/");
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const toggleFavorite = async (songId: string, songSlug: string) => {
    if (!user) return;

    const isCurrentlyFavorite = favorites.includes(songId);
    const delta = isCurrentlyFavorite ? -1 : 1; // 👈 corregí el signo

    const newFavorites = isCurrentlyFavorite
      ? favorites.filter((id) => id !== songId)
      : [ ...favorites, songId ];

    setFavorites(newFavorites);
    localStorage.setItem(`favorites_${user.uid}`, JSON.stringify(newFavorites));

    try {
      await Promise.all([
        updateLikeCount(songId, delta),
        revalidateAfterLike(songSlug),
      ]);
    } catch (error) {
      setFavorites(favorites); // revertir
      localStorage.setItem(`favorites_${user.uid}`, JSON.stringify(favorites));
      toast.error("No se pudo agregar a tus favoritos.");
      console.error("No se pudo agregar a tus favoritos.", error);
    }
  };

  const isFavorite = (songId: string) => favorites.includes(songId);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        isAdmin,
        favorites,
        isLoaded: !loading,
        signInWithGoogle,
        registerWithEmail,
        signInWithEmail,
        logout,
        toggleFavorite,
        isFavorite,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
