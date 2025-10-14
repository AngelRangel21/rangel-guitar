"use client";

import { Search } from "lucide-react";
import { useI18n } from "@/context/i18n-context";

interface SearchBarProps {
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
}
export function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  const { t } = useI18n();

  return (
    <div className="flex justify-center">
      <form role="search" className="relative w-[500px]">
        <div className="relative">
          <input
            name="search"
            type="search"
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-full bg-background p-4 placeholder:text-muted-foreground border-2 disabled:cursor-not-allowed disabled:bg-muted/50 focus-visible:outline-none border-black dark:border-white"
            value={searchTerm ?? ""}
            onChange={(e) => onSearchChange?.(e.target.value)}
            disabled={onSearchChange === undefined}
          />
          {/* <button
            name="Boton Buscar"
            className="absolute right-1 top-1/2 -translate-y-1/2 p-3 dark:bg-[#ddd] bg-[#222] rounded-full"
          > */}
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          {/* </button> */}
        </div>
      </form>
    </div>
  );
}
