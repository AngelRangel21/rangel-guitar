'use client';

import Link from "next/link";
import { Facebook } from "lucide-react";
import { WhatsAppIcon, TelegramIcon } from "@/components/icons";
import { useI18n } from "@/context/i18n-context";
import { Paypal } from "./footer/Paypal";

/**
 * Componente del pie de página de la aplicación.
 * Muestra enlaces a redes sociales, políticas legales y el copyright.
 * @returns {JSX.Element} El componente del pie de página.
 */
export function Footer() {
  const { t } = useI18n(); // Hook para obtener traducciones.
  const currentYear = new Date().getFullYear(); // Obtiene el año actual para el copyright.

  return (
    <footer className="bg-primary/95 text-primary-foreground backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
      <Paypal />
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Enlaces a redes sociales */}
          <div className="flex gap-6">
          <Link href="https://www.facebook.com/share/1Akd7FErLL/?mibextid=wwXlfr" aria-label="Facebook" className="text-accent hover:text-accent/60 transition-colors" title="Ir a la pagina de Facebook de Rangel Guitar">
              <Facebook className="h-6 w-6" />
            </Link>
            <Link href="https://chat.whatsapp.com/Hbtr0lzFG4u4AGvAStj6WJ?mode=r_c" aria-label="WhatsApp" className="text-accent hover:text-accent/60 transition-colors" title="Ir al grupo de Whatsapp de Rangel Guitar">
              <WhatsAppIcon className="h-6 w-6" />
            </Link>
            <Link href="https://t.me/Rangelguitar" aria-label="Telegram" className="text-accent hover:text-accent/60 transition-colors" title="Ir al grupo de Telegram de Rangel Guitar">
              <TelegramIcon className="h-6 w-6" />
            </Link>
          </div>
          {/* Enlaces a páginas legales */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <Link href="/privacy-policy" title="Ir a la pagina de Politica de Privacidad de Rangel Guitar" className="hover:text-accent transition-colors">{t('privacyPolicy')}</Link>
            <Link href="/security" title="Ir a la pagina de Politica de Seguridad de Rangel Guitar" className="hover:text-accent transition-colors">{t('security')}</Link>
            <Link href="/cookie-policy" title="Ir a la pagina de Politicas de Cookies de Rangel Guitar" className="hover:text-accent transition-colors">{t('cookiePolicy')}</Link>
          </div>
          {/* Texto de copyright */}
          <div className="text-sm text-primary-foreground/70 text-center md:text-right">
            {t('copyright', { year: currentYear })}
          </div>
        </div>
      </div>
    </footer>
  );
}
