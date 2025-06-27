"use client";

import Link from "next/link";
import { Menu, Music, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" aria-label="Rangel Guitar Home">
          <Music className="h-8 w-8 text-accent" />
          <span className="text-2xl font-bold whitespace-nowrap">Rangel Guitar</span>
        </Link>

        <div className="hidden md:flex flex-1 max-w-md items-center ml-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by song or artist..."
              className="w-full rounded-full bg-background text-foreground placeholder:text-muted-foreground pl-10 border-2 border-transparent focus-visible:ring-accent focus-visible:border-accent"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-primary-foreground/10" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="md:hidden p-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input type="search" placeholder="Search..." className="w-full rounded-md pl-10" />
                </div>
              </div>
              <DropdownMenuSeparator className="md:hidden" />
              <DropdownMenuItem asChild>
                <Link href="#">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="#">Artists</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="#">Top Charts</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="#">About</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
