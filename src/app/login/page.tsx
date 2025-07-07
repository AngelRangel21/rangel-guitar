import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LoginForm } from "@/components/login-form";

/**
 * Página de inicio de sesión.
 * Muestra el formulario para que los usuarios puedan acceder a sus cuentas.
 * @returns {JSX.Element} La página de inicio de sesión.
 */
export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center container mx-auto px-4 py-8">
        {/* Componente que contiene la lógica y la interfaz del formulario de inicio de sesión. */}
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
}
