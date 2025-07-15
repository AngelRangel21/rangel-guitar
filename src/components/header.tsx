"use client";

import Link from "next/link";
import { Menu, Music, Search, LogOut, Globe, Heart, GitPullRequest, Shield, Bell, X, GraduationCap, FilePlus2, TrendingUp, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useI18n } from "@/context/i18n-context";
import { ThemeToggle } from "./theme-toggle";
import { useEffect, useState } from "react";
import { revalidateAfterRequestDelete } from '@/app/admin/requests/actions';
import { deleteSongRequest } from '@/lib/client/requests';
import { formatDistanceToNow } from "date-fns";
import { es, enUS } from 'date-fns/locale';
import type { SongRequest } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "./ui/badge";
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Componente del encabezado principal de la aplicación.
 * Contiene el logo, la barra de búsqueda (en la página de inicio), y el menú de usuario/navegación.
 * @param {{ searchTerm?: string; onSearchChange?: (value: string) => void }} props - Propiedades para el control de la búsqueda.
 * @returns {JSX.Element} El componente del encabezado.
 */
export function Header({ searchTerm, onSearchChange }: { searchTerm?: string; onSearchChange?: (value: string) => void }) {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { t, language, setLanguage } = useI18n();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<{ count: number; recentRequests: SongRequest[] }>({ count: 0, recentRequests: [] });

  // Efecto para escuchar notificaciones de solicitudes de canciones en tiempo real para administradores.
  useEffect(() => {
    if (!isAdmin) {
        setNotifications({ count: 0, recentRequests: [] });
        return; // No hacer nada si el usuario no es administrador.
    }

    const requestsCollection = collection(db, 'song-requests');
    const q = query(requestsCollection, orderBy('requestedAt', 'desc'));

    // onSnapshot establece un listener en tiempo real a la colección de Firestore.
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const requests = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                artist: data.artist,
                requestedAt: data.requestedAt.toDate(),
            }
        }) as SongRequest[];

        setNotifications({
            count: requests.length,
            recentRequests: requests.slice(0, 5), // Muestra solo las 5 más recientes.
        });
    }, (error) => {
        console.error("Error fetching notifications:", error);
    });

    // Limpia el listener cuando el componente se desmonta para evitar fugas de memoria.
    return () => unsubscribe();
  }, [isAdmin]);

  const locale = language === 'es' ? es : enUS;

  /**
   * Maneja la eliminación de una notificación de solicitud.
   * @param {React.MouseEvent} e - Evento del mouse.
   * @param {string} requestId - ID de la solicitud a eliminar.
   */
  const handleDeleteNotification = async (e: React.MouseEvent, requestId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const originalNotifications = { ...notifications };

    // Actualización optimista de la UI.
    setNotifications(prev => ({
        count: Math.max(0, prev.count - 1),
        recentRequests: prev.recentRequests.filter(req => req.id !== requestId),
    }));
    
    try {
      await deleteSongRequest(requestId);
      const result = await revalidateAfterRequestDelete();
      if (!result.success) {
          // Si falla la revalidación, revierte la UI.
          toast({
              variant: 'destructive',
              title: t('error'),
              description: t('notificationDeleteError'),
          });
          setNotifications(originalNotifications);
      }
    } catch (error) {
        console.error('Error deleting notification:', error);
        toast({
            variant: 'destructive',
            title: t('error'),
            description: t('notificationDeleteError'),
        });
        setNotifications(originalNotifications); // Revertir en caso de error.
    }
  };

  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" aria-label="Rangel Guitar Home">
          <Music className="h-8 w-8 text-accent" />
          <span className="text-2xl font-bold whitespace-nowrap">{t('appName')}</span>
        </Link>

        {/* Barra de búsqueda (solo visible en escritorio y si se pasan las props) */}
        <div className="hidden md:flex flex-1 max-w-md items-center ml-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('searchPlaceholder')}
              className="w-full rounded-full bg-background text-foreground placeholder:text-muted-foreground pl-10 border-2 border-transparent focus-visible:ring-accent focus-visible:border-accent disabled:cursor-not-allowed disabled:bg-muted/50"
              value={searchTerm ?? ''}
              onChange={(e) => onSearchChange?.(e.target.value)}
              disabled={onSearchChange === undefined}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Menú de notificaciones para administradores */}
          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10 hover:bg-primary-foreground/10 rounded-full" aria-label={t('notifications')}>
                  <Bell className="h-6 w-6" />
                  {notifications.count > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive p-1 text-xs font-bold text-destructive-foreground">
                      {notifications.count}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>{t('notificationsTitle')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.recentRequests.length > 0 ? (
                  notifications.recentRequests.map((req, index) => (
                    <DropdownMenuItem key={`${req.id}-${index}`} onSelect={(e) => e.preventDefault()} className="p-0 focus:bg-transparent">
                      <div className="flex items-center justify-between w-full hover:bg-accent rounded-sm">
                          <Link 
                            href={`/admin/add-song?id=${req.id}&title=${encodeURIComponent(req.title)}&artist=${encodeURIComponent(req.artist)}`} 
                            className="flex-grow grid gap-1 px-2 py-1.5"
                          >
                              <p className="font-semibold">{req.title}</p>
                              <p className="text-sm text-muted-foreground">{t('byArtist', { artist: req.artist })}</p>
                              <p className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(req.requestedAt), { addSuffix: true, locale })}
                              </p>
                          </Link>
                          <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 mr-1 shrink-0 rounded-full"
                              onClick={(e) => handleDeleteNotification(e, req.id)}
                              aria-label={t('deleteNotification')}
                          >
                              <X className="h-4 w-4" />
                          </Button>
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>{t('noNewRequests')}</DropdownMenuItem>
                )}
                {notifications.count > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/admin/requests" className="justify-center">
                        {t('viewAllRequests')}
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {/* Botón para cambiar tema (claro/oscuro) */}
          <ThemeToggle />
          
          {/* Menú principal de usuario y navegación */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-primary-foreground/10 rounded-full" aria-label="Open user menu">
                  {isAuthenticated && user ? (
                      <Avatar className="h-10 w-10">
                         <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                  ) : (
                      <Menu className="h-6 w-6" />
                  )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {isAuthenticated && user ? (
                // Menú para usuarios autenticados
                <>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{t('signedInAs')}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.name}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/requests">
                          <Shield className="mr-2 h-4 w-4" />
                          <span>{t('songRequestsTitle')}</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/upload-song">
                          <FilePlus2 className="mr-2 h-4 w-4" />
                          <span>{t('uploadSong')}</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/favorites">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>{t('favorites')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('logout')}</span>
                  </DropdownMenuItem>
                </>
              ) : (
                // Menú para usuarios no autenticados
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login">{t('login')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register">{t('register')}</Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
               {/* Barra de búsqueda para móviles */}
               <div className="md:hidden p-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder={t('searchPlaceholder')} 
                    className="w-full rounded-md pl-10 disabled:cursor-not-allowed disabled:bg-muted/50" 
                    value={searchTerm ?? ''}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    disabled={onSearchChange === undefined}
                  />
                </div>
              </div>
              <DropdownMenuSeparator className="md:hidden" />
              {/* Enlaces de navegación generales */}
              <DropdownMenuItem asChild>
                <Link href="/">{t('home')}</Link>
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                <Link href="/artists">{t('artists')}</Link>
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                 <Link href="/top-charts">
                   <TrendingUp className="mr-2 h-4 w-4" />
                   <span>{t('topChartsPageTitle')}</span>
                 </Link>
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                <Link href="/request-song">
                  <GitPullRequest className="mr-2 h-4 w-4" />
                  <span>{t('requestSong')}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/analyze-song" className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    <span>{t('analyzeSong')}</span>
                  </div>
                  <Badge variant="info" className="text-xs">{t('new')}</Badge>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/learn" className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    <span>{t('topCharts')}</span>
                  </div>
                  <Badge variant="info" className="text-xs">{t('beta')}</Badge>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* Submenú para cambiar de idioma */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                    <Globe className="mr-2 h-4 w-4" />
                    <span>{t('language')}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setLanguage('es')}>{t('spanish')}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage('en')}>{t('english')}</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
