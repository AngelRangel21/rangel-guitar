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
    <search className="px-4 py-3 top-0 z-10 bg-background backdrop-blur-sm">
      <label className="flex flex-col min-w-40 h-12 w-full">
        <form
          role="search"
          className="flex w-full flex-1 items-stretch rounded-lg h-full "
        >
          <Search className="absolute top-1/2 -translate-y-1/2 text-muted-foreground ml-2" />
          <input
            name="search"
            type="search"
            className="flex w-full min-w-0 resize-none overflow-hidden rounded-lg focus:outline-0 disabled:cursor-not-allowed disabled:bg-muted/50 focus-visible:outline-none bg-[#e2ecfc] dark:bg-gray-800 h-full placeholder:text-muted-foreground border-l-0 pl-10 text-base font-normal shadow-xl"
            placeholder={t("searchPlaceholder")}
            value={searchTerm ?? ""}
            onChange={(e) => onSearchChange?.(e.target.value)}
            disabled={onSearchChange === undefined}
          />
        </form>
      </label>
    </search>
  );
}
