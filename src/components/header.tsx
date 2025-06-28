"use client";

import Link from "next/link";
import { Menu, Music, Search, LogOut, Globe } from "lucide-react";
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

export function Header({ searchTerm, onSearchChange }: { searchTerm?: string; onSearchChange?: (value: string) => void }) {
  const { isAuthenticated, user, logout } = useAuth();
  const { t, setLanguage } = useI18n();

  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" aria-label="Rangel Guitar Home">
          <Music className="h-8 w-8 text-accent" />
          <span className="text-2xl font-bold whitespace-nowrap">{t('appName')}</span>
        </Link>

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
                <>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{t('signedInAs')}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.name}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('logout')}</span>
                  </DropdownMenuItem>
                </>
              ) : (
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
              <DropdownMenuItem asChild>
                <Link href="/">{t('home')}</Link>
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                <Link href="/artists">{t('artists')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="#">{t('topCharts')}</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
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
