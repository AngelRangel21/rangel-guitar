import { useAuth } from "@/context/auth-context";
import Link from "next/link";

export default function DesktopNav() {
  const { isAuthenticated, isAdmin } = useAuth();

  // Enlaces base para todos los usuarios
  const baseLinks = [
    { href: "/", label: "Inicio", title: "Titulo Pagina Principal" },
    { href: "/artists", label: "Artistas", title: "Pagina artistas" },
    {
      href: "/top-charts",
      label: "Top canciones",
      title: "Pagina top canciones",
    },
    {
      href: "/request-song",
      label: "Solicitar",
      title: "Pagina de solicitar cancion",
    },
    { href: "/learn", label: "Aprender", title: "Pagina para aprender" },
  ];

  // Enlaces adicionales según el tipo de usuario
  const userLinks = isAuthenticated
    ? [
        ...baseLinks,
        {
          href: "/favorites",
          label: "Favoritos",
          title: "Pagina de favoritos",
        },
      ]
    : baseLinks;
  const adminLinks = [
    ...userLinks,
    {
      href: "/admin/requests",
      label: "Solicitudes",
      title: "Pagina de solicitudes canciones",
    },
    {
      href: "/admin/upload-song",
      label: "Subir",
      title: "Pagina para subir cancion",
    },
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
          title={link.title}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
