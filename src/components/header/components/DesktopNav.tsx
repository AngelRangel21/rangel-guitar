import { useAuth } from "@/context/auth-context";
import Link from "next/link";

export default function DesktopNav() {
  const { isAuthenticated, isAdmin } = useAuth();

  // Enlaces base para todos los usuarios
  const baseLinks = [
    { href: "/", label: "Inicio" },
    { href: "/artists", label: "Artistas" },
    { href: "/top-songs", label: "Top canciones" },
    { href: "/request-song", label: "Solicitar" },
    { href: "/learn", label: "Aprender" },
  ];

  // Enlaces adicionales según el tipo de usuario
  const userLinks = isAuthenticated
    ? [...baseLinks, { href: "/favorites", label: "Favoritos" }]
    : baseLinks;
  const adminLinks = [
    ...userLinks,
    { href: "/admin/requests", label: "Solicitudes" },
    { href: "/admin/upload-song", label: "Subir" },
  ];

  // Selecciona qué links mostrar según el rol
  const navLinks = isAdmin ? adminLinks : userLinks;

  return (
    <nav className="hidden xl:flex gap-6">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="hover:text-[#d2d2d2] transition-colors font-medium"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
