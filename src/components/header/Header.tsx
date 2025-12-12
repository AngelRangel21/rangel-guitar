"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Menu, X, Bell, Heart, Shield, FilePlus2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { ThemeToggle } from "../theme-toggle";
import { Logo } from "./components/Logo";
import DesktopNav from "./components/DesktopNav";
import type { SongRequest } from "@/lib/types";
import { supabase } from "@/lib/supabase";

export function Header() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState<{
    count: number;
    recentRequests: SongRequest[];
  }>({ count: 0, recentRequests: [] });

  useEffect(() => {
    if (!isAdmin) {
      setNotifications({ count: 0, recentRequests: [] });
      return; // No hacer nada si el usuario no es administrador.
    }

    const fetchInitialRequests = async () => {
      const { data: requests, error } = await supabase
        .from("songs_requests")
        .select("*")
        .order("requestedAt", { ascending: false });

      if (error) {
        console.error("Error fetching initial song requests:", error);
        return;
      }

      setNotifications({
        count: requests.length,
        recentRequests: requests
          .slice(0, 99)
          .map((r) => ({ ...r, requestedAt: new Date(r.requestedAt) })),
      });
    };

    fetchInitialRequests();

    const channel = supabase
      .channel("song-requests-chanel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "songs_requests" },
        () => {
          fetchInitialRequests(); // Re-fetch all requests on any change
        }
      )
      .subscribe();

    // Limpia el listener cuando el componente se desmonta para evitar fugas de memoria.
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  // Enlaces base para todos los usuarios
  const baseLinks = [
    { href: "/", label: "Inicio", title: "Titulo Pagina Principal" },
    { href: "/artists", label: "Artistas", title: "Pagina artistas" },
    {
      href: "/top-charts",
      label: "Top canciones",
      title: "Pagina top canciones",
    },
    {
      href: "/request-song",
      label: "Solicitar",
      title: "Pagina de solicitar cancion",
    },
    { href: "/learn", label: "Aprender", title: "Pagina para aprender" },
  ];

  // Enlaces adicionales según el tipo de usuario
  const userLinks = isAuthenticated
    ? [
        ...baseLinks,
        {
          href: "/favorites",
          label: "Favoritos",
          title: "Pagina de favoritos",
        },
      ]
    : baseLinks;
  const adminLinks = [
    {
      href: "/admin/requests",
      label: "Solicitudes",
      title: "Pagina de solicitudes de canciones",
    },
    {
      href: "/admin/upload-song",
      label: "Subir",
      title: "Pagina para subir cancion",
    },
  ];

  // Selecciona qué links mostrar según el rol
  const navLinks = isAdmin ? adminLinks : userLinks;

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 backdrop-filter backdrop-blur-xs">
      <div className="container mx-auto flex items-center justify-between px-4 h-16">
        {/* Logo */}
        <Logo />

        {/* --- Desktop Navigation --- */}
        <DesktopNav />

        {/* --- Desktop Actions --- */}
        <section className="hidden xl:flex items-center gap-3">
          {isAdmin && (
            <Link
              href="/admin/requests"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors size-10 relative hover:bg-primary-foreground/10 rounded-full"
              title="Solicitudes">
              <Bell />
              {notifications.count > 0 && (
                <span className="absolute top-0 right-1 flex size-5 items-center justify-center rounded-full bg-destructive p-1 text-xs font-bold text-destructive-foreground">
                  {notifications.count}
                </span>
              )}
            </Link>
          )}
          {/* Tema modo claro/obscuro */}
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="hidden xl:flex">
              <Button
                variant="secondary"
                size="sm"
                onClick={logout}
                className="font-semibold">
                Cerrar sesión
              </Button>
            </div>
          ) : (
            <div className="hidden xl:flex gap-2">
              <Link
                href="/login"
                className="font-semibold rounded-[8px] py-3 px-[10px] hover:text-[#d2d2d2]">
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="font-semibold rounded-[8px] py-3 px-[10px] border-white hover:text-[#d2d2d2]">
                Registrarse
              </Link>
            </div>
          )}
        </section>

        {/* --- Mobile Menu Button --- */}
        <section className="flex">
          {isAdmin && (
            <Link
              href="/admin/requests"
              className="xl:hidden flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors h-10 w-10 rounded-full mr-4 size-10 relative hover:bg-primary-foreground/10"
              title="Solicitudes">
              <Bell />
              {notifications.count > 0 && (
                <span className="absolute top-0 right-1 flex size-5 items-center justify-center rounded-full bg-destructive p-1 text-xs font-bold text-destructive-foreground">
                  {notifications.count}
                </span>
              )}
            </Link>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden flex items-center justify-center h-10 w-10 rounded-md hover:bg-primary-foreground/10"
            title="Mostrar Menú"
            aria-label="Mostrar Menú">
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </section>
      </div>

      {/* --- Mobile Navigation --- */}
      {mobileOpen && (
        <div className="xl:hidden bg-primary text-primary-foreground border-t border-primary-foreground/10 w-full absolute">
          <nav className="flex flex-col space-y-2 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 px-3 rounded-md hover:bg-primary-foreground/10 font-medium"
                onClick={() => setMobileOpen(false)}
                title={link.title}>
                {link.label}
              </Link>
            ))}

            <div className="border-t border-primary-foreground/10 my-2" />

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <>
                    <Link
                      href="/admin/requests"
                      className="block py-2 px-3 rounded-md hover:bg-primary-foreground/10"
                      onClick={() => setMobileOpen(false)}>
                      <Shield className="inline mr-2 h-4 w-4" /> Solicitudes
                    </Link>
                    <Link
                      href="/admin/upload-song"
                      className="block py-2 px-3 rounded-md hover:bg-primary-foreground/10"
                      onClick={() => setMobileOpen(false)}>
                      <FilePlus2 className="inline mr-2 h-4 w-4" /> Subir
                    </Link>
                  </>
                )}
                <Link
                  href="/favorites"
                  className="block py-2 px-3 rounded-md hover:bg-primary-foreground/10"
                  onClick={() => setMobileOpen(false)}>
                  <Heart className="inline mr-2 h-4 w-4" /> Favoritos
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="block py-2 px-3 text-left rounded-md hover:bg-primary-foreground/10 font-semibold">
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block py-2 px-3 rounded-md hover:bg-primary-foreground/10 font-semibold"
                  onClick={() => setMobileOpen(false)}>
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="block py-2 px-3 rounded-md hover:bg-primary-foreground/10 font-semibold"
                  onClick={() => setMobileOpen(false)}>
                  Registrarse
                </Link>
              </>
            )}

            <div className="border-t border-primary-foreground/10 my-2" />
            <div className="flex justify-between items-center px-3">
              <span className="text-sm">Tema</span>
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
