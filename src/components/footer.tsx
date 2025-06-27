import Link from "next/link";
import { Facebook } from "lucide-react";
import { WhatsAppIcon, TelegramIcon } from "@/components/icons";

export function Footer() {
  return (
    <footer className="bg-primary/95 text-primary-foreground backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-6">
            <Link href="#" aria-label="WhatsApp" className="text-accent hover:text-accent/80 transition-colors">
              <WhatsAppIcon className="h-6 w-6" />
            </Link>
            <Link href="#" aria-label="Telegram" className="text-accent hover:text-accent/80 transition-colors">
              <TelegramIcon className="h-6 w-6" />
            </Link>
            <Link href="#" aria-label="Facebook" className="text-accent hover:text-accent/80 transition-colors">
              <Facebook className="h-6 w-6" />
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <Link href="#" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-accent transition-colors">Security</Link>
            <Link href="#" className="hover:text-accent transition-colors">Cookie Policy</Link>
          </div>
          <div className="text-sm text-primary-foreground/70 text-center md:text-right">
            © {new Date().getFullYear()} Rangel Guitar Hub. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
