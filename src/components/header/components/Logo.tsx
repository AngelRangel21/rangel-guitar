"use client";

import { useI18n } from "@/context/i18n-context";
import { Music } from "lucide-react";
import Link from "next/link";

export function Logo() {
  const { t } = useI18n();

  return (
    <Link
      href="/"
      className="flex items-center gap-2"
      aria-label="Rangel Guitar Inicio"
      title="Titulo Pagina Principal"
    >
      <Music className="h-8 w-8 text-accent" />
      <h1 className="text-2xl font-bold whitespace-nowrap">{t("appName")}</h1>
    </Link>
  );
}
