"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useSupabaseAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // 1️⃣ Cargar sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    // 2️⃣ Escuchar cambios de sesión (login, logout, refresh)
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      }
    );

    // 3️⃣ Cleanup al desmontar
    return () => {
      mounted = false;
      subscription?.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
