"use client";

import { useI18n } from "@/context/i18n-context";
import { Music } from "lucide-react";
import Link from "next/link";

export function Logo() {
  const { t } = useI18n();

  return (
    <Link
      href="/"
      className="flex items-center gap-1"
      aria-label="Rangel Guitar Inicio"
      title="Titulo Pagina Principal"
    >
      <Music className="h-4 w-4" style={{ color: '#000080' }} />
      <span style={{ fontFamily: "'Tahoma', 'MS Sans Serif', sans-serif", fontSize: '11px', fontWeight: 'bold', color: '#000000' }}>
        {t("appName")}
      </span>
    </Link>
  );
}
